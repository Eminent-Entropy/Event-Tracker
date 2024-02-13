let eventServer = new URL("http://" + window.location.host);

/**
 * sends the specified GET request to the server and returns the response
 * @param {string} filePath - path to requested file on server
 * @param {string} dataType - type of data requested (text, json, blob)
 * @param {Object} [headers] - request headers if needed
 * @param {Object} [parameters] - Search Parameters 
 * @returns {Response} response - data returned by the server, decoded as indended
 */
function fetchFile(filePath, dataType, headers={}, parameters={}) {
	//setup URL
	let fileURL = eventServer;
	fileURL.pathname = `/${filePath}`;
	for (p in parameters) fileURL.searchParams.append(p, parameters[p]);
	
	headers["method"] = "GET";
	return fetch(fileURL, headers)
		.then(response => {
			//If server replies with requested file, return it. Else log HTTP error
			if (response.ok) {
				//decode the response as indended
				switch (dataType) {
					case "text": return response.text().then(data => { return data }); break;
					case "json": return response.json().then(data => { return data }); break;
					case "blob": return response.blob().then(data => { return data }); break;
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
	
	return fetch(fileURL, headers)
		.then(response => {
			//return the server's response, log if there is an HTTP error
			if (response.ok)
				return response;
			else {
				console.log(`HTTP-Error: ${response.status}\n${fileURL}`);
				return response;
			}
		})
		//if request is unable to be sent, log error
		.catch(error => {
			console.log(error.message);
			return undefined;
		});
}
