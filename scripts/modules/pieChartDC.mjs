import { toggleSelection } from "./filter.mjs";

function renderPieChart(filteredData, key, onSelectCategory) {
    
    let ndx = crossfilter(filteredData);
    const selectedLabels = new Set();

    const pieDim = ndx.dimension(d => d["INT_MORPH1"] || "NA");
    const pieGroup = pieDim.group().reduceCount();
    const paper_group = "marker-select";
    const pieChart = dc.pieChart("#pie-chart-container", paper_group);

    dc.config.defaultColors(d3.schemeSet3);

    pieChart
        .width(150)
        .height(150)
        .dimension(pieDim)
        .group(pieGroup)
        // .transitionDuration(0)
        .legend(
            new dc.HtmlLegend()
                .container("#pie-chart-legend")
                .horizontal(false)
                .highlightSelected(true)
                .legendText(d => `${d.name} (${d.data})`)
        )
        .on("pretransition", chart => {
            // Attach click handler to slices
            chart.selectAll("g.pie-slice").on("click", function(event) {
                const label = event.data?.key || event.key;
                console.log("Clicked on:", label);
                toggleSelection(label, selectedLabels, onSelectCategory);
            });

            // Attach click handler to legend items
            // DOESN'T WORK!!!
            d3.selectAll("#pie-chart-legend .dc-legend-item")
              .on("click", function(event) {
                  const label = event.name || event.key;
                  toggleSelection(label, selectedLabels, onSelectCategory);
                });
                
        });

    dc.renderAll(paper_group);
    return selectedLabels;
}


export { renderPieChart };
