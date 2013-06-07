/**
 * This localNotification API is the same between our iOS and Android codebases.  It's basically 
 */

if (window.cordova) {
	window.document.addEventListener ( "receivedLocalNotification", receivedLocalNotification, false );
    window.document.addEventListener ( "deviceready", function () {
        window.plugins = {
                LocalNotificationPlugin: cordova.require( 'cordova/plugin/js/LocalNotification' )
            };
        console.log("Device ready");
    }, false);

}

var localNotification = {
	
	cancelAll : function() {
		console.log("************** localNotification.cancelAll() called ****************");
        window.plugins.LocalNotificationPlugin.cancelAll();
    },
    
    queue : function(id, notificationDate) {
        console.log("notification with id [" + id + " queued for [" + notificationDate + "]");
        window.plugins.LocalNotificationPlugin.add({
                    date : notificationDate,
                    message : "First 90 Days",
                    ticker : "View Today\'s Content",
                    repeatDaily : false,
                    id : id
            });
	}

}

function receivedLocalNotification ()  {
	console.log("******* javascript has received a local notification **********");
	try {
		page.goToArticleViaWeekDay( "" + ( GetCurrentWeek() + 1 ) + "::" + ( GetCurrentDay() ) + "" );
	} catch (err) {
		console.log("***** ERROR: problem trying to call page.goToArticleViaWeekDay: [" + err + "]");
	}
 }

function RegisterSingleNotification ( notificationDate ) {
        localNotification.queue( Math.floor(Math.random()*9000000), notificationDate);
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
