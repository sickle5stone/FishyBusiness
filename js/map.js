var map;
var poly = [];
var markers = [];
var kmRadius = 50;

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.1229058, lng: -84.2068444},
        zoom: 6
    });

    $(document).ready(function(){
        //All Rivers
        $.get("http://139.59.238.158:8080/listRivers", function(data) {
            var obj = $.parseJSON(data);
            for(var i = 0; i < obj.length; i++) {
                console.log(obj);
                setMarkers(map, obj[i]);
            }
        });

        //TODO remove and replace with bounding box
        //All Dams
        // $.get("http://139.59.238.158:8080/listAllDams", function(data) {
        //     var obj = $.parseJSON(data);
        //     var polygon = [];
        //
        //      for(var i = 0; i < obj.length; i++) {
        //          setDamMarkers(map, obj[i]);
        //      }
        // });

        //TODO remove
        //Waterfalls
        $.get("http://139.59.238.158:8080/listAllWaterfalls", function(data) {
            var obj = $.parseJSON(data);
            for(var i = 0; i < obj.length; i++) {

                console.log(obj[i].waterfallLat, obj[i].waterfallLon)
                setWaterfallMarkers(map, obj[i]);
            }
        });
    });

    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);
    });

    // Poly line to be drawn!

    //draw the lines
    // drawForMRiver(map);

    // Drawing Manager here!
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.POLYLINE,
                google.maps.drawing.OverlayType.RECTANGLE
            ]
        },
        markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
        }
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
        console.log(rectangle);
    });

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(poly) {
        //console.log(poly.getPath());
        // generate the coords
        var result = [];
        for (var i = 0; i < poly.getPath().getLength(); i++) {
            // console.log(poly.getPath().getAt(i).toUrlValue(6));
            var latlng = poly.getPath().getAt(i).toUrlValue(6);
            var latlngStr = {"latitude":latlng.split(",")[0],"longitude":latlng.split(",")[1]};
            result.push(latlngStr);
        }
        console.log(result);

        var postData = {boundary: result};
        $.post("http://139.59.238.158:8080/listDams", postData, function(data) {
            var obj = $.parseJSON(data);

            for(var i = 0; i < obj.length; i++) {
                setDamMarkers(map, obj[i]);
            }
        });
    });

}

function placeMarkerAndPanTo(latLng, map) {
    clearMarkers();
    var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    markers.push(marker);
    marker = new google.maps.Circle({
        center: latLng,
        map: map,
        strokeColor: '#87CEFA',
        strokeWeight: 2,
        strokeOpacity: 0.8,
        fillColor: '#87CEFA',
        fillOpacity: 0.35,
        radius: kmRadius * 1000
    });
    markers.push(marker);
    map.setZoom(7);
    map.setCenter(latLng);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

function setMarkers(map, obj) {
    var image = {
        url: 'images/green.png',
    };

    // if (obj.riverName == "MILWAUKEE RIVER AT MOUTH AT MILWAUKEE, WI"){
    //     image.url = "images/green.png";
    // }

    if (obj.riverName == "GRAND RIVER NEAR EASTMANVILLE, MI"){
        image.url = "images/red.png";
    }

    if (obj.riverName == "FOX RIVER AT APPLETON, WI"){
        image.url = "images/yellow.png";
    }

    var marker = new google.maps.Marker({
        position: {lat: obj.riverLat, lng: obj.riverLong},
        map: map,
        icon: image,
        title: obj.riverName
    });

    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">' + obj.riverName + '</h1>'+
    '<div id="bodyContent">'+
    '<p><b>' + obj.riverName + '</b> has a GDD15 value of: <br>' +
    '<b>' + obj.riverName + '</b> has a Distance of: ' +
    '</p>'+
    '</div>'+
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    // When fish marker is being clicked
    marker.addListener('click', function() {
        infowindow.open(map, marker);
        console.log(this);
        if (this.title == "MENOMONEE RIVER AT 16TH STREET AT MILWAUKEE, WI"){
            poly = new google.maps.Polyline({
                strokeColor: '#1ABB9C',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            poly.setMap(map);
            drawForMRiver(map);
        } else if (this.title == "MILWAUKEE RIVER AT MOUTH AT MILWAUKEE, WI"){
            poly = new google.maps.Polyline({
                strokeColor: '#E74C3C',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            poly.setMap(map);
            drawForMilRiver(map);
        }
    });

}

function setDamMarkers(map, obj) {
    var dam = {
        url: 'images/dam2.png',
    };

    var marker = new google.maps.Marker({
        position: {lat: obj.damLat, lng: obj.damLon},
        map: map,
        icon: dam,
        title: obj.damName
    });
}

function setWaterfallMarkers(map, obj) {
    var waterfall = {
        url: 'images/waterfall.png',
    };

    var marker = new google.maps.Marker({
        position: {lat: obj.waterfallLat, lng: obj.waterfallLon},
        map: map,
        icon: waterfall,
        title: obj.waterfallName
    });
}


function drawForMRiver(map) {
    var path = poly.getPath();
    for(var i = 0; i < mRiver.length; i++) {
        path.push(new google.maps.LatLng(mRiver[i].lat, mRiver[i].lng));
        var marker = new google.maps.Marker({
            position: google.maps.LatLng(mRiver[i].lat, mRiver[i].lng),
            title: '#' + path.getLength(),
            map: map
        });
    }

    google.maps.LatLng.prototype.kmTo = function(a){
        var e = Math, ra = e.PI/180;
        var b = this.lat() * ra, c = a.lat() * ra, d = b - c;
        var g = this.lng() * ra - a.lng() * ra;
        var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g/2), 2)));
        return f * 6378.137;
    }

    google.maps.Polyline.prototype.inKm = function(n){
        var a = this.getPath(n), len = a.getLength(), dist = 0;
        for (var i=0; i < len-1; i++) {
        dist += a.getAt(i).kmTo(a.getAt(i+1));
        }
        return dist;
    }

    console.log(poly.inKm());
}

function drawForMilRiver(map) {
    var path = poly.getPath();
    for(var i = 0; i < milRiver.length; i++) {
        path.push(new google.maps.LatLng(milRiver[i].lat, milRiver[i].lng));
        var marker = new google.maps.Marker({
            position: google.maps.LatLng(milRiver[i].lat, milRiver[i].lng),
            title: '#' + path.getLength(),
            map: map
        });
    }

    google.maps.LatLng.prototype.kmTo = function(a){
        var e = Math, ra = e.PI/180;
        var b = this.lat() * ra, c = a.lat() * ra, d = b - c;
        var g = this.lng() * ra - a.lng() * ra;
        var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g/2), 2)));
        return f * 6378.137;
    }

    google.maps.Polyline.prototype.inKm = function(n){
        var a = this.getPath(n), len = a.getLength(), dist = 0;
        for (var i=0; i < len-1; i++) {
        dist += a.getAt(i).kmTo(a.getAt(i+1));
        }
        return dist;
    }

    console.log(poly.inKm());
}


function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
