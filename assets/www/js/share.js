var SharePopUp =  new Class ({
	initialize: function () {
		this.showing = false;
	},
	hide: function () {
		if( nav.sharePop.showing == true) {
			$( 'share-backdrop' ).dispose();
			me.showing = false;
		}
	},
	show: function () {
		var ele = new Element ('div',  { id: 'share-backdrop', html: '<div id="share"></div>', });
		ele.inject( $( 'content-container' ) );
		var share = $( 'share' );
        //alert('articleTitle [' + articleTitle + '] article body [' + body + ']');
		//Email this to someone

		//ele = new Element ( 'div', { id: 'mail-icon',	'class': 'quick-share', html: '<a href="mailto:collegue@work.com" id="mail-icon"></a>', });		
		//ele.inject( $( 'share' ) );
		//Twitter
		//ele = new Element ( 'div', { id: 'twitter-icon',	'class': 'quick-share', html: '<div></div>', });		
		//ele.inject( $( 'share' ) );
		//Facebook
		//ele = new Element ( 'div', { id: 'facebook-icon', 'class': 'quick-share', html: '<div></div>', });		
		//ele.inject( $( 'share' ) );
		//Linkedin
		//ele = new Element ( 'div', { id: 'ln-icon',	'class': 'quick-share', html: '<div></div>', });		
		//ele.inject( $( 'share' ) );
		
		//Cal Event
		//ele = new Element ( 'div', { id: '',	'class': 'share-element', html: 'Create calendar event <div id="cal-icon"></div>', });		
		//ele.inject( $( 'share' ) );
        // Favorites
        // this next bit of code gets the current article id from page.init.id which is found in the Article object
        var article = page.init;

       ele = new Element ('a', {
       		id: '',
       		'class': 'e-share-element',
       		html: 'Share by email <a></a>',
       		href: 'mailto:?subject=' + article.title + '&body=' +  encodeURIComponent( article.snippet ) + '  \n \n - From The First 90 Days app for iPhone',
       		events: {
       			click: function () {	
       				nav.sharePop.toggle();
       			}
       		}
       });
       ele.inject( share );
       
        var articleID = page.init.id;
        if (ArticleIsFavorite(articleID)) {
            ele = new Element ( 'div', { id: '','class': 'share-element', html: 'Remove from favorites <div id="fav-icon"></div>', });
            ele.addEventListener( 'touchstart', function() {
                                                  RemoveFromFavorites(articleID);
                                                  nav.sharePop.toggle();} // end anonymous function
                                                  ); // end call to addEventListener
            ele.inject( $( 'share' ) );

        } else {
            ele = new Element ( 'div', { id: '','class': 'share-element', html: 'Add to favorites <div id="fav-icon"></div>', });
            ele.addEventListener( 'touchstart', function() {
            									  navigator.notification.alert( 'Added to favorites', null , 'First 90 Days' );
                                                  AddToFavorites(articleID);
                                                  nav.sharePop.toggle();} // end anonymous function
                                                  ); // end call to addEventListener
            ele.inject( $( 'share' ) );
        }
		ele = new Element ( 'div', { id: '', 'class': 'share-cancel', html: 'Cancel <div id="close-icon"></div>', });
		ele.addEvent( 'touchstart', nav.sharePop.toggle );
		ele.inject( $( 'share' ) );
	
		me.showing = true;
	},
	toggle: function () {
		me = nav.sharePop;
		if( me.showing == true ){
			me.hide();
		} else {
			me.show();
		}
	}
});
