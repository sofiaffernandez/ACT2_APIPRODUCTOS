import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { Product } from '../models/product.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private apiUrl = 'https://api.jsonblob.com/019b0f3a-ba30-7297-bb14-bed467f7fc00';

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor() {
    this.loadFromServer();
  }

  private async loadFromServer() {
    const res = await fetch(this.apiUrl);
    const data = await res.json();

    this.productsSubject.next(data || []);
  }

  private async saveToServer(products: Product[]) {
    await fetch(this.apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products)
    });
    this.productsSubject.next([...products]);
  }

  getAll(): Observable<Product[]> {
    return this.products$;
  }

  getById(id: string): Observable<Product | undefined> {
    const products = this.productsSubject.value;
    return of(products.find(p => p.id === id));
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    const newProduct: Product = { id: uuidv4(), ...product };
    const updated = [...this.productsSubject.value, newProduct];

    return from(
      this.saveToServer(updated).then(() => newProduct)
    );
  }

  update(id: string, changes: Partial<Product>): Observable<Product | undefined> {
    const products = this.productsSubject.value;
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return of(undefined);

    const updated = [...products];
    updated[idx] = { ...updated[idx], ...changes };

    return from(
      this.saveToServer(updated).then(() => updated[idx])
    );
  }

  delete(id: string): Observable<boolean> {
    const products = this.productsSubject.value;
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return of(false);

    const updated = products.filter(x => x.id !== id);

    return from(
      this.saveToServer(updated).then(() => true)
    );
  }
}
