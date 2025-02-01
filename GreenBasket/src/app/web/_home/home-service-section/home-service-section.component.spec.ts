import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeServiceSectionComponent } from './home-service-section.component';

describe('HomeServiceSectionComponent', () => {
  let component: HomeServiceSectionComponent;
  let fixture: ComponentFixture<HomeServiceSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeServiceSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeServiceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
