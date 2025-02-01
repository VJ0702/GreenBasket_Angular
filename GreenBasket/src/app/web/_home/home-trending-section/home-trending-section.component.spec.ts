import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTrendingSectionComponent } from './home-trending-section.component';

describe('HomeTrendingSectionComponent', () => {
  let component: HomeTrendingSectionComponent;
  let fixture: ComponentFixture<HomeTrendingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTrendingSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTrendingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
