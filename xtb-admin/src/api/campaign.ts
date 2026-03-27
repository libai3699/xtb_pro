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
  _count?: {
    leads: number;
    orders: number;
    shares: number;
  };
}

export interface CampaignPayload {
  title: string;
  campaignType?: string;
  targetCount?: number;
  location?: string;
  cover?: string;
  description?: string;
  requirement?: string;
  rewardDesc?: string;
  formConfig?: Record<string, unknown>;
  startTime?: string;
  endTime?: string;
  status?: 0 | 1 | 2;
}

export function getCampaignList() {
  return request<{ code: number; message: string; data: CampaignItem[] }>('/admin/campaign/list');
}

export function createCampaign(payload: CampaignPayload) {
  return request<{ code: number; message: string; data: CampaignItem }>('/admin/campaign/create', {
    method: 'POST',
    body: payload,
  });
}
