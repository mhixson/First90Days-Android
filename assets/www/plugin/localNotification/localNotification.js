/**
 * 
 * @author Ally Ogilvie
 * @copyright WizCorp Inc. [ Incorporated Wizards ] 2011
 * @file localNotification.js for PhoneGap
 *
 */

if (window.cordova) {
	window.document.addEventListener ( "receivedLocalNotification", receivedLocalNotification, false );
    window.document.addEventListener ( "deviceready", function () {
        cordova.exec(null, null, "LocalNotification", "ready", []);
    }, false);
}

var localNotification = {

	add : function(id, options) {

		return cordova.exec(null, null, "LocalNotification", "addNotification", [id, options]);
	},

	cancel : function(id) {
		return cordova.exec(null, null, "LocalNotification", "cancelNotification", [id]);
	},
	
	cancelAll : function() {
        return cordova.exec(null, null,"LocalNotification", "cancelAllNotifications", []);
    },
    
    queue : function(id, options) {
        
		return cordova.exec(null, null, "LocalNotification", "queueNotification", [id, options]);
	},

    getApplicationBadge : function(s) {
        return cordova.exec(s, null, "LocalNotification", "getApplicationBadge", []);
    },
        
    setApplicationBadge : function(intValue, s) {
        return cordova.exec(s, null, "LocalNotification", "setApplicationBadge", [intValue]);
    }

}

function receivedLocalNotification ( event )  {
	if ( !appOpen ) {
		fromNotification = true;
  		page.goToArticleViaWeekDay( "" + ( GetCurrentWeek() + 1 ) + "::" + ( GetCurrentDay() ) + "" );
  	}
 }


/*
*
*   Example functions
*

function sendNotif() {
    myOptions = {
        seconds: 30,
        message: 'chaaaarrrliieeeee',
        badge: 1
    }
    localNotification.add( "0", myOptions );
    
};

function cancelLastNotif() {
    localNotification.cancel( "0" );
    
};

function cancelAllNotif() {
    
    localNotification.cancelAll();
    
};



*/
