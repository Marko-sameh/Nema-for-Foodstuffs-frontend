import { api } from '@/lib/api';
import { WISHLIST_MODULE_CONFIG } from '../module.config';

export class WishlistAPI {
  static async fetchWishlist(): Promise<{ productIds: string[] }> {
    return api.get(WISHLIST_MODULE_CONFIG.endpoints.list);
  }

  static async addToWishlist(productId: string): Promise<void> {
    return api.post(WISHLIST_MODULE_CONFIG.endpoints.add, { productId });
  }

  static async removeFromWishlist(productId: string): Promise<void> {
    return api.delete(WISHLIST_MODULE_CONFIG.endpoints.remove(productId));
  }
}
