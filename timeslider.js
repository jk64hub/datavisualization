const initializeTimeFilter = () => {

    document.getElementById('timeline_header').innerHTML = ''

    var values = [];

    const onClickHandler = (selectedYear) => {
        loadBarChart(selectedSector, selectedYear);
        loadLineChart(selectedSector,selectedYear);
    }

    for (var i = 0; i <= 10; i++)
        values.push(2009 + i)

    var select = document.createElement("select");
    select.id = 'yearSelection';
    select.onchange = onClickHandler;

    for (const val of values) {
        var option = document.createElement("option");
        option.value = val;
        option.text = val;
        option.selected = val === 2019;
        select.appendChild(option);


    }
    document.getElementById('timeline_header').append(select);


    $('#yearSelection').change(function () {
        onClickHandler($(this).val());
    })
}