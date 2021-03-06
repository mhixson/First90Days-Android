var VideoPage = new Class({
	initialize: function ( videoURL, callback ) {
		console.log( 'inside VideoPage' );
		//navigation activate back button with link to the week they came from
		//initialize content pull
		//We need this to allow jumping from this article to the prev or next
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
        console.log('our video is [' + videoURL + ']');
        localStorage.setItem('videoToWatch', videoURL);
        window.screenOrientation.set("sensor");
	},
	render: function () {
		/* This is a horrible hack that removes the setup page from view when the app is viewed in portrait mode on this video page. 
		   We restore the visibility of setup-container in the cleanup() function below.  */
		$('setup-container').style.display = 'none';
		console.log("inside render()");
		var me = page.init;
        var content = '<video width="320" height="240" controls autoplay="autoplay">'
                      + '<source src="' + localStorage.getItem('videoToWatch') + '" type="video/mp4">'
                      + '</video>';      
        
        var html = '<div id="article-body">' + content + '</div>';
        var article = new Element ( 'div',
            {
                id: 'article-container',
                html: html
            });
        console.log("html is [" + html + "]");
        article.inject( $( 'content-container' ) );
        nav.share.UpdateCallbackAndShow( function () { nav.sharePop.toggle(); }, [] );
        nav.back.UpdateCallbackAndShow( me.backButtonCallback, me.week );
	},
	page: function () {
		return 'video';
	},
	cleanup: function () {
		if( $('article-container') != null ){
			$('article-container').dispose();
		}
		nav.prev.hide();
		nav.next.hide();
		nav.share.hide();
		nav.sharePop.hide();
		nav.back.hide();
		window.screenOrientation.set("portrait");
		$('setup-container').style.display = 'inline';
	}
});

