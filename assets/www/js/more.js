var MorePage = new Class({
	initialize: function () {
      	scroll( 0, 0 );
        console.log('initializing the more page');
        this.GetNav();
		this.container = $('content-container');
        localStorage.removeItem('sendMeBackToTheMorePage');
        nav.back.hide();
    }, 
    render: function() {
        var moreContainer = new Element ('div', {
                            id: 'more-container'});
        var howToDiv = new Element ('div', {
                            id: 'list-item',
                            'class': 'list-item',
                            events: {
                                click: function () {
                                    page.goToHowTo();
                                }
                            },
                            html: '<div id="item-content" class="title">'
                                        +		'<div id="item-title">'
                                        +			'<div id="item-title" style="color:black;">How to Use This App</div>'
                                        +		'</div>' 
                                        +	'</div>'
                                        +	'<div id="item-content" class="arrow">'
                                        +		'<div id="item-title">'
                                        +			'<div id="more-arrow" style="color:grey;" ></div>'
                                        +		'</div>'
                                        +	'</div>'
                            });
        howToDiv.inject(moreContainer);
        var settingsDiv = new Element ('div', {
                            id: 'list-item',
                            'class': 'list-item',
                            events: {
                                click: function () {
                                    localStorage.setItem('sendMeBackToTheMorePage', 'true');
                                    page.goToSetup();
                                }
                            },
                            html: '<div id="item-content" class="title">'
                                        +		'<div id="item-title">'
                                        +			'<div id="item-title" style="color:black;">Settings</div>'
                                        +		'</div>' 
                                        +	'</div>'
                                        +	'<div id="item-content" class="arrow">'
                                        +		'<div id="item-title">'
                                        +			'<div id="more-arrow" style="color:grey;" ></div>'
                                        +		'</div>'
                                        +	'</div>'
                            });
        settingsDiv.inject(moreContainer);
        /*
        var buyTheBookDiv = new Element ('div', {
                            id: 'buyTheBook',
                            'class': 'list-item',
                            events: {
                                click: function (  ) {
                                    //window.open('https://play.google.com/store/books/details/Michael_Watkins_The_First_90_Days_Updated_and_Expa?id=QGkHs4pExOQC&feature=search_result#?t=W251bGwsMSwxLDEsImJvb2stUUdrSHM0cEV4T1FDIl0.', '_system');
                                    console.log('You clicked Buy the Book');
                                    page.goToBuyTheBook();
                                }
                            },
                            html: '<div id="item-content" class="title">'
                                        +		'<div id="item-title">'
                                        +			'<div id="item-title" style="color:black;">Buy the Book</div>'
                                        +		'</div>' 
                                        +	'</div>'
                                        +	'<div id="item-content" class="arrow">'
                                        +		'<div id="item-title">'
                                        +			'<div id="more-arrow" style="color:grey;" ></div>'
                                        +		'</div>'
                                        +	'</div>'
                            });
        buyTheBookDiv.inject(moreContainer);
        */
        var otherAppsDiv = new Element ('div', {
                            id: 'otherApps',
                            'class': 'list-item',
                            events: {
                                click: function (  ) {
                                    window.open('http://play.google.com/store/apps/developer?id=Harvard+Business+Review', '_system');
                                    console.log('You clicked Other Apps from HBR');
                                }
                            },
                            html: '<div id="item-content" class="title">'
                                        +		'<div id="item-title">'
                                        +			'<div id="item-title" style="color:black;">Other Apps from HBR</div>'
                                        +		'</div>' 
                                        +	'</div>'
                                        +	'<div id="item-content" class="arrow">'
                                        +		'<div id="item-title">'
                                        +			'<div id="more-arrow" style="color:grey;" ></div>'
                                        +		'</div>'
                                        +	'</div>'
                            });
        otherAppsDiv.inject(moreContainer);
        var feedbackDiv = new Element ('div', {
                            id: 'feedback',
                            'class': 'list-item',
                            html: '<div id="item-content" class="title">'
                                        +		'<div id="item-title">'
                                        +			'<div id="item-title"><a style="color:black;text-decoration:none;" href="mailto:andrew.innes@harvardbusiness.org?subject=Feedback from First 90 Days app - Android">Feedback</a></div>'
                                        +		'</div>' 
                                        +	'</div>'
                                        +	'<div id="item-content" class="arrow">'
                                        +		'<div id="item-title">'
                                        +			'<div id="more-arrow" style="color:grey;" ></div>'
                                        +		'</div>'
                                        +	'</div>'
                            });
        feedbackDiv.inject(moreContainer);

        moreContainer.inject($('content-container'));
        nav.setCurrentPage( 'more' );
        //console.log('render() has ended');
    },
    page: function () {
		return 'more';
	},
	GetNav: function () {
		if( window.nav == null ){
		 window.nav = new Navigation();
		} else {
			if( window.nav.hidden ) {
				window.nav.show();
			}
		}
        window.nav.setHead('More');
	},
    cleanup: function () {
		if( $('more-container') != null ){
			$('more-container').dispose();
		}
	}
});