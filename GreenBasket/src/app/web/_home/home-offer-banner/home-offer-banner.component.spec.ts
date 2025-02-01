import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOfferBannerComponent } from './home-offer-banner.component';

describe('HomeOfferBannerComponent', () => {
  let component: HomeOfferBannerComponent;
  let fixture: ComponentFixture<HomeOfferBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeOfferBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeOfferBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
