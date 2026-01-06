import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExternalHeaderComponent } from './web/_shared/external-header/external-header.component';
import { ExternalFooterComponent } from './web/_shared/external-footer/external-footer.component';
import { SliderCartComponent } from './web/cart/slider-cart/slider-cart.component';
import { ToastComponent } from './web/_shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExternalHeaderComponent, ExternalFooterComponent, SliderCartComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GreenBasket';
}
