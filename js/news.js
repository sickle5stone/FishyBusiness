$(function(){

    Handlebars.registerHelper('timeAgo', function(context){
        //context is the unix epoch timestamp
        var day = moment.unix(context).fromNow();
        return day;
    });

    Handlebars.registerHelper('getNewsExcerpt', function(context, param){
        $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(context) + "%22%20and%20xpath%3D'%2F%2Fp'&format=json&diagnostics=true&callback="
        })
        .done(function(data){
            var allText = data.query.results.p;
            var result = "";
            allText.forEach(function(chunk){
                if (chunk && chunk.content)
                    result += chunk.content + "... ";
            });
            $("#" + param).text(result);
            $("#" + param).collapser({
                mode: 'words',
                truncate: 30
            });
        })

        return "";
    });

    Handlebars.registerHelper('truncateText', function(context, param){
        $("#" + param).text(context);
        $("#" + param).collapser({
            mode: 'words',
            truncate: 30
        });
    });

    // spin.js for adding a loading indicator right at the start
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
    var target = document.getElementById('agricultural-news-content')
    var spinner = new Spinner(opts).spin(target);

    $.ajax({
        method: "GET",
        url: "https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=0d0e6816bf8e6fb31a965f5fa81655ce5e018e58&outputMode=json&start=now-7d&end=now&count=5&q.enriched.url.title=Asian+Carp&return=enriched.url.url,enriched.url.title,enriched.url.text"
    })
    .done(function(data){
        console.log(data);
        var source = $("#agricultural-news").html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $("#agricultural-news-content").html(html);
    });
});
