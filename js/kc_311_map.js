
// initialize the map
var map = new L.Map('map');
var layers = [];

// configure the map settings
var mapUrl = 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.jpg',
    mapAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles By <a href="http://stamen.com">Stamen</a>',
    mapInfo = new L.TileLayer(mapUrl, {maxZoom: 18, attribution: mapAttrib});

// set a default location for the map
var city = new L.LatLng(37.7577,-122.4376); // geographical point (longitude and latitude)
map.setView(city, 12).addLayer(mapInfo);
var marker_orange = new L.icon({iconUrl: 'images/marker_orange.png'});
var marker_blue = new L.icon({iconUrl: 'images/marker_blue.png'});

// set up the filters
var current_neighborhood = $('#neighborhood').val();
var current_request_type = $('#request_type').val();
var current_status = $('#status').val();

// create a marker

function add_yesterdays_markers(open_or_closed){
var cases_list = [];

  if (open_or_closed == 'opened'){
    var marker_color = marker_orange;
  }
  if (open_or_closed == 'closed'){
    var marker_color = marker_blue;
  }

// find yesterday date
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate() - 1;
  if ((month == 1) && (day==1)){
  	month = 12;
  	day = 31;
  	year -= 1;
  }
  else if (day <= 0) {
  	month -= 1;
  	if (month == 5 || 6 || 10 || 11 ) {
  		day = 30;
  	}
  	if (month == 2 ){
  		day = 28;
  	}
  	else {
  		day = 31;
  		}
  	}

// fake date for demo until Socrata is fixed
	month = 5
	day = 27


  var yesterday = d.getFullYear() + '-' +
      ((''+month).length<2 ? '0' : '') + month + '-' +
      ((''+day).length<2 ? '0' : '') + day;

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
      	console.log(current_neighborhood);
      	if ( ((current_neighborhood === 'All') || (data[i].neighborhood === current_neighborhood)) && ((current_request_type === 'All') || (data[i].request_type === current_request_type)) && ((current_status === 'All') || (data[i].status === current_status))) {
	        var latitude = data[i].point.latitude;
	        var longitude = data[i].point.longitude;
	        markerLocation = new L.LatLng(parseFloat(latitude), parseFloat(longitude));
	        if (data[i].media_url === undefined) {
	        var marker = new L.Marker(markerLocation, {icon: marker_color}).bindPopup(data[i].request_type+', '+data[i].opened);
	        }
	        else {
	        var marker = new L.Marker(markerLocation, {icon: marker_color}).bindPopup(data[i].request_type+', '+data[i].opened+', <img src='+data[i].media_url.url+' style="width:100px;display:block;"/>');
	        }
	        cases_list.push(marker);
    	}
      }
      var open_cases_layer = new L.LayerGroup(cases_list);
      map.addLayer(open_cases_layer);
      layers.push(open_cases_layer);
  });
}

//Filter lists
function build_lists(){
	var filters = ["neighborhood", "request_type", "status"];
	filters.forEach(function(filter_name){
		var json_url = "https://data.sfgov.org/resource/vw6y-z8j6.json?$select="+filter_name;
		//console.log(json_url);
		var filter_list_items = [];
		var filter_name = filter_name;
		$.getJSON(json_url, 
			function(data){
			for (i in data){ 
				if (data[i][filter_name]) {
					filter_list_items[data[i][filter_name]]='';
				}	
			}
			//console.log(filter_list_items);
			for(i in filter_list_items){
				$('#'+filter_name).append('<option>'+i+'</option>');
			}
		});
	});	
		
}


//Remove points
function remove_points(){
	layers.forEach(function(i){
		map.removeLayer(i)
	});
}

build_lists();

// Yesterday
add_yesterdays_markers('opened');
add_yesterdays_markers('closed');

//Filter by selection
$('#neighborhood, #request_type, #status').change(function() {
  current_neighborhood = $('#neighborhood').val();
  current_service = $('#request_type').val();
  current_status = $('#status').val();
  remove_points();
  add_yesterdays_markers('opened');
  add_yesterdays_markers('closed');
});



