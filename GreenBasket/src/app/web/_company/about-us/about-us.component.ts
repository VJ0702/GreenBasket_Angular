import { Component, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';

declare const $: any;

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly isBrowser: boolean;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'About Us', isActive: true }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => this.initializeCarousels(), 100);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.destroyCarousels();
    }
  }

  private initializeCarousels(): void {
    // Initialize Testimonial Slider
    if (typeof $ !== 'undefined' && $('#gi-testimonial-slider').length) {
      $('#gi-testimonial-slider').owlCarousel({
        loop: true,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        items: 1,
        margin: 0
      });
    }

    // Initialize Team Carousel
    if (typeof $ !== 'undefined' && $('.gi-team.owl-carousel').length) {
      $('.gi-team.owl-carousel').owlCarousel({
        loop: true,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        margin: 24,
        responsive: {
          0: { items: 1 },
          420: { items: 2 },
          768: { items: 3 },
          1024: { items: 4 }
        },
        navText: [
          '<i class="gicon gi-angle-left"></i>',
          '<i class="gicon gi-angle-right"></i>'
        ]
      });
    }
  }

  private destroyCarousels(): void {
    try {
      if (typeof $ !== 'undefined') {
        if ($('#gi-testimonial-slider').data('owl.carousel')) {
          $('#gi-testimonial-slider').owlCarousel('destroy');
        }
        if ($('.gi-team.owl-carousel').data('owl.carousel')) {
          $('.gi-team.owl-carousel').owlCarousel('destroy');
        }
      }
    } catch (e) {
      console.warn('Error destroying carousels:', e);
    }
  }
}
