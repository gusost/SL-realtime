
function getData(url, callback, dataPassThrough){

	var xmlHttpStatus = new XMLHttpRequest();
	xmlHttpStatus.onreadystatechange = function() {
		if(xmlHttpStatus.readyState === 4 && xmlHttpStatus.status === 200){
//      console.log("Raw http response " + JSON.stringify(xmlHttpStatus,null,'\t'));
//			if(xmlHttpStatus.responseXML)
//				callback(/* xmlHttpStatus.status, */xmlHttpStatus.responseXML.documentElement);
//			else
				callback(xmlHttpStatus.responseText, dataPassThrough);
			xmlHttpStatus.abort();
			xmlHttpStatus.onreadystatechange = null;
			xmlHttpStatus = null;
		}
	};
	xmlHttpStatus.open("GET", url, true);
//	xmlHttpStatus.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttpStatus.send();
}

function getSites(data)
{
//	console.time('Get-Sites');
	var preliminarySites = csvParse(data, "", ["LastModifiedUtcDateTime","ExistsFromDate"]);

	var sitePrefix = /^[12]00([0-9]{3}[0-9]*)/;
	// GG. Collapse reduntant SiteIds
	_.each(preliminarySites, function(site, index, preliminarySites) {
		if( sitePrefix.test(site.SiteId) )
		{
			/* 				console.log(sites[index].SiteId + "\ninto "); */
			preliminarySites[index].SiteId = site.SiteId.replace(sitePrefix, "$1");
			/* 				console.log(sites[index].SiteId); */
		}
	});

	// GG. Get all the uniq values for a site into an array but keyed with SiteId.
	_.each(preliminarySites, function(site, index, preliminarySites){
		if( _.has(sites, parseInt(site.SiteId)) )
		{
			if(_.isEqual(sites[parseInt(site.SiteId)], site) )
			{
				delete preliminarySites[index];
			}
			else
			{
/* 					console.log( JSON.stringify(sites[parseInt(site.SiteId)]) + " is not equal to " + JSON.stringify(site) ); */

				// GG. Compare all properties.
				_.each(_.keys(site),function(keyName) {
					if( sites[parseInt(site.SiteId)][keyName] !== site[keyName] )
					{
						// GG. if this property is allready an array. Push to it. Otherwise make an array of it.
						if ( _.isArray( sites[parseInt(site.SiteId)][keyName] ) )
						{
							if( sites[parseInt(site.SiteId)][keyName].indexOf() === -1 )
							{
								sites[parseInt(site.SiteId)][keyName].push(site[keyName]);
							}
						}
						else
						{
							sites[parseInt(site.SiteId)][keyName] = [ sites[parseInt(site.SiteId)][keyName], site[keyName] ];
						}
					}
				});
			}
		}
		else
		{
			sites[site.SiteId] = _.clone(site);
		}
	});

	// GG. Collapse Sitenames into ONE and add all sites to sitesArray.
	_.each(sites, function(site, index, sites){
		if( _.isArray(site.SiteName) )
		{
			sites[index].SiteName = _.reduce(site.SiteName, function(string, value) { 
				if( _.isString(string) ) 
				{
					return string + "/" + value;
				}
				else
				{
					return value;
				}
			});
		}
		sitesArray.push(site);
	});
	console.log("Done getting sites: " + sitesArray.length);
	
	// GG. Map StopAreaNumber to SiteId.
	_.each(sitesArray,function(site, index, sitesArray){
		if (_.isArray(site.StopAreaNumber) )
		{
			_.each(site.StopAreaNumber, function(value){
				if( ! _.isEmpty(stopAreaNumberToSiteId[value]) ) console.log( "Exists: " + stopAreaNumberToSiteId[value] );
				stopAreaNumberToSiteId[value] = index;
			});
		}
		else if( _.isString(site.StopAreaNumber) )
		{
			if( ! _.isEmpty(stopAreaNumberToSiteId[site.StopAreaNumber]) ) console.log( "Exists: " + stopAreaNumberToSiteId[site.StopAreaNumber] );
			stopAreaNumberToSiteId[site.StopAreaNumber] = index;
		}
		else
		{
			console.log( "What is site StopAreaNumber then? " + JSON.stringify(site.StopAreaNumber) );
		}
	});
	localStorage.setItem("sitesArray", JSON.stringify(sitesArray));
	localStorage.setItem("stopAreaNumberToSiteId", JSON.stringify(stopAreaNumberToSiteId));
	console.log("Done mapping stopAreaNumberToSiteId: " + _.keys(stopAreaNumberToSiteId).length );

//	console.timeEnd('Get-Sites');
}

function getStopPoints(data)
{
//	console.time('Get-Stop-Points');	
	stopPoints = csvParse(data,"", ["LastModifiedUtcDateTime","ExistsFromDate", "ZoneShortName", "StopAreaTypeCode"]);

	stopPoints.sort(function(a,b) {	return parseFloat(a.LocationNorthingCoordinate) - parseFloat(b.LocationNorthingCoordinate);	});

	/*
		_.each(result ,function(StopArea, key){
			if (StopArea.length > 1)
			{
				console.log("Row: " + key + "\n" + JSON.stringify(StopArea) );
			}
		});
		*/
	/*
		StopAreaNumber: "13427" StopAreaTypeCode: "BUSTERM" StopPointName: "Vivelvägen" StopPointNumber: "13428" ZoneShortName: "A"
		*/

//	console.timeEnd('Get-Stop-Points');
	console.log("Done mapping stopPoints: " + stopPoints.length);
	localStorage.setItem( "stopPoints", JSON.stringify(stopPoints) );
}

function getRealtimeTransports(SiteId) {
//	var url = 'https://api.trafiklab.se/sl/realtid/GetDpsDepartures.json?key=df4229ba40a5c038e5fb11eb151a5455&timeWindow=30&siteId=' + SiteId;
  console.log("Getting realtime info for: " + SiteId);
  var url = 'https://api.sl.se/api2/realtimedepartures.json?key=f89b47f34d48432eaeac26dc34ba4dee&timewindow=30&siteid=' + SiteId;
  getData(url, getRealtimeTransportsCallback);
}

function getRealtimeTransportsCallback(data){
//  console.log("\ngetRealtimeTransportsCallback data:\n" + JSON.stringify(JSON.parse(data), null, '\t'));
    var rides = [];

//    console.log(JSON.stringify(JSON.parse(req.response), null, '\t'));

    var departureCategories = _.pick(JSON.parse(data).ResponseData, transports);
    _.each(departureCategories, function(departures) {
		if(_.isArray(departures))
			rides = rides.concat(departures);
		else
			rides.push(departures);
	});

	//		console.log(JSON.stringify(rides, null, '\t'));

	var ridesArray = [];

	// GG. Pick the right attributes and make good dates.
	_.each(rides, function(ride){
		if(ride.TransportMode !== "METRO")
		{
			ride.TimeTabledDateTime = parseInt(new Date(ride.TimeTabledDateTime).getTime() / 1000 );
			ride.ExpectedDateTime   = parseInt(new Date(ride.ExpectedDateTime).getTime() / 1000 );
		}
		else
		{
			ride.TimeTabledDateTime = parseInt(new Date().getTime() / 1000 + parseInt(ride.DisplayTime) * 60 + timeOffset);
			ride.ExpectedDateTime   = ride.TimeTabledDateTime;
		}
		ridesArray.push(_.pick(ride, properties));
	});
/*
	if (new Date().getHours() < 15)
	{
		var filtered = ridesArray.filter(function(element) { return element.Destination === "Slussen"; });
		ridesArray = filtered;
	}
*/
	
	// GG. Make a message que and send messages there instead.
	ridesArray.sort(expectedTimeSort);
	var ridesArrayLength = ridesArray.length;
	var objArray = [];
	for(var k = 0; k < ridesArrayLength && k < 4; k++)
	{
		objArray.push({	"TransportMode" : ridesArray[k].TransportMode,
					   "LineNumber"		: ridesArray[k].LineNumber,
					   "Destination"		: ridesArray[k].Destination,
					   "TimeTabledDateTime": ridesArray[k].TimeTabledDateTime,
					   "ExpectedDateTime"	: ridesArray[k].ExpectedDateTime,
					   "Index"				: k	});

		setTimeout(function() {
			Pebble.sendAppMessage(objArray.shift());
		}, k*250, objArray);
	}

	if (ridesArrayLength < 3 )
	{
		for(var l = ridesArrayLength; l < 4; l++)
		{
			objArray.push({	"TransportMode" : "",
						   "LineNumber"		: "",
						   "Destination"		: "",
						   "TimeTabledDateTime"	: new Date().getTime() / 1000 + timeOffset,
						   "ExpectedDateTime"	: new Date().getTime() / 1000 + timeOffset,
						   "Index"				: l	});

			setTimeout(function() {
				Pebble.sendAppMessage(objArray.shift());
			}, l*250 + 750, objArray);
		}
	}
}


// GG. Generic result showing function

function result(data){
  console.log("Result:\n" + JSON.stringify(JSON.parse(data),null,'\t'));
}