
// initialize the map
var map = new L.Map('map');

// configure the map settings
var mapUrl = 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.jpg',
    mapAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles By <a href="http://stamen.com">Stamen</a>',
    mapInfo = new L.TileLayer(mapUrl, {maxZoom: 18, attribution: mapAttrib});

// set a default location for the map
var city = new L.LatLng(37.7577,-122.4376); // geographical point (longitude and latitude)
map.setView(city, 13).addLayer(mapInfo);
var open_cases_list = [];
var marker_orange = new L.icon({iconUrl: 'images/marker_orange.png'});
var marker_blue = new L.icon({iconUrl: 'images/marker_blue.png'});

// create a marker

function add_yesterdays_markers(open_or_closed){
  if (open_or_closed == 'opened'){
    var marker_color = marker_orange;
  }
  if (open_or_closed == 'closed'){
    var marker_color = marker_blue;
  }

  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate() - 5;
  var yesterday = d.getFullYear() + '-' +
      ((''+month).length<2 ? '0' : '') + month + '-' +
      ((''+day).length<2 ? '0' : '') + day;
  /*var timestamp = '[0-9]{1,2}\:[0-9]{1,2}\:[0-9]{1,2}' ; 
  var regex = new RegExp(timestamp);*/
  yesterday += 'T00:00:00';
  var request_url = "https://data.sfgov.org/resource/vw6y-z8j6.json?$where="+open_or_closed+" > '"+yesterday+"'"
  console.log(request_url)
  var yesterdays_cases = $.getJSON(request_url
    , function(data){
      // console.log(data);
      // console.log(data.length);
      if (open_or_closed == 'opened'){
        $('#legend-newly-opened .value').html(data.length)
      }
      if (open_or_closed == 'closed'){
        $('#legend-newly-closed .value').html(data.length)
      }

      for (i in data){
        var latitude = data[i].point.latitude;
        var longitude = data[i].point.longitude;
        markerLocation = new L.LatLng(parseFloat(latitude), parseFloat(longitude));
        var marker = new L.Marker(markerLocation, {icon: marker_color}).bindPopup(data[i].request_type+', '+data[i].opened);
        open_cases_list.push(marker);
      }
      var open_cases_layer = new L.LayerGroup(open_cases_list);
      map.addLayer(open_cases_layer);
  });
}

// Yesterday
add_yesterdays_markers('opened')
add_yesterdays_markers('closed')
