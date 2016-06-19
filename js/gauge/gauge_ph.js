var CustomTextRenderer = function(el){
    this.el = el;
    this.render = function(gauge){
        this.el.innerHTML = gauge.displayedValue.toPrecision(3);
    }
}
// inherit TextRenderer through prototype chain
CustomTextRenderer.prototype = new TextRenderer();

var cs = new CustomTextRenderer(document.getElementById("gauge-text"));


var opts = {
    lines: 12, // The number of lines to draw
    angle: 0, // The length of each line
    lineWidth: 0.4, // The line thickness
    pointer: {
        length: 0.75, // The radius of the inner circle
        strokeWidth: 0.042, // The rotation offset
        color: '#1D212A' // Fill color
    },
    limitMax: 'false', // If true, the pointer will not go past the end of the gauge
    colorStart: '#1ABC9C', // Colors
    colorStop: '#1ABC9C', // just experiment with them
    strokeColor: '#F0F3F3', // to see which ones work best for you
    generateGradient: true,
    animationSpeed: 128
};
var target = document.getElementById('gauge'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.setTextField(new CustomTextRenderer(document.getElementById("gauge-text")));
gauge.maxValue = 5.0; // set max gauge value
gauge.animationSpeed = 128; // set animation speed (32 is default value)
gauge.set(2.2); // set actual value


window.phgauge = gauge;

//TODO get this websocket implementation up and running
// This set of instructions will open a socket on the server, and wait for updates to the temperature data
// It will receive the updates, and modify the gauge accordingly
// $(function(){
//
//
//     var connection = new WebSocket('ws://html5rocks.websocket.org/echo');
//
//     // When the connection is open, send some data to the server
//     connection.onopen = function () {
//         connection.send('Ping'); // Send the message 'Ping' to the server
//     };
//
//     // Log errors
//     connection.onerror = function (error) {
//         console.log('WebSocket Error ' + error);
//     };
//
//     // Log messages from the server
//     connection.onmessage = function (e) {
//         console.log('Server: ' + e.data);
//         gauge.set(e.data.temperature);
//
//     };
// });
