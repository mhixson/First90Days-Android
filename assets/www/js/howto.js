var HowToPage = new Class ({
	initialize: function ( ) {
		this.GetNav();
		this.container = $( 'content-container' );
		this.render();
		nav.back.UpdateCallbackAndShow( page.goToMore );
	},
	render: function () {
        var html = '<div id="article" class="content" style="background-color: #464646;">' +
                                    '<div id="howto-body">This app is designed to help you through the first three months ' +
                                    'of your job transition by actively engaging you with First 90 Days concepts. Use this app when starting a ' +
                                    'new job, being promoted, taking on a new assignment, or making a lateral move in your organization.<br/><br/>Visit ' +
                                    'the Settings page and <div id="linkToMore">select a start date and a preferred notification time.</div>  On your start date the app ' +
                                    'will begin sending daily in-app notifications (1x per day, Mon-Fri) encouraging you to read a short piece of ' +
                                    'content and/or watch a brief video. Feel free to browse/search all app content, save content to your ' +
                                    'Favorites folder, or turn off notifications at any time.  ' +
                                    'We know job transitions can be very busy, stressful times.  With that in mind, we\'ve kept all content ' +
                                    'short and to the point. <br/><br/>' +
                                    'For more in-depth reading, you can purchase The First 90 Days eBook via the link in the More menu of the app. ' +
                                    '<br/><br/>Questions? Comments? Please get in touch via the Feedback link, also included in the More menu.<br/><br/>' +
                                    'Thanks, and good luck in your new role!</div></div>';
		var howToContent = new Element ('div', {
                            id: 'howToContent',
                            html: html
                            });
		howToContent.inject($('content-container'));
        $('linkToMore').setAttribute('onclick', 'page.goToMore()'); // I don't understand why an <a href> in the paragraph above wouldn't work, but this does.
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
		nav.setHead( 'How to Use This App' );
		nav.setCurrentPage( 'howto' );
	},
	cleanup: function () {
		$( 'howToContent').dispose();
	},
	page: function () {
		return 'howto';
	}
});
