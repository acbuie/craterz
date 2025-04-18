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

let pageSize = 25;
let currentPage = 0;

myFunctionHolder.allDim = {};

myFunctionHolder.displayPage = function (pageIndex) {
  const offset = pageIndex * pageSize;
  const pageData = myFunctionHolder.enrichedData.slice(offset, offset + pageSize); // ✅

  myFunctionHolder.allDim.filterFunction(d => pageData.includes(d)); // ✅ filter manually

  dc.redrawAll();
  myFunctionHolder.updatePageInfo();
};

myFunctionHolder.updatePageInfo = function () {
  const offset = currentPage * pageSize;
  const pageText = `Showing rows ${offset + 1}–${offset + pageSize}`;
  document.getElementById("page-info").textContent = pageText;
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
  { label: "Angle (from North)", format: (d) => d.DIAM_ELLI_ANGLE_IMG.toFixed(1) },

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
  { label: "Floor Degradation", format: (d) => d.DEG_FLR }
  ];
};


window.onload = function () {
  // Create and configure the Leaflet map
  let mapObject = L.map("map").setView([0, 0], 2); // global view

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

  baseMap.addTo(mapObject);

  // Load crater data
  d3.csv("data/sample.csv", d3.autoType).then(function (data) {
    const ellipseGroup = L.layerGroup();

    // Button click
    document
      .getElementById("filter-update")
      .addEventListener("click", function () {
        // Update settings
        // TODO: Check for changes?
        updateFilterSettings(FilterSettings);
        console.log(FilterSettings);

        // Filter
        data = data.filter((d) => {
          return FilterData(d, FilterSettings);
        });

        // Need to redraw map and table here
      });

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
      myFunctionHolder.ellipseMap[row.CRATER_ID] = ellipse;

      return row;
    });

    ellipseGroup.addTo(mapObject);
    // mapObject.fitBounds(ellipseGroup.getBounds());

    // Crossfilter + DC setup
    let ndx = crossfilter(enrichedData);
    let allDim = ndx.dimension((d) => d);
    let selectedEllipse = null;

    myFunctionHolder.craterTable = dc.dataTable("#table");

    myFunctionHolder.enrichedData = enrichedData;
    myFunctionHolder.allDim = allDim;

    myFunctionHolder.craterTable
      .dimension(myFunctionHolder.allDim)
      .group(() => "")
      .showGroups(false) // Gets rid of group header, which is unnecessary right now,  but might be useful later
      .size(Infinity)
      .columns(myFunctionHolder.getCraterTableColumns())
      .sortBy((d) => d.DIAM_CIRC_IMG)
      .order(d3.descending)
      .on("renderlet", function () {
        setTimeout(() => {
          const rows = d3.selectAll(".dc-table-row");      
          rows.on("click", function () {
            const cells = d3.select(this).selectAll("td").nodes();
            const craterId = cells[0]?.textContent?.trim();      
            const ellipse = myFunctionHolder.ellipseMap[craterId];
            if (ellipse) {
              if (selectedEllipse) {
                myFunctionHolder.setDefaultEllipseStyle(selectedEllipse);
              }
              myFunctionHolder.setSelectedEllipseStyle(ellipse);
              mapObject.fitBounds(ellipse.getBounds(), { padding: [100, 100] });
              ellipse.openPopup();
              selectedEllipse = ellipse;
            } 
          });
        }, 0);
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


