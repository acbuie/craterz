import {
  diameterSlider,
  ellipSlider,
  eccenSlider,
  angleSlider,
} from "./slider.mjs";

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

function multivalueFitler(values) {
  return function (v) {
    return values.indexOf(v) !== -1;
  };
}

// const ejectaLookup = {};
//
// const interiorLookup = {
//   Cpx: "Complex",
//   Smp: "Simple",
//   FF: "Flat Floor",
//   FP: "Flat Floor - Pristine",
//   CPt: "Central Peak",
// }; // TODO: Work in progress, need to parse .csv for all options

var FILTER = {
  id: null,
  lat: null,
  lon: null,
  diam: null,
  eccen: null,
  ellip: null,
  angle: null,
  layNum: null,
  layMorph1: null,
  layMorph2: null,
  layMorph3: null,
  layNotes: null,
  intMorph1: null,
  intMorph2: null,
  intMorph3: null,
  conf: null,
  notes: null,
  degRim: null,
  degEjc: null,
  degFlr: null,
};

function updateFilter(filterList, dcData) {
  // TODO: Update with getter functions as they begin to exist
  // filterList.id = null
  // filterList.lat = null
  // filterList.lon = null
  filterList.diam = diameterSlider.noUiSlider.get(true);
  filterList.eccen = eccenSlider.noUiSlider.get(true);
  filterList.ellip = ellipSlider.noUiSlider.get(true);
  filterList.angle = angleSlider.noUiSlider.get(true);
  // filterList.layNum = null;
  // filterList.layMorph1 = dcData[];
  // filterList.layMorph2 = null;
  // filterList.layMorph3 = null;
  // filterList.layNotes = null;
  filterList.intMorph1 = [...dcData.INT_MORPH1]; // Convert set to list
  filterList.intMorph2 = [...dcData.INT_MORPH2];
  filterList.intMorph3 = [...dcData.INT_MORPH3];
  // filterList.conf = null;
  // filterList.notes = null;
  filterList.degRim = [...dcData.DEG_RIM];
  // filterList.degEjc = null;
  // filterList.degFlr = null;

  console.log(filterList);
  return filterList;
}

function filterAllDims(ndx, filterList = FILTER) {
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

  // TODO: This can be replaced with a zipped loop at some point
  if (filterList.id) {
    idDim.filter(filterList.id);
  }
  if (filterList.lat) {
    latDim.filter(filterList.lat);
  }
  if (filterList.lon) {
    lonDim.filter(filterList.lon);
  }
  if (filterList.diam) {
    diamDim.filter(filterList.diam);
  }
  if (filterList.eccen) {
    eccenDim.filter(filterList.eccen);
  }
  if (filterList.ellip) {
    ellipDim.filter(filterList.ellip);
  }
  if (filterList.angle) {
    angleDim.filter(filterList.angle);
  }
  if (filterList.layNum) {
    layNumDim.filter(filterList.layNum);
  }
  if (filterList.layMorph1) {
    layMorph1Dim.filter(filterList.layMorph1);
  }
  if (filterList.layMorph2) {
    layMorph2Dim.filter(filterList.layMorph2);
  }
  if (filterList.layMorph3) {
    layMorph3Dim.filter(filterList.layMorph3);
  }
  if (filterList.layNotes) {
    layNotesDim.filter(filterList.layNotes);
  }
  if (filterList.intMorph1 && filterList.intMorph1.length !== 0) {
    intMorph1Dim.filterFunction(multivalueFitler(filterList.intMorph1));
  }
  if (filterList.intMorph2 && filterList.intMorph2.length !== 0) {
    intMorph2Dim.filterFunction(multivalueFitler(filterList.intMorph2));
  }
  if (filterList.intMorph3 && filterList.intMorph3.length !== 0) {
    intMorph3Dim.filterFunction(multivalueFitler(filterList.intMorph3));
  }
  if (filterList.conf) {
    confDim.filter(filterList.conf);
  }
  if (filterList.notes) {
    notesDim.filter(filterList.notes);
  }
  if (filterList.degRim && filterList.degRim.length !== 0) {
    degRimDim.filterFunction(multivalueFitler(filterList.degRim));
  }
  if (filterList.degEjc) {
    degEjcDim.filter(filterList.degEjc);
  }
  if (filterList.degFlr) {
    degFlrDim.filter(filterList.degFlr);
  }

  return ndx.allFiltered();
}

export { FILTER, filterAllDims, updateFilter, toggleSelection };
