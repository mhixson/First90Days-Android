var BuyTheBookPage = new Class ({
	initialize: function ( ) {
		this.GetNav();
		this.container = $( 'content-container' );
		this.render();
		nav.back.UpdateCallbackAndShow( page.goToMore );
	},
	render: function () {
        var html = '<div id="article" class="content">' +
                                    '<div id="buythebook-body">Purchase the 10th anniversary eBook edition of <i>The First 90 Days</i> via the links below.<br/><br/><br/>' + 
                                    '<a href="http://hbr.org/product/the-first-90-days-updated-and-expanded-proven-strategies-for-getting-up-to-speed-faster-and-smarter/an/11323E-KND-ENG">HBR.org</a><br/><br/><br/>' +
                                    '<a href="http://www.amazon.com/First-Days-Updated-Expanded-ebook/dp/B00B6U63ZE/">Kindle</a><br/><br/><br/>' +
                                    '<a href="http://www.barnesandnoble.com/w/the-first-90-days-updated-and-expanded-michael-watkins/1113628619">Nook</a></div>';
		var buyTheBookContent = new Element ('div', {
                            id: 'buyTheBookContent',
                            html: html
                            });
		buyTheBookContent.inject($('content-container'));
		$('content-container').setAttribute('onclick', 'function() { /* do nothing to prevent Android 4.1.2 bug */ }');
        //$('linkToMore').setAttribute('onclick', 'page.goToMore()'); // I don't understand why an <a href> in the paragraph above wouldn't work, but this does.
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
		nav.setHead( 'Buy the Book' );
		nav.setCurrentPage( 'buyTheBook' );
	},
	cleanup: function () {
		$( 'buyTheBookContent').dispose();
	},
	page: function () {
		return 'buyTheBook';
	}
});