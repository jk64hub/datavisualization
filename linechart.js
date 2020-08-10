let lineChartdata = [];

const updateLineChartPointer = (year) => {


    selectedData = lineChartdata.filter(d => d.fiscalYear === Number(year));

    // set the dimensions and margins of the graph
    var width = screen.width * 0.3,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scaleTime()
        .domain(d3.extent(lineChartdata, function (d) { return d.fiscalYear; }))
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(lineChartdata, function (d) { return +d.intialsApprovals; })])
        .range([height, 0]);

    d3.select("#linechart_visual")
        .select('svg')
        .selectAll('g')
        .select('circle')
        .attr("cx", x(year))
        .attr("cy", y(selectedData[0].intialsApprovals))
}




const loadLineChart = (sectorSelection, year) => {

    console.log('sector', selectedSector.data.code);

    // Features of the annotation
    const annotations = selectedSector.data.code === 54 ? [
        {
            note: {
                label: "President Trump signed the Buy American and Hire American Executive Order",
                title: "On April 18, 2017"
            },
            x: screen.width * 0.3 * 0.8,
            y: 140,
            dy: 50,
            dx: -50
        }
    ] : [];

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 30, bottom: 40, left: 40 },
        width = screen.width * 0.3,
        height = 400 - margin.top - margin.bottom;

    document.getElementById('linechart_visual').innerHTML = '';

    // append the svg object to the body of the page
    var svg = d3.select("#linechart_visual")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv('data/h1b_datahubexport_2009_2019.csv', function (summary) {

        lineChartdata = summary.map(d => ({
            fiscalYear: parseInt(d['FiscalYear']),
            intialsApprovals: parseInt(d['Initial Approvals'].replace(/\,/g, ''), 10),
            intialsDenials: parseInt(d['Initial Denials'].replace(/\,/g, ''), 10),
            continuingApprovals: parseInt(d['Continuing Approvals'].replace(/\,/g, '')),
            continuingDenials: parseInt(d['Continuing Denials'].replace(/\,/g, '')),
            naics: d['naics'],
        })).filter(d => d.naics === `${sectorSelection.data.code}`);

        console.log('linechart', lineChartdata);
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(lineChartdata, function (d) { return d.fiscalYear; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(lineChartdata, function (d) { return +d.intialsApprovals; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        var focus = svg
            .append('g')
            .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 1)
            .attr('cx', x(2019))
            .attr('cy', lineChartdata.filter(d => d.fiscalYear === Number(year))[0].intialsApprovals)

        const makeAnnotations = d3.annotation()
            .annotations(annotations);

        // Add the line
        svg.append("path")
            .datum(lineChartdata)
            .attr("fill", "none")
            .attr("stroke", "#402D54")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.fiscalYear) })
                .y(function (d) { return y(d.intialsApprovals) })
            )
            .transition()
            .duration(500)
            .ease(d3.easeLinear);

        svg
            .append("g")
            .call(makeAnnotations);

    })
}