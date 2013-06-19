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
		ele = new Element ( 'div', { id: '', 'class': 'share-element', html: 'Share on Twitter <div id="twitter-icon"></div>', });
        ele.addEventListener( 'touchstart', function() {
                                                    // https://twitter.com/intent/tweet?text=https%3A%2F%2Fwww.google.com%2F&url=https%3A%2F%2Fwww.google.com%2F&related=
                                                  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(article.title + ', #TheFirst90Days, - From The First 90 Days app for iPhone'), '_system');} // end anonymous function
                                                  ); // end call to addEventListener
		ele.inject( share );
		//Facebook
		ele = new Element ( 'div', { id: '', 'class': 'share-element', html: 'Share on Facebook <div id="facebook-icon"></div>'});
        /*
        https://www.facebook.com/dialog/feed?
  app_id=458358780877780&
  link=https://itunes.apple.com/us/app/the-first-90-days/id644647173?mt=8&
  name=First90Days&
  caption=This%is%20the%20caption&
  description=Using%20Dialogs%20to%20interact%20with%20users.&
  redirect_uri=https://itunes.apple.com/us/app/the-first-90-days/id644647173?mt=8
        
        */
        ele.addEventListener( 'touchstart', function() {
                                                // take the article and decode the URI escaped stuff, strip out the HTML, re-encode it to be URI safe, and then truncate that to 950 chars.
                                                var snippet1 = encodeURIComponent(stripHTML(decodeURIComponent(article.snippet))).substring(0, 950);
                                                // mobile safari chokes when the string ends with a partial URI encoded character like "%2" so we're finding the last occurence of % and removing it and everything after it.
                                                var snippet2 = snippet1.substring(0, snippet1.lastIndexOf('%')) + '...';
                                                var description = encodeURIComponent('From The First 90 Days app for iPhone');
                                                // book URL:  https://itunes.apple.com/book/first-90-days-updated-expanded/id554886276
                                                // app URL: https://itunes.apple.com/us/app/the-first-90-days/id644647173
                                                var url = 'https://www.facebook.com/dialog/feed?app_id=540640415999565&link=https://itunes.apple.com/book/first-90-days-updated-expanded/id554886276&name=First90Days&caption=' + snippet2 + '&description=' + description + '&redirect_uri=https://itunes.apple.com/book/first-90-days-updated-expanded/id554886276';
                                                    //console.log('sending the browser to a url that is ' + url.length + ' characters long [' + url + ']');
                                                  window.open(url, '_system');} // end anonymous function
                                                  ); // end call to addEventListener	
		ele.inject( share );
		//Linkedin
		ele = new Element ( 'div', { id: '',	'class': 'share-element', html: 'Share on LinkedIn <div id="linkedin-icon"></div>', });
		ele.inject( $( 'share' ) );
		ele.addEventListener( 'touchstart', function() {
                                                // take the article and decode the URI escaped stuff, strip out the HTML, re-encode it to be URI safe, and then truncate that to 950 chars.
                                                var snippet1 = encodeURIComponent(stripHTML(decodeURIComponent(article.snippet))).substring(0, 950);
                                                // mobile safari chokes when the string ends with a partial URI encoded character like "%2" so we're finding the last occurence of % and removing it and everything after it.
                                                var snippet2 = snippet1.substring(0, snippet1.lastIndexOf('%')) + '...';
                                                var description = encodeURIComponent('From The First 90 Days app for iPhone');
                                                // book URL:  https://itunes.apple.com/book/first-90-days-updated-expanded/id554886276
                                                // app URL: https://itunes.apple.com/us/app/the-first-90-days/id644647173
                                                // http://www.linkedin.com/shareArticle?mini=true&url=http%3A%2F%2Fwww.addthis.com%2Fsocial-plugins%2Flinkedin-button%23.UcD4Bk0ioYw.linkedin&title=LinkedIn+Button+-+Social+Plugins+%7C+AddThis&ro=false&summary=&source=&counter=horizontal
                                                var url = 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent('https://play.google.com/store/books/details/Michael_Watkins_The_First_90_Days_Updated_and_Expa?id=QGkHs4pExOQC') + '&summary=' + snippet2 + '&ro=false&title=' + encodeURIComponent(article.title);
                                                console.log('sending the browser to a url that is ' + url.length + ' characters long [' + url + ']');
                                                window.open(url, '_system');} // end anonymous function
                                            ); // end call to addEventListener	
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

function stripHTML(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}
