import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/ProductService';
import { ProductFilter } from '../product-filter/product-filter.component';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private allProducts: Product[] = []; 
  loading = false;
  error = '';

  private sub?: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loading = true;
    this.sub = this.productService.products$.subscribe({
      next: list => {
        this.allProducts = list || [];
        this.products = [...this.allProducts];
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos.';
        this.loading = false;
      }
    });
  }


  onFilter(criteria: ProductFilter) {
    this.products = this.allProducts.filter(p => {
      if (criteria.name && !p.name?.toLowerCase().includes((criteria.name || '').toLowerCase())) return false;
      if (criteria.category && !p.category?.toLowerCase().includes((criteria.category || '').toLowerCase())) return false;
      if (criteria.minPrice != null && Number(criteria.minPrice) > (p.price ?? 0)) return false;
      if (criteria.maxPrice != null && Number(criteria.maxPrice) < (p.price ?? 0)) return false;
      if (criteria.active === 'true' && !p.active) return false;
      if (criteria.active === 'false' && p.active) return false;
      return true;
    });
  }

  remove(id: string) {
    this.loading = true;
    this.productService.delete(id).subscribe({
      next: ok => {
        this.loading = false;
        if (!ok) this.error = 'No se pudo eliminar el producto.';
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al eliminar el producto.';
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}