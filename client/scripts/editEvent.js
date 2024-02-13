let newEvent = true;  //false if editing exisiting event
let currentURL = new URL(window.location.href);
let id = currentURL.searchParams.get("id"); //id of event being edited

/** load event data **/

/**
 * Checks if we are editing event, and sets up page for it if so
 */
function editEvent() {
	if (id) {
		fetchEventData(id, populateData);
		newEvent = false;
		indicateEditing();
	}
}

/**
 * requests data from server about an event with specified id
 * @param {number} id - id of event
 * @param {function} callback
 * @returns {Object} eventData - data about requested event
 */
function fetchEventData(id, callback) {
	fetchFile("event.json", "json", undefined, { "id": id }).then((eventData) => {
		//If server replies with requested data, return it. Else, alert user
		if (eventData) {
			callback(eventData);
		}
		else {
			alert("Could not retrieve event data");
			window.location.replace("./index.html");
		}
	});
}

/**
 * populates data about the event into the form's fields 
 * @param {Object} eventData - data about requested event
 */
function populateData(eventData) {
	document.getElementById("event-id").value = id;
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
			span.classList.add('link');
			span.append('Editing');
			a.append(span);
		elem.append(a);
	document.getElementById("links").append(elem); //add elem to navigation bar

	//creates delete button
	//<button id="delete-button">Delete</button>
	let deleteButton = document.createElement("button");
	deleteButton.id = "delete-button";
	deleteButton.innerText = "Delete";
	deleteButton.addEventListener("click", deleteEvent);
	document.getElementById("body-container").append(deleteButton);
}

/**
 * Sents post request to delete current event
 */
function deleteEvent() {
	console.log(id);
	if (confirm("Delete this event?")) {
		postData("delete-event.json", 
				JSON.stringify({"id":id}), 
				"application/json")
		.then(res => {
			if (!res || !res.ok) alert("delete failed");
			else window.location.replace("./index.html");
		});
	}
}

document.addEventListener("DOMContentLoaded", editEvent);