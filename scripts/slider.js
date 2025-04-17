var slider = document.getElementById("diameter-slider");

noUiSlider.create(slider, {
  start: [1, 100],
  connect: true,
  range: {
    min: 1,
    max: 100,
  },
});
