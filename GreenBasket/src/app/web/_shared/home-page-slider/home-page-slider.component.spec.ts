import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageSliderComponent } from './home-page-slider.component';

describe('HomePageSliderComponent', () => {
  let component: HomePageSliderComponent;
  let fixture: ComponentFixture<HomePageSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
