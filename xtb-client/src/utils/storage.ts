const USER_KEY = 'xtb_app_user';
const REDIRECT_KEY = 'xtb_redirect_url';
const REFERRAL_KEY = 'xtb_campaign_referrals';

export interface CampaignReferral {
  campaignId: string;
  agentUserId: string;
}

export function saveUserStorage(data: unknown) {
  uni.setStorageSync(USER_KEY, data);
}

export function getUserStorage<T>() {
  return (uni.getStorageSync(USER_KEY) || null) as T | null;
}

export function clearUserStorage() {
  uni.removeStorageSync(USER_KEY);
}

export function saveRedirectUrl(url: string) {
  uni.setStorageSync(REDIRECT_KEY, url);
}

export function consumeRedirectUrl() {
  const url = uni.getStorageSync(REDIRECT_KEY) as string;
  if (url) {
    uni.removeStorageSync(REDIRECT_KEY);
  }
  return url || '';
}

export function saveCampaignReferral(referral: CampaignReferral) {
  const current = getCampaignReferralMap();
  current[referral.campaignId] = referral;
  uni.setStorageSync(REFERRAL_KEY, current);
}

export function getCampaignReferral(campaignId: string) {
  const current = getCampaignReferralMap();
  return current[campaignId] || null;
}

function getCampaignReferralMap() {
  return (uni.getStorageSync(REFERRAL_KEY) || {}) as Record<string, CampaignReferral>;
}
