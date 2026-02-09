import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product-models/product-details-request';
import { UtilityService } from '../../../services/common-services/utility.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.css'
})
export class ProductListingComponent implements OnInit {
  @Input() product!: Product;

  constructor(public utilityService: UtilityService) { }

  ngOnInit(): void {
    //console.log('Product in ProductListingComponent:', this.product);
  }
}