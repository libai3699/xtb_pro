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

export interface ShareRecordItem {
  id: string;
  campaignId: string;
  agentUserId: string;
  shareCode: string;
  shareUrl?: string;
  pv: number;
  uv: number;
  leadCount: number;
  orderCount: number;
  updatedAt: string;
  campaign?: {
    id: string;
    title: string;
    cover?: string;
    rewardDesc?: string;
  };
}

export function getCampaignList() {
  return request<{ code: number; message: string; data: CampaignItem[] }>('/app/campaign/list');
}

export function getCampaignDetail(id: string | number) {
  return request<{ code: number; message: string; data: CampaignItem }>(`/app/campaign/detail/${id}`);
}

export function createShareRecord(data: { campaignId: number; agentUserId: number; shareUrl?: string }) {
  return request<{ code: number; message: string; data: ShareRecordItem }>('/app/share/create', {
    method: 'POST',
    data,
  });
}

export function visitShareRecord(data: { campaignId: number; agentUserId: number }) {
  return request<{ code: number; message: string; data: ShareRecordItem }>('/app/share/visit', {
    method: 'POST',
    data,
  });
}

export function getShareList(userId: string | number) {
  return request<{ code: number; message: string; data: ShareRecordItem[] }>(`/app/share/list/${userId}`);
}
