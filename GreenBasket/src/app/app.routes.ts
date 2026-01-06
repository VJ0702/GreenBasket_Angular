import { Routes } from '@angular/router';
import { HomeIndexComponent } from './web/_home/home-index/home-index.component';
import { ProductDetailComponent } from './web/_product/product-detail/product-detail.component';
import { CategoryDetailComponent } from './web/_category/category-detail/category-detail.component';
import { LoginComponent } from './web/_user/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeIndexComponent, title: 'Home - GreenBasket' }, // Default route
    { path: 'product/:urlHandle', component: ProductDetailComponent, title: 'Product - GreenBasket' },
    { path: 'category/:seName', component: CategoryDetailComponent, title: 'Category - GreenBasket' },
    { path: 'login', component: LoginComponent, title: 'Login - GreenBasket' },
    { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route for a 404 page can be added later
];
