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
  Ellipse: {
    Eccen: {
      Min: "",
      Max: "",
    },
    Ellip: {
      Min: "",
      Max: "",
    },
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

// Filters; Must take `d` as first arg and filterSettings as second arg

function coords(d, filterSettings) {}

function diameter(d, filterSettings) {
  // Allow for only one of mix or max to be set
  if (filterSettings.Diameter.Min ^ filterSettings.Diameter.Max) {
    if (filterSettings.Diameter.Min) {
      return d.DIAM_CIRC_IMG >= filterSettings.Diameter.Min;
    } else {
      return d.DIAM_CIRC_IMG <= filterSettings.Diameter.Max;
    }
  }

  return (
    d.DIAM_CIRC_IMG >= filterSettings.Diameter.Min &&
    d.DIAM_CIRC_IMG <= filterSettings.Diameter.Max
  );
}

function ellipseEccen(d, filterSettings) {
  if (filterSettings.Ellipse.Eccen.Min ^ filterSettings.Ellipse.Eccen.Max) {
    if (filterSettings.Ellipse.Eccen.Min) {
      return d.ELLI_ECCEN_IMG >= filterSettings.Ellipse.Eccen.Min;
    } else {
      return d.ELLI_ECCEN_IMG <= filterSettings.Ellipse.Eccen.Max;
    }
  }

  return (
    d.ELLI_ECCEN_IMG >= filterSettings.Ellipse.Eccen.Min &&
    d.ELLI_ECCEN_IMG <= filterSettings.Ellipse.Eccen.Max
  );
}
function ellipseEllip(d, filterSettings) {
  if (filterSettings.Ellipse.Ellip.Min ^ filterSettings.Ellipse.Ellip.Max) {
    if (filterSettings.Ellipse.Ellip.Min) {
      return d.ELLI_ELLIP_IMG >= filterSettings.Ellipse.Ellip.Min;
    } else {
      return d.ELLI_ELLIP_IMG <= filterSettings.Ellipse.Ellip.Max;
    }
  }

  return (
    d.ELLI_ELLIP_IMG >= filterSettings.Ellipse.Ellip.Min &&
    d.ELLI_ELLIP_IMG <= filterSettings.Ellipse.Ellip.Max
  );
}

// Ejecta filters
function ejectaLayers(d, filterSettings) {}
function ejectaMorph(d, filterSettings) {}
function ejectaLayerMorph(d, filterSettings) {}
function ejectaTextureShape(d, filterSettings) {}
function ejectaNotes(d, filterSettings) {}

// Interior filters
function interiorCrater(d, filterSettings) {
  if (d.INT_MORPH1 === null) {
    return false;
  }
  return d.INT_MORPH1.includes(filterSettings.Interior.Crater);
}
function interiorWall(d, filterSettings) {}
function interiorFloor(d, filterSettings) {}

function confidence(d, filterSettings) {}
function notes(d, filterSettings) {}

function degRim(d, filterSettings) {}
function degWall(d, filterSettings) {}
function degFloor(d, filterSettings) {}

function getFilters(filterSettings) {
  let filters = [];

  if (filterSettings.Diameter.Min || filterSettings.Diameter.Max) {
    filters.push(diameter);
  }

  if (filterSettings.Interior.Crater) {
    filters.push(interiorCrater);
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
