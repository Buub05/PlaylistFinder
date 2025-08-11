async function fetchUserPlaylists(token) {
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  return data.items;
}

function filterPlaylists(playlists, settings) {
  return playlists.filter(pl => {
    // filtri basati su durata, genere ecc.
    return true; // placeholder
  });
}

// Altre funzioni per ordinare, calcolare durata, ecc.
