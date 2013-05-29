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
    
    queue : function(id, options) {
        console.log("************** notification with id [" + id + " queued for [" + options.notificationDate + "] ****************");
        window.plugins.LocalNotificationPlugin.add({
                    date : options.notificationDate,
                    message : "First 90 Days\r\nView Today's Content",
                    ticker : options.message,
                    repeatDaily : false,
                    id : id
            });
	}

}

function receivedLocalNotification ( event )  {
	if ( !appOpen ) {
		fromNotification = true;
  		page.goToArticleViaWeekDay( "" + ( GetCurrentWeek() + 1 ) + "::" + ( GetCurrentDay() ) + "" );
  	}
 }

function RegisterSingleNotification ( notificationDate ) {
        //console.log('inside RegisterSingleNotification');
        //var today = getNow();
        //Prevents notifications being added in the past - This should prevent multiple notifications from popping all at once.
        //if( today  <= notificationDate) {
        //	console.log( 'notification is in the future [' + today + ' < ' + notificationDate + ']' );
        	localNotification.queue( notificationDate.getTime(), {
                                        notificationDate: notificationDate,
                                        message: ' View Today\'s Content ',
                                        badge: 0
            });
        //} else {
        //    console.log( 'not registering notification because it is in the past [' + today + ' > ' + notificationDate + ']' );
        //}
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
