/**
 * returns string of Date object in format: HH:MM AM/PM
 * @param {Date} time
 * @returns {string} time - HH:MM AM/PM
 */
function getTime(time) {
	let hours = time.getHours();
	let meridiem;
	
	if (hours > 12) {
		hours -= 12;
		meridiem = "PM";
	}
	else {
		meridiem = "AM";
	}
	
	return `${hours}:${time.getMinutes()} ${meridiem}`;
}

/**
 * returns string of Date object in format: DayOfWeek, Month DD
 * @param {Date} time
 * @returns {string} date - DayOfWeek, Month DD
 */
function getDay(time) {
	let day;
	switch(time.getDay()) {
		case 0:
			day = 'Sunday';
			break;
		case 1:
			day = 'Monday';
			break;
		case 2:
			day = 'Tuesday';
			break;
		case 3:
			day = 'Wednesday';
			break;
		case 4:
			day = 'Thursday';
			break;
		case 5:
			day = 'Friday';
			break;
		case 6:
			day = 'Saturday';
			break;
		default: 
			day = 'Invalid';
	}
	day = day + ', ';
	
	switch(time.getMonth()) {
		case 0:
			day = day + "January";
			break;
		case 1:
			day = day + "February";
			break;
		case 2:
			day = day + "March";
			break;
		case 3:
			day = day + "April";
			break;
		case 4:
			day = day + "May";
			break;
		case 5:
			day = day + "June";
			break;
		case 6:
			day = day + "July";
			break;
		case 7:
			day = day + "August";
			break;
		case 8:
			day = day + "September";
			break;
		case 9:
			day = day + "October";
			break;
		case 10:
			day = day + "November";
			break;
		case 11:
			day = day + "December";
			break;
		default:
			day = day + "Invalid";
	}
	
	day = day + " " + time.getDate();
	return day;
}