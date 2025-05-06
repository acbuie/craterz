import { diameterSlider, ellipSlider, eccenSlider } from "./slider.mjs";

// Stores selected values for each category
const categoryFilters = {
  Classification: new Set(),
  // Add more keys as needed
};


function toggleSelection(label, selectedSet, callback) {
  const wasSelected = selectedSet.has(label);
  // If the label is already selected, remove it from the set
  if (wasSelected) {
      selectedSet.delete(label);
  } else {
      selectedSet.add(label);
  }

  if (typeof callback === "function") {
      callback(Array.from(selectedSet));
  }
}

const ejectaLookup = {};

const interiorLookup = {
  Cpx: "Complex",
  Smp: "Simple",
  FF: "Flat Floor",
  FP: "Flat Floor - Pristine",
  CPt: "Central Peak",
}; // TODO: Work in progress, need to parse .csv for all options

function multivalue_filter(values) {
  return function (v) {
    return values.indexOf(v) !== -1;
  };
}

function filterAllDims(ndx, filter) {
  const idDim = ndx.dimension((d) => d.CRATER_ID),
    latDim = ndx.dimension((d) => +d.LAT_ELLI_IMG),
    lonDim = ndx.dimension((d) => +d.LON_ELLI_IMG),
    diamDim = ndx.dimension((d) => +d.DIAM_CIRC_IMG),
    eccenDim = ndx.dimension((d) => +d.DIAM_ELLI_ECCEN_IMG),
    ellipDim = ndx.dimension((d) => +d.DIAM_ELLI_ELLIP_IMG),
    angleDim = ndx.dimension((d) => +d.DIAM_ELLI_ANGLE_IMG),
    layNumDim = ndx.dimension((d) => +d.LAY_NUMBER),
    layMorph1Dim = ndx.dimension((d) => d.LAY_MORPH1),
    layMorph2Dim = ndx.dimension((d) => d.LAY_MORPH2),
    layMorph3Dim = ndx.dimension((d) => d.LAY_MORPH3),
    layNotesDim = ndx.dimension((d) => d.LAY_NOTES),
    intMorph1Dim = ndx.dimension((d) => d.INT_MORPH1),
    intMorph2Dim = ndx.dimension((d) => d.INT_MORPH2),
    intMorph3Dim = ndx.dimension((d) => d.INT_MORPH3),
    confDim = ndx.dimension((d) => d.CONF),
    notesDim = ndx.dimension((d) => d.NOTES),
    degRimDim = ndx.dimension((d) => d.DEG_RIM),
    degEjcDim = ndx.dimension((d) => d.DEG_EJC),
    degFlrDim = ndx.dimension((d) => d.DEG_FLR);

  diamDim.filter(null);

  // Sliders
  diamDim.filter(diameterSlider.noUiSlider.get(true));
  eccenDim.filter(eccenSlider.noUiSlider.get(true));
  ellipDim.filter(ellipSlider.noUiSlider.get(true));

  // intMorph1Dim.filter((v) => [""].includes(v));

  // Apply multi-value category filters
  // if (
  //   categoryFilters.Classification &&
  //   categoryFilters.Classification.size > 0
  // ) {
  //   const selected = Array.from(categoryFilters.Classification);
  //   intMorph1Dim.filter((d) => selected.includes(d ?? "NA"));
  // }

  let filteredData = ndx.allFiltered();
  return filteredData;
}

export { filterAllDims, toggleSelection };
