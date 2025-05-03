// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@5/+esm";
function renderPieChart(containerId, filteredData, key, onClick) {
    console.log("onClick is", onClick);

    d3.select(`#${containerId}`).select("svg").remove();

    const width = 100;
    const height = 100;
    const radius = Math.min(width, height) / 2;

    const svg = d3
        .select(`#${containerId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Group data
    const groupedData = d3
        .nest()
        .key(d => d[key] ?? "NA")
        .rollup(v => v.length)
        .entries(filteredData);

    // Count values
    const counts = d3
        .nest()
        .key(d => d[key] ?? "NA")
        .rollup(v => v.length)
        .entries(filteredData);

    // Normalize to percentages
    const total = d3.sum(groupedData, d => d.value);
    const normalizedData = groupedData.map(d => ({
        label: d.key,
        value: d.value / total,
        rawCount: d.value
    }));
    console.log("Normalized Data:", normalizedData);

    // Create pie layout
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg
        .selectAll("path")
        .data(pie(normalizedData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .on("mouseenter", function () {
            d3.select(this).attr("stroke", "#000").attr("stroke-width", 2);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1);
        })
        .on("click", function (event, d) {
            if (d && d.data && d.data.label && typeof onClick === "function") {
                console.log("Pie segment clicked:", d.data.label);
                onClick(d.data.label);
            } else {
                console.warn("Invalid click target or callback:", d);
            }
        })
        .append("title")
        .text(d => `${d.data.label}: ${(d.data.value * 100).toFixed(1)}%`);
}

export { renderPieChart };