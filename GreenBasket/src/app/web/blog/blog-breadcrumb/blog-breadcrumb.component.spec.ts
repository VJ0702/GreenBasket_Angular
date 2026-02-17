import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogBreadcrumbComponent } from './blog-breadcrumb.component';

describe('BlogBreadcrumbComponent', () => {
  let component: BlogBreadcrumbComponent;
  let fixture: ComponentFixture<BlogBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogBreadcrumbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
