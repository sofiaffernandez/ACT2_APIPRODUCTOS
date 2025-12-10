import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductCardComponent } from './components/product-card/product-card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductFormComponent, ProductsListComponent, ProductCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-products-app';
}
