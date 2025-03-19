import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-menu-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-menu-item.component.html',
  styleUrl: './category-menu-item.component.css'
})
export class CategoryMenuItemComponent {
  @Input() category: any;
}
