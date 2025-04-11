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
  const angle = parseFloat(row.DIAM_ELLI_ANGLE_IMG); // in degrees
  const ellipse = L.ellipse([lat, lng], [major, minor], angle, {
    color: "black",
    fillColor: "red",
    weight: 1,
    fillOpacity: 0.1,
  });
  return ellipse;
};

window.onload = function () {
  // window.onload allows for the map to load after the page has loaded
  let mapObject = L.map("map").setView([0, 0], 2); // global view
  let baseMap = L.tileLayer(
    "http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/viking_mdim21_global/{z}/{x}/{y}.png",
    {
      tms: true,
      attribution:
        "&copy; <a href=”https://www.openplanetary.org/opm-basemaps/global-viking-mdim2-1-colorized-mosaic”>OpenPlanetary</a>",
    },
  );
  // let baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '&copy; OpenStreetMap contributors'
  // });
  baseMap.addTo(mapObject);

  d3.csv("data/sample.csv").then(function (data) {
    const ellipseGroup = L.layerGroup();
    data.forEach(function (row) {
      const ellipse = myFunctionHolder.pointToEllipse(row);
      ellipseGroup.addLayer(ellipse);
    });
    ellipseGroup.addTo(mapObject);
    mapObject.fitBounds(ellipseGroup.getBounds());
  });
};

