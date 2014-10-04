// GG. Intended to take care of all the location shizz.

function locationSuccess(pos) {
	currentPosition = pos; // coordinates = pos.coords;
	getStationsNearby(pos);
}

function locationError(err) {
  console.warn('Location error (' + err.code + '): ' + err.msg );
	Pebble.showSimpleNotificationOnPebble('Location error (' + err.code + ')', err.msg);
	Pebble.sendAppMessage({	
		"TransportMode" 	: "TRAM",
		"LineNumber"		: 666,
		"Destination"		: err.msg,
		"TimeTabledDateTime": new Date().getTime() / 1000 + timeOffset,
		"ExpectedDateTime"	: new Date().getTime() / 1000 + timeOffset,
		"Index"				: 0
	});
}

var R = 6371000; // [m]
var meterPerDegreeLat  = 111194.92; //R * Math.PI / 180; // [m/degree]
var meterPerDegreeLong = R * Math.cos(lat) * Math.PI / 180; // GG. cos around 60 is like 0.5 maybe should do that.
	
function getStationsNearby(pos) {
	if ( ! _.isArray(sitesArray ) || ! _.isArray(stopPoints) )
	{
		console.log("Not all variables are initiated.");
	}
  	console.log("Position: " + JSON.stringify(pos,null,'\t'));
	var lat = pos.coords.latitude;
	var long = pos.coords.longitude;
//  var coordinates = pos.coords;
// pos.coords.latitude, pos.coords.longitude;
//	var urlPosition = 'https://api.trafiklab.se/samtrafiken/resrobot/StationsI5e398bd12f7f956&apiVersion=2.1&radius=200&coordSys=WGS84&centerX=' + pos.coords.longitude + '&centerY=' + pos.coords.latitude;
/*
	"latitude": 59.30732342946562,
	"longitude": 18.132210749800667,
	"altitude": 34.669315338134766,
	"accuracy": 65.52569306115157
*/
  // GG. localStorage check if nearby here.
	var searchRadius = 600 + pos.coords.accuracy; // [m]
	var degreesSearchRadiusLat = searchRadius / meterPerDegreeLat; // [degree]
	
	// GG. With over 10000 elements. A binary search is needed to find lower point. Array is sorted.
	var latLowerLimit = lat - degreesSearchRadiusLat;
    var minIndex = 0;
    var maxIndex = stopPoints.length - 1;
    var currentIndex;
    var currentElement;
 	
	console.log("latLowerLimit: " + latLowerLimit);
	// GG. Can't decide if this will miss by one in some cases... decrement current index by one when done just in case.
    while (minIndex <= maxIndex) {
  
		currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = parseFloat( stopPoints[currentIndex].LocationNorthingCoordinate );
//		console.log("Current index: " + currentIndex + " Current lat: N " + currentElement); // GG. Debug
 
        if (currentElement < latLowerLimit) {
            minIndex = currentIndex + 1;
        }
		else { //if (currentElement > searchElement) { // GG. Equal "won't" happen.
            maxIndex = currentIndex - 1;
        }
    }
	currentIndex--;
	console.log("Decramenting index one. Current index: " + currentIndex + " Current lat: N " + parseFloat( stopPoints[currentIndex].LocationNorthingCoordinate ) ); // GG. Debug
	
	var meterPerDegreeLong = R * Math.cos(lat * Math.PI / 180) * Math.PI / 180; // GG. cos around 60 is like 0.5 maybe should do that.	
	var degreesSearchRadiusLong = searchRadius / meterPerDegreeLong; // [degree]

	
	var searchLength = 0;
	var hits = [];
	var latUpperLimit = lat + degreesSearchRadiusLat;
	var longUpperLimit = long + degreesSearchRadiusLong;
	var longLowerLimit = long - degreesSearchRadiusLong;
	console.log("longLowerLimit: " + longLowerLimit + ". longUpperLimit: " + longUpperLimit);
	
	var currentLongIndex = 0;
	for(var i=currentIndex, len = stopPoints.length; i < len; i++)
	{
		searchLength++
		if( parseFloat( stopPoints[i].LocationEastingCoordinate ) < longUpperLimit &&
		  	parseFloat( stopPoints[i].LocationEastingCoordinate ) > longLowerLimit )
		{
			hits.push(i);
			if (favoriteStationsIds.indexOf( stopAreaNumberToSiteId[ parseInt( stopPoints[i].StopAreaNumber) ] ) !== -1 )
			{
				currentSiteId = stopAreaNumberToSiteId[ parseInt( stopPoints[i].StopAreaNumber) ];
				getRealtimeTransports(currentSiteId);
			}
		}
			
		if( latUpperLimit < parseFloat( stopPoints[i].LocationNorthingCoordinate ) )
		{
			currentLongIndex = i;
			break;
		}
	}	
	console.log("Current long index: " + currentLongIndex + " Current lat: N " + parseFloat( stopPoints[currentLongIndex].LocationNorthingCoordinate ) ); // GG. Debug
	console.log("Search length: " + searchLength + ". Hits: " + hits.length);
	
	
//	var url = 'https://api.trafiklab.se/samtrafiken/resrobot/StationsInZone.json?apiVersion=2.1&centerX=' + pos.coords.longitude + '&centerY=' + pos.coords.latitude + '&radius=' + searchRadius + '&coordSys=WGS84&key=d7d1b22681627cc3e5e398bd12f7f956';
//	getData(url, findStation);
}

function getDistance(stopPoint, pos) {
/*	
	var R = 6371000;
	var x = (λ2-λ1) * Math.cos((φ1+φ2)/2);
*/
	var dlat = pos.coords.latitude - parseFloat( stopPoint.LocationNorthingCoordinate );
	var dlong = pos.coords.long - parseFloat( stopPoint.LocationEastingCoordinate );
	
	return meterPerDegreeLat * dlat * dlat + meterPerDegreeLong * dlong * dlong;
/*
	var R = 6371000; // [m]
	var meterPerDegreeLat  = 111194.92; //R * Math.PI / 180; // [m/degree]
	var meterPerDegreeLong = R * Math.cos(lat) * Math.PI / 180;

	var d = Math.sqrt(x*x + y*y) * R;

	var h = {};
	h.lon = 18.132483;
	h.lat = 59.307596;
	var dlon = 111412; // [m/deg]
	var dlat = Math.cos(h.lat*Math.PI/180)*dlon; // [m/deg]

	for(var i=0;i<l.length;i++) {
		console.log(l[i].name);
		console.log(Math.sqrt(Math.pow((parseFloat(l[i]['@x']) - h.lon)*dlon,2) + Math.pow((parseFloat(l[i]['@y']) - h.lat)*dlat,2)));
	}
	
*/
}

function findStation(response) {
  var locations = JSON.parse(response).stationsinzoneresult.location; // GG. Array.
	
//		JSON.stringify(_.pick(location, "name") , null,'\t') 
	
  _.each(locations, function(location){
    // GG. localStorage store them here.
    getSiteNameFromLocation(location);
  });
}

function getSiteNameFromLocation(location) {
  var stationName = location.name;
  var urlStationIdUrl = 'https://api.trafiklab.se/sl/realtid/GetSite.json?stationSearch=' + stationName + '&key=df4229ba40a5c038e5fb11eb151a5455';
//  console.log(encodeURI(urlStationIdUrl));
  getData(encodeURI(urlStationIdUrl), getSiteIdFromSiteName, stationName);
}

function getSiteIdFromSiteName(data, stationName){
/* GG. Data structure 
{
"Hafas": {
	"xmlnsxsi": "http://www.w3.org/2001/XMLSchema-instance",
	"xmlnsxsd": "http://www.w3.org/2001/XMLSchema",
	"xmlns": "http://www1.sl.se/realtidws/",
	"ExecutionTime": "00:00:00.2500272",
	"Sites": {
		"Site": {
			"Number": "9430",
			"Name": "Nacka station (Nacka)"
		}
	}
}
*/
  var parsedData = JSON.parse(data);
	if( _.isArray( parsedData.Hafas.Sites.Site ) ){
		console.log("Multiple sites have the same name");
		_.each(parsedData.Hafas.Sites.Site, function(site){
			if ( favoriteStationsIds.indexOf(site.Number) !== -1 ) {
				console.log("Got favorite: " + JSON.stringify(site, null, '\t') );
				getRealtimeTransports(site.Number);
				currentSiteId = site.Number;
			}			
		});
	}
	else if ( favoriteStationsIds.indexOf(parsedData.Hafas.Sites.Site.Number) !== -1 ) {
		getRealtimeTransports(parsedData.Hafas.Sites.Site.Number);
		currentSiteId = parsedData.Hafas.Sites.Site.Number;
	}
}

function printDistance() {
	var h = {};
	h.lon = 18.132483;
	h.lat = 59.307596;
	var dlon = 111412; // [m/deg]
	var dlat = Math.cos(h.lat*Math.PI/180)*dlon; // [m/deg]

	for(var i=0;i<l.length;i++) {
		console.log(l[i].name);
		console.log(Math.sqrt(Math.pow((parseFloat(l[i]['@x']) - h.lon)*dlon,2) + Math.pow((parseFloat(l[i]['@y']) - h.lat)*dlat,2)));
	}
}