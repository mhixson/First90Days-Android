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
                                    '<a href="https://play.google.com/store/books/details/Michael_Watkins_The_First_90_Days_Updated_and_Expa?id=QGkHs4pExOQC">Buy the Book</a><br/><br/><br/>';
		var buyTheBookContent = new Element ('div', {
                            id: 'buyTheBookContent',
                            html: html
                            });
		buyTheBookContent.inject($('content-container'));
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