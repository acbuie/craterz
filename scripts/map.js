("use strict"); // JS strict mode

var myFunctionHolder = {};

// //declaring function addPopups
// myFunctionHolder.addPopups = function (feature, layer) {
//   //this if statement used to check whether the feature has a property named "Location"
//   if (feature.properties && feature.properties.Location) {
//     layer.bindPopup(feature.properties.Location);
//   }
// }

//declaring function pointToCircle

myFunctionHolder.setDefaultEllipseStyle = function (ellipse) {
  ellipse.setStyle({
    color: "black",
    fillColor: "red",
    weight: 1,
    fillOpacity: 0.1,
  });
};

myFunctionHolder.setSelectedEllipseStyle = function (ellipse) {
  ellipse.setStyle({
    color: "#1c75bc",
    fillColor: "#4da6ff",
    weight: 4,
    fillOpacity: 0,
  });
};

myFunctionHolder.pointToEllipse = function (row) {
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
  myFunctionHolder.setDefaultEllipseStyle(ellipse); // Set default style
  return ellipse;
};

myFunctionHolder.popup = function (row) {
  const crater_id = row.CRATER_ID;
  const int_morph1 = row.INT_MORPH1;
  const diameter = row.DIAM_CIRC_IMG;
  const popup_text = `Crater ID: ${crater_id}<br>Int Morph 1: ${int_morph1}<br>Diameter: ${diameter}`;
  return popup_text;
};

let pageSize = 5;
let currentPage = 0;

myFunctionHolder.displayPage = function (pageIndex) {
  const offset = pageIndex * pageSize;
  const craterTable = myFunctionHolder.craterTable;
  craterTable.beginSlice(offset);
  craterTable.endSlice(offset + pageSize);
  dc.redrawAll();
  myFunctionHolder.updatePageInfo();
};

myFunctionHolder.updatePageInfo = function () {
  const offset = currentPage * pageSize;
  const pageText = `Showing rows ${offset + 1}–${offset + pageSize}`;
  document.getElementById("page-info").textContent = pageText;
};

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
    },
  );

  baseMap.addTo(mapObject);

  // Load crater data
  d3.csv("data/sample.csv", d3.autoType).then(function (data) {
    const ellipseGroup = L.layerGroup();

    // Filter data
    // Currently both Min and Max must be set
    FilterSettings.Diameter.Min = 40;
    FilterSettings.Diameter.Max = 1000;
    // FilterSettings.Interior.Crater = "FF";

    // Check if the filter has been set
    let updated = !Object.values(flatten(FilterSettings)).every(
      (o) => o === "",
    );

    if (updated) {
      console.log("Updated filter");
      data = data.filter((d) => {
        return FilterData(d, FilterSettings);
      });
    }

    // Sort largest to smallest so small craters appear on top
    data.sort(
      (a, b) => parseFloat(b.DIAM_CIRC_IMG) - parseFloat(a.DIAM_CIRC_IMG),
    );

    // Draw ellipses and bind popup
    const enrichedData = data.map((row) => {
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
    let allDim = ndx.dimension((d) => d);
    let selectedEllipse = null;

    myFunctionHolder.craterTable = dc.dataTable("#table");
    myFunctionHolder.craterTable
      .dimension(allDim)
      .group(() => "")
      .showGroups(false) // Gets rid of group header, which is unnecessary right now,  but might be useful later
      .size(Infinity)
      .columns([
        { label: "Crater ID", format: (d) => d.CRATER_ID },
        { label: "Longitude", format: (d) => d.LON_ELLI_IMG },
        { label: "Latitude", format: (d) => d.LAT_ELLI_IMG },
        { label: "Morphology", format: (d) => d.INT_MORPH1 },
      ])
      .sortBy((d) => d.DIAM_CIRC_IMG)
      .order(d3.descending)
      .on("postRender", function () {
        setTimeout(() => {
          d3.selectAll(".dc-table-row").on("click", (event) => {
            const ellipse = event._leafletEllipse;
            if (ellipse) {
              if (selectedEllipse) {
                myFunctionHolder.setDefaultEllipseStyle(selectedEllipse); // Reset previous selection
              }
              myFunctionHolder.setSelectedEllipseStyle(ellipse); // Set new selection style
              mapObject.fitBounds(ellipse.getBounds(), {
                padding: [100, 100],
              });
              ellipse.openPopup();
              selectedEllipse = ellipse; // Update the selected ellipse
            }
          });
        }, 0); // delay just long enough for rows to appear
      });

    // Render first page of table

    dc.renderAll();
    myFunctionHolder.displayPage(0);
  });

  // Set up pagination controls
  document.getElementById("prev").addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      myFunctionHolder.displayPage(currentPage);
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    currentPage++;
    myFunctionHolder.displayPage(currentPage);
  });
};
