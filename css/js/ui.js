/* ===========================
   Spotify Playlist Finder UI Logic
   =========================== */

// ======== GLOBAL VARIABLES ========
let accessToken = '';
let codeVerifier = '';

// ======== SPOTIFY LOGIN (PKCE) ========
// MOD: Added PKCE login flow
async function login() {
  codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem('code_verifier', codeVerifier);

  const clientId = 'YOUR_CLIENT_ID'; // MOD: Replace with your Spotify app client ID
  const redirectUri = window.location.origin + window.location.pathname;

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=playlist-modify-public playlist-modify-private&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

  window.location.href = authUrl;
}

async function handleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return;

  const clientId = 'YOUR_CLIENT_ID'; // MOD
  const redirectUri = window.location.origin + window.location.pathname;
  const codeVerifier = localStorage.getItem('code_verifier');

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

  if (accessToken) {
    document.getElementById("loginStatus").textContent = "✅ Logged in!";
    document.getElementById("loginStatus").style.color = "lightgreen";
  }

  window.history.replaceState({}, document.title, redirectUri);
}

// ======== UTILITY FUNCTIONS ========
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

// ======== ADD PLAYLIST INPUTS ========
function addPlaylistInput() {
  const div = document.getElementById('playlistInputs');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'playlist-link';
  input.placeholder = 'Spotify playlist link';
  input.style = 'width: 70%; margin-top: 0.4rem;';
  div.insertBefore(input, div.lastElementChild);
}

// ======== SLIDER UPDATE FUNCTION ========
function updateSlider(minEl, maxEl, progressEl, labelEl, maxRange) {
  const min = parseInt(minEl.value);
  const max = parseInt(maxEl.value);
  if (min > max) minEl.value = max; // Prevent invalid overlap

  const percentMin = (min / maxRange) * 100;
  const percentMax = (max / maxRange) * 100;
  progressEl.style.left = percentMin + '%';
  progressEl.style.right = (100 - percentMax) + '%';

  // MOD: Add + for max if at limit
  const maxLabel = (max === maxRange) ? `${max}+` : max;
  labelEl.textContent = `${min} - ${maxLabel}`;
}

// ======== INITIALIZE SLIDERS ========
function initSliders() {
  const durationMin = document.getElementById('durationMin');
  const durationMax = document.getElementById('durationMax');
  const durationProgress = document.getElementById('durationProgress');
  const durationLabel = document.getElementById('durationLabel');

  durationMin.addEventListener('input', () => updateSlider(durationMin, durationMax, durationProgress, durationLabel, 7200));
  durationMax.addEventListener('input', () => updateSlider(durationMin, durationMax, durationProgress, durationLabel, 7200));
  updateSlider(durationMin, durationMax, durationProgress, durationLabel, 7200);

  const popMin = document.getElementById('popMin');
  const popMax = document.getElementById('popMax');
  const popProgress = document.getElementById('popularityProgress');
  const popLabel = document.getElementById('popularityLabel');

  popMin.addEventListener('input', () => updateSlider(popMin, popMax, popProgress, popLabel, 100));
  popMax.addEventListener('input', () => updateSlider(popMin, popMax, popProgress, popLabel, 100));
  updateSlider(popMin, popMax, popProgress, popLabel, 100);
}

// ======== PROGRESS BAR ========
function simulateProgressBar(duration = 5000) {
  const bar = document.getElementById("progressBar");
  const container = document.getElementById("progressBarContainer");
  const label = document.getElementById("progressLabel");

  container.style.display = "block";
  let start = Date.now();

  function update() {
    let progress = Math.min(1, (Date.now() - start) / duration);
    bar.style.width = (progress * 100) + "%";
    label.textContent = Math.round(progress * 100) + "%";
    if (progress < 1) requestAnimationFrame(update);
  }
  update();
}

// ======== FILE UPLOAD/DOWNLOAD ========
function exportCSV() {
  const selects = document.querySelectorAll('select');
  if (!selects.length) return alert('⛔ No selections found');

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

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    console.log("Uploaded file content:", e.target.result);
    // MOD: You can add parsing logic here
  };
  reader.readAsText(file);
}

// ======== SETTINGS SIDEBAR ========
// MOD: Added toggle for settings panel
function toggleSettings() {
  document.getElementById('sidebarSettings').classList.toggle('open');
}

// ======== INIT ON LOAD ========
document.addEventListener('DOMContentLoaded', () => {
  handleRedirect();
  initSliders();
});
