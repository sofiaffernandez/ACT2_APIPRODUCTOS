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
    try {
      const res = await fetch(this.apiUrl);
      if (!res.ok) {
        console.error('loadFromServer failed', res.status);
        return;
      }
      const data = await res.json();
      const raw = Array.isArray(data) ? data : Array.isArray((data as any).items) ? (data as any).items : [];
      const normalized: Product[] = raw.map((p: any) => ({
        id: p.id ?? uuidv4(),
        name: p.name ?? '',
        category: p.category ?? '',
        price: p.price != null ? Number(p.price) : 0,
        active: p.active != null ? !!p.active : true,
        ...p
      }));
      this.productsSubject.next(normalized);
    } catch (err) {
      console.error('loadFromServer error', err);
    }
  }

  private async saveToServer(products: Product[]) {
    try {
      const res = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      });
      if (!res.ok) {
        throw new Error(`saveToServer failed: ${res.status}`);
      }
      // solo actualizar si el servidor aceptó la modificación
      this.productsSubject.next([...products]);
      return true;
    } catch (err) {
      console.error('saveToServer error', err);
      throw err;
    }
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
