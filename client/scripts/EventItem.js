class EventItem {
	constructor(eventObject) {
		this.id = eventObject["id"];
		this.name = eventObject["name"];
		this.startTime = new Date(Date.parse(eventObject["starttime"]));
		this.endTime = new Date(Date.parse(eventObject["endtime"]));
		this.people = eventObject["people"];
		this.desc = eventObject["description"];
		this.constructElem();
	}
	
	editEvent() {
		window.location.replace(`./event.html?id=${this.id}`);
	}
	
	/**
	 * Creates the HTML Element for this Event using the standard format
	 *
	 *	<div id='event-#' class='event'>
	 *		<span class='event-topLine'>
	 *		<h3>Example Event</h3>
	 *			<span class='event-buttons'>
	 *				<button class='event-edit'>Edit</button>
	 *			</span>
	 *		</span>
	 *		<this.sameDayElem() or this.bothDaysElem()>
	 *		<li class='event-people'>People Involved</li>
	 *		<li class='event-desc'>Description</li>
	 *	</div>
	 */
	constructElem() {
		this.elem = document.createElement("div");
			this.elem.id = `event-${this.id}`;
			this.elem.classList.add("event");
			
			//top line includes event name and button section
			let topLine = document.createElement("span");
				topLine.classList.add("event-topLine");
				
				//event name
				let title = document.createElement("h3");
					title.innerText = this.name;
					topLine.append(title);	
					
				//button section as edit button
				let buttons = document.createElement("span");
					buttons.classList.add("event-buttons");
					
					//edit button
					let editButton = document.createElement("button");
						editButton.classList.add("event-edit");
						editButton.innerText = "Edit";
						buttons.append(editButton);
					topLine.append(buttons);
					
				this.elem.append(topLine);
			//topLine end
				
			//datetime includes event date and time
			//if start and end time are less than 24h apart, only show the day for the start time
			if ((this.endTime.getTime() - this.startTime.getTime()) / 3600000 < 24)
				this.elem.append(this.sameDayElem());
			else
				this.elem.append(this.bothDaysElem());
			
			//people involved in event
			let eventPeople = document.createElement("li");
				eventPeople.classList.add("event-people");
				eventPeople.innerText = this.people;
				this.elem.append(eventPeople);
			
			//description of event
			let eventDesc = document.createElement("li");
				eventDesc.classList.add("event-desc");
				eventDesc.innerText = this.desc;
				this.elem.append(eventDesc);
		//elem end
		
		editButton.addEventListener("click", () => this.editEvent());
	}
	
	/**
	 *	Creates the HTML Element for datetime section of the Event using the standard format
	 *	When only the day is shown for the start time
	 *
	 *	<li class='event-datetime'>
	 *		DayOfWeek, Month ##<br/>
	 *		<time datetime='YYYY-MM-DD HH:MM'>HH:MM AM/PM</time> - <time datetime='YYYY-MM-DD HH:MM'>HH:MM AM/PM</time>
	 *	</li>
	 *
	 *	@returns {HTMLElement} datetime - li that contains start date and time info
	 */
	sameDayElem() {
		let datetime = document.createElement("li");
			datetime.classList.add = "event-datetime";
			
			//Day for starting time
			datetime.append(getDay(this.startTime));
			
			//linebreak
			datetime.append(document.createElement('br'));
			
			//starting time within HTML timestamp
			let start = document.createElement("TIME");
				start.setAttribute("datetime", this.startTime.toISOString().slice(0, 16).replace('T', ' '));
				start.innerText = getTime(this.startTime);
				datetime.append(start);
				
			//seperator
			datetime.append(" - ");
			
			//ending time within HTML timestamp
			let end = document.createElement("TIME");
				end.setAttribute("datetime", this.endTime.toISOString().slice(0, 16).replace('T', ' '));
				end.innerText = getTime(this.endTime);
				datetime.append(end);
		
		return datetime;
	}
	
	/**
	 *	Creates the HTML Element for datetime section of the Event using the standard format
	 *	When the day is shown for both start and end times
	 *
	 *	<li class='event-datetime'>
	 *		<time datetime='2023-04-28 21:30'>Friday, April 28 9:30 PM</time><br/>
	 *		<time datetime='2023-04-29 22:30'>Saturday, April 28 10:30 PM</time>
	 *	</li>
	 *
	 *	@returns {HTMLElement} datetime - li that contains end date and time info
	 */
	bothDaysElem() {
		let datetime = document.createElement("li");
			datetime.classList.add("event-datetime");
			
			//starting day and time within HTML timestamp
			let start = document.createElement("TIME");
				start.setAttribute("datetime", this.startTime.toISOString().slice(0, 16).replace('T', ' '));
				start.innerText = `${getDay(this.startTime)} ${getTime(this.startTime)}`;
				datetime.append(start);
			
			//linebreak
			datetime.append(document.createElement('br'));
			
			//ending day and time within HTML timestamp
			let end = document.createElement("TIME");
				end.setAttribute("datetime", this.endTime.toISOString().slice(0, 16).replace('T', ' '));
				end.innerText = `${getDay(this.endTime)} ${getTime(this.endTime)}`;
				datetime.append(end);
			
		return datetime;
	}
}
