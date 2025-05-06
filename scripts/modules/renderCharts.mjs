import { renderPieChart } from "./pieChartDC.mjs";

function renderCharts(filteredData) {
  // renderPieChart("pie-chart-container", filteredData, "INT_MORPH1", (label) => {
  //   console.log("You clicked on:", label);
  const selectedLabels = renderPieChart(filteredData, "INT_MORPH1", label => {
    console.log("You clicked on:", selectedLabels);
  });
}
export { renderCharts };
