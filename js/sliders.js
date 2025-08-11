function createSlider(id, min, max, step, initialValue, onChange) {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = id;
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = initialValue;
  slider.addEventListener('input', (e) => onChange(e.target.value));
  return slider;
}

// Eventuale inizializzazione slider
