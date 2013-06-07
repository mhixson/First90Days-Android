var MyPlan = new Class ({
	initialize: function () {
		scroll (0,0);
		this.GetNav();
		this.container = $( 'content-container' );
		this.articles = new Array();
		this.currentWeek;
		this.firstUncompletedWeek = 0;
		this.currentWeek;
		GetWeeksList( );
	},
	GetNav: function () {
		if( window.nav == null ){
		 window.nav = new Navigation();
		} else {
			if( window.nav.hidden ) {
				window.nav.show();
			}
		}
		//Resets the title bar to it's default text
		nav.setHead( );
		nav.setCurrentPage( 'myPlan' );
	},
	populateWeek: function ( tx, results ) {
		var length = results.rows.length;
		var listItem;
		var item;
		var date = new nDate();
		date.setDate( parseInt ( localStorage.getItem('startDate') ) );
		var curDate;
		var completed = false;
		var weekCompleted;
		var skip;
		var currentWeek = GetCurrentWeek()  + 1;
		page.init.PlaceHeader( date, results.rows.length - 1 );
        //alert('There are ' + length + ' items in the results');
        for (var i = 0; i < length; i++) {
			item = results.rows.item( i );
            //Date is generated based off start date and week --  should be similiar logic to how we are getting the fridays (except that should be a monday)
			curDate = date.getModifiedDateByWeekDay( (item.ID - 1 ) , 0 );
			listItem = new MyPlanListItem( item.ID, curDate.getFormatedDate() , item.WEEKTITLE, item.ID );
			//A weeks ID is === to it's week number, meaning there is no week 0'
			if( currentWeek > item.ID ) {
				listItem.HTML( page.init.container, 'past', 1, 'Week ' + ( i + 1) );
			} else if( currentWeek == item.ID  ) {
				listItem.HTML ( page.init.container , 'current', 0, 'Today' );
				SaveCurrentWeek( i );
			} else {
				listItem.HTML ( page.init.container , '', 0, 'Week ' + ( i + 1 ) );
			}
			page.init.articles.push( listItem );			
		} // end for
	},
	cleanup: function () {
		//Clean up each of the articles in the list
		this.articles.each( function ( item, index ) {
			item.ELEMENT.removeEvent('touchstart');
			item.ELEMENT.dispose();
		});
		if ($('plan-header')) { // put this here because 'plan-header' doesn't seem to exist when we're trying to open an article directly from a notification
			$( 'plan-header' ).dispose();
		}
		window.nav.hide();
	},
	page: function () {
		return 'myplan';
	},
	//MAKE THIS ITS OWN CLASS
	PlaceHeader: function ( date, lastWeek ) {
		
		var first = date.getModifiedDateByWeekDay( ( 0 ) , 0 );
		var last = date.getModifiedDateByWeekDay( ( lastWeek ) , 5 );
		
		var head = new Element ( 'div', {
			id: 'plan-header',
			html: '<div id="plan-header-top">'
					+ '<h1>My Plan</h1>'
					+	 '<div id="current-week">'
					+		'<div id="week-icon" class="active"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+	'</div>'
					+ '</div>'
					+ '<div id="program-period">' + first.getFormatedDate() + ' - ' + last.getFormatedDate()  + '</div>'
					+ '</div>',
				}
		);
		head.inject( this.container );
		$('plan-header-top').setAttribute('onclick', 'function() { }');
	}
});

// Article Blocks found on the MyPlan Page
var MyPlanListItem = new Class ({
	initialize: function (id, date, title, week ) {
		this.ELEMENT;
		this.date = date;
		this.title = title;
		this.id = id;
		this.week = week;
	},
	HTML: function ( container, classes, completed, date ) {
		var style;
		var color;
		
		if ( date == null ){
			date = this.date;
		}
		
		if ( completed != 1 ) {
			color = 'color: #a0a0a0';
		}
		
		var article = new Element ( 'div', {
			id: 'list-item',
			'class': 'list-item '  + classes,
			events: {
				click: function (  ) {
					window.page.goToWeeklyView( this.retrieve( 'week' ) );
				}
			},
			html:	'<div id="item-content"  class=" date" >'
				+		'<div id="item-date">'
				+				'<div id="item-date" style="' + color +  '">' + date + '</div>'
				+		'</div>'
				+	'</div>'
				+	'<div id="item-content" class="title">'
				+		'<div id="item-title">'
				+			'<div id="item-title" style="' + color +  '">' + this.title + '</div>'
				+		'</div>' 
				+	'</div>'
				+	'<div id="item-content" class="arrow">'
				+		'<div id="item-title">'
				+			'<div id="item-arrow" style=" color:#' + weekColor( 0 ) + '; " ></div>'
				+		'</div>'
				+	'</div>'
				} );
			article.store( 'week', this.week );
			article.inject( container );
		
		this.setELEMENT( article );
	},
	setELEMENT: function ( element ) {
		this.ELEMENT = element;
	}
});

