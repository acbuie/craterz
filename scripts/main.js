import {
  configureMap,
  myFunctionHolder,
  setDefaultEllipseStyle,
  setSelectedEllipseStyle,
  drawEllipse,
} from "./modules/map.mjs";

import {
  FilterSettings,
  updateFilterSettings,
  filterData,
} from "./modules/filter.mjs";

import { formatColumnHeader, displayPage } from "./modules/table.mjs";

("use strict");

// Setup map baselayer
let mapObject = configureMap("map");

// Load crater data
d3.csv("data/sample.csv", d3.autoType).then(function (data) {
  // Filter on `Update Filter` button
  document.getElementById("filter-update").addEventListener("click", () => {
    // Update settings
    // TODO: Check for changes?
    updateFilterSettings(FilterSettings);
    console.log(FilterSettings);

    // Filter
    data = data.filter((d) => {
      return filterData(d, FilterSettings);
    });

    // Need to redraw map and table here
  });

  // Sort largest to smallest so small craters appear on top
  data.sort(
    (a, b) => parseFloat(b.DIAM_CIRC_IMG) - parseFloat(a.DIAM_CIRC_IMG),
  );

  // Draw ellipses and bind popup
  const ellipseGroup = L.layerGroup();
  data.map((row) => {
    // Add ellipses to ellipseGroup
    let ellipse = drawEllipse(ellipseGroup, row, formatColumnHeader());

    myFunctionHolder.ellipseMap[row.CRATER_ID] = ellipse;

    return row;
  });

  ellipseGroup.addTo(mapObject);
  // mapObject.fitBounds(ellipseGroup.getBounds());

  // Crossfilter + DC setup
  let ndx = crossfilter(data);
  let allDim = ndx.dimension((d) => d);
  let selectedEllipse = null;

  const craterTable = dc.dataTable("#table");

  myFunctionHolder.enrichedData = data;
  myFunctionHolder.allDim = allDim;

  craterTable
    .dimension(myFunctionHolder.allDim)
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
  const totalRows = data.length;
  const pageSize = 25;
  let pageIndex = 0;

  // Render first page of table
  displayPage(pageIndex, totalRows, pageSize);

  document.getElementById("prev").addEventListener("click", () => {
    if (pageIndex > 0) {
      pageIndex--;
      displayPage(pageIndex, totalRows, pageSize);
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    const totalPages = Math.ceil(totalRows / pageSize);
    if (pageIndex + 1 < totalPages) {
      pageIndex++;
      displayPage(pageIndex, totalRows, pageSize);
    }
  });
});
