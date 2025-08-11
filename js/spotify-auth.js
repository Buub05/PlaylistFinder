function getAccessToken() {
  // Controlla token nella URL o localStorage
}

function login() {
  const url = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${SCOPES.join('%20')}&response_type=token&show_dialog=true`;
  window.location = url;
}

// Altre funzioni per refresh token, logout ecc.
