var SecondaryArticle = new Class({
	initialize: function ( id, title, type ) {
		scroll (0,0);
        this.id = id;
        this.title = title;
        this.type = type;
//        alert('new SecondaryArticle has been created with id ' + id + ' and title [' + title + ']');
    }
});

var ArticlePage = new Class({
	initialize: function ( id, callback ) {
		console.log( 'test' );
		//navigation activate back button with link to myplan
		//initialize content pull
		//We need this to allow jumping from this article to the prev or next
		this.id;
		this.week;
		this.day;
        this.results;
        this.backButtonCallback = page.goToWeeklyView;
        this.secondaryArticles = new Array(0);
        this.title;
        this.snippet;
        if (callback) {
            this.backButtonCallback = callback;
        }
	},
    setSecondaryArticles: function(results) {
        //alert('results are ' + results.rows.length + ' items long');
        this.secondaryArticles = new Array(results.rows.length);
        for (var i = 0;i < results.rows.length;i++) {
            var id = results.rows.item(i).ID;
            var title = results.rows.item(i).TITLE;
            console.log( results.rows.item(i) );
            var type = results.rows.item(i).CONTENT.substring( 0, 7 );
            var sa = new SecondaryArticle( id, title, type );
            this.secondaryArticles[i] = sa;  // ARGH! Why doesn't array.push() work for this object?
        }
    },
	//Callback
	populateArticle: function ( results ) {
		var data = results.rows.item( 0 );
		var me = page.init;
		me.id = data.ID;  /* NOTICE: This is kinda hacky, but the Add to favorites link on the share popup in share.js uses the article id from here, so don't remove this 'id' variable on this line. ***/
		me.week = data.WEEK;
		me.day = data.DAY;
		MarkArticleRead( me.day, me.week );
		var date = new nDate();
		date.setDate( parseInt ( localStorage.getItem('startDate') ) );
		date = date.getModifiedDateByWeekDay( ( me.week - 1 ) , me.day -1 );
		var color = weekColor( me.week );
		var content = unescape(data.CONTENT);
		var me = page.init;
		//Used for sharing
		me.title = data.TITLE;
		me.snippet = content;
		
        // look for the special format for video content
        if (content.substring(0, 7) === 'video::') {
            content = '<video width="320" height="240" controls autoplay="autoplay">'
                      + '<source src="' + content.substring(7) + '" type="video/mp4">'
                      + '</video>';      
        }
        console.log( this.secondaryArticles );
        var html = ' <div id="today-date-head">'
                        +		'<div id="today-date" class="arrow" style="color: #' + color + '">  &#9654; </div>' 
                        +		'<div id="today-date" class="date">' + intDayToString( me.day ) + ' ' + date.getFormatedDate() + '</div>'
                        +	'</div>'
                        +	'<h2 id="today-subject" style=" color: #' + color + '; " >' + data.WEEKTITLE + '</h2>'
                        +	'<div id="today-week">'
                        +	page.init.weeksProgress( data.DAY )
                        +	'</div>'
                        +	'<div id="article">'
                        +		'<h1 id="article-head">' + unescape(data.TITLE) + '</h1>'
                        +		'<div id="article-body">'	+ content + '</div>'
                        +   '</div>';
        var article = new Element ( 'div',
            {
                id: 'article-container',
                html: html
            });
            article.inject( $( 'content-container' ) );
        if (data.TYPE == 'primary') {
            for (var i = 0;i < this.secondaryArticles.length;i++) {   
                    var articleId = this.secondaryArticles[i].id;
                  	var icon = 'quote';
       				 if( this.secondaryArticles[i].type == 'video::' ){
        				icon = 'video';
        				console.log( 'VIDEO!' );
        			 }
                  
                    var secondaryContent = new Element ('div',
                        {
                            id: 'secondary-article-container',
                            events: {
                                click: function (  ) {
                                    window.page.goToArticle( articleId, function() { window.page.goToArticle(me.id); } );
                                }
                            },
                            html: '<div id="article-more">'									
                                        +				'<h4>more</h4>'
                                        +				'<div id="more-link">'
                                        +					'<div id="more-arrow"></div>'
                                        +					'<div id="more-icon" class="' + icon + '"></div>'
                                        +					'<div id="more-title">' + unescape(this.secondaryArticles[i].title) + '</div>'
                                        +				'</div></div>'
                        });
                    secondaryContent.inject($('content-container'));
            }
        }
        nav.share.UpdateCallbackAndShow( function () { nav.sharePop.toggle(); }, [] );
        nav.back.UpdateCallbackAndShow( me.backButtonCallback, me.week );
	},
	//Generates the weekly progress rings
	weeksProgress: function ( day ) {
		var progress = '';
		for( var i = 1; i <= 5; i++ ){
			if( i == day ) {
				progress += '<div id="week-icon" class="active today"></div>'
			} else {
				progress += '<div id="week-icon" class="today"></div>'
			}
		}
		return progress;
	},
	setDayWeek: function ( day, week ) {
		this.day = day;
		this.week = week;
	},
	page: function () {
		return 'article';
	},
	cleanup: function () {
		if( $('article-container') != null ){
			$('article-container').dispose();
		}
        if( $('secondary-article-container') != null) {
            $('secondary-article-container').dispose();
        }
		nav.prev.hide();
		nav.next.hide();
		nav.share.hide();
		nav.sharePop.hide();
		nav.back.hide();
	}
});

