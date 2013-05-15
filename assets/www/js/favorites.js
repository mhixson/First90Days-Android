var Favorites = new Class ({
    initialize: function () {
    	scroll (0,0);
        this.GetNav();
        this.container = $( 'content-container' );
        this.render();
        this.articles = new Array(0);
    },
    GetNav: function () {
        if( window.nav == null ){
            window.nav = new Navigation();
        } else {
            if( window.nav.hidden ) {
                window.nav.show();
            }
        }
        nav.setHead('Favorites');
        nav.setCurrentPage( 'favorites' );
    },
    populateList: function ( results ) {
        var length = results.rows.length;
        if ( length < 1 ) {
        	$('content-container').set( 'html', "<p id='fav-none' > You haven't favorited anything yet! </p>");
        }
        //alert('There are ' + length + ' items in the results');
        for (var i = 0; i < length; i++) {
            var article = results.rows.item( i );
            //alert('article is [' + article + ']');
            var favoriteListItem = new FavoritesListItem(article.ID, article.TITLE);
            favoriteListItem.HTML(page.init.container);
            page.init.articles.push(favoriteListItem);
        }
        //alert('done creating favorite list items');
    },
    cleanup: function () {
        //Clean up each of the articles in the list
        for (var i = 0;i < page.init.articles.length;i++) {
            page.init.articles[i].ELEMENT.dispose();
        }
        
        if( $( 'fav-none' ) != null ){ 
       		$('fav-none').dispose();
        }
        // do we want to hide the nav?  window.nav.hide();
    },
    page: function () {
        return 'favorites';
    },
    render: function () {
        var list = GetFavoritesList();
        //alert('there are [' + list.length + '] favorites');
        GetArticles(list, this.populateList);
    }
});

var FavoritesListItem = new Class ({
    initialize: function (articleId, title) {
        this.ELEMENT;
        this.title = title;
        this.id = articleId;
    },
    HTML: function ( container ) {
        var article = new Element ( 'div', {
                                        id: 'list-item',
                                        'class': 'list-item',
                                        events: {
                                            click: function () {
                                                window.page.goToArticle( this.retrieve('articleID'), window.page.goToFavorites);
                                            }
                                        },
                                        html:	'<div id="item-content" class="title">'
                                        +		'<div id="item-title">'
                                        +			'<div id="item-title" style="color:black;">' + this.title + '</div>'
                                        +		'</div>' 
                                        +	'</div>'
                                        +	'<div id="item-content" class="arrow">'
                                        +		'<div id="item-title">'
                                        +			'<div id="more-arrow" style="color:grey;" ></div>'
                                        +		'</div>'
                                        +	'</div>',
                                        styles: {
                                            'border-color': '#green',
                                            'background-color': '#blue',
                                        },
                                    } );
        article.store( 'articleID',this.id );
        article.inject( container );
        this.setELEMENT( article );
    },
    setELEMENT: function ( element ) {
        this.ELEMENT = element;
    }
});

