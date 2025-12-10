export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  active: boolean;
  description?: string;
}