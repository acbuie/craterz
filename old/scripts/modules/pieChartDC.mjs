import { toggleSelection } from "./filter.mjs";
import { explodeColumn } from "./utils.mjs";

function renderPieChart(filteredData, key, onSelectCategory) {
  // Dynamically create div names for pie chart and legend
  const chartDivName = `#pie-chart-container-${key}`;
  const legendDivName = `#pie-chart-legend-${key}`;

  // @Aidan For now, apply this logic to all pie charts. Comment out if you don't want to filter the "contains" data.
  // if (key == "INT_MORPH3") {
  const longData = explodeColumn(filteredData, key);
  console.log("Long data:", longData);
  filteredData = longData;
  // }

  let ndx = crossfilter(filteredData);
  const selectedLabels = new Set();

  // Accomodate both string and number keys
  const pieDim = ndx.dimension((d) => {
    const val = d[key];
    return val !== undefined && val !== null ? val.toString() : "NA";
  });
  console.log("Pie dimension:", pieDim);

  const pieGroup = pieDim.group().reduceCount();
  console.log("Pie group:", pieGroup.all());

  const pieChart = dc.pieChart(chartDivName);

  dc.config.defaultColors(d3.schemeSet1);
  pieChart
    .width(175)
    .height(175)
    .dimension(pieDim)
    .group(pieGroup)
    .transitionDuration(0)
    .renderLabel(false) // Temporary fix for fixing bug that prevents the clcick from being registered if you click on the label
    .legend(
      new dc.HtmlLegend()
        .container(legendDivName)
        .highlightSelected(true)
        .horizontal(false)
        .legendText((d) => `${d.name} (${d.data})`),
    )
    .on("pretransition", (chart) => {
      chart.selectAll("g.pie-slice").on("click", function (event) {
        const label = event.data?.key || event.key;
        console.log("Clicked on:", label);
        toggleSelection(label, selectedLabels, onSelectCategory);
      });
      d3.selectAll(`${legendDivName} .dc-legend-item-vertical`).on(
        "click",
        function (event) {
          const label = event.name || event.key;
          pieChart.filter(label);
          console.log("Clicked on legend item:", label);
          toggleSelection(label, selectedLabels, onSelectCategory);
          dc.renderAll();
        },
      );
    });

  dc.renderAll();
  return selectedLabels;
}

export { renderPieChart };
