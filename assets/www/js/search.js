var Search = new Class ({
	initialize: function ( ) {
		scroll (0,0);
		this.GetNav();
		this.container = $( 'content-container' );
		this.render();
	},
	render: function () {
		var searchBox = new Element ( 'input', {
				id: 'search-box',
				type: 'text',
				content: 'search',
				placeholder: 'Search The First 90 Days',
			});
		var searchClear = new Element ( 'div', {
			id: 'clear-search-box',
			events: {
				touchstart: function () {
					$('search-box').set('value', '');
				}
			},
		});
		var searchInit = new Element ( 'div', {
				id: 'search-init',
				events:  {
					touchstart: function () {
						$('search-box').blur();
                        console.log('searching...');
						SearchQuery( $('search-box').get('value') );
					}
				},
		});
		var searchContainer = new Element ( 'div', {
			id:'search-container'
		});
		searchBox.inject( this.container );
		searchClear.inject( this.container );
		searchInit.inject( this.container );
		searchContainer.inject(this.container);
		this.searchContainer = $('search-container');
	},
	renderResults: function ( tx, results ) {
        console.log('done searching.');
		var me = page.init;
		//result count
		var length = results.rows.length;
		
		me.searchContainer.set('html', '');
	
		var resultCount = new Element ('div', {
			id:'result-count',
			html: 'Results: <br/><div id="result-count-num">' + length + '</div>'
		});
		resultCount.inject( me.searchContainer );
	
		var item;
		for( var i = 0; i < length; i++ ) {
			item =  results.rows.item(i);
			var resultItem = new Element ( 'div', {
				id:'list-item',
				classes: 'list-tem',
				html:	'<div id="item-content" class="title">'
					+		'<div id="search-item-title">'
					+			'<div id="search-item-title">'
					+				'<span class="search-chapter">' + item.WEEKTITLE + ':</span>'
					+				'<span class="search-title" >' + item.TITLE + '</span>'
					+			 '</div>'
					+		'</div>' 
					+	'</div>'
					+	'<div id="item-content" class="arrow">'
					+		'<div id="item-title">'
					+			'<div id="search-item-arrow" ></div>'
					+		'</div>'
					+	'</div>'
			});
            resultItem.store( 'articleID', item.ID );  // this is so hacky, but its also what we do on the week page to iterate through the articles and store the article id.
            resultItem.addEvent('click', function() {
                                           page.goToArticle( this.retrieve('articleID'), page.goToSearch )});
			resultItem.inject( me.searchContainer);
		}
		//Output results
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
		nav.setHead( 'search' );
		nav.setCurrentPage( 'search' );
	},
	cleanup: function () {
		$( 'search-box').dispose();
		$('search-init').dispose();
		$('clear-search-box').dispose();
		this.searchContainer.dispose();
	},
	page: function () {
		return 'search';
	}
});
