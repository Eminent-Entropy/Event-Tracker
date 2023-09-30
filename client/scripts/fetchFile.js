let eventServer = new URL("http://eventtracker.eminent.entropy");

/**
 * sends the specified GET request to the server and returns the response
 * @param {string} filePath - path to requested file on server
 * @param {string} dataType - type of data requested (text, json, ect)
 * @param {Object} [headers] - request headers if needed
 * @returns {Response} response - data returned by the server, decoded as indended
 */
function fetchFile(filePath, dataType, headers={}) {
	//setup URL
	let fileURL = eventServer;
	fileURL.pathname = `/${filePath}`;
	
	headers["method"] = "GET";
	fetch(fileURL, headers)
		.then(response => {
			//If server replies with requested file, return it. Else log HTTP error
			if (response.ok) {
				//decode the response as indended
				switch (dataType) {
					case "text": return response.text(); break;
					case "json": return response.json(); break;
					case "blob": return response.blob(); break;
				}
			}
			else {
				console.log(`HTTP-Error: ${events.status}\n${fileURL}`);
				return undefined;
			}
		})
		//if request is unable to be sent, log error
		.catch(error => {
			console.log(error.message);
			return undefined;
		});
}

/**
 * sends specified data as a POST request to the server
 * @param {string} filePath - path to requested file on server
 * @param {string} data - stringified data to be sent to server
 * @param {string} contentType - content type header for POST request
 * @param {Object} [headers] - request headers if needed 
 * @returns {Response} response - server's response to the request
 */
function postData(filePath, data, contentType, headers={}) {
	//setup URL
	let fileURL = eventServer;
	fileURL.pathname = `/${filePath}`;

	headers["method"] = "POST";
	headers["headers"] = {"Content-Type" : contentType};
	headers["body"] = data;
	
	fetch(fileURL, headers)
		.then(response => {
			//return the server's response, log if there is an HTTP error
			if (response.ok)
				return response;
			else {
				console.log(`HTTP-Error: ${events.status}\n${fileURL}`);
				return response;
			}
		})
		//if request is unable to be sent, log error
		.catch(error => {
			console.log(error.message);
			return undefined;
		});
}
