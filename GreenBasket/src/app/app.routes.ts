import { Routes } from '@angular/router';
import { HomeIndexComponent } from './web/_home/home-index/home-index.component';
import { ProductDetailComponent } from './web/_product/product-detail/product-detail.component';

export const routes: Routes = [
    { path: '', component: HomeIndexComponent }, // Default route
    { path: 'product/:seName', component: ProductDetailComponent },
];
