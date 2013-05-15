var WeeklyView = new Class ({
	initialize: function ( week ) {
		scroll (0,0);
		this.GetNav();
		this.container = $('content-container');
		this.articles = new Array();
		this.week = week;
		this.weekTitle;// = 'first 90';
        GetArticlesListForWeek( week, 'primary' );
	},
	GetNav: function () {
		if( window.nav == null ){
		 window.nav = new Navigation();
		} else {
			if( window.nav.hidden ) {
				window.nav.show();
			}
		}
		window.nav.back.UpdateCallbackAndShow( page.goToMyPlan, [] );
		nav.setCurrentPage( 'myPlan' );
	},
	//returns the week/day of the current lesson
	CurrentArticle: function () {
		if( window.localStorage.getItem('currentArticle') == null ){
			//get from database
		} else {
			return window.localStorage.getItem( 'currentArticle' );
		}
	},
	populateWeek: function ( tx, results ) {
		var length = results.rows.length;
        this.weekTitle = results.rows.item(0).WEEKTITLE;
        this.week = results.rows.item(0).WEEK;
        page.init.video = results.rows.item(0).VIDEO;
        page.init.videoTitle = results.rows.item(0).VIDEOTITLE;
        console.log('video title is [' + page.init.videoTitle + ']');
        var color = weekColor( this.week );
		var d = new nDate();
        d.setDate( parseInt ( localStorage.getItem('startDate') ) );
		var s = d.getModifiedDateByWeekDay( (this.week - 1 ) , 0 );
		var e = d.getModifiedDateByWeekDay( (this.week - 1 ) , 4 );
		var head = new Element ( 'div', {
			id: 'weekly-header',
			html: '<div id="plan-header-top">'
					+ 		'<h2>' + this.weekTitle + '</h2>'
					+ '</div>'
					+ '<div id="current-week" class="weekly">'
					+		'<div id="week-icon" class="active"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+		'<div id="week-icon"></div>'
					+ 		'<div id="week-icon"></div>'
					+	'</div>'
					+ '<div id="program-period" class="weekly">' + s.getFormatedDate() + ' - ' + e.getFormatedDate() + '</div>'
					+ '</div>',
            styles: {
					'background-color': '#' + color,
				}
			}
		);
        head.inject( page.init.container );
        var date = new nDate();
		date.setDate( parseInt ( localStorage.getItem('startDate') ) );
		var completed = false;
        var foundCurrentArticle = false;
        var now = getNow();
        //var color = 'color: #a0a0a0';
       
        /****************************
        if (we are viewing the current week) {
            if (this week's video is unwatched) {
                display arrow by video;
                underline arrow link;
                do not display arrow by article;
            } else {
                set background of video link to week color;
                display text in white;
                do not display arrow;
                allow arrow to display next to article as is already done;
            }
        }
        *****************************/
        var arrowDisplayedByVideo = false;
        var videoArrowColor = '#fff';
        var backgroundColor = '#fff';
        var textColor = '#a0a0a0';
        var wColor = '#' + weekColor(this.week);
        if (this.week == (GetCurrentWeek() + 1)) {
          
            if (localStorage.getItem('week_' + this.week + '_alreadyViewed') != 1) {
                videoArrowColor = weekColor(this.week);
                console.log('videoArrowColor is [' + videoArrowColor + ']');
                arrowDisplayedByVideo = true;
            } else {
                console.log('user has already watched this video');
                videoArrowColor = wColor;
                backgroundColor = wColor;
                textColor = '#fff';
            }
        } else {
            console.log('this is not the current week');
        }
        console.log('videoArrowColor is: [' + videoArrowColor + ']');
        console.log('backgroundColor is: [' + backgroundColor + ']');
        console.log('textColor is:       [' + textColor + ']');
        console.log('weekColor is:       [' + wColor + ']');
        var videoDiv = new Element('div', {
            id: 'video-list-item',

			'class': 'list-item', /* why was this also marked as current? */
            html:	'<div id="item-content"  class="date">'
				+		'<div id="item-date">'
				+				'<div id="video-intro-text" style="color:' + textColor + ';">Intro</div>'
				+		'</div>'
				+	'</div>'
				+	'<div id="item-content" class="title">'
				+		'<div id="video-title">'
				+			'<div id="video-item-title" style="color:' + textColor + ';">' + page.init.videoTitle + '</div>'
                +           '<div id="video-text" style="font-size:small;color:' + textColor + ';">VIDEO</div>'
				+		'</div>' 
				+	'</div>'
				+	'<div id="item-content" class="arrow">'
				+		'<div id="item-title">'
				+			'<div id="video-item-arrow" style="color:#' + videoArrowColor + ';"></div>' /* style="color:#' + weekColor( this.week ) + ';" */
				+		'</div>'
				+	'</div>',
            styles: {
					'border-color': '#' + videoArrowColor, /* '#'+ weekColor( this.week ) */
					'background-color': backgroundColor
				}
            }
        );
        videoDiv.inject(page.init.container);
        $('video-list-item').setStyle('border-color', wColor);
        if (localStorage.getItem('week_' + this.week + '_alreadyViewed') == 1) {
            $( 'video-item-arrow' ).setStyle('display', 'none');
        }
		for ( var i = 0; i < length; i++ ) {
            var classes = '';
			var item = results.rows.item( i );
			//Date is generated based off start date and week --  should be similiar logic to how we are getting the fridays (except that should be a monday)
			var articleDate = date.getModifiedDateByWeekDay( (item.WEEK - 1 ) , ( item.DAY - 1 ) );
			var article = new WeeklyListItem( item.ID, articleDate, item.TITLE, item.WEEK );

            if ( ( this.week == ( GetCurrentWeek() + 1 ) ) && ( item.DAY == GetCurrentDay() ) ) {
                if (arrowDisplayedByVideo) {
                    console.log('arrow is displayed by the video so we should not show it next to the current article');
                } else {
                    console.log('should be displaying the arrow next to the article');
                    foundCurrentArticle = true;
                    classes = 'current';
                }
            }
            article.HTML(page.init.container, classes, item.COMPLETED);
			page.init.articles.push( article );	 
		}
        var w = this.week;
        $('video-list-item').addEvent( 'click', function () {
		                                                console.log('this.week is [' + w + ']');
		                                                localStorage.setItem('week_' + w + '_alreadyViewed', 1);
                                                        //window.open( page.init.video, '_blank', 'location=yes');  // this doesn't work on android very well
                                                        /***
                                                        todo: make this show and play a video the way that article.js does for secondary video content
                                                        ***/
                                                        console.log("sending the user to the video page for video [" + page.init.video + "]");
                                                        window.page.goToVideo(page.init.video, function() { window.page.goToWeeklyView( w ) });
                                                        //localStorage.setItem('videoToWatch', page.init.video);
		                                                //window.page.goToWeeklyView( w ); // this sends our app to the weekly view while the video url loads in the native browser
		                                             } );                          
        if(  ( GetCurrentWeek() + 1 ) < w ) {
            $('video-list-item' ).setStyle( 'border-color', '#fff' );
        }
	},
	cleanup: function () {
		//Clean up each of the articles in the list
		this.articles.each( function ( item, index ) {
			item.ELEMENT.removeEvent('touchstart');
			item.ELEMENT.dispose();
			window.nav.back.hide();
		});
        $('video-list-item').dispose();
		$( 'weekly-header' ).dispose();
	},
	page: function () {
		return 'weeklyView';
    }
});

var WeeklyListItem = new Class ({
	initialize: function (id, date, title, week ) {
        this.ELEMENT;
        this.fullDate = date; // this is an nDate object
		this.date = date.getFormatedDate(); // this type is just a string like 'Apr 15'
		this.title = title;
		this.id = id;
		this.week = week;
	},
	HTML: function ( container, classes, completed ) {
		var style;
		var color;
        var now = getNow();
 
		if ( completed == 1 && now.getTime() > this.fullDate.date.getTime()) { // fix for issue #1
			style = '#' + weekColor( this.week );
		} else {
			color = 'color: #a0a0a0';
		}
		var today = intDayToString( this.fullDate.date.getDay() );
		
		if ( this.isCurrent( classes ) ) {
			today = 'Today';
			style = '#fff';
			color = 'color: #a0a0a0';
		}
		var article = new Element ( 'div', {
			id: 'list-item',
			'class': 'list-item '  + classes,
			events: {
				click: function (  ) {
					window.page.goToArticle( this.retrieve( 'articleID' ) );
				}
			},
			html:	'<div id="item-content"  class=" date" ">'
				+		'<div id="item-date">'
				+				'<div id="item-date" style=" ' + color + ' ">' + today + '</div>'
				+		'</div>'
				+	'</div>'
				+	'<div id="item-content" class="title">'
				+		'<div id="item-title">'
				+			'<div id="item-title" style=" ' + color + ' ">' + this.title + '</div>'
				+		'</div>' 
				+	'</div>'
				+	'<div id="item-content" class="arrow">'
				+		'<div id="item-title">'
				+			'<div id="item-arrow" style=" color:#' + weekColor( this.week ) + ';" ></div>'
				+		'</div>'
				+	'</div>',
				styles: {
					'border-color': '#'+ weekColor( this.week ),
					'background-color': style,
				},
        } );
        article.store( 'articleID',this.id );
        article.inject( container );
		this.setELEMENT( article );
	},
	setELEMENT: function ( element ) {
		this.ELEMENT = element;
	},
	isCurrent: function ( classes ) {
		classes = classes.toString().split( ' ' );
		for( var i = 0; i < classes.length; i++) {
			if( classes[ i ] == 'current' ) {
				return true;
			}
		}
		return false;
	},
});
