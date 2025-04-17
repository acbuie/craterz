var slider = document.getElementById("diameter-slider");

noUiSlider.create(slider, {
  start: [1, 1000],
  connect: true,
  step: 1,
  tooltips: [true, true],
  range: {
    min: 1,
    max: 1000,
  },
});

mergeTooltips(slider, 30, " - ");
