import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBannerSectionComponent } from './home-banner-section.component';

describe('HomeBannerSectionComponent', () => {
  let component: HomeBannerSectionComponent;
  let fixture: ComponentFixture<HomeBannerSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBannerSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeBannerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
