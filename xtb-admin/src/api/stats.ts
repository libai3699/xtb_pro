import { request } from './request';

export interface StatsOverview {
  campaignCount: number;
  agentCount: number;
  leadCount: number;
  orderCount: number;
  paidAmount: string | number;
}

export function getStatsOverview() {
  return request<{ code: number; message: string; data: StatsOverview }>('/admin/stats/overview');
}

