var diameterSlider = document.getElementById("diameter-slider");
var eccenSlider = document.getElementById("eccen-slider");
var ellipSlider = document.getElementById("ellip-slider");

noUiSlider.create(diameterSlider, {
  start: [1, 1000],
  connect: true,
  step: 1,
  tooltips: [true, true],
  range: {
    min: 1,
    max: 1000,
  },
  format: {
    to: (v) => {
      return ~~v;
    },
    from: (v) => {
      return Number(v);
    },
  },
});

noUiSlider.create(eccenSlider, {
  start: [0, 1],
  connect: true,
  tooltips: [true, true],
  range: {
    min: 0,
    max: 1,
  },
});

noUiSlider.create(ellipSlider, {
  start: [0, 1],
  connect: true,
  tooltips: [true, true],
  range: {
    min: 0,
    max: 1,
  },
});
