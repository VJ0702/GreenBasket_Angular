import { Component } from '@angular/core';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Contact Us', isActive: true }
  ];
}
