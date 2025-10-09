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

function popup(row, columnMap) {
  const lines = columnMap
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
  return `<div class="scrollable-popup">${popupText}</div>`; // Wrap in a div to make it scrollable
}

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

function drawEllipse(layer, row, columnMap) {
  const ellipse = pointToEllipse(row);
  const popupText = popup(row, columnMap);

  ellipse.bindPopup(popupText);
  layer.addLayer(ellipse);

  return ellipse;
}

export {
  configureMap,
  setDefaultEllipseStyle,
  setSelectedEllipseStyle,
  drawEllipse,
};
