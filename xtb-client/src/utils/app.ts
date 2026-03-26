import type { UserRole } from '@/store/user';
import { saveRedirectUrl } from './storage';

export function buildCampaignDetailPath(campaignId: string | number, agentUserId?: string | number) {
  const query = [`id=${campaignId}`];
  if (agentUserId) {
    query.push(`agentUserId=${agentUserId}`);
  }
  return `/pages/campaign/detail?${query.join('&')}`;
}

export function goRoleHome(role: UserRole) {
  uni.reLaunch({
    url: role === 'agent' ? '/pages/agent/home' : '/pages/student/home',
  });
}

export function redirectToLogin(redirectUrl?: string) {
  if (redirectUrl) {
    saveRedirectUrl(redirectUrl);
  }
  uni.reLaunch({
    url: '/pages/index/index',
  });
}

export function buildH5CampaignShareUrl(campaignId: string | number, agentUserId?: string | number) {
  const path = buildCampaignDetailPath(campaignId, agentUserId);
  if (typeof window === 'undefined') {
    return path;
  }
  return `${window.location.origin}${window.location.pathname}#${path}`;
}
