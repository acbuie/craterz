"use strict"; // JS strict mode

var myFunctionHolder = {};

// //declaring function addPopups
// myFunctionHolder.addPopups = function (feature, layer) {
//   //this if statement used to check whether the feature has a property named "Location"
//   if (feature.properties && feature.properties.Location) {
//     layer.bindPopup(feature.properties.Location);
//   }
// }


//declaring function pointToCircle
myFunctionHolder.pointToEllipse = function (row) {
  const lat = parseFloat(row.LAT_ELLI_IMG);
  let lng;
  if (parseFloat(row.LON_ELLI_IMG) > 180) {
    lng = parseFloat(row.LON_ELLI_IMG) - 360;
  } else {
    lng = parseFloat(row.LON_ELLI_IMG);
  }
  const major = parseFloat(row.DIAM_ELLI_MAJOR_IMG) * 1000;
  const minor = parseFloat(row.DIAM_ELLI_MINOR_IMG) * 1000;
  const angle = parseFloat(row.DIAM_ELLI_ANGLE_IMG) + 90; // in degrees
  const ellipse = L.ellipse([lat, lng], [major, minor], angle, {
    color: "black",
    fillColor: "red",
    weight: 1,
    fillOpacity: 0.1,
  });
  return ellipse;
};


myFunctionHolder.popup = function (row) {
  const crater_id = row.CRATER_ID;
  const int_morph1 = row.INT_MORPH1;
  const popup_text = `Crater ID: ${crater_id}<br>Int Morph 1: ${int_morph1}`;
  return popup_text;
}

window.onload = function () {
  // Create and configure the Leaflet map
  let mapObject = L.map("map").setView([0, 0], 2); // global view

  let baseMap = L.tileLayer(
    "http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/viking_mdim21_global/{z}/{x}/{y}.png",
    {
      tms: true,
      maxNativeZoom: 7,
      attribution:
        '&copy; <a href="https://www.openplanetary.org/opm-basemaps/global-viking-mdim2-1-colorized-mosaic">OpenPlanetary</a>',
    }
  );

  baseMap.addTo(mapObject);

  // Load crater data
  d3.csv("data/sample.csv").then(function (data) {
    const ellipseGroup = L.layerGroup();

    // Sort largest to smallest so small craters appear on top
    data.sort((a, b) => parseFloat(b.DIAM_CIRC_IMG) - parseFloat(a.DIAM_CIRC_IMG));

    // Draw ellipses and bind popup
    const enrichedData = data.map(row => {
      const ellipse = myFunctionHolder.pointToEllipse(row);
      const popup_text = myFunctionHolder.popup(row);
      ellipse.bindPopup(popup_text);
      ellipseGroup.addLayer(ellipse);

      return { ...row, _leafletEllipse: ellipse }; // Attach the ellipse to the row for later reference
    });

    ellipseGroup.addTo(mapObject);
    // mapObject.fitBounds(ellipseGroup.getBounds());

    // Crossfilter + DC setup
    let ndx = crossfilter(enrichedData);
    let allDim = ndx.dimension(d => d);

    let craterTable = dc.dataTable("#table");
    craterTable
      .dimension(allDim)
      .group(() => "")
      .size(6)
      .columns([
        { label: "Crater ID", format: d => d.CRATER_ID },
        { label: "Longitude", format: d => d.LON_ELLI_IMG },
        { label: "Latitude", format: d => d.LAT_ELLI_IMG },
        { label: "Morphology", format: d => d.INT_MORPH1 }
      ])
      .sortBy(d => d.DIAM_CIRC_IMG)
      .order(d3.descending)
      .on('postRender', function () {
        d3.selectAll("#table .dc-table-row").on("click", function (event, d) {
          console.log("Clicked row:", d);
          console.log("Ellipse attached?", d._leafletEllipse);
          const ellipse = d._leafletEllipse;
          if (ellipse) {
            mapObject.setView(ellipse.getBounds().getCenter(), 10);
            ellipse.openPopup();
          }
        });
      });

    dc.renderAll();
  });
};
