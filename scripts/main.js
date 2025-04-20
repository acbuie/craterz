import {
  configureMap,
  setDefaultEllipseStyle,
  setSelectedEllipseStyle,
  drawEllipse,
} from "./modules/map.mjs";

import { filterAllDims } from "./modules/filter.mjs";

import { formatColumnHeader, displayPage } from "./modules/table.mjs";

("use strict");

// TODO: Cleanup
var myFunctionHolder = {};
myFunctionHolder.allDims = {};
myFunctionHolder.ellipseMap = {};

// Setup map baselayer
let mapObject = configureMap("map");

// Load crater data
d3.csv("data/sample.csv", d3.autoType).then(function (data) {
  // Filter on `Update Filter` button

  // Crossfilter + DC setup
  const ndx = crossfilter(data);
  const allDims = ndx.dimension((d) => d);

  // Initial page load
  let filteredData = filterAllDims(ndx);

  // Sort largest to smallest so small craters appear on top
  filteredData.sort(
    (a, b) => parseFloat(b.DIAM_CIRC_IMG) - parseFloat(a.DIAM_CIRC_IMG),
  );

  // Draw ellipses and bind popup
  const ellipseGroup = L.layerGroup();
  filteredData.map((row) => {
    // Add ellipses to ellipseGroup
    let ellipse = drawEllipse(ellipseGroup, row, formatColumnHeader());

    myFunctionHolder.ellipseMap[row.CRATER_ID] = ellipse;
  });

  ellipseGroup.addTo(mapObject);
  let selectedEllipse = null;

  const craterTable = dc.dataTable("#table");

  // TODO: Cleanup
  myFunctionHolder.enrichedData = filteredData;
  myFunctionHolder.allDims = allDims;

  craterTable
    .dimension(allDims)
    .group(() => "")
    .showGroups(false) // Gets rid of group header, which is unnecessary right now,  but might be useful later
    .size(Infinity)
    .columns(formatColumnHeader())
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
              setDefaultEllipseStyle(selectedEllipse);
            }
            setSelectedEllipseStyle(ellipse);
            mapObject.fitBounds(ellipse.getBounds(), { padding: [100, 100] });
            ellipse.openPopup();
            selectedEllipse = ellipse;
          }
        });
      }, 0);
    });

  // Set up pagination controls
  let totalRows = filteredData.length;
  const pageSize = 25;
  let pageIndex = 0;

  // Render first page of table
  displayPage(pageIndex, totalRows, pageSize, myFunctionHolder);

  document.getElementById("prev").addEventListener("click", () => {
    if (pageIndex > 0) {
      pageIndex--;
      displayPage(pageIndex, totalRows, pageSize, myFunctionHolder);
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    const totalPages = Math.ceil(totalRows / pageSize);
    if (pageIndex + 1 < totalPages) {
      pageIndex++;
      displayPage(pageIndex, totalRows, pageSize, myFunctionHolder);
    }
  });

  // Update filter on button click
  document.getElementById("filter-update").addEventListener("click", () => {
    filteredData = filterAllDims(ndx);
    totalRows = filteredData.length;

    // Draw table
    displayPage(pageIndex, totalRows, pageSize, myFunctionHolder);
    dc.redrawAll();

    // Draw map
    // NOTE: This clears all data from the leaflet group then recalculates ellipses from the filtered data
    // There is almost certainly a better way to do this
    ellipseGroup.clearLayers();
    filteredData.map((row) => {
      drawEllipse(ellipseGroup, row, formatColumnHeader());
    });
    ellipseGroup.addTo(mapObject);
  });
});
