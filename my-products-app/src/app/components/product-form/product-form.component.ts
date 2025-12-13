import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/ProductService';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})

export class ProductFormComponent {
  form!: FormGroup;
  saving = false;
  message = '';

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', [Validators.required, Validators.minLength(4)]],
      price: ['', [Validators.min(1)]],
      active: [true]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const payload: Omit<Product, 'id'> = {
      name: String(v.name ?? ''),
      category: v.category ? String(v.category) : '',
      price: v.price != null ? Number(v.price) : 0,
      active: !!v.active
    };

    this.saving = true;
    this.productService.create(payload).subscribe({
      next: () => {
        this.message = 'Producto creado.';
        this.form.reset({ active: true });
        this.saving = false;
        setTimeout(() => (this.message = ''), 2500);
      },
      error: () => {
        this.message = 'Error al crear.';
        this.saving = false;
      }
    });
  }
}