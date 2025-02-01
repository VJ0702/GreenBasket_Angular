import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBlogSectionComponent } from './home-blog-section.component';

describe('HomeBlogSectionComponent', () => {
  let component: HomeBlogSectionComponent;
  let fixture: ComponentFixture<HomeBlogSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBlogSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeBlogSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
