import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private configService: ConfigService) { }

  // Get full image URL
  getFullImageUrl(imageUrl: string): string {
    return `${this.configService.baseImageUrl}${imageUrl}`;
  }

  // Helper method to get filled stars count
  getFilledStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // Helper method to check if there's a half star
  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  // Helper method to get empty stars count
  getEmptyStars(rating: number): number[] {
    const filledStars = Math.floor(rating);
    const hasHalf = this.hasHalfStar(rating);
    const emptyCount = 5 - filledStars - (hasHalf ? 1 : 0);
    return Array(emptyCount).fill(0);
  }

  //Format price
  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  // Truncate text
  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}
