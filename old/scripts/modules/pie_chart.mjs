function renderPieChart(containerId, filteredData, key, onClick) {
    d3.select(`#${containerId}`).select("svg").remove();
  
    const width = 100;
    const height = 100;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.5;
  
    const svg = d3.select(`#${containerId}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    const grouped = d3.nest()
      .key(d => d[key] || "NA")
      .rollup(v => v.length)
      .entries(filteredData);
  
    const total = d3.sum(grouped, d => d.value);
  
    const pieData = grouped.map(d => ({
      label: d.key,
      value: d.value / total,
      rawCount: d.value
    }));
  
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    const arcs = pie(pieData);
  
    svg.selectAll("path")
      .data(arcs)
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
      .on("click", function (event) {
        onClick(event.data.label);
      })
      .append("title")
      .text(d => `${d.data.label}: ${(d.data.value * 100).toFixed(1)}%`);
  
    // 🔹 Custom Filterable Legend
    const legend = d3.select("#pie-chart-legend");
    legend.html(""); // clear previous
  
    pieData.forEach(d => {
      const item = legend.append("div")
        .attr("class", "legend-item")
        .style("display", "flex")
        .style("align-items", "center")
        .style("cursor", "pointer")
        .style("margin", "2px 0")
        .on("click", function () {
          d3.select(this).classed("selected", !d3.select(this).classed("selected"));
          onClick(d.label); // call your filter function
        });
  
      item.append("div")
        .style("width", "12px")
        .style("height", "12px")
        .style("background-color", color(d.label))
        .style("margin-right", "6px");
  
      item.append("span")
        .text(`${d.label} (${d.rawCount})`);
    });
  }

  export { renderPieChart };