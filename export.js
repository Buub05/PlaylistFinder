// Esportazione CSV già presente nell'app principale

function exportJSON() {
  const selects = document.querySelectorAll('select');
  if (!selects.length) return alert('⛔ No selections found');
  const data = Array.from(selects).map(sel => {
    const text = sel.options[sel.selectedIndex].text;
    const uri = sel.value;
    return { text, uri };
  });
  const blob = new Blob([JSON.stringify(data,null,2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'playlist.json';
  a.click();
}

// Mock esportazione Apple Music/YouTube Music
function exportAppleMusic() {
  alert("Esportazione verso Apple Music: funzione da integrare con API reale di Apple Music. Puoi esportare il file CSV/JSON e poi importarlo tramite servizi esterni come Soundiiz o FreeYourMusic.");
}
function exportYouTubeMusic() {
  alert("Esportazione verso YouTube Music: funzione da integrare con API reale di YouTube Music. Puoi esportare il file CSV/JSON e poi importarlo tramite servizi esterni come Soundiiz o FreeYourMusic.");
}