let selectedSector = {};

var data = [];

const onClick = (d) => {
  svg.selectAll("rect").style('opacity', "0.85");
  d3.select(event.currentTarget).style("opacity", "0.75");
  selectedSector = d;
  reloadTreeMap();

  var index = data.children.map(n => n.value).indexOf(d.value);

  var color = d3.rgb(d3.select(event.currentTarget).style('fill'));
  console.log('index', index);
  console.log(d3.scaleOrdinal(d3.schemeCategory10)(index))
  loadBarChart(d, 2019, color);
  loadLineChart(d, 2019);
  d3.select('#yearDiv').style('display','block');
  d3.select('#yearSlider').node().focus();
}

const onMouseOver = (d) => {
  d3.select(event.currentTarget).style("cursor", "pointer");
  svg.selectAll("rect").style('opacity', "0.75");
  d3.select(event.currentTarget).style("opacity", "0.85");
}

const onMouseOut = (d) => {
  d3.select(event.currentTarget).style("cursor", "default");
  svg.selectAll("rect").style('opacity', "0.85");
}

var color = d3.scaleOrdinal(d3.schemeCategory10);

// set the dimensions and margins of the graph
var margin = { top: 20, right: 0, bottom: 40, left: 0 },
  width = screen.width * .7,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#treemap")
  .append("svg")
  .attr("width", width)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/2017_NAICS_Structure_Summary_Table.csv", function (summary) {

  data = {
    "children": summary.map(d => ({
      code: parseInt(d['Sector']),
      name: d['Name'],
      value: parseInt(d['value'].replace(/\,/g, ''), 10),
    }))
      .sort((a, b) => (a.value > b.value) ? -1 : 1).slice(0, 10)
  };

  var root = d3.hierarchy(data).sum(function (d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap()
    .size([width, height])
    .padding(4)
    (root)

    console.log(data);
    console.log(root.leaves())
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
    .style("fill", function (d, i) { return color(i) })
    .style("opacity", "0.85")
    .on('click', onClick)
    .on('mouseover', onMouseOver)
    .on('mouseout', onMouseOut);

  // and to add the text labels

  svg.selectAll("rect").append("title").data(root.leaves()).text(d => d.data.name + '/' + d.data.value);


  var text = svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("font-weight", (d, i) => i === 0 ? "normal" : null)
    .attr("x", function (d) { return d.x0 })    // +10 to adjust position (more right)
    .attr("y", function (d) { return d.y0 })    // +20 to adjust position (lower)


    text.append("tspan")
    .text(d => d.data.name.split("\n"))
    .attr("font-size", "15px")
    .attr("fill", "white")
    .attr("dx", 10)
    .attr("dy", 25);

  var vals = svg
    .selectAll("vals")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function (d) { return d.x0 + 10 })    // +10 to adjust position (more right)
    .attr("y", function (d) { return d.y0 + 40 })    // +20 to adjust position (lower)
    .text(function (d) { return d.data.value })
    .attr("font-size", "12px")
    .attr("fill", "white")
});

var reloadTreeMap = () => {

  var height = 200;
  d3.select('svg')
    .transition()
    .duration(500).attr('height', height + margin.top);


  // svg.selectAll("rect").remove();

  var root = d3.hierarchy(data).sum(function (d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data

  d3.treemap()
    .size([width, height])
    .padding(4)
    (root)

  svg
    .selectAll("rect")
    .data(root.leaves())
    .transition()
    .duration(500)
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("stroke", "black")
    .style("fill", function (d, i) { return color(d.value) })
    .style("opacity", "0.85")

    d3.selectAll('text').remove();


    var tspan = svg
    .selectAll("tspan")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("font-weight", (d, i) => i === 0 ? "normal" : null)
    .text(d => d)
    .attr("x", function (d) { return d.x0 + 10 })    // +10 to adjust position (more right)
    .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
    .text(function (d) { return d.data.name })
    .attr("font-size", "15px")
    .attr("fill", "white")


  var vals = svg
    .selectAll("vals")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function (d) { return d.x0 + 10 })    // +10 to adjust position (more right)
    .attr("y", function (d) { return d.y0 + 40 })    // +20 to adjust position (lower)
    .text(function (d) { return d.data.value })
    .attr("font-size", "12px")
    .attr("fill", "white")
}