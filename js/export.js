function exportPlaylistAsJSON(playlist) {
  const dataStr = JSON.stringify(playlist, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'playlist.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Altre funzioni per esportare CSV o copiare link
