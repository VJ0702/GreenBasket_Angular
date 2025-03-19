import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ConfigService } from '../../../services/common-services/config.service';

@Component({
  selector: 'app-category-banner',
  standalone: true,
  imports: [],
  templateUrl: './category-banner.component.html',
  styleUrl: './category-banner.component.css'
})
export class CategoryBannerComponent implements OnInit {
  @Input() category: any;

  constructor(private configService: ConfigService) { }
  ngOnInit(): void {
    //console.log('category', this.category?.name);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category']) {
      //console.log('category', this.category?.imageUrl);
    }
  }
  getFullImageUrl(imageUrl: string): string {
    return `${this.configService.baseImageUrl}${imageUrl}`;
  }
}
