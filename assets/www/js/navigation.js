var fButton = new Class({
	initialize: function ( id, classes, parent, eventMethod, eventArgs, innerHtml ) {
		this.parentElement = parent;
		this.idName = id;
		this.classes = classes;
		this.eventMethod = eventMethod;
		this.eventArgs = eventArgs;
		this.inner = innerHtml;
		this.ELEMENT;
		//Call show when item is needed
	},
	//passing this and calling it me feels hacky as fuck.. but javascript man.. javascript. 
	createDiv: function ( me ) {
		var temp  = new Element ( 'div', {
			id: me.idName,
			classes: me.classes,
			events:  {
				touchstart: function () {
					me.eventMethod( me.eventArgs );
				}
			},
			html: me.inner,
		});
		temp.inject( me.parentElement );
		me.ELEMENT = $( me.idName );
	},
	show: function ( ) {
		this.createDiv();
	},
	UpdateCallbackAndShow: function ( method, args ) {
		this.eventMethod = method;
		this.eventArgs = args
		this.hide();
		this.createDiv( this );
	},
	hide: function ( ) {
	 	if( this.ELEMENT != null ){
	 		this.ELEMENT.dispose( );
	 	}
	},
});

//FIX ME LATER -- THIS IS TERRIBLE
var bButton = new Class({
	initialize: function ( id, classes, parent, eventMethod, eventArgs, innerHtml ) {
		this.parentElement = parent;
		this.idName = id;
		this.classes = classes;
		this.eventMethod = eventMethod;
		this.eventArgs = eventArgs;
		this.inner = innerHtml;
		this.ELEMENT;
		//Call show when item is needed
	},
	//passing this and calling it me feels hacky as fuck.. but javascript man.. javascript. 
	createDiv: function ( me ) {
		var temp  = new Element ( 'div', {
			id: me.idName,
			classes: me.classes,
			events:  {
				click: function () {
					me.eventMethod( me.eventArgs );
				}
			},
			html: me.inner,
		});
		temp.inject( me.parentElement );
		me.ELEMENT = $( me.idName );
	},
	show: function ( ) {
		this.createDiv();
	},
	UpdateCallbackAndShow: function ( method, args ) {
		this.eventMethod = method;
		this.eventArgs = args
		this.hide();
		this.createDiv( this );
	},
	hide: function ( ) {
	 	if( this.ELEMENT != null ){
	 		this.ELEMENT.dispose( );
	 	}
	},
});

var Navigation = new Class ({
	initialize: function () {
		this.hidden = true;
		this.head = $( 'top-nav-container' );
		this.foot = $( 'bot-nav-container' );
		var container = new Element( 'div', { id: 'content-container' } ); 
		container.inject( $( 'splash-bg' ) );
		this.back = new bButton ( 'back-arrow', '', this.head, page.goToMyPlan, [] ,'<div></div>' );
		container = $( 'content-container' ); 
		this.prev = new fButton( 'today-prev', '', container , page.goToArticle, 1, '' );
		this.next = new fButton( 'today-next', '', container, page.goToArticle, 1, '' );
		this.share = new fButton ( 'share-button', '', $('top-nav-container'), [], [], '<div></div>' );
		this.sharePop = new SharePopUp();
		this.show();
		this.currentPage = '';
		 //Indicates whether or not the left/right buttons have been temporarily hidden.
		this.prevNextShowing = false;
	},
	hide: function () {
		this.hidden = true;
		this.head.setStyle ( 'display', 'none' );
		this.foot.setStyle ( 'display', 'none' );
	},
	show: function () {
		this.hidden = false;
		this.head.setStyle ( 'display', 'block' );
		this.foot.setStyle ( 'display', 'block' );
		$('nav-my-plan').addEvent( 'click' , page.goToMyPlan );
        $('nav-favorites').addEvent( 'click' , page.goToFavorites );
        $('nav-more').addEvent( 'click', page.goToMore);
        $('nav-button').addEvent( 'click' , page.goToSearch );
	},
	showHead: function () {
		this.hidden = false;
		this.head.setStyle ('display', 'block');
   },
   //Sets (or resets ) the title bar text
   setHead: function ( title ) {
   		if( !title ) {
   			title = '<span id="page-head-emphasis">The First</span> 90 Days';
   		}
   		$('page-head').set( 'html', title );
   },
   //removes the carats from all menu buttons at the bottom of the page. 
   setCurrentPage : function ( page ) {
		var cur = this.getPageID( page );
		if( cur != false ){
			if( this.getCurrentPageID() != false ) {
				$( this.getCurrentPageID( ) ).removeClass( 'current' );	
			}
			$( cur ).addClass( 'current' );
			this.currentPage = page;
		}
   },
   getCurrentPageID: function () {
   		return this.getPageID( this.currentPage );
   },
   getPageID: function ( page ) {
   			switch ( page ) {
   			case 'myPlan':
   				return 'nav-my-plan';
   			break;
   			case 'favorites':
   				return 'nav-favorites';
   			break;
   			case 'search':
   				return 'nav-button';
   			break;
   			case 'more':
   				return 'nav-more';
   			break;
   			default: 
   				//console.log( 'Invalid page passed to current page. value: ' + page );
   				return false;
   			break;
   		}
   	}
});





