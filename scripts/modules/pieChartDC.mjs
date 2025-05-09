import { toggleSelection } from "./filter.mjs";

function renderPieChart(filteredData, key, onSelectCategory) {
    // Dynamically create div names for pie chart and legend
    const chartDivName = `#pie-chart-container-${key}`;
    const legendDivName = `#pie-chart-legend-${key}`;

    let ndx = crossfilter(filteredData);
    const selectedLabels = new Set();

    // Accomodate both string and number keys
    const pieDim = ndx.dimension(d => {
        const val = d[key];
        return val !== undefined && val !== null ? val.toString() : "NA";
    });
    console.log("Pie dimension:", pieDim);

    const pieGroup = pieDim.group().reduceCount();
    console.log("Pie group:", pieGroup.all());

    const pieChart = dc.pieChart(chartDivName);

    // FIXME: Trying to get the color scale to work with the pie chart
    // // const domain = Array.from(new Set(filteredData.map(d => d[key] || "NA")));
    // // const colorScale = d3.scaleOrdinal(d3.schemeSet3).domain(domain);
    // console.log(dc.config.defaultColors(d3.schemeCategory10));
    // console.log(d3.schemeSet3);

    // const domain = Array.from(new Set(filteredData.map(d => d[key] || "NA")));

    // const myColorScale = d3.scaleOrdinal()
    //     .domain(domain)
    //     .range(d3.schemeCategory10);
    dc.config.defaultColors(d3.schemeSet1);
    pieChart
        .width(150)
        .height(150)
        .dimension(pieDim)
        .group(pieGroup)
        .transitionDuration(0)
        .legend(
            new dc.HtmlLegend()
                .container(legendDivName)
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
            d3.selectAll(`${legendDivName} .dc-legend-item-vertical`)
                .on("click", function (event) {
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
