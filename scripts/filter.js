const ejectaLookup = {};

const interiorLookup = {
  Cpx: "Complex",
  Smp: "Simple",
  FF: "Flat Floor",
  FP: "Flat Floor - Pristine",
  CPt: "Central Peak",
}; // TODO: Work in progress, need to parse .csv for all options

// Default settings all set to empty string, null fails with `flatten`
var FilterSettings = {
  Coords: {
    Lat: "",
    Lon: "",
  },
  Diameter: {
    Min: "",
    Max: "",
  },
  Ejecta: {
    Layers: "",
    Morph: "", // EJECTA_MORPH_1
    LayerMorph: "", // EJECTA_MORPH_2
    TextureShape: "", // EJECTA_MORPH_3
    Notes: "",
  },
  Interior: {
    Crater: "",
    Wall: "",
    Floor: "",
  },
  Confidence: "",
  Notes: "",
  Degradation: {
    Rim: "",
    Ejecta: "",
    Floor: "",
  },
};

function Coords() {}

function Diameter(d, filterSettings) {
  return (
    d.DIAM_CIRC_IMG >= filterSettings.Diameter.Min &&
    d.DIAM_CIRC_IMG <= filterSettings.Diameter.Max
  );
}

// Ejecta filters
function EjectaLayers() {}
function EjectaMorph() {}
function EjectaLayerMorph() {}
function EjectaTextureShape() {}
function EjectaNotes() {}

// Interior filters
function InteriorCrater(d, filterSettings) {
  if (d.INT_MORPH1 === null) {
    return false;
  }
  return d.INT_MORPH1.includes(filterSettings.Interior.Crater);
}
function InteriorWall() {}
function InteriorFloor() {}

function Confidence() {}
function Notes() {}

function DegRim() {}
function DegWall() {}
function DegFloor() {}

// NOTE: Main filter function
// Add new filters to this array. Must follow the function signature as shown above

// TODO: Skip filter if FilterSettings set to null
// We will do this by only adding filters to Filters array if the FilterSettings has info
// Will probably need lookup table

// var Filters = [Diameter, InteriorCrater];

function getFilters(filterSettings) {
  let filters = [];

  if (filterSettings.Diameter.Min || filterSettings.Diameter.Max) {
    filters.push(Diameter);
  }

  if (filterSettings.Interior.Crater) {
    filters.push(InteriorCrater);
  }

  return filters;
}

function FilterData(d, filterSettings) {
  let validRow = true;

  let filters = getFilters(filterSettings);

  filters.every((func) => {
    validRow = validRow && func(d, filterSettings);

    // Break early if fails a filter
    if (!validRow) {
      return false;
    }

    return true;
  });

  return validRow;
}
