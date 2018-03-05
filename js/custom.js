


jQuery.noConflict()(function ($) {

'use strict';

$(document).ready(function(){


	// PRELOADER
	var hellopreloader = document.getElementById("preloader");
	function fadeOutnojquery(el) {
		el.style.opacity = 1;
		var interhellopreloader = setInterval(function() {
			el.style.opacity = el.style.opacity - 0.05;
			if (el.style.opacity <= 0.05) {
				clearInterval(interhellopreloader);
				hellopreloader.style.display = "none";
			}
		}, 16);
	}
	window.onload = function() {
		setTimeout(function() {
			fadeOutnojquery(hellopreloader);
		}, 750);
	};

	
	// MAGNIFICENT POPUP
	$('.image-modal').magnificPopup({
		type:'inline',
		fixedContentPos: false,
		removalDelay: 100,
		closeBtnInside: true,
		preloader: false,
		mainClass: 'mfp-fade'
	});

	$(document).on('click', '.popup-modal-dismiss', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});


	// "quotes" OWL CAROUSEL SETTINGS
	$('.owl-carousel-quotes').owlCarousel({
		loop:true,
		margin:25,
		nav:false,
		autoplay: false,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:1
			},
			1000:{
				items:1
			}
		}
	})


	// "reviews" OWL CAROUSEL SETTINGS
	$('.owl-carousel-reviews').owlCarousel({
		loop:true,
		margin:25,
		nav:false,
		autoplay: false,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:2
			},
			1000:{
				items:2
			}
		}
	})
	
 
});

});