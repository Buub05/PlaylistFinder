// script.js - Tutta la logica del sito PlaylistFinder

// --- VARIABILI GLOBALI ---
const clientId = '162bcf77cc254ffaa8426ef1001c1f7f';
const redirectUri = 'https://buub05.github.io/PlaylistFinder/';
let codeVerifier = '';
let accessToken = '';

// --- LOGIN CON SPOTIFY USANDO PKCE ---
async function login() {
  codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem('code_verifier', codeVerifier);

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=playlist-modify-public playlist-modify-private&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
  window.location.href = authUrl;
}

// --- DOPO IL REDIRECT OTTENIAMO IL TOKEN ---
async function handleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return;

  codeVerifier = localStorage.getItem('code_verifier');
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  const data = await res.json();
  accessToken = data.access_token;
  window.history.replaceState({}, document.title, redirectUri);
}
handleRedirect();

// --- FUNZIONI DI SUPPORTO LOGIN ---
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(length))).map(x => chars[x % chars.length]).join('');
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// --- AGGIORNA INTERFACCE DINAMICHE ---
function updateDurationLabel() {
  const min = document.getElementById('minDuration').value;
  const max = document.getElementById('maxDuration').value;
  document.getElementById('durationLabel').textContent = `${min} - ${max}`;
}
function updatePopularityLabel() {
  const min = document.getElementById('minPopularity').value;
  const max = document.getElementById('maxPopularity').value;
  document.getElementById('popularityLabel').textContent = `${min} - ${max}`;
}
function toggleAdvancedMode() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const manualBtn = document.getElementById("createManualPlaylist");
  manualBtn.style.display = (mode === "manual") ? "inline-block" : "none";
}

// --- SIMULA BARRA DI PROGRESSO ---
function simulateProgressBar(duration = 5000) {
  const bar = document.getElementById("progressBar");
  const container = document.getElementById("progressBarContainer");
  container.style.display = "block";
  let start = Date.now();
  function update() {
    let progress = Math.min(1, (Date.now() - start) / duration);
    bar.style.width = (progress * 100) + "%";
    if (progress < 1) requestAnimationFrame(update);
  }
  update();
}

// --- PULISCE IL TITOLO DA PAROLE NON RILEVANTI ---
function cleanTitle(title) {
  return title.toLowerCase()
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .replace(/remix|live|version|edit|feat\.?|acoustic|piano|instrumental/gi, '')
    .replace(/\s{2,}/g, ' ').trim();
}

// --- PROCESSA E FILTRA I BRANI ---
async function startProcessing() {
  if (!accessToken) return alert('🔐 Devi fare login prima.');
  const playlistUrl = document.getElementById('playlistLink').value.trim();
  const playlistName = document.getElementById('playlistName').value.trim() || 'Playlist_1';
  const playlistId = playlistUrl.includes('/playlist/') ? playlistUrl.split('/playlist/')[1].split('?')[0] : null;

  const exclude = document.getElementById('excludeKeywords').value.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  const include = document.getElementById('includeKeywords').value.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  const minDur = parseInt(document.getElementById('minDuration').value || '0');
  const maxDur = parseInt(document.getElementById('maxDuration').value || '10000');
  const minPop = parseInt(document.getElementById('minPopularity').value || '0');
  const maxPop = parseInt(document.getElementById('maxPopularity').value || '100');

  const genres = Array.from(document.querySelectorAll('#genreList input:checked')).map(el => el.value);
  const customGenres = document.getElementById('customGenres').value.split(',').map(s => s.trim()).filter(Boolean);
  const allGenres = [...genres, ...customGenres];

  simulateProgressBar(6000);

  let allTracks = [], offset = 0;
  if (playlistId) {
    while (true) {
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=${offset}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const json = await res.json();
      if (!json.items) break;
      allTracks.push(...json.items);
      if (!json.next) break;
      offset += 100;
    }
  }

  const results = [], manualTracks = [];
  for (const item of allTracks) {
    const name = cleanTitle(item.track.name);
    const query = encodeURIComponent(name);
    const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const json = await res.json();
    const matches = (json.tracks.items || []).filter(track => {
      const tname = track.name.toLowerCase();
      if (exclude.some(k => tname.includes(k))) return false;
      if (include.length && !include.some(k => tname.includes(k))) return false;
      const dur = track.duration_ms / 1000;
      if (dur < minDur || dur > maxDur) return false;
      const pop = track.popularity;
      if (pop < minPop || pop > maxPop) return false;
      return true;
    });
    if (document.querySelector('input[name="mode"]:checked').value === "manual") {
      if (matches.length) manualTracks.push({ original: name, options: matches });
    } else {
      if (matches[0]) results.push(matches[0].uri);
    }
  }

  // Selezione manuale
  if (document.querySelector('input[name="mode"]:checked').value === "manual") {
    renderManualSelection(manualTracks);
    return;
  }

  const user = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  }).then(r => r.json());

  const playlist = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: playlistName, public: false })
  }).then(r => r.json());

  for (let i = 0; i < results.length; i += 100) {
    const chunk = results.slice(i, i + 100);
    await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: chunk })
    });
  }

  alert('✅ Playlist creata con successo!');
}

// --- RENDER INTERFACCIA MANUALE ---
function renderManualSelection(tracks) {
  const container = document.getElementById('trackSelection');
  container.innerHTML = '';
  tracks.forEach((track, i) => {
    const div = document.createElement('div');
    div.className = 'track-option';
    const label = document.createElement('label');
    label.textContent = `🎵 ${track.original}`;
    div.appendChild(label);
    const select = document.createElement('select');
    select.id = `track-select-${i}`;
    track.options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.uri;
      option.text = `${opt.name} - ${opt.artists.map(a => a.name).join(', ')}`;
      select.appendChild(option);
    });
    div.appendChild(select);
    container.appendChild(div);
  });
}

// --- CREA PLAYLIST MANUALMENTE ---
async function createManualPlaylist() {
  const selectedUris = Array.from(document.querySelectorAll('select')).map(sel => sel.value);
  const playlistName = document.getElementById('playlistName').value.trim() || 'Playlist_1';

  const user = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  }).then(r => r.json());

  const playlist = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: playlistName, public: false })
  }).then(r => r.json());

  for (let i = 0; i < selectedUris.length; i += 100) {
    const chunk = selectedUris.slice(i, i + 100);
    await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: chunk })
    });
  }

  alert('✅ Playlist creata con successo!');
}

// --- ESPORTA IN CSV ---
function exportCSV() {
  const selects = document.querySelectorAll('select');
  if (!selects.length) return alert('⛔ Nessuna selezione trovata');
  const csv = Array.from(selects).map(sel => {
    const text = sel.options[sel.selectedIndex].text;
    const uri = sel.value;
    return `"${text}","${uri}"`;
  }).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'playlist.csv';
  a.click();
}
