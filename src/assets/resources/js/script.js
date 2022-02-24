(function($) {

    "use strict";

    $(document).on('ready', function() {
        $('[data-bs-toggle="popover"]').popover();
    });

    /* ----- Preloader ----- */
    function preloaderLoad() {
        // console.log($('.preloader').length);
        if ($('.preloader').length) {
            $('.preloader').delay(200).fadeOut(300);
        }
        $(".preloader_disabler").on('click', function() {
            $("#preloader").hide();
        });
    }

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

    $(".slider-range1").slider({
        range: true,
        min: 5000,
        max: 100000,
        values: [10000, 50000],
        slide: function(event, ui) {
            $(".amount1").val("₹ " + ui.values[0] + " - ₹ " + ui.values[1]);
            //$(".amount2").val(ui.values[1]);
        }
    });

    $(".amount1").change(function() {
        $(".slider-range1").slider('values', 1, $(this).val());
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
            //console.log($('.stricky').length);
            //console.log($('.header-navigation').next());
            var headerScrollPos = $('.header-navigation').next().offset(200).top;
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

    if ($('.showBtns').length) {
        $('.showBtns').on('click', function() {
            $(this).toggleText2('Show Filter', 'Hide Filter');
            $(this).toggleClass('flaticon-close flaticon-filter-results-button sidebarOpended2 sidebarClosed2');
            $('.sidebar_content_details').toggleClass('is-full-width');
        });
    }

    if ($('.showFilter').length) {
        $('.showFilter').on('click', function() {
            $(this).toggleText('Show Filter', 'Hide Filter');
            $(this).toggleClass('flaticon-close flaticon-filter-results-button sidebarOpended sidebarClosed');
            $('.listing_toogle_sidebar.sidenav').toggleClass('opened');
            $('.body_content').toggleClass('translated');
        });
    }

    $("#prncgs").on('click', function() {
        //console.log("Hello");
        $(".dd_content2").toggle();
    });

    $("#prncgs2").on('click', function() {
        $(".dd_content2").toggle();
    });

    $(".filter_open_btn").on('click', function() {
        $(".sidebar_content_details.style3").addClass("sidebar_ml0");
    });

    $(".filter_open_btn").on('click', function() {
        $("body").addClass("body_overlay");
    });

    $(".filter_closed_btn").on('click', function() {
        $(".sidebar_content_details.style3").removeClass("sidebar_ml0");
    });

    $(".filter_closed_btn").on('click', function() {
        $("body").removeClass("body_overlay");
    });

    $(".overlay_close").on('click', function() {
        $(".white_goverlay").toggle(500);
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

    if ($('.sidebar_feature_property_slider').length) {
        $('.sidebar_feature_property_slider').owlCarousel({
            animateIn: 'fadeIn',
            loop: true,
            margin: 15,
            dots: true,
            nav: true,
            rtl: false,
            autoplayHoverPause: false,
            autoplay: false,
            smartSpeed: 2000,
            singleItem: true,
            navText: [
                '<i class="flaticon-left-arrow-1"></i>',
                '<i class="flaticon-right-arrow"></i>'
            ],
            responsive: {
                320: {
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

    if ($('.fp_single_item_slider').length) {
        $('.fp_single_item_slider').owlCarousel({
            loop: true,
            margin: 15,
            dots: false,
            nav: true,
            rtl: false,
            autoplayHoverPause: false,
            autoplay: false,
            smartSpeed: 2000,
            singleItem: true,
            navText: [
                '<i class="flaticon-left-arrow-1"></i>',
                '<i class="flaticon-right-arrow"></i>'
            ],
            responsive: {
                320: {
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

    if ($(".banner-style-one").length) {
        $(".banner-style-one").owlCarousel({
            loop: true,
            items: 1,
            margin: 0,
            dots: true,
            nav: true,
            animateOut: "slideOutDown",
            animateIn: "fadeIn",
            active: true,
            smartSpeed: 1000,
            autoplay: false
        });
        $(".banner-carousel-btn .left-btn").on("click", function() {
            $(".banner-style-one").trigger("next.owl.carousel");
            return false;
        });
        $(".banner-carousel-btn .right-btn").on("click", function() {
            $(".banner-style-one").trigger("prev.owl.carousel");
            return false;
        });
    }

    function scrollToTop() {
        //console.log("Scroll to Top called");
        $(window).scroll(function() {
            if ($(this).scrollTop() > 600) {
                $('.scrollToHome').fadeIn();
            } else {
                $('.scrollToHome').fadeOut();
            }
        });

        //Click event to scroll to top
        $('.scrollToHome').on('click', function() {
            $('html, body').animate({ scrollTop: 0 }, 10);
            return false;
        });
    }

    /*const ctx = $('#myChart');
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Principal Amount', 'Interest Amount'],
            datasets: [{
                label: 'EMI Calculator',
                data: [40, 60],
                backgroundColor: [
                    'rgba(251, 136, 85, 1)',
                    'rgba(146, 208, 96, 1)'
                ],
                borderColor: [
                    '#eee'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    anchor: 'end',
                    display: true,
                    backgroundColor: '#ccc',
                    color: 'blue'
                }
            }
        }
    });*/

    $(window).on('load', function() {
        preloaderLoad();
    });

})(window.jQuery);