import { renderPieChart } from "./pieChartDC.mjs";

function renderCharts(filteredData) {
  const columnNames = [
    // "LAY_NUMBER",
    // "LAY_MORPH1",
    // "LAY_MORPH2",
    // "LAY_MORPH3",
    // "LAY_NOTES",
    "INT_MORPH1",
    "INT_MORPH2",
    // "INT_MORPH3",
    // "CONF",
    "DEG_RIM",
    // "DEG_EJC",
    // "DEG_FLR"
  ];

  const selectedLabelMap = {};

  columnNames.forEach(key => {
    const selectedLabels = renderPieChart(filteredData, key, labels => {
      console.log(`You clicked on ${key}:`, labels);
      console.log(selectedLabelMap, `now selected`);
    });
  
    selectedLabelMap[key] = selectedLabels; // Store the Set
 });
  
}
export { renderCharts };
