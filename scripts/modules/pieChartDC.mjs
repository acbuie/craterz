import { toggleSelection } from "./filter.mjs";

function renderPieChart(filteredData, key, onSelectCategory) {

    let ndx = crossfilter(filteredData);
    const selectedLabels = new Set();

    const pieDim = ndx.dimension(d => d["INT_MORPH1"] || "NA");
    const pieGroup = pieDim.group().reduceCount();
    const paper_group = "marker-select";
    const pieChart = dc.pieChart("#pie-chart-container");

    dc.config.defaultColors(d3.schemeSet3);

    pieChart
        .width(150)
        .height(150)
        .dimension(pieDim)
        .group(pieGroup)
        .transitionDuration(0)
        .legend(
            new dc.HtmlLegend()
                .container("#pie-chart-legend")
                // .legendItemClass("dc-legend-item")
                .highlightSelected(true)
                .horizontal(false)
                .legendText(d => `${d.name} (${d.data})`)
        )
        .on("pretransition", chart => {
            chart.selectAll("g.pie-slice").on("click", function (event) {
                const label = event.data?.key || event.key;
                console.log("Clicked on:", label);
                toggleSelection(label, selectedLabels, onSelectCategory);
            });
            d3.selectAll("#pie-chart-legend .dc-legend-item-vertical")
                .on("click", function (event) {
                    // d3.select(this).classed("dc-html-legend-selected", wasSelected => !wasSelected);

                    const label = event.name || event.key;
                    pieChart.filter(label);
                    console.log("Clicked on legend item:", label);
                    toggleSelection(label, selectedLabels, onSelectCategory);
                    dc.renderAll();
                });

        });

    dc.renderAll();
    return selectedLabels;
}


export { renderPieChart };
