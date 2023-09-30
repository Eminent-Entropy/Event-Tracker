let newEvent = true;  //false if editing exisiting event
let currentURL = new URL(window.location.href);
let id = currentURL.searchParams.get("id"); //id of event being edited

/** load event data **/

/**
 * Checks if we are editing event, and sets up page for it if so
 */
function editEvent() {
	if (id) {
		populateData(fetchEventData(id));
		newEvent = false;
		indicateEditing();
	}
}

/**
 * requests data from server about an event with specified id
 * @param {number} id - id of event
 * @returns {Object} eventData - data about requested event
 */
function fetchEventData(id) {
	let eventData = fetchFile("event.json", "json", {"id": id});
	//If server replies with requested data, return it. Else, alert user
	if (eventData) {
		eventData = eventData.parse();
		return eventData;
	}
	else {
		alert("Could not retrieve event data");
		window.location.replace("./index.html");
	}
}

/**
 * populates data about the event into the form's fields 
 * @param {Object} eventData - data about requested event
 */
function populateData(eventData) {
	for (let item in eventData) {
		//the key for each item should equal the id of the field
		let itemElem = document.getElementById(item);
		if (itemElem) {
			//map data to expected value for that field type
			switch (itemElem.type) {
				case "datetime-local":
					let datetime = new Date(Date.parse(eventData[item])); 
					datetime = datetime.toISOString().slice(0, 16);
					itemElem.defaultValue = datetime;
					break;
				default:
					itemElem.defaultValue = eventData[item];
			}
		}
		else console.log("Could not find field " + item);
	}
	
	//set section radio button in included
	if (eventData["section"]) document.getElementById(eventData["section"]).checked = true;
	
}

/**
 * Adds an item on the navigation bar to show the user is editing an event instead of adding one
 */
function indicateEditing() {
	document.querySelector(".current-page").classList.remove('current-page');
	
	//creates html element:
	//<li class='current-page'><a href='event.html?id=EventID'><span class='link'>Editing</span></a></li>
	let elem = document.createElement("li");
	elem.classList.add('current-page');
	let a = document.createElement('a');
		a.href = window.location.href;
		let span = document.createElement('span');
			span.class = 'link';
			span.append('Editing');
			a.append(span);
		elem.append(a);
	document.getElementById("links").append(elem); //add elem to navigation bar
}

//document.addEventListener("DOMContentLoaded", editEvent);


/** Submit Form **/

/**
 * Submits new event or changes to existing event to server
 * @param {Event} event
 */
function eventSubmit(event) {
	event.preventDefault();
	
	//find data fields
	let eventForm = document.getElementById("event-form");
	let items = eventForm.getElementsByTagName("input");
	
	//store data in {Object} eventData
	let eventData = {};
	eventData["id"] = !newEvent ? id : -1;
	for (let item of items) {
		//interprets based on input type 
		switch(item.type) {
			case "submit":
				break;
			case "radio":
				if (item.checked) eventData[item.id] = item.value;
				break;
			default:
				eventData[item.id] = item.value;
		}
	}
	
	//send object to server as json
	let response = postData("event.json", JSON.stringify(eventData), "application/json");
	
	//verify data was sent successfully, alert user if not
	if (!response) alert("Error: Request not recived");
	else if (!response.ok) alert(`Request Failed: ${events.status}`);
}
document.addEventListener("load", () => { document.getElementById("event-form").onsubmit = eventSubmit; });