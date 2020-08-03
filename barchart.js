const loadBarChart = (sectorSelection, year) => {
    console.log(sectorSelection);

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 30, bottom: 40, left: 250 },
        width = screen.width * 0.3,
        height = 400 - margin.top - margin.bottom;

    document.getElementById('barchart_visual').innerHTML = '';



    // append the svg object to the body of the page
    var svg = d3.select("#barchart_visual")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Parse the Data
    d3.csv('data/h1b_datahubexport-' + year + '.csv', function (data) {

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

        console.log('naiscs', sectorSelection.data.code)
        data = data.filter((d) => d.naics === `${sectorSelection.data.code}`)
            .sort((a, b) => (a.intialsApprovals > b.intialsApprovals) ? -1 : 1).slice(0, 10);
        console.log(data.slice(0, 10));

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.intialsApprovals; })])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(function (d) { return d.employer; }))
            .padding(.1);
        svg.append("g")
            .call(d3.axisLeft(y))

        //Bars
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", function (d) { return y(d.employer); })
            .transition()
            .duration(500)
            .attr("width", function (d) { return x(d.intialsApprovals); })
            .attr("height", y.bandwidth())
            .attr("fill", "#69b3a2")

        svg.selectAll("rect")
            .append("title")
            .data(data)
            .text(d => d.intialsApprovals);

    })
}
