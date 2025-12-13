import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProductFilter {
  name?: string;
  category?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  active?: 'any' | 'true' | 'false';
}

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {
  @Output() filter = new EventEmitter<ProductFilter>();

  model: ProductFilter = { name: '', category: '', minPrice: null, maxPrice: null, active: 'any' };

  apply() {
    this.filter.emit({ ...this.model });
  }

  clear() {
    this.model = { name: '', category: '', minPrice: null, maxPrice: null, active: 'any' };
    this.apply();
  }
}
