export interface SearchResult {
  products: import('@/types/product').Product[];
  total: number;
  query: string;
}

export interface SearchFilters {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
