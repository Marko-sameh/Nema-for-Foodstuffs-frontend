import { api } from '@/lib/api';
import { CART_MODULE_CONFIG } from '../module.config';
import {
  AddToCartPayload,
  CartSessionResponse,
  ServerCart,
  UpdateCartItemPayload,
} from '../types/cart.types';

export class CartAPI {
  static async fetchSession(): Promise<CartSessionResponse> {
    return api.get<CartSessionResponse>(CART_MODULE_CONFIG.endpoints.session);
  }

  static async fetchCart(): Promise<ServerCart> {
    return api.get<ServerCart>(CART_MODULE_CONFIG.endpoints.get);
  }

  static async addItem(payload: AddToCartPayload): Promise<ServerCart> {
    return api.post<ServerCart>(CART_MODULE_CONFIG.endpoints.addItem, payload);
  }

  static async updateItem(itemId: string, payload: UpdateCartItemPayload): Promise<ServerCart> {
    return api.patch<ServerCart>(CART_MODULE_CONFIG.endpoints.updateItem(itemId), payload);
  }

  static async removeItem(itemId: string): Promise<ServerCart> {
    return api.delete(CART_MODULE_CONFIG.endpoints.removeItem(itemId));
  }

  static async clearCart(): Promise<void> {
    return api.delete(CART_MODULE_CONFIG.endpoints.clear);
  }
}
