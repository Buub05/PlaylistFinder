function createButton(id, label, onClick) {
  const btn = document.createElement('button');
  btn.id = id;
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

function updateStatus(message) {
  const container = document.getElementById('controls');
  container.textContent = message;
}

// Altre funzioni per la UI: mostra playlist, slider, etc.
