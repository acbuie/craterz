// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@5/+esm";
function renderPieChart(containerId, filteredData, key, onClick) {
    console.log("TEST PIE CHART MODULE");

    // Clean up existing SVG if re-rendering
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
        value: d.value / total
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
        .append("title")
        .text(d => `${d.data.label}: ${(d.data.value * 100).toFixed(1)}%`);
}

export { renderPieChart };