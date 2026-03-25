import { request } from './request';

export interface OrderItem {
  id: string;
  orderNo: string;
  studentName: string;
  mobile: string;
  amount: string | number;
  status: number;
  createdAt: string;
  product?: {
    id: string;
    title: string;
    price: string | number;
  };
}

export function createOrder(data: {
  productId: number;
  campaignId?: number;
  agentUserId?: number;
  studentUserId?: number;
  studentName: string;
  mobile: string;
}) {
  return request<{ code: number; message: string; data: OrderItem }>('/app/order/create', {
    method: 'POST',
    data,
  });
}

export function getMyOrders(userId?: string) {
  const query = userId ? `?userId=${userId}` : '';
  return request<{ code: number; message: string; data: OrderItem[] }>(`/app/my/orders${query}`);
}

