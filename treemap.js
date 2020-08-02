const onClick = (d) => {
  loadBarChart(d);
}

// set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 40, left: 100 },
width = 700 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/2017_NAICS_Structure_Summary_Table.csv", function (data) {

  data = {
    "children": data.map(d => ({
      code: parseInt(d['Sector']),
      name: d['Name'],
      value: parseInt(d['value'].replace(/\,/g, ''), 10),
    }))
    .sort((a, b) => ( a.value > b.value ) ? -1 : 1).slice(0,10)
  };

  var root = d3.hierarchy(data).sum(function (d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap()
    .size([width, height])
    .padding(4)
    (root)

  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("stroke", "black")
    .style("fill", "#69b3a2")
    .on('click', onClick);

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function (d) { return d.x0 + 10 })    // +10 to adjust position (more right)
    .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
    .text(function (d) { return d.data.name })
    .attr("font-size", "15px")
    .attr("fill", "white")

});