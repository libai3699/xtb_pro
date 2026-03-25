import { request } from './request';

export interface CampaignItem {
  id: string;
  title: string;
  cover?: string;
  description?: string;
  rewardDesc?: string;
  status: number;
  createdAt: string;
  products?: ProductItem[];
  _count?: {
    leads: number;
    orders: number;
    shares: number;
  };
}

export interface ProductItem {
  id: string;
  title: string;
  price: string | number;
  originalPrice?: string | number;
  description?: string;
}

export function getCampaignList() {
  return request<{ code: number; message: string; data: CampaignItem[] }>('/app/campaign/list');
}

export function getCampaignDetail(id: string | number) {
  return request<{ code: number; message: string; data: CampaignItem }>(`/app/campaign/detail/${id}`);
}

