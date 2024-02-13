/**
 * Retrieves the list of events from the server and adds them respective to their section
 */
function loadEvents() {
	fetchFile("events.json", "json").then((events) => {
		//if server replies with requested data
		if (events) {
			for (let header in events) {
				events[header].forEach((eventData) => {
					addEvent(eventData, header);
				});
			}
		}
		else console.log("Could not retrieve event data");
	});
	
}

/**
 * Adds event to specified header via creating a new instance of EventItem
 * @param {Object} eventData - contains required information about the event
 * @param {string} header - specifies under which section to add the new event item
 */
function addEvent(eventData, header) {
	let item = new EventItem(eventData);
	document.getElementById(header).append(item.elem);
}

document.addEventListener("DOMContentLoaded", loadEvents);