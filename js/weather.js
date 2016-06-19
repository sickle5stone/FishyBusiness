// In here, we use OpenWeatherMap API to grab weather data in Singapore
// Eventually, we can grab weather data based on geoIP location

$(function(){
    String.prototype.capitalize = function(){
        return this.toLowerCase().replace( /\b\w/g, function (m) {
            return m.toUpperCase();
        });
    };

    Handlebars.registerHelper('capitalizeFirst', function(context){
        //context is the unix epoch timestamp
        return context.capitalize();
    });

    Handlebars.registerHelper('formatTime', function(context){
        //context is the unix epoch timestamp
        var day = moment.unix(context).calendar();
        return day;
    });

    Handlebars.registerHelper('formatTemp', function(context){
        var temp = +(context).toFixed(2);
        return temp;
    });

    Handlebars.registerHelper('getWeatherIcon', function(context){
        switch (context){
            case "Clear":
                return "clear-day";
            case "Rain":
                return "rain"
            case "Clouds":
                return "cloudy";
            default:
                return "wind";
        }
        return temp;
    });

    var opts = {
      lines: 13 // The number of lines to draw
    , length: 0 // The length of each line
    , width: 14 // The line thickness
    , radius: 20 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
    }
    var target = document.getElementById('weather-today-content')
    var spinner = new Spinner(opts).spin(target);

    $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=Singapore&units=metric&appid=45a0c04d8f03c2a339f2470378e03df9"
    })
    .done(function(data){
        console.log(data);
        // Removes today's weather, since we are making a separate API call for a more accurate current weather
        var source = $("#weather-today").html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $("#weather-today-content").html(html);

    });

    $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/forecast/daily?q=Singapore&cnt=7&units=metric&appid=45a0c04d8f03c2a339f2470378e03df9"
    })
    .done(function(data){
        console.log(data);
        // Removes today's weather, since we are making a separate API call for a more accurate current weather
        data.list.shift();
        var source = $("#weather-forecast").html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $("#weather-forecast-content").html(html);

        something();
    });

});

function something(){
    var icons = new Skycons({
        "color": "#73879C"
    }),
    list = [
        "clear-day", "clear-night", "partly-cloudy-day",
        "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
        "fog"
    ];

    for (var i = 0; i < list.length; i++) {
        var em = document.getElementsByName(list[i]);
        if (em.length > 0){
            for (var j = 0; j < em.length; j++){
                icons.set(em[j], list[i]);
            }
        }
    }

    icons.play();
}
