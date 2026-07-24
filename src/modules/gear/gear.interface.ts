export interface ICreateGear {
  name: string;
  description?: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  categoryId: string;
}

export interface IUpdateGear {
  name?: string;
  description?: string;
  brand?: string;
  pricePerDay?: number;
  stock?: number;
  isAvailable?: boolean;
  categoryId?: string;
}

export interface IGearFilter {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}