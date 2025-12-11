import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/ProductService';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})


export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = false;
  error = '';

  private sub?: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loading = true;
    this.sub = this.productService.products$.subscribe({
      next: list => {
        this.products = list;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos.';
        this.loading = false;
      }
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