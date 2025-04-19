var myFunctionHolder = {};

function setDefaultEllipseStyle(ellipse) {
  ellipse.setStyle({
    color: "black",
    fillColor: "red",
    weight: 1,
    fillOpacity: 0.1,
  });
}

function setSelectedEllipseStyle(ellipse) {
  ellipse.setStyle({
    color: "#1c75bc",
    fillColor: "#4da6ff",
    weight: 4,
    fillOpacity: 0,
  });
}

function pointToEllipse(row) {
  const lat = parseFloat(row.LAT_ELLI_IMG);
  let lng;
  if (parseFloat(row.LON_ELLI_IMG) > 180) {
    lng = parseFloat(row.LON_ELLI_IMG) - 360;
  } else {
    lng = parseFloat(row.LON_ELLI_IMG);
  }
  const major = parseFloat(row.DIAM_ELLI_MAJOR_IMG) * 1000; // km to m
  const minor = parseFloat(row.DIAM_ELLI_MINOR_IMG) * 1000; // km to m
  const angle = parseFloat(row.DIAM_ELLI_ANGLE_IMG) + 90; // in degrees
  const ellipse = L.ellipse([lat, lng], [major, minor], angle);
  setDefaultEllipseStyle(ellipse); // Set default style
  return ellipse;
}

function popup(row) {
  const columns = myFunctionHolder.getCraterTableColumns();

  const lines = columns
    .map(({ label, format }) => {
      try {
        const value = format(row);
        return value === "NA" || value == null
          ? null
          : `<strong>${label}:</strong> ${value}`; // if no value for a column, don't display it.
      } catch {
        return null;
      }
    })
    .filter(Boolean); // remove nulls

  const popupText = lines.join("<br>");
  return popupText;
}

let pageSize = 25;
let currentPage = 0;

myFunctionHolder.allDim = {};

myFunctionHolder.displayPage = function (pageIndex) {
  const totalPages = Math.ceil(myFunctionHolder.totalRows / pageSize);
  if (pageIndex >= totalPages) return; // Don't go beyond last page
  if (pageIndex < 0) return; // Don't go before first page
  const offset = pageIndex * pageSize;
  const pageData = myFunctionHolder.enrichedData.slice(
    offset,
    offset + pageSize,
  ); // ✅

  myFunctionHolder.allDim.filterFunction((d) => pageData.includes(d)); // ✅ filter manually

  dc.redrawAll();
  myFunctionHolder.updatePageInfo();
};

myFunctionHolder.updatePageInfo = function () {
  const offset = currentPage * pageSize;
  const pageText = `Showing rows ${offset + 1}–${offset + pageSize} out of ${myFunctionHolder.totalRows}`;
  document.getElementById("page-info").textContent = pageText;

  const totalPages = Math.ceil(myFunctionHolder.totalRows / pageSize);
  document.getElementById("next").disabled = currentPage + 1 >= totalPages;
  document.getElementById("prev").disabled = currentPage === 0;
};
myFunctionHolder.ellipseMap = {};

// Table formatting
myFunctionHolder.getCraterTableColumns = function () {
  return [
    { label: "Crater ID", format: (d) => d.CRATER_ID },
    { label: "Lat", format: (d) => d.LAT_ELLI_IMG.toFixed(3) },
    { label: "Lon", format: (d) => d.LON_ELLI_IMG.toFixed(3) },
    { label: "Diameter (km)", format: (d) => d.DIAM_CIRC_IMG.toFixed(2) },
    { label: "Eccentricity", format: (d) => d.DIAM_ELLI_ECCEN_IMG.toFixed(3) },
    { label: "Ellipticity", format: (d) => d.DIAM_ELLI_ELLIP_IMG.toFixed(3) },
    {
      label: "Angle (from North)",
      format: (d) => d.DIAM_ELLI_ANGLE_IMG.toFixed(1),
    },

    { label: "Ejecta Layers", format: (d) => d.LAY_NUMBER },
    { label: "Ejecta Class", format: (d) => d.LAY_MORPH1 }, // @Aidan need a lookup table for this.
    { label: "Ejecta Texture", format: (d) => d.LAY_MORPH2 }, // @Aidan need a lookup table for this.
    { label: "Ejecta Shape", format: (d) => d.LAY_MORPH3 },
    { label: "Ejecta Notes", format: (d) => d.LAY_NOTES },

    { label: "Crater Class", format: (d) => d.INT_MORPH1 }, // @Aidan need a lookup table for this.
    { label: "Wall Morph", format: (d) => d.INT_MORPH2 },
    { label: "Floor Morph", format: (d) => d.INT_MORPH3 },

    { label: "Confidence", format: (d) => d.CONF },
    { label: "Notes", format: (d) => d.NOTES },

    { label: "Rim Degradation", format: (d) => d.DEG_RIM },
    { label: "Ejecta Degradation", format: (d) => d.DEG_EJC },
    { label: "Floor Degradation", format: (d) => d.DEG_FLR },
  ];
};

function configureMap(id) {
  let leafletMap = L.map(id).setView([0, 0], 2);

  let baseMap = L.tileLayer(
    "http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/viking_mdim21_global/{z}/{x}/{y}.png",
    {
      tms: true,
      maxNativeZoom: 7,
      noWrap: true, // Prevents wrapping longitudinally
      attribution:
        '&copy; <a href="https://www.openplanetary.org/opm-basemaps/global-viking-mdim2-1-colorized-mosaic">OpenPlanetary</a>',
    },
  );

  baseMap.addTo(leafletMap);

  return leafletMap;
}

export {
  configureMap,
  pointToEllipse,
  popup,
  myFunctionHolder,
  setSelectedEllipseStyle,
};
