import {
  configureMap,
  pointToEllipse,
  popup,
  myFunctionHolder,
  setSelectedEllipseStyle,
} from "./modules/map.mjs";

import {
  FilterSettings,
  updateFilterSettings,
  filterData,
} from "./modules/filter.mjs";

("use strict");

let mapObject = configureMap("map");

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
        return filterData(d, FilterSettings);
      });

      // Need to redraw map and table here
    });

  // Sort largest to smallest so small craters appear on top
  data.sort(
    (a, b) => parseFloat(b.DIAM_CIRC_IMG) - parseFloat(a.DIAM_CIRC_IMG),
  );

  // Draw ellipses and bind popup
  const enrichedData = data.map((row) => {
    const ellipse = pointToEllipse(row);
    const popupText = popup(row);
    ellipse.bindPopup(popupText);
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
  myFunctionHolder.totalRows = enrichedData.length;
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
  const totalPages = Math.ceil(myFunctionHolder.totalRows / pageSize);
  if (currentPage + 1 < totalPages) {
    currentPage++;
    myFunctionHolder.displayPage(currentPage);
  }
});
