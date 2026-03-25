import { request } from './request';

export function getMyAgentStats(userId?: string) {
  const query = userId ? `?userId=${userId}` : '';
  return request<{
    code: number;
    message: string;
    data: {
      pv: number;
      uv: number;
      leadCount: number;
      orderCount: number;
      paidAmount: string | number;
    };
  }>(`/app/my/stats${query}`);
}

