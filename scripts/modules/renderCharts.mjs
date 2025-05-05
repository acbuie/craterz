import { renderPieChart } from "./pie_chart.mjs";

function renderCharts(filteredData) {
  renderPieChart("pie-chart-container", filteredData, "INT_MORPH1", (label) => {
    console.log("You clicked on:", label);
  });
}

export { renderCharts };
