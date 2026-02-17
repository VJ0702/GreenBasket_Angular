import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Blog } from '../../../models/blog-models/blog.model';
import { UtilityService } from '../../../services/common-services/utility.service';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.css'
})
export class BlogCardComponent {
  @Input() blog!: Blog;

  constructor(public utilityService: UtilityService) { }

}
