import { request } from './request';

export interface OrderItem {
  id: string;
  orderNo: string;
  studentName: string;
  mobile: string;
  amount: string | number;
  status: number;
  payTime?: string;
  createdAt: string;
  campaign?: {
    id: string;
    title: string;
  };
  product?: {
    id: string;
    title: string;
    price: string | number;
  };
  agentUser?: {
    id: string;
    nickname?: string;
    mobile?: string;
  };
}

export function getOrderList() {
  return request<{ code: number; message: string; data: OrderItem[] }>('/admin/order/list');
}

