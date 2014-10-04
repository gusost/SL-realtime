function csvParse(data, key, omitKeys) {
	var arr = CSVToArray(data, ";");

	var headers = arr.shift();
	_.each(headers, function(value,index) {
		headers[index] = value.replace("#", "");
	} );

	var indexOfOmittedKeys = [];
	_.each(omitKeys, function(key){
		indexOfOmittedKeys.push(headers.indexOf(key));
	});

	var objectArray = [];
	var hashObject = {};

	if (key)
	{
		console.log("Got key: " + key);
		var keyRowIndex = headers.indexOf(key);

		indexOfOmittedKeys.push(keyRowIndex);
		indexOfOmittedKeys = _.sortBy(indexOfOmittedKeys).reverse(); // GG. reverse to always remove highest first.

		_.each(indexOfOmittedKeys,function(value){ 
			headers.splice(value,1);
		});

		_.each(arr, function(row) {

			var rowKey = row[keyRowIndex];

			_.each(indexOfOmittedKeys,function(index){ 
				row.splice(index,1); 
			});

			if( _.has(hashObject, rowKey) )
			{
				//console.log("Row:\n" + JSON.stringify(_.object(headers, row)) + "\n is allready present in the hash as:\n" + JSON.stringify(hashObject[rowKey]));
				hashObject[rowKey].push(_.object(headers, row));
			}
			else
			{
				hashObject[rowKey] = [_.object(headers, row)];
			}
		});
	}
	else
	{
		indexOfOmittedKeys = _.sortBy(indexOfOmittedKeys).reverse(); // GG. reverse to always remove highest first.		
		_.each(indexOfOmittedKeys,function(value){ 
			headers.splice(value,1);
		});

		_.each(arr, function(row) {

			_.each(indexOfOmittedKeys,function(index){ 
				row.splice(index,1); 
			});
			objectArray.push( _.object(headers, row) );
		});
	}

	return _.isEmpty(objectArray) ? hashObject : objectArray ;
}

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = (strDelimiter || ",");

	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp(
		(
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
	);


	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];

	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;


	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec( strData )){

		// Get the delimiter that was found.
		var strMatchedDelimiter = arrMatches[ 1 ];

		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if (
			strMatchedDelimiter.length &&
			strMatchedDelimiter !== strDelimiter
		){

			// Since we have reached a new row of data,
			// add an empty row to our data array.
			arrData.push( [] );

		}

		var strMatchedValue;

		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[ 2 ]){

			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			strMatchedValue = arrMatches[ 2 ].replace(
				new RegExp( "\"\"", "g" ),
				"\""
			);

		} else {

			// We found a non-quoted value.
			strMatchedValue = arrMatches[ 3 ];

		}


		// Now that we have our value string, let's add
		// it to the data array.
		arrData[ arrData.length - 1 ].push( strMatchedValue );
	}

	// Return the parsed data.
	return( arrData );
}
