import { Component } from '@angular/core';
import { BreadcrumbItem } from '../../../models/common/breadcrumb.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../_shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.css'
})
export class TrackOrderComponent {


  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Track Order', isActive: true }
  ];
}
