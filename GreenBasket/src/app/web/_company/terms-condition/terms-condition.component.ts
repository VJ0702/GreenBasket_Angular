import { Component } from '@angular/core';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-terms-condition',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  templateUrl: './terms-condition.component.html',
  styleUrl: './terms-condition.component.css'
})
export class TermsConditionComponent {


  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Terms & Conditions', isActive: true }
  ];
}
