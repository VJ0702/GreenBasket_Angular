import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDailyDealsComponent } from './home-daily-deals.component';

describe('HomeDailyDealsComponent', () => {
  let component: HomeDailyDealsComponent;
  let fixture: ComponentFixture<HomeDailyDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDailyDealsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDailyDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
