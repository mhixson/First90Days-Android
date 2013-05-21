/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
  

var touch = 'touchstart';
var fromNotification = false;
var appOpen = false;

document.addEventListener("pause", function () { appOpen = false;  }, false);
document.addEventListener("resume",function () { appOpen = true;  } , false);

var IndexController = new Class ( {
	initialize: function () {
		appOpen = true;
		this.init; // this.init gets set to an object corresponding to the page that is currently being displayed such as My Plan or Favorites
	},
	begin: function () {
		//alert( 'start inspector' );
		if ( !page.setup() ) {
			page.goToSetup();
		} else {
			page.killSplash();
			page.goToMyPlan();
		}
	},
	goToSetup: function () {
        //console.log('inside goToSetup');
        if ( page.init != null ) {
            page.init.cleanup();
        }
		page.init = new SetupInit();
	},
 	goToMyPlan: function (){
		if( page.init == null || page.init.page() != 'myplan') {
			if ( page.init != null ) {
				page.init.cleanup();
			}
			page.init = new MyPlan();
		}
		SetNotificationsForWeek();
	},
    goToFavorites: function (){
        if( page.init == null || page.init.page() != 'favorites') {
            if ( page.init != null ) {
                page.init.cleanup();
            }
            page.init = new Favorites();
        }
        SetNotificationsForWeek();
    },
     goToSearch: function ( searchSpot ){
        if( page.init == null || page.init.page() != 'search') {
            if ( page.init != null ) {
                page.init.cleanup();
            }
            page.init = new Search( );
        }
        SetNotificationsForWeek();
    },
	goToWeeklyView: function ( week ){
			if ( page.init != null ) {
				page.init.cleanup();
			}
			page.init = new WeeklyView( week );
	},
	goToArticle: function ( id, backButtonCallback ) {
        if( page.init != null && fromNotification == false) {
            page.init.cleanup();
        }
        
        if( fromNotification ){      
        		fromNotification = false;
        		nav.show();
        }
		localStorage.setItem( 'articleID', id );
		page.init = new ArticlePage( id, backButtonCallback );
        GetSecondaryArticles(page.init.setSecondaryArticles);
		GetFullArticle(page.init.populateArticle);
		SetNotificationsForWeek();
	},
	goToArticleViaWeekDay: function ( weekDay ) {		
		if( page.init != null ) { page.init.cleanup(); }
		GetArticleIdByWeekDay( page.goToArticleCallback, weekDay );
	},
	goToArticleCB: function (tx, results ) {
		page.goToArticle(  results.rows.item( 0 ).ID );
	},
    goToMore: function() {
        if( page.init != null ) {
            page.init.cleanup();
        }
        page.init = new MorePage();
        page.init.render();
    },
    goToHowTo: function() {
        if( page.init != null ) {
            page.init.cleanup();
        }
        page.init = new HowToPage();
    },
    goToVideo: function(url, backDestination) {
        if( page.init != null ) {
            page.init.cleanup();
        }
        page.init = new VideoPage(url, backDestination);
        page.init.render();
    },
	setup: function () {
        if( localStorage.getItem('startDate') == null ){
            return false;
        } else {
            return true;
        }
	},
	killSplash: function () {
        if ($('splash')) {
            console.log('disposing splash');
            $( 'splash' ).dispose();
        }
        if ($('author')) {
            console.log('disposing author');
            $( 'author' ).dispose();
        }
        if ($('splash-foot')) {
            console.log('disposing splash-foot');
            $( 'splash-foot' ).dispose();
        }
        if ($('splash-bg')) {
            console.log('disposing splash-bg');
            $( 'splash-bg' ).setStyle('background-color', '#fff');
        }
	}
});

var DomObject = new Class ({
	initialize: function () {
		this.ID;
		this.CLASS;
		this.ELEMENT;
	},
	setID: function (id) {
		this.ID = id;
		this.ELEMENT = document.id(this.ID);
	},	
});

var SetupInit = new Class ({
	Extends: DomObject,
	initialize: function () {
		//Clear all previous notifications to prevent issues.
		console.log('**** killing all notifications from SetupInit ****');
		KillNotifications();
		this.setID ("intro-box");
		this.start = new DomObject ();
		this.start.setID ('intro-pick');
        this.browse = new DomObject();
		//this.browse.setID ('intro-browse');
		nav = new Navigation();
		nav.hide();
        if( localStorage.getItem( 'sendMeBackToTheMorePage' ) != null ) {
            //console.log('beginSetup is [' + page.init.beginSetup + ']'); //**** at this point page.init has not yet been initialized to this SetupInit class and therefore there is no such function available to call
            //console.log('we have already been setup');
            this.beginSetup();
        } else {
            this.slideIn();
        }
	},
	slideIn: function () {
		$('intro-pick').addEvent(touch, function () { page.init.beginSetup(); });
		//$('intro-browse').addEvent(touch, function () { page.init.browseApp(); });
		this.slideInFX = new Fx.Tween (this.ELEMENT , {
		    duration: '500',
		    transition: Fx.Transitions.Pow.easeOut,
		    property: 'width'
		});
		this.slideInFX.start(0, 258);
	},
	browseApp: function () {
		SaveSetupData( getNow(), 1 );
		page.init.slideOut();
		page.begin();
	},
	slideOut: function () {
		$('intro-pick').removeEvents();
		//$('intro-browse').removeEvents();
		this.slideInFX = new Fx.Tween (this.ELEMENT , {
		    duration: '500',
		    transition: Fx.Transitions.Pow.easeOut,
		    property: 'width'
		});
		this.slideInFX.start(258, 0);
	},
	page: function () {
		return null;
	},
	beginSetup: function () {
		this.slideOut();
		if( this.setup == null ){
            //console.log('creating a new Setup() in SetupInit.beginSetup');
			this.setup = new Setup();
		} else {
			this.setup.show();
		}
	},
	cleanup: function () {
		this.start.ELEMENT.removeEvent( touch );
		//this.setup.cleanup();
		//$( 'setup-container' ).dispose(); /*** NOTE: do not dispose() something from the HTML if you want to be able to display it again in the future. */
		
	}
});

//Second setup window with pickers
var Setup = new Class ({
	Extends: DomObject,
	initialize: function () {
        //console.log('inside initialize');
		this.setID("setup-container");
        //console.log('about to show()');
		this.show();
		nav.show();
        //console.log('done with show()');
		//done and cancel buttons
		this.done = new DomObject();
		this.done.setID('done');
		this.cancel = new DomObject();
		this.cancel.setID('cancel');
        //console.log('about to create a DatePicker()');
		this.datePicker = new DatePicker();
        //console.log('done creating DatePicker()');
		this.timePicker = new TimePicker();
        //console.log('done creating TimePicker()');
		this.notify = new NotificationsToggle();
        //console.log('done creating NotificationsToggle()');
        //console.log('adding a callback for the done button');
	},
    addEvents : function () {
    	$('done').addEvent('click', function () {
			 page.init.setup.doneCB(); // Done clicked
		});
        $('cancel').addEvent('click', function () {
            page.init.setup.hide();
            // this feels so horrible...
            if ( localStorage.getItem('sendMeBackToTheMorePage') == 'true' ) {
                page.goToMore();
            } else {
                ready(); // got tired of trying to figure out this flow so we're just restarting from the very beginning.
            } } );
		
		//Date Picker 
		$('next-date-arrow').addEvent(touch, function () { page.init.setup.datePicker.adjustDate(1); });
		$('prev-date-arrow').addEvent(touch, function () { page.init.setup.datePicker.adjustDate(-1); });
		
		//Time Picker
		$( 'plus-hour' ).addEvent( touch, function() { page.init.setup.timePicker.adjustTime(60); });
		$('minus-hour').addEvent( touch, function() { page.init.setup.timePicker.adjustTime(-60); });
		$('plus-min').addEvent( touch, function() { page.init.setup.timePicker.adjustTime( 15 ); });
		$('minus-min').addEvent( touch, function() { page.init.setup.timePicker.adjustTime( -15 ); });
		$('am').addEvent( touch, function() { page.init.setup.timePicker.setPeriod( 0 ); });
		$('pm').addEvent( touch, function() { page.init.setup.timePicker.setPeriod( 1 ); });
		$('not-rad').addEvent( touch, function() { page.init.setup.notify.toggle( ); });
    },
    removeEvents : function () {
    	$('done').removeEvents();
    	$('cancel').removeEvents();
    	
    	//Date Picker 
    	$('next-date-arrow').removeEvents();
		$('prev-date-arrow').removeEvents();
		
		//Time Picker
		$('plus-hour').removeEvents();
		$('minus-hour').removeEvents();
		$('plus-min').removeEvents();
		$('minus-min').removeEvents();
		$('am').removeEvents();
		$('pm').removeEvents();
    },
	//Moves the window into the visible area
	show: function () {
		this.slideInFX = new Fx.Tween (this.ELEMENT , {
		    duration: '500',
		    transition: Fx.Transitions.Pow.easeOut,
		    property: 'margin-left'
		});
		this.slideInFX.start( -document.width, 0 );
		this.addEvents();
	},
	//removes the window from the visible area
	hide: function () {
		this.removeEvents();
		this.slideInFX = new Fx.Tween (this.ELEMENT , {
		    duration: '500',
		    transition: Fx.Transitions.Pow.easeOut,
		    property: 'margin-left'
		});
		this.slideInFX.start( 0, -document.width );
	},
	//Shakes the screen in a no gesture
	nope: function () {
		this.slideInFX = new Fx.Tween (this.ELEMENT , {
		    duration: '500',
		    transition: Fx.Transitions.Elastic.easeOut,
		    property: 'margin-left'
		});
		this.slideInFX.start( 10, 0 );
	},
	//Called when the done button is pressed
	doneCB: function () {
		localStorage.removeItem( 'notificationsWeek' );
		startDate =  page.init.setup.datePicker.getPicked();
        startTime = page.init.setup.timePicker.getPicked();
//        console.log('startTime is ' + startTime);
        startTime = startTime.split( ':' );
        //bool indicating whether or not to set up micro transactions. <- what does this mean?
        getNotifications = page.init.setup.notify.getPicked();
//        console.log('startDate before setting hours is  [' + startDate + ']');
        startDate.setHours( startTime[0] );
//        console.log('startDate after setting hours is   [' + startDate + ']');
        startDate.setMinutes( startTime[1] );
//        console.log('startDate after setting minutes is [' + startDate + ']');
        startDate.setSeconds(0);
//        console.log('startDate after setting seconds is [' + startDate + ']');
        page.init.setup.hide();
        page.init.cleanup();
        if (page.killSplash != undefined) {
            page.killSplash();
        }
        if (localStorage.getItem('sendMeBackToTheMorePage') == 'true') {
            page.goToMore();
        } else {
            page.init = new MyPlan();
        }
        //It will be necessary to use parseInt when pulling the date back out for usage
//        console.log('saving a startDate of ' + startDate);
        window.SaveSetupData(startDate.getTime(), getNotifications);
	},
	cleanup: function () {
		this.done.ELEMENT.removeEvents(touch);
		this.cancel.ELEMENT.removeEvents(touch);
		this.datePicker.cleanup();
		this.timePicker.cleanup();
		this.notify.cleanup();
	}
});

//Date picker for the setup page
var DatePicker = new Class ({
	Extends: DomObject,
	initialize: function () {
		this.pickedDate;
		this.dateMinus = new DomObject();
		this.dateMinus.setID('prev-date-arrow');
		this.datePlus = new DomObject ();
		this.datePlus.setID('next-date-arrow');
		this.lastWeek = new DomObject();
		this.lastWeek.setID('last-week');
		this.thisWeek = new DomObject();
		this.thisWeek.setID('this-week');
		this.nextWeek = new DomObject();
		this.nextWeek.setID('next-week');
		this.weekMod = 0;
		this.date = new nDate();
        var d = parseInt( localStorage.getItem('startDate') );
//        console.log('DatePicker has been initialized to ' + new Date(d));
        if ( d ) {
            this.date.setDate(d);
        }
		this.adjustDate(0);
	},
	addEvents: function () {
		//moved to paren due to javascript closure quirks
	},
	removeEvents: function () {
		//Moved to parent due to javascript closure Quirks
	},
	//Updates the dates displayed in the 
	adjustDate: function ( weekMod ) {
        //console.log('weekMod is [' + weekMod + ']');
		this.weekMod += weekMod;
		this.lastWeek.ELEMENT.set( 'text', this.formatMonday( this.date.monday( this.weekMod - 1 ) ) );
		this.thisWeek.ELEMENT.set( 'text', this.formatMonday( this.date.monday( this.weekMod ) ) );
		this.nextWeek.ELEMENT.set( 'text', this.formatMonday( this.date.monday( this.weekMod + 1 ) ) );
		this.pickedDate = this.date.monday( this.weekMod );
//        console.log('Date has been adjusted to [' + this.pickedDate + ']');
	},
	//Format the date for placement into the picker
	formatMonday: function ( date ) {
		info = date.toString();
		info = info.split(' ');
		return  info[1] + ' ' + info[2] ;
	},
	getPicked: function () {
		return this.pickedDate;
	},
	cleanup: function () {
		this.dateMinus.ELEMENT.removeEvents( touch );
		this.datePlus.ELEMENT.removeEvents( touch );
	}
});

//Time picker on the setup page
var TimePicker = new Class ({
	Extends:DomObject,
	initialize: function () {
		this.name = 'time picker';
		this.pickedTime = 720;
		this.pickedPeriod = 1; // 0 = am, 1 = pm
		//time buttons
		this.hourPlus = new DomObject ();
		this.hourPlus.setID('plus-hour');
		this.hourMinus = new DomObject ();
		this.hourMinus.setID('minus-hour');
		this.minPlus = new DomObject ();
		this.minPlus.setID('plus-min');
		this.minMinus = new DomObject ();
		this.minMinus.setID('minus-min');
		//time slots
		this.hour = new DomObject();
		this.hour.setID('hour');
		this.min = new DomObject();
		this.min.setID('min');
		//am pm
		this.am = new DomObject();
		this.am.setID('am');
		this.pm = new DomObject();
		this.pm.setID('pm');
        var date;
        var dateIntFromLocalStorage = localStorage.getItem('startDate');
        var minutes;
        if ( dateIntFromLocalStorage ) {
            date = new Date(parseInt(dateIntFromLocalStorage));
            console.log('hours from the date in localStorage [' + date.getHours() + ']');
            minutes = (date.getHours() * 60) + date.getMinutes();
            if (date.getHours() > 11) {
                this.pickedPeriod = 1;
            } else {
                this.pickedPeriod = 0;
            }
        } else {
            console.log('creating new Date()');
            minutes = 0;
            this.pickedPeriod = 1;
        }
        this.pickedTime = minutes;
        //this.hour.ELEMENT.set('text', this.prependZero(date.getHours()));
//            console.log('minutes [' + minutes + ']');
        //this.min.ELEMENT.set('text', this.prependZero(date.getMinutes()));
        console.log('TimePicker has been initialized to ' + date);
		this.adjustTime( 0 );
	},
	//Takes in a time in minutes and adjusts this.pickedTime
	adjustTime: function ( minutes ) {
		this.pickedTime = this.cycle( this.pickedTime += minutes );
		this.min.ELEMENT.set( 'text', this.prependZero( this.pickedTime % 60) );
		this.hour.ELEMENT.set( 'text', this.zeroIsTwelve( Math.floor( this.pickedTime/60 ) ) );
	},
	//Places a zero on numbers lower than 10 so 5 becomes 05
	prependZero: function (time) {
		if( time < 10 ){
			return '0' + time;
		}
		return time;
	},
	zeroIsTwelve: function ( hour ) {
		if( hour == 0 ) {
			return 12;
		}
		return hour;
	},
	//Ensures that the given minutes do not exced 720 ( 12 hour clock ) or o lower than 0
	cycle: function (time) {
		if( time < 0 ) {
			return 720;
		}
		if( time > 720 ){
			return time - 720;
		}
		return time;
	},
	setPeriod: function ( period ) {
		var me = page.init.setup.timePicker;
		me.pickedPeriod = period;
		if( this.pickedPeriod == 0) {
			this.am.ELEMENT.addClass('selected');
			this.pm.ELEMENT.removeClass('selected');	
		} else {
			this.am.ELEMENT.removeClass('selected');
			this.pm.ELEMENT.addClass('selected');
		}
	},
	getPicked: function () {
		var me = page.init.setup.timePicker;
		if( me.pickedPeriod == 1) {
    		return this.prependZero( Math.floor( ( this.pickedTime + 720 ) / 60 ) ) + ':' + this.prependZero( this.pickedTime % 60);
   		 } else {
    		return this.prependZero( ( Math.floor( this.pickedTime ) / 60 ) ) + ':' + this.prependZero( this.pickedTime % 60);
    	}
	},
	cleanup: function () {
		this.hourPlus.ELEMENT.removeEvent( touch );
		this.hourMinus.ELEMENT.removeEvent( touch );
		this.minPlus.ELEMENT.removeEvent( touch );
		this.minMinus.ELEMENT.removeEvent( touch );
		this.am.ELEMENT.removeEvent( touch );
		this.pm.ELEMENT.removeEvent( touch);
	}
});

var NotificationsToggle = new Class ({
	Extends: DomObject,
	initialize: function () {
		this.value = false;
		this.setID( 'not-rad' );
	},
	toggle: function () {
		this.value = !this.value;
		if( this.value ){
			this.ELEMENT.addClass('selected');
		} else {
			this.ELEMENT.removeClass('selected');
		}
	},
	getPicked: function () {
		if( this.value ){
			return 1;
		} else {
			return 0;
		}
	},
	cleanup: function() {
		this.ELEMENT.removeEvent( touch );
	}
});

var nDate = new Class ({
	Extends: Date,
	initialize: function () {
		this.date = new Date; // hmm, should this call the global getNow()?
		this.millisecondWeek = 604800000; //use global msWeek
		this.millisecondDay = 86400000; //use global msDay
	},
	//Returns date of monday for a given week relative to the current week
	monday: function ( week ) {
		return new Date( this.date.getTime() + ( this.millisecondWeek * week) + this.daysToMon() );
	},
	//returns the number of days til friday  <- stale comment
	daysToMon: function () {
		switch( this.date.getDay() ) {
			//Monday
			case 1:
				return 0;
				break;
			//Tuesday
			case 2:
				return 6 * this.millisecondDay;
				break;
			//Wednesday
			case 3:
				return 5 * this.millisecondDay;
				break;
			//Thursday
			case 4:
				return 4 * this.millisecondDay;
				break;
			//Friday
			case 5:
				return 3 * this.millisecondDay;
				break;
			//Saturday
			case 6:
				return 2 * this.millisecondDay;
				break;
			//Sunday
			case 0:
				return 1 * this.millisecondDay;
				break;
		}
	},
	setDate: function ( dateString ) {
		this.date = new Date ( dateString );
	},
	getModifiedDateByWeekDay: function  (week, day) {
		var d =  new nDate ();
		d.setDate ( this.date.getTime() + ( this.millisecondWeek * week) + ( this.millisecondDay * day ) );
		return d;
	},
	getFormatedDate: function ( ) {
		var info = this.date.toString();
		info = info.split(' ');
		return  info[1] + ' ' + info[2] ;
	},
    getDate: function() {
        return(this.date);
    }
});


/****************************************************************
 **************************** MyPlan **************************
 ****************************************************************/
   
document.addEventListener('deviceready', ready, false);

function ready ( ) {
	console.log("we've received the deviceready event");
  	window.page = new IndexController ();
  	page.begin();
}