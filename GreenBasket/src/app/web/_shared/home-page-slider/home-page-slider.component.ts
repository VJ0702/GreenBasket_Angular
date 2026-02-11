import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, PLATFORM_ID, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Banner } from '../../../models/home-data/banner';
import { UtilityService } from '../../../services/common-services/utility.service';

declare var Swiper: any;

@Component({
  selector: 'app-home-page-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page-slider.component.html',
  styleUrl: './home-page-slider.component.css'
})
export class HomePageSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() banners: Banner[] = [];
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  private swiper: any;
  private isBrowser: boolean;

  constructor(
    private utilityService: UtilityService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Initial setup - Swiper will be initialized in ngAfterViewInit
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.banners && this.banners.length > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        this.initSwiper();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
  }

  /**
   * Initialize Swiper slider with theme configuration
   */
  private initSwiper(): void {
    if (!this.isBrowser || typeof Swiper === 'undefined') return;

    try {
      this.swiper = new Swiper(this.swiperContainer.nativeElement, {
        loop: true,
        speed: 800,
        spaceBetween: 0,
        slidesPerView: 1,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // Enable touch/swipe
        touchRatio: 1,
        touchAngle: 45,
        grabCursor: true,
        // Animation callbacks
        on: {
          slideChangeTransitionStart: () => {
            const slides = this.swiperContainer.nativeElement.querySelectorAll('.swiper-slide');
            slides.forEach((slide: HTMLElement) => {
              const content = slide.querySelector('.slider-animation');
              if (content) {
                content.classList.remove('animate');
              }
            });
          },
          slideChangeTransitionEnd: () => {
            const activeSlide = this.swiperContainer.nativeElement.querySelector('.swiper-slide-active');
            if (activeSlide) {
              const content = activeSlide.querySelector('.slider-animation');
              if (content) {
                content.classList.add('animate');
              }
            }
          },
          init: () => {
            // Trigger animation on first slide
            setTimeout(() => {
              const activeSlide = this.swiperContainer.nativeElement.querySelector('.swiper-slide-active');
              if (activeSlide) {
                const content = activeSlide.querySelector('.slider-animation');
                if (content) {
                  content.classList.add('animate');
                }
              }
            }, 100);
          }
        }
      });

      console.log('Swiper initialized successfully');
    } catch (error) {
      console.error('Error initializing Swiper:', error);
    }
  }

  /**
   * Get full image URL using utility service
   */
  getImageUrl(banner: Banner): string {
    return this.utilityService.getFullImageUrl(banner.imageUrl);
  }

  /**
   * Get mobile image URL using utility service
   */
  getMobileImageUrl(banner: Banner): string {
    return this.utilityService.getFullImageUrl(banner.mobileImageUrl || banner.imageUrl);
  }

  /**
   * Get text alignment with null safety
   */
  getTextAlignment(banner: Banner): string {
    return banner.textAlignment ? banner.textAlignment.toLowerCase() : 'left';
  }

  /**
   * Check if banner has button
   */
  hasButton(banner: Banner): boolean {
    return !!banner.buttonText;
  }
}