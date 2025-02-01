import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageLatestArrivalComponent } from './home-page-latest-arrival.component';

describe('HomePageLatestArrivalComponent', () => {
  let component: HomePageLatestArrivalComponent;
  let fixture: ComponentFixture<HomePageLatestArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageLatestArrivalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageLatestArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
