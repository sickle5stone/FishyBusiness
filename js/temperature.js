// This is used to populate the graph for the first time when its initialise
var weekTempAverage = 0;
$(function(){
    var tempArr = [];
    $.ajax({
        url: "http://allow-any-origin.appspot.com/http://waterdata.usgs.gov/nwis/uv?format=rdb&period=&begin_date=2016-04-15&end_date=2016-04-24&cb_00010=on&site_no=04119400"
    })
    .done(function(data){

        data = data.split(/\r?\n/);
        var lines = [];
        for(var i = 0; i < data.length; i++){
            if (data[i].charAt(0) != "#"){
                var token = data[i].split('\t');
                lines.push(token);
            }
        }
        lines.shift();
        lines.shift();
        for (var i = 0; i < lines.length; i++){
            var day = moment(lines[i][2]);
            var temp = lines[i][4];
            tempArr.push([day.unix() * 1000, temp]);
            // tempArr.push(temp);
        }

        var total = 0;
        for (var i = 0; i < tempArr.length; i++){
            if (tempArr[i][1] != undefined)
                total += parseInt(tempArr[i][1]);
        }

        weekAverage = total / tempArr.length;
        $("#avg-temp").html(weekAverage.toFixed(2) + "°C");
        window.phgauge.set(lines[0][2]);
        initializeGraph(tempArr, tempArr);
    })
})

function loadRiver(site){
    console.log(site)
    // For temp data
    var tempArr = [];
    $.ajax({
        url: "http://allow-any-origin.appspot.com/http://waterdata.usgs.gov/nwis/uv?cb_00010=on&format=rdb&period=&begin_date=2016-04-16&end_date=2016-04-24&site_no=" + site
    })
    .done(function(data){
        data = data.split(/\r?\n/);
        var lines = [];
        for(var i = 0; i < data.length; i++){
            if (data[i].charAt(0) != "#"){
                var token = data[i].split('\t');
                lines.push(token);
            }
        }
        lines.shift();
        lines.shift();
        for (var i = 0; i < lines.length; i++){
            var day = moment(lines[i][2]);
            var temp = lines[i][4];
            tempArr.push([day.unix() * 1000, temp]);
            // tempArr.push(temp);
        }

        var total = 0;
        for (var i = 0; i < tempArr.length; i++){
            if (tempArr[i][1] != undefined)
                total += parseInt(tempArr[i][1]);
        }

        weekAverage = total / tempArr.length;
        $("#avg-temp").html(weekAverage.toFixed(2) + "m/s");

        initializeGraph(tempArr, tempArr);
    });



    var weekAverage = 0;

    // For flow data
    var flowArr = [];
    $.ajax({
        url: "http://allow-any-origin.appspot.com/http://waterdata.usgs.gov/nwis/uv?format=rdb&period=&begin_date=2016-04-15&end_date=2016-04-22&cb_00055=on&site_no=" + site
    })
    .done(function(data){

        data = data.split(/\r?\n/);
        var lines = [];
        for(var i = 0; i < data.length; i++){
            if (data[i].charAt(0) != "#"){
                var token = data[i].split('\t');
                lines.push(token);
            }
        }
        lines.shift();
        lines.shift();
        for (var i = 0; i < lines.length; i++){
            var day = moment(lines[i][2]);
            var flowData = lines[i][4];
            flowArr.push([day.unix() * 1000, flowData]);

        }

        var total = 0;
        for (var i = 0; i < flowArr.length; i++){
            if (flowArr[i][1] != undefined)
                total += parseInt(flowArr[i][1]);
        }

        weekAverage = total / flowArr.length;
        $("#avg-motion").html(weekAverage.toFixed(2) + "m/s");
        initializePHGraph(flowArr, flowArr);
    })
}

function initializeGraph(data1, data2){
    $("#canvas_dahs").length && $.plot($("#canvas_dahs"), [
        {label: "Probe 1", data: data1}//, {label:"Probe 2", data: data2}
    ], {
        series: {
            lines: {
                show: false,
                fill: true
            },
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },
            points: {
                radius: 1,
                show: true
            },
            shadowSize: 2
        },
        grid: {
            verticalLines: true,
            hoverable: true,
            clickable: true,
            tickColor: "#d5d5d5",
            borderWidth: 1,
            color: '#fff'
        },
        colors: ["rgba(38, 185, 154, 0.38)", "rgba(3, 88, 106, 0.38)"],
        xaxis: {
            tickColor: "rgba(51, 51, 51, 0.06)",
            mode: "time",
            tickSize: [1, "day"],
            //tickLength: 10,
            axisLabel: "Date",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10,
            mode: "time",
            timeformat: "%Y/%m/%d"
        },
        yaxis: {
            ticks: 8,
            tickColor: "rgba(51, 51, 51, 0.06)",
        },
        legend: {
            show: true,
            labelBoxBorderColor: "rgba(38, 185, 154, 0.38)",
            position: "se",
            labelFormatter: function(label, series) {
                // series is the series object for the label
                return '<a href="#' + label + '" style="color:#1ABB9C">' + label + '</a>';
            }
            //margin: number of pixels or [x margin, y margin]
            //backgroundColor: null or color
            //backgroundOpacity: number between 0 and 1
            //container: null or jQuery object/DOM element/jQuery expression
            //sorted: null/false, true, "ascending", "descending", "reverse", or a comparator
        },
        tooltip: {
            show: true,
            content: "%s"
        }
    });
}
