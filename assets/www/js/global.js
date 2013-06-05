//Traverses a html elements heirarchy to find a parent element with id equal to id
 function getParentByID ( element, id ) {
 	if( ( element.id.split('--').length < 2 ) && ( element.id != id ) && ( element.parentElement != null ) ){
 		getParentByID( element.parentElement, id );
 	} else {
 		return element;
 	}
 }

function weekColor ( week ) {
//    console.log('looking up color for week [' + week + ']');
	switch ( week ) {
		case 0:
			return '05ccea';
			break;
		case 1:
			return 'f00404';
			break;
		case 2:
			return 'ffb500';
			break;
		case 3:
			return '55ce04';
			break;
		case 4:
			return 'fb6405';
			break;
		case 5:
			return '4b00c7';
			break;
		case 6:
			return 'eb2862';
			break;
		case 7:
			return 'a79a00';
			break;
		case 8:
			return 'b20303';
			break;
		case 9:
			return '0284fd';
			break;
		case 10:
			return '95008d';
			break;
		case 11:
			return '06b1a4';
			break;
		case 12:
			return 'ff8205';
			break;
		default: 
			return '95008d';
	}	
}

/* This method returns the current time.  Use this method to change the current time if you need to
   test a time or date dependent feature. */
function getNow() {
    var d = new Date();
    return (d);
}

/* This method returns the time and date that the user setup as their start monday */
function getStart() {
	//Date is stored as milliseconds since unix epoc in string format
	var d = new Date( parseInt( localStorage.getItem('startDate') ) );
	return d;
}

function intDayToString ( num ) {
	switch ( num ) {
		case 1:
			return 'Mon';
			break;
		case 2:
			return 'Tue';
			break;
		case 3:
			return 'Wed';
			break;
		case 4:
			return 'Thu';
			break;
		case 5:
			return 'Fri';
			break;
		}
}
var msSec = 	1000;
var msMin = 	60000;
var msHour = 	3600000;
var msDay = 	86400000;
var msWeek = 604800000;

//Creates notifications for the next seven days if not exists
function SetNotificationsForWeek( ) {
	// Notifications disabled?
	var notificationsDisabled = localStorage.getItem( 'not' );
	// Get the start date
	var sDate = parseInt( localStorage.getItem( 'startDate' ) );
	// Create a date from the start week.
	var firstMonday = new Date( sDate );
	// Get Current week number
	var curWeek = parseInt( GetCurrentWeek() );
	
	// Are notifications Disabled?
	// and is the current week greater than the last registered week of notifications?
	if( ( notificationsDisabled == 0 ) && ( curWeek > LastNotificationWeek() ) ) {
		// Add this to the registered weeks list
		RegisterNotificationWeeks( curWeek );
		
		//loop vars
		var noteDate;
		console.log( 'first monday [' + firstMonday + ']');
		for( var i = 0; i < 5; i++ ) {
			// Date/Time of our new Notification
			console.log( 'curweek [' + curWeek+ ']');
			noteDate = new Date( firstMonday.getTime() + ( ( curWeek )  * msWeek ) + ( i * msDay )  );
			console.log( 'Notification time [' + noteDate + ']');
			
			
			RegisterSingleNotification( noteDate );
		} 
	} else if ( notificationsDisabled == 1 ) {
		console.log('**** killing all notifications from SetNotificationsForWeek ****');
		KillNotifications();
	}
}

function RegisterSingleNotification ( notificationDate ) {
        //console.log('inside RegisterSingleNotification');
		var today = getNow();
		//Prevents notifications being added in the past - This should prevent multiple notifications from popping all at once.
		if( today  <= notificationDate) {
            console.log( 'notification is in the future [' + today + ' < ' + notificationDate + ']' );
			console.log( 'Still valid though' );
			localNotification.queue( notificationDate.getTime(), {
					notificationDate: notificationDate,
					message: ' View Today\'s Content ',
					badge: 0
			});
		} else {
            console.log( 'notification is in the past [' + today + ' > ' + notificationDate + ']' );
        }
}


function LastNotificationWeek () {
	var notificationsWeeks = GetRegisteredNotificationWeeks();
	//console.log( 'Stored weeks: ' + localStorage.getItem('notificationsWeek') );
	if( notificationsWeeks == ""  || notificationsWeeks == null ){	return -1; }
	//console.log( notificationsWeeks );
	if( ( notificationsWeeks.length > 0 ) && (  notificationsWeeks.length < 13 ) ) {
		var highest = 0;
		for ( var i = 0; notificationsWeeks.length > i; i ++ ) {
			if( notificationsWeeks[i] > highest ) {
				highest = notificationsWeeks[i];
			}
		}
		console.log( 'HIGHEST WEEK: ' + highest );
		return highest;
	}
}

//Recursive function that adds all provided notiications to ios queue as well as the local list
function RegisterNotificationWeeks ( week ) {
	var weeks = GetRegisteredNotificationWeeks();
	if ( weeks == "" ) {
		weeks = new Array();
	}
 	weeks.push(week);
	localStorage.setItem('notificationsWeek', JSON.stringify( weeks ) );
}

//Retrieves the list of notifications,used to determine what notifications have been set, what notifications
function GetRegisteredNotificationWeeks () {
	var notifications = localStorage.getItem( 'notificationsWeek' );
	 if ( !notifications ) {
        localStorage.setItem( 'notificationsWeek', JSON.stringify( [] ) );
        favoritesList = localStorage.getItem('notificationsWeek' );
    }
    notifications = JSON.parse( notifications );
    return  notifications;
}

function KillNotifications () {
	localNotification.cancelAll();
}

//Determines current day/week

function GetCurrentWeek () {
	var currentWeek = Math.floor( ( getNow().getTime() - getStart().getTime() ) / msWeek );
	if ( currentWeek < 0 ) {
		currentWeek = 0;
	}
	
	if( currentWeek > 12 ) {
		currentWeel = 12;
	}
	return currentWeek;
}

function GetCurrentDay () {
	var start = getStart().toString();
	start = start.split( ' ' );
	start[4] = '00:00:00';
	start = start.join( " " );
	start = new Date( start );
	
	var currentDay = Math.ceil( ( getNow().getTime() - start.getTime() ) / msDay ) % 7;
	return currentDay;
}

