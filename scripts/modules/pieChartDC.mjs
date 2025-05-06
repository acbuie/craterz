function renderPieChart(filteredData) {
    let ndx = crossfilter(filteredData);

    const pieDim = ndx.dimension(d => d["INT_MORPH1"] || "NA");
    const pieGroup = pieDim.group().reduceCount();
    const paper_group = "marker-select";
    const pieChart = dc.pieChart("#pie-chart-container", paper_group);

    pieChart
        .width(120)
        .height(120)
        // .innerRadius(20)
        .dimension(pieDim)
        .group(pieGroup)
        // .colors(d3.scaleOrdinal(d3.schemeSet3))
        .legend(
            new dc.HtmlLegend()
                .container("#pie-chart-legend")
                .horizontal(false)
                .highlightSelected(true)
                .legendText(d => `${d.name} (${d.data})`)
        );
    dc.config.defaultColors(d3.schemeSet3);
    console.log(pieGroup.all())
    // Render the chart group
    dc.renderAll(paper_group);

}

export { renderPieChart };
