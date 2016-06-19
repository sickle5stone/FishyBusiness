onLoad("04119400", "2015-06-01", "2016-01-01", function(data){});
globalGDD = 0;
function onLoad(siteNo, begin, end, callback){
    //Stream velocity for this function
    var tempArr = [];

    // http://allow-any-origin.appspot.com/http://news.google.com/news?ned=us&topic=h&output=rss
    $.ajax({
        url: "http://nwis.waterdata.usgs.gov/usa/nwis/uv/?format=rdb&period=&begin_date="+begin+"&end_date="+end+"&cb_00010=on&site_no=" + siteNo
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
        var dateTemp = new Map();
        //data access starts
        for (var i = 0; i < lines.length; i++){

            var day = moment(lines[i][2]).format('MMMM Do YYYY');
            var temp = lines[i][4];
            //console.log(lines[i][2])
            //console.log(lines[i][4])
            var val = dateTemp.get(day);
            if (val == null){
                dateTemp.set(day,temp);
                // console.log("i am here");
            }
            else{
                val = val + "|" + temp;
                dateTemp.set(day,val);
            }
            tempArr.push(temp);
        }

        var gddArray = gdd(moment("20150601"),moment("20160101"),dateTemp);

        console.log("Array Content: " + gddArray);

        var cumuArray = [];
        for (var i = 0; i < gddArray.length; i++){
            cumuArray[i] = arrayFromThis(gddArray, i);
        }
        console.log(cumuArray);

        var resultArr = [];
        for (var i = 0; i < cumuArray.length; i++){
            resultArr.push([i, cumuArray[i]]);
        }
        initializeGDDGraph(resultArr, resultArr);

        callback(cumuArray);
    })
}


function loadGDD(siteNo, begin, end){
    //Stream velocity for this function
    var tempArr = [];

    // http://allow-any-origin.appspot.com/http://news.google.com/news?ned=us&topic=h&output=rss
    $.ajax({
        url: "http://nwis.waterdata.usgs.gov/usa/nwis/uv/?format=rdb&period=&begin_date="+window.startDate+"&end_date="+window.endDate+"&cb_00010=on&site_no=" + siteNo
    })
    .done(function(data){
        console.log(data);
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
        var dateTemp = new Map();
        //data access starts
        for (var i = 0; i < lines.length; i++){

            var day = moment(lines[i][2]).format('MMMM Do YYYY');
            var temp = lines[i][4];
            //console.log(lines[i][2])
            //console.log(lines[i][4])
            var val = dateTemp.get(day);
            if (val == null){
                dateTemp.set(day,temp);
                // console.log("i am here");
            }
            else{
                val = val + "|" + temp;
                dateTemp.set(day,val);
            }
            tempArr.push(temp);
        }

        var gddArray = gdd(moment(window.startDate),moment(window.endDate),dateTemp);

        console.log("Array Content: " + gddArray);

        var cumuArray = [];
        for (var i = 0; i < gddArray.length; i++){
            cumuArray[i] = arrayFromThis(gddArray, i);
        }
        console.log(cumuArray);

        $("#gdd-score").html(cumuArray[cumuArray.length-1]);
        // callback(cumuArray);
    })
}

//2
function streamDistance(v, temp){
    // v is the velocity of water
    var d = 3.6 * v * hatchingRate(temp);
    return d;
}

// 3
function hatchingRate(temp){
    var rate = 233855 * Math.pow(temp, -2.4915);
    return rate;
}

function gdd(start_date,end_date,temperatureArray){

    var difference = moment(end_date.diff(start_date,'days'));
    var loop = difference._i;
    var returnArray = [];
    var curDate = moment();
    var totalGddScore = 0;
    curDate = start_date.format('MMMM Do YYYY');
    curDateObj = start_date;

    for (var k = 0;k<loop;k++){
        var totalTemp=0;
        var gddScore=0;
        var readings=0;
        var valueList = temperatureArray.get(curDate);
        var dayTempList = valueList.split("|");
        for (var j = 0;j<dayTempList.length;j++){
            totalTemp = parseFloat(totalTemp) + parseFloat(dayTempList[j]);
            readings = parseFloat(readings) + 1;
        }

        if (totalTemp > 0){
            gddScore = parseFloat(totalTemp)/parseFloat(readings);
            if (gddScore < 15){
                gddScore = 0;
            }
            else {
                gddScore = gddScore - 15;
            }
        }
        returnArray[k] = gddScore;
        totalGddScore = totalGddScore + gddScore;

        //    console.log(gddScore);
        curDateObj = curDateObj.add(1,'days');
        curDateObj = curDateObj.format("YYYY-MM-DD");
        curDateObj = moment(curDateObj);
        curDate = curDateObj.format('MMMM Do YYYY');
        //    console.log(curDate);

    }
    console.log("Number of Days: "+returnArray.length);
    console.log("Total Gdd Score: "+totalGddScore);

    globalGDD = totalGddScore;
    $("#gdd-score").html(totalGddScore.toFixed(2));
    return returnArray;
}


function min(start_date,end_date,temperatureArray){
    var difference = moment(end_date.diff(start_date,'days'));
    var loop = difference._i;
    var returnArray = [];
    var curDate = moment();
    var totalGddScore = 0;
    curDate = start_date.format('MMMM Do YYYY');
    curDateObj = start_date;
    var min = NUMBER.MAX_VALUE;

    for (var k = 0;k<loop;k++){
        var valueList = temperatureArray.get(curDate);
        var dayTempList = valueList.split("|");
        for (var j = 0;j<dayTempList.length;j++){
            if (parseFloat(dayTempList[j]) < min){
                min = dayTempList[j];
            }
        }

        curDateObj = curDateObj.add(1,'days');
        curDateObj = curDateObj.format("YYYY-MM-DD");
        curDateObj = moment(curDateObj);
        curDate = curDateObj.format('MMMM Do YYYY');
    }

    return min;
}

function max(start_date,end_date,temperatureArray){
    var difference = moment(end_date.diff(start_date,'days'));
    var loop = difference._i;
    var returnArray = [];
    var curDate = moment();
    var totalGddScore = 0;
    curDate = start_date.format('MMMM Do YYYY');
    curDateObj = start_date;
    var max = NUMBER.MIN_VALUE;

    for (var k = 0;k<loop;k++){
        var valueList = temperatureArray.get(curDate);
        var dayTempList = valueList.split("|");
        for (var j = 0;j<dayTempList.length;j++){
            if (parseFloat(dayTempList[j]) > min){
                min = dayTempList[j];
            }
        }

        curDateObj = curDateObj.add(1,'days');
        curDateObj = curDateObj.format("YYYY-MM-DD");
        curDateObj = moment(curDateObj);
        curDate = curDateObj.format('MMMM Do YYYY');

    }

    return max;

}

function avg(start_date,end_date,temperatureArray){

    return min(start_date,end_date,temperatureArray) + max(start_date,end_date,temperatureArray) / 2;

}

function arrayFromThis(arr, num){
    var total = 0;
    for (var i = num; i != 0; i--){
        total += arr[i];
    }
    return total;
}

function initializeGDDGraph(data1, data2){
    var gddplot = $("#canvas_gdd").length && $.plot($("#canvas_gdd"), [
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
            mode: "text",
            tickSize: [1, "day"],
            //tickLength: 10,
            axisLabel: "Day",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10
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

    window.gddplot = gddplot;
}
