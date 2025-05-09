import { renderPieChart } from "./pieChartDC.mjs";

//@Aidan if you want to test out just one or two pie charts, you can comment out the rest of the column names in the array below
function renderCharts(filteredData) {
  const columnNames = [
    // "LAY_NUMBER",
    // "LAY_MORPH1",
    // "LAY_MORPH2",
    // "LAY_MORPH3",
    "INT_MORPH1",
    "INT_MORPH2",
    "INT_MORPH3",
    // "CONF",
    "DEG_RIM",
    // "DEG_EJC",
    // "DEG_FLR"
  ];

  // This is the list of selected labels for each pie chart. Key is the column name, value is selectedLabels (as a Set)
  const selectedLabelMap = {};

  columnNames.forEach((key) => {
    const selectedLabels = renderPieChart(filteredData, key, (labels) => {
      // console.log(`You clicked on ${key}:`, labels);
      // console.log(selectedLabelMap, `now selected`);
    });

    selectedLabelMap[key] = selectedLabels;
  });

  return selectedLabelMap;
}

export { renderCharts };
