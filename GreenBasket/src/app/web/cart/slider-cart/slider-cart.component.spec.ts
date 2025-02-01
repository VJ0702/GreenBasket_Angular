import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderCartComponent } from './slider-cart.component';

describe('SliderCartComponent', () => {
  let component: SliderCartComponent;
  let fixture: ComponentFixture<SliderCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
