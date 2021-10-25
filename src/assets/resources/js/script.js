(function($) {

    "use strict";

    /** Main Menu Custom Script Start **/
    $(document).on('ready', function() {
        $("#respMenu").aceResponsiveMenu({
            resizeWidth: '768', // Set the same in Media query
            animationSpeed: 'fast', //slow, medium, fast
            accoridonExpAll: false //Expands all the accordion menu on click
        });
    });

    $(".slider-range").slider({
        range: true,
        min: 5000,
        max: 100000,
        values: [10000, 50000],
        slide: function(event, ui) {
            $(".amount").val("₹ " + ui.values[0] + " - ₹ " + ui.values[1]);
            //$(".amount2").val(ui.values[1]);
        }
    });
    $(".amount").change(function() {
        $(".slider-range").slider('values', 0, $(this).val());
    });
    $(".amount2").change(function() {
        $(".slider-range").slider('values', 1, $(this).val());
    });


    function mobileNavToggle() {
        if ($('#main-nav-bar .navbar-nav .sub-menu').length) {
            var subMenu = $('#main-nav-bar .navbar-nav .sub-menu');
            subMenu.parent('li').children('a').append(function() {
                return '<button class="sub-nav-toggler"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>';
            });
            var subNavToggler = $('#main-nav-bar .navbar-nav .sub-nav-toggler');
            subNavToggler.on('click', function() {
                var Self = $(this);
                Self.parent().parent().children('.sub-menu').slideToggle();
                return false;
            });

        };
    }

    $(window).on('scroll', function() {
        if ($('.scroll-to-top').length) {
            var strickyScrollPos = 100;
            if ($(window).scrollTop() > strickyScrollPos) {
                $('.scroll-to-top').fadeIn(500);
            } else if ($(this).scrollTop() <= strickyScrollPos) {
                $('.scroll-to-top').fadeOut(500);
            }
        };
        if ($('.stricky').length) {
            console.log($('.stricky').length);
            console.log($('.header-navigation').next());
            var headerScrollPos = $('.header-navigation').next().offset().top;
            var stricky = $('.stricky');
            if ($(window).scrollTop() > headerScrollPos) {
                stricky.removeClass('slideIn animated');
                stricky.addClass('stricky-fixed slideInDown animated');
            } else if ($(this).scrollTop() <= headerScrollPos) {
                stricky.removeClass('stricky-fixed slideInDown animated');
                stricky.addClass('slideIn animated');
            }
        };
    });

    jQuery(document).on('ready', function() {
        jQuery(window).stellar({
            horizontalScrolling: false,
            hideDistantElements: true,
            verticalScrolling: !isMobile.any(),
            scrollProperty: 'scroll',
            responsive: true
        });
    });

    mobileNavToggle();
    scrollToTop();

    $("#prncgs").on('click', function() {
        console.log("Hello");
        $(".dd_content2").toggle();
    });

    $("#prncgs2").on('click', function() {
        $(".dd_content2").toggle();
    });

    if ($('.feature_property_slider').length) {
        $('.feature_property_slider').owlCarousel({
            loop: false,
            margin: 30,
            autoplayHoverPause: false,
            autoplay: false,
            singleItem: true,
            smartSpeed: 1200,
            navText: [
                '<i class="fa fa-arrow-left"></i>',
                '<i class="fa fa-arrow-right"></i>'
            ],
            responsive: {
                0: {
                    items: 1,
                    center: false
                },
                480: {
                    items: 1,
                    center: false
                },
                600: {
                    items: 1,
                    center: false
                },
                768: {
                    items: 2
                },
                992: {
                    items: 2
                },
                1200: {
                    items: 2
                },
                1280: {
                    items: 3
                }
            }
        })
    }

    /*  Testimonial-Slider-Owl-carousel  */
    if ($('.testimonial_grid_slider').length) {
        $('.testimonial_grid_slider').owlCarousel({
            loop: false,
            margin: 15,
            dots: true,
            nav: false,
            rtl: false,
            autoplayHoverPause: false,
            autoplay: false,
            singleItem: true,
            smartSpeed: 1200,
            navText: [
                '<i class="fa fa-arrow-left"></i>',
                '<i class="fa fa-arrow-right"></i>'
            ],
            responsive: {
                0: {
                    items: 1,
                    center: false
                },
                480: {
                    items: 1,
                    center: false
                },
                600: {
                    items: 1,
                    center: false
                },
                768: {
                    items: 1
                },
                992: {
                    items: 1
                },
                1200: {
                    items: 1
                }
            }
        })
    }

    function scrollToTop() {
        console.log("Scroll to Top called");
        $(window).scroll(function() {
            if ($(this).scrollTop() > 600) {
                $('.scrollToHome').fadeIn();
            } else {
                $('.scrollToHome').fadeOut();
            }
        });

        //Click event to scroll to top
        $('.scrollToHome').on('click', function() {
            $('html, body').animate({ scrollTop: 0 }, 800);
            return false;
        });
    }

})(window.jQuery);