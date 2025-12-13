import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';

@Component({
  selector: 'app-root',
  imports: [ ProductFormComponent, ProductsListComponent, ProductFilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-products-app';
}
