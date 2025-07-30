// Qui puoi centralizzare eventuale logica JS per filtri multipiattaforma, slider e preset universali

// Esempio: slider energia
const energyMin = document.getElementById('energyMin');
const energyMax = document.getElementById('energyMax');
const energyProgress = document.getElementById('energyProgress');
const energyLabel = document.getElementById('energyLabel');
function updateEnergySlider() {
  const min = parseFloat(energyMin.value);
  const max = parseFloat(energyMax.value);
  const percentMin = (min / 1) * 100;
  const percentMax = (max / 1) * 100;
  energyProgress.style.left = percentMin + '%';
  energyProgress.style.right = (100 - percentMax) + '%';
  energyLabel.textContent = `${min} - ${max}`;
}
energyMin.addEventListener('input', updateEnergySlider);
energyMax.addEventListener('input', updateEnergySlider);
updateEnergySlider();