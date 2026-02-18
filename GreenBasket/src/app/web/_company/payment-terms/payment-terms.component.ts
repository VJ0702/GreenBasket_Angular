import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';

@Component({
  selector: 'app-payment-terms',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  templateUrl: './payment-terms.component.html',
  styleUrl: './payment-terms.component.css'
})
export class PaymentTermsComponent {


  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Payment Terms', isActive: true }
  ];
}
