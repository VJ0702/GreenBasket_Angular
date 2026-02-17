import { Routes } from '@angular/router';
import { HomeIndexComponent } from './web/_home/home-index/home-index.component';
import { ProductDetailComponent } from './web/_product/product-detail/product-detail.component';
import { CategoryDetailComponent } from './web/_category/category-detail/category-detail.component';
import { LoginComponent } from './web/_user/login/login.component';
import { RegisterComponent } from './web/_user/register/register.component';
import { ForgotPasswordComponent } from './web/_user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './web/_user/reset-password/reset-password.component';
import { ProfileComponent } from './web/_user/profile/profile.component';
import { AllBlogsComponent } from './web/blog/all-blogs/all-blogs.component';
import { BlogDetailsComponent } from './web/blog/blog-details/blog-details.component';

export const routes: Routes = [
    { path: '', component: HomeIndexComponent, title: 'Home - GreenBasket' }, // Default route
    { path: 'product/:urlHandle', component: ProductDetailComponent, title: 'Product - GreenBasket' },
    { path: 'category/:seName', component: CategoryDetailComponent, title: 'Category - GreenBasket' },
    { path: 'login', component: LoginComponent, title: 'Login - GreenBasket' },
    { path: 'register', component: RegisterComponent, title: 'Register - GreenBasket' },
    { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Forgot Password - GreenBasket' },
    //{ path: 'reset-password/:token', component: ResetPasswordComponent, title: 'Reset Password - GreenBasket' },
    { path: 'reset-password', component: ResetPasswordComponent, title: 'Reset Password - GreenBasket' },
    { path: 'profile', component: ProfileComponent, title: 'Profile - GreenBasket' },
    { path: 'blogs', component: AllBlogsComponent, title: 'Blogs - GreenBasket' },
    { path: 'blog/:urlSlug', component: BlogDetailsComponent, title: 'Blog Details - GreenBasket' },
    { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route for a 404 page can be added later
];
