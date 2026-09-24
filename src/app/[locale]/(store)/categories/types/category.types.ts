import { Category } from '@/types/product';

export interface CategoryListResponse {
  data: Category[];
  total: number;
}
