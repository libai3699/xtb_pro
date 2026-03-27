import { request } from './request';

export interface CampaignItem {
  id: string;
  title: string;
  campaignType?: string;
  targetCount?: number;
  location?: string;
  cover?: string;
  description?: string;
  requirement?: string;
  rewardDesc?: string;
  status: number;
  createdAt: string;
  startTime?: string;
  endTime?: string;
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

export interface CampaignCreatePayload {
  title: string;
  campaignType?: string;
  targetCount?: number;
  location?: string;
  cover?: string;
  description?: string;
  requirement?: string;
  rewardDesc?: string;
  startTime?: string;
  endTime?: string;
  formConfig?: Record<string, unknown>;
}

export function getCampaignList() {
  return request<{ code: number; message: string; data: CampaignItem[] }>('/app/campaign/list');
}

export function getCampaignDetail(id: string | number) {
  return request<{ code: number; message: string; data: CampaignItem }>(`/app/campaign/detail/${id}`);
}

export function createAppCampaign(data: CampaignCreatePayload) {
  return request<{ code: number; message: string; data: CampaignItem }>('/app/campaign/create', {
    method: 'POST',
    data,
  });
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
