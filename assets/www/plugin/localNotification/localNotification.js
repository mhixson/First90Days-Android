/**
 * 
 * TODO: change the implementation in this file to use the Android LocalNotification
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
        //return cordova.exec(null, null,"LocalNotification", "cancelAllNotifications", []);
    },
    
    queue : function(id, options) {
        console.log("************** notification queued for " + options.notificationDate + " ****************");
        window.plugins.LocalNotificationPlugin.add({
                    date : options.notificationDate,
                    message : "First 90 Days\r\nSubtitle goes here",
                    ticker : options.message,
                    repeatDaily : false,
                    id : id
            });
		//return cordova.exec(null, null, "LocalNotification", "queueNotification", [id, options]);
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
