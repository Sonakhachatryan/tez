/**
*
* -----------------------------------------------------------------------------
*
* Template : Edulearn | Responsive Education HTML5 Template 
* Author : rs-theme
* Author URI : http://www.rstheme.com/
*
* -----------------------------------------------------------------------------
*
**/

(function($) {
    "use strict";

    // sticky menu
    var header = $('.menu-sticky');
    var win = $(window);
    win.on('scroll', function() {
       var scroll = win.scrollTop();
       if (scroll < 300) {
           header.removeClass("sticky");
       } else {
           header.addClass("sticky");
       }
    });
	
    // Latest News
	$('.latest-news-slider').slick({
		slidesToShow: 1,
		// vertical: true,
		// verticalSwiping: true,
		slidesToScroll: 1,
		arrows: true,
		fade: false,
		asNavFor: '.latest-news-nav'
	});

	$('.latest-news-nav').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		asNavFor: '.latest-news-slider',
		dots: false,
		centerMode: false,
		centerPadding: '0',
		focusOnSelect: true
	});




	 
	// video 
    if ($('.player').length) {
        $(".player").YTPlayer();
    }
    
    //about tabs
    $('.collapse.show').prev('.card-header').addClass('active');
    $('#accordion, #bs-collapse, #accordion1')
        .on('show.bs.collapse', function (a) {
            $(a.target).prev('.card-header').addClass('active');
        })
        .on('hide.bs.collapse', function (a) {
            $(a.target).prev('.card-header').removeClass('active');
        });

    // wow init
    new WOW().init();
    
    // image loaded portfolio init
	var gridfilter = $('.grid');
		if(gridfilter.length){
		$('.grid').imagesLoaded(function() {
			$('.gridFilter').on('click', 'button', function() {
				var filterValue = $(this).attr('data-filter');
				$grid.isotope({
					filter: filterValue
				});
			});
			var $grid = $('.grid').isotope({
				itemSelector: '.grid-item',
				percentPosition: true,
				masonry: {
					columnWidth: '.grid-item',
				}
			});
		});
	}
        
    // project Filter
    if ($('.gridFilter button').length) {
		var projectfiler = $('.gridFilter button');
			if(projectfiler.length){
			$('.gridFilter button').on('click', function(event) {
				$(this).siblings('.active').removeClass('active');
				$(this).addClass('active');
				event.preventDefault();
			});
		}
	}

    // image popup
	var imaggepoppup = $('.image-popup');
	if(imaggepoppup.length){
		$('.image-popup').magnificPopup({
			type: 'image',
			callbacks: {
				beforeOpen: function() {
				   this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure animated zoomInDown');
				}
			},
			gallery: {
				enabled: true
			}
		});
	}
    
	// video popup
	var popupyoutube = $('.popup-youtube');
	if(popupyoutube.length){
		$('.popup-youtube').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false								
		});	
	}
	
    
     /*----------------------------
    single-productjs active
    ------------------------------ */
	var singleproduct = $('.single-product');
	if(singleproduct.length){
		$('.single-product').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			fade: true,
			asNavFor: '.single-product-nav'
		});
	}
	var singleproductnav = $('.single-product-nav');
	if(singleproductnav.length){
		$('.single-product-nav').slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			asNavFor: '.single-product',
			dots: false,
			focusOnSelect: true,
			centerMode:true,
		});
	}

	/*-------------------------------------
	Preloder Js here
	---------------------------------------*/
	//preloader
	$(window).on( 'load', function() {
		$(".book_preload").delay(2000).fadeOut(200);
		$(".book").on('click', function() {
		$(".book_preload").fadeOut(200);
		})
	})
		
    // Counter Up
    if($('.counter-number').length){	
		$('.counter-number').counterUp({
			delay: 20,
			time: 1500
		});
	}
    // scrollTop init
    var totop = $('#scrollUp'); 
    if(totop.length){	
		win.on('scroll', function() {
			if (win.scrollTop() > 150) {
				totop.fadeIn();
			} else {
				totop.fadeOut();
			}
		});
		totop.on('click', function() {
			$("html,body").animate({
				scrollTop: 0
			}, 500)
		});
	}
    
    // Google Map
    if ($('#googleMap').length) {
        var initialize = function() {
            var mapOptions = {
                zoom: 10,
                scrollwheel: false,
                center: new google.maps.LatLng(40.837936, -73.412551),
                styles: [{
                    stylers: [{
                        saturation: -100
                    }]
                }]
            };
            var map = new google.maps.Map(document.getElementById("googleMap"),
                mapOptions);
            var marker = new google.maps.Marker({
                position: map.getCenter(),
                animation: google.maps.Animation.BOUNCE,
                icon: 'images/map-marker.png',
                map: map
            });
        }
        // Add the map initialize function to the window load function
        google.maps.event.addDomListener(window, "load", initialize);
    }
    
    /* MENU JS */
	var togglebtn = $('.toggle-btn');
	if(togglebtn.length){
		$(".toggle-btn").on("click", function () {
			$(this).toggleClass("active");
			$("body").toggleClass("hidden-menu");
		});
	}
    
	//canvas menu
	var navexpander = $('#nav-expander');
	if(navexpander.length){
		$('#nav-expander').on('click',function(e){
			e.preventDefault();
			$('body').toggleClass('nav-expanded');
		});
	}
	var navclose = $('#nav-close');
	if(navclose.length){
		$('#nav-close').on('click',function(e){
			e.preventDefault();
			$('body').removeClass('nav-expanded');
		});
	}
	
	//canvus menu
	var sidebarnavmenu = $('.sidebarnav_menu');
	if(sidebarnavmenu.length){
		$( ".sidebarnav_menu li.menu-item-has-children" ).on('click', function() {
		  $(this).children( "ul" ).slideToggle( "slow", function() {
		  });
		});
	}
	

})(jQuery);