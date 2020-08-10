const dataTransformAndFilter = (data, naics, year) => {
    data = data.map(d => ({
        fiscalYear: parseInt(d['Fiscal Year']),
        employer: d['Employer'],
        intialsApprovals: parseInt(d['Initial Approvals'].replace(/\,/g, ''), 10),
        intialsDenials: parseInt(d['Initial Denials'].replace(/\,/g, ''), 10),
        continuingApprovals: parseInt(d['Continuing Approvals'].replace(/\,/g, '')),
        continuingDenials: parseInt(d['Continuing Denials'].replace(/\,/g, '')),
        naics: d['NAICS'],
        state: d['State'],
        city: d['City'],
        zip: d['ZIP']
    }));

    return data.filter((d) => d.naics === `${naics}`)
        .sort((a, b) => (a.intialsApprovals > b.intialsApprovals) ? -1 : 1).slice(0, 10);
}

const loadBarChart = (sectorSelection, year, color) => {
    console.log(sectorSelection);

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 0, bottom: 150, left: 75 },
        width = screen.width * 0.3,
        height = 500 - margin.top - margin.bottom;

    var values = [];
    for (var i = 0; i <= 10; i++)
        values.push(2009 + i)

    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(values)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    document.getElementById('barchart_visual').innerHTML = '';

    // append the svg object to the body of the page
    var svg = d3.select("#barchart_visual")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    svg
        .append('text')
        .attr('id', 'yearLabel')
        .attr('x', width - 100)
        .attr('y', 20)
        .style('font-size', "xx-large")
        .text(year);

    // Parse the Data
    d3.csv('data/h1b_datahubexport-' + year + '.csv', function (data) {

        data = dataTransformAndFilter(data, sectorSelection.data.code);

        // Add X axis
        var x = d3.scaleBand()
            .domain(data.map(function (d) { return d.employer; }))
            .range([0, width])
            .padding(.1);

        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        var xAxisText = xAxis
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")


        // Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return d.intialsApprovals; })])
            .range([height, 0])
        var yAxis = svg.append("g")
            .call(d3.axisLeft(y))

        //Bars
        var bars = svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.employer); })
            .attr("y", function (d) { return y(d.intialsApprovals) })
            .attr("width", 30)
            .attr("height", function (d) { return height - y(d.intialsApprovals); })
            .attr("fill", color)
            .style("opacity", "0.85")

        svg.selectAll("rect")
            .append("title")
            .data(data)
            .text(d => d.intialsApprovals);

        const updateChart = (year) => {
            d3.select('#yearLabel').text(year);
            d3.csv('data/h1b_datahubexport-' + year + '.csv', function (data) {

                data = dataTransformAndFilter(data, sectorSelection.data.code);

                // Add X axis
                var x = d3.scaleBand()

                    .domain(data.map(function (d) { return d.employer; }))
                    .range([0, width])
                    .padding(.1);

                xAxis
                    .transition().duration(500)
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end")

                // Y axis
                var y = d3.scaleLinear()
                    .range([height, 0])
                    .domain([0, d3.max(data, function (d) { return d.intialsApprovals; })])

                yAxis
                    .transition().duration(500)
                    .call(d3.axisLeft(y))

                bars
                    .data(data)
                    .transition()
                    .duration(500)

                    .attr("x", function (d) { return x(d.employer); })
                    .attr("y", function (d) { return y(d.intialsApprovals) })
                    .attr("height", function (d) { return height - y(d.intialsApprovals); })
                    .attr("width", 30)
                    .attr("fill", color)
                    .style("opacity", "0.85")
            });
        }

        // Listen to the slider?
        d3.select("#yearSlider").on("input", function (d) {
            selectedYear = this.value
            updateChart(selectedYear)
        })
    })
}