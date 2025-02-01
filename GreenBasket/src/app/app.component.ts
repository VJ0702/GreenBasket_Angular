import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExternalHeaderComponent } from './web/_shared/external-header/external-header.component';
import { ExternalFooterComponent } from './web/_shared/external-footer/external-footer.component';
import { SliderCartComponent } from './web/cart/slider-cart/slider-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ExternalHeaderComponent, ExternalFooterComponent, SliderCartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GreenBasket';
}
