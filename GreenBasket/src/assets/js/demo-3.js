$(document).ready(function () {
    "use strict";

    /*--------------------- Main Slider ---------------------- */
    var GiMainSlider = new Swiper('.gi-slider.swiper-container', {
        loop: true,
        centeredSlides: true,
        speed: 2000,
        effect: 'slide',
        parallax: true,
        autoplay: {
            delay: 10000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }

    });

    /*--------------------- Language and Currency Click to Active ---------------------- */
    $(document).ready(function () {
        $(".header-top-lan li").click(function () {
            $(this).addClass('active').siblings().removeClass('active');
        });
        $(".header-top-curr li").click(function () {
            $(this).addClass('active').siblings().removeClass('active');
        });
    });
    /*--------------------- Search popup (Home Page 2) ---------------------- */
    $('.gi-search-icon').click(function () {
        $('.gi-search-menu').fadeIn();
    });
    $('.gi-close-search').click(function () {
        $('.gi-search-menu').fadeOut();
    });
    /*--------------------- Category slider section (Home Page) ---------------------- */
    $('.gi-category-block-4').owlCarousel({
        margin: 24,
        loop: true,
        dots: false,
        nav: false,
        smartSpeed: 1500,
        autoplay: false,
        items: 3,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            420: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            },
            1400: {
                items: 5
            }
        }
    });
    /*--------------------- Day of the deal Slider (offer section) ---------------------- */
    $('.deal-slick-carousel').slick({
        dots: false,
        infinite: true,
        arrows: false,
        speed: 300,
        slidesToShow: 4,        
        slidesToScroll: 4,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 2400,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 421,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 0,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    });

    /*--------------------- Trending, Top Rated Start Slider ----------------------- */
    $('.gi-trending-slider, .gi-rated-slider').slick({
        dots: false,
        infinite: true,
        arrows: true,
        autoplay: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });


    /*--------------------- Blog slider (Home Page) ---------------------- */
    $('.gi-blog-carousel').owlCarousel({
        margin: 24,
        loop: true,
        dots: false,
        nav: false,
        smartSpeed: 1000,
        autoplay: false,
        items: 3,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            481: {
                items: 2
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            },
            1400: {
                items: 5
            }
        }
    });

    /*----------------------------- Sidebar js | Toggle Icon OnClick Open sidebar  -----------------------------------*/
    $(".gi-site-cat-icon").on("click", function () {
        $(".gi-shop-sidebar-overlay").fadeIn();
        $(".gi-shop-sidebar-2").addClass("gi-open");
    });

    $(".gi-cat-close").on("click", function () {
        $(".gi-shop-sidebar-2").removeClass("gi-open");
        $(".gi-shop-sidebar-overlay").fadeOut();
    });

    $(".gi-shop-sidebar-overlay").on("click", function () {
        $(".gi-shop-sidebar-2").removeClass("gi-open");
        $(".gi-shop-sidebar-overlay").fadeOut();
    });

    /*--------------------- Newsletter popup Homepage ---------------------- */
    setTimeout(function () {
        $("#gi-popnews-bg").fadeIn();
        $("#gi-popnews-box").fadeIn();
    }, 5000);
    $("#gi-popnews-close").click(() => {
        $("#gi-popnews-bg").fadeOut();
        $("#gi-popnews-box").fadeOut();
    });

    $("#gi-popnews-bg").click(() => {
        $("#gi-popnews-bg").fadeOut();
        $("#gi-popnews-box").fadeOut();
    });
});