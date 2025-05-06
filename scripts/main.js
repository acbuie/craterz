import {
  configureMap,
  setDefaultEllipseStyle,
  setSelectedEllipseStyle,
  drawEllipse,
} from "./modules/map.mjs";

import { filterAllDims } from "./modules/filter.mjs";

import { formatColumnHeader, updatePage } from "./modules/table.mjs";
import { convertToCSV } from "./modules/csv.mjs";
import { renderCharts } from "./modules/renderCharts.mjs";

("use strict");

// TODO: Cleanup
let dataWrapper = {};
dataWrapper.allDims = {};
dataWrapper.ellipseMap = {};

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

    dataWrapper.ellipseMap[row.CRATER_ID] = ellipse;
  });

  // Initial chart setup
  renderCharts(filteredData);

  ellipseGroup.addTo(mapObject);
  let selectedEllipse = null;

  const craterTable = dc.dataTable("#table");

  // TODO: Cleanup
  dataWrapper.data = filteredData;
  dataWrapper.allDims = allDims;

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
          const ellipse = dataWrapper.ellipseMap[craterId];
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
  let pageSettings = {
    rows: filteredData.length,
    size: 25,
    index: 0,
  };

  // Render first page of table
  dc.renderAll();
  updatePage(pageSettings, dataWrapper);

  document.getElementById("prev").addEventListener("click", () => {
    if (pageSettings.index > 0) {
      pageSettings.index--;
      updatePage(pageSettings, dataWrapper);
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    const totalPages = Math.ceil(pageSettings.rows / pageSettings.size);
    if (pageSettings.index + 1 < totalPages) {
      pageSettings.index++;
      updatePage(pageSettings, dataWrapper);
    }
  });

  // Update filter on button click
  document.getElementById("filter-update").addEventListener("click", () => {
    const ndx = crossfilter(data);
    filteredData = filterAllDims(ndx);

    filteredData.sort(
      (a, b) => parseFloat(b.DIAM_CIRC_IMG) - parseFloat(a.DIAM_CIRC_IMG),
    );

    pageSettings.rows = filteredData.length;
    pageSettings.index = 0; // Reset to first page after a click
    // Scroll table to top-left
    document
      .getElementById("table-container")
      .scrollTo({ top: 0, left: 0, behavior: "smooth" });

    // NOTE: Recreate data table
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
            const ellipse = dataWrapper.ellipseMap[craterId];
            if (ellipse) {
              // NOTE: This is a bit of a hack to get the ellipse to redraw
              // and show the popup
              if (!ellipseGroup.hasLayer(ellipse)) {
                ellipseGroup.addLayer(ellipse);
              }
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

    // Draw table
    dataWrapper.data = filteredData;
    updatePage(pageSettings, dataWrapper);

    // Draw map
    // NOTE: This clears all data from the leaflet group then recalculates ellipses from the filtered data
    // There is almost certainly a better way to do this
    ellipseGroup.clearLayers();
    filteredData.map((row) => {
      drawEllipse(ellipseGroup, row, formatColumnHeader());
    });
    ellipseGroup.addTo(mapObject);
  });

  // Export to CSV
  document
    .getElementById("download-csv")
    .addEventListener("click", function () {
      if (filteredData.length === 0) {
        alert("No data to download!");
        return;
      }

      const csvContent = convertToCSV(filteredData);

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "filtered_data.csv";
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
});
