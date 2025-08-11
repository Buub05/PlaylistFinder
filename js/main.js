document.addEventListener('DOMContentLoaded', () => {
  const token = getAccessToken();

  if (!token) {
    updateStatus(t('loginPrompt'));
    const loginBtn = createButton('login-btn', 'Login Spotify', login);
    document.getElementById('controls').appendChild(loginBtn);
    return;
  }

  updateStatus(t('loading'));
  fetchUserPlaylists(token).then(playlists => {
    updateStatus('');
    // Mostra playlist
  }).catch(() => {
    updateStatus(t('error'));
  });

  // Eventi globali: toggle manual, filtri slider ecc.
});
