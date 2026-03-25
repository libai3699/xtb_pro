import { request } from './request';

export interface ProductItem {
  id: string;
  campaignId: string;
  title: string;
  price: string | number;
  originalPrice?: string | number;
  cover?: string;
  description?: string;
  status: number;
  createdAt: string;
  campaign?: {
    id: string;
    title: string;
  };
}

export interface ProductPayload {
  campaignId: number;
  title: string;
  price: number;
  originalPrice?: number;
  cover?: string;
  description?: string;
}

export function getProductList() {
  return request<{ code: number; message: string; data: ProductItem[] }>('/admin/product/list');
}

export function createProduct(payload: ProductPayload) {
  return request<{ code: number; message: string; data: ProductItem }>('/admin/product/create', {
    method: 'POST',
    body: payload,
  });
}

