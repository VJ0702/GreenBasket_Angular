import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPageFilterComponent } from './category-page-filter.component';

describe('CategoryPageFilterComponent', () => {
  let component: CategoryPageFilterComponent;
  let fixture: ComponentFixture<CategoryPageFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPageFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryPageFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
