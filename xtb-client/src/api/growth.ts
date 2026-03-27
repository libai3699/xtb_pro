import { request } from './request';

export interface RewardGoodsItem {
  id: string;
  title: string;
  cover?: string;
  points: number;
  stock: number;
  description?: string;
}

export interface PointRecordItem {
  id: string;
  type: string;
  changeValue: number;
  balanceValue: number;
  remark?: string;
  createdAt: string;
}

export interface RedeemOrderItem {
  id: string;
  orderNo: string;
  goodsId?: string;
  points: number;
  status: number;
  createdAt: string;
  goods?: RewardGoodsItem;
}

export interface MessageItem {
  id: string;
  type: string;
  title: string;
  content: string;
  isRead: number;
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  targetType: 'campaign' | 'article';
  targetId: string;
  createdAt: string;
  target?: Record<string, unknown> | null;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer?: string;
  cover?: string;
  fileUrl?: string;
  issuedAt?: string;
}

export interface LearningRecordItem {
  id: string;
  title: string;
  cover?: string;
  progress: number;
  durationMinutes: number;
  lastStudyAt?: string;
}

export interface RewardOverviewData {
  points: number;
  redeemCount: number;
  unreadMessageCount: number;
  goodsList: RewardGoodsItem[];
}

export function getRewardOverview(userId: string | number) {
  return request<{ code: number; message: string; data: RewardOverviewData }>(`/app/reward/overview?userId=${userId}`);
}

export function getRewardGoodsList() {
  return request<{ code: number; message: string; data: RewardGoodsItem[] }>('/app/reward/goods');
}

export function getPointRecordList(userId: string | number) {
  return request<{ code: number; message: string; data: PointRecordItem[] }>(`/app/reward/records?userId=${userId}`);
}

export function getRedeemOrderList(userId: string | number) {
  return request<{ code: number; message: string; data: RedeemOrderItem[] }>(`/app/reward/redeem-orders?userId=${userId}`);
}

export function redeemReward(userId: string | number, goodsId: string | number) {
  return request<{ code: number; message: string; data: RedeemOrderItem }>('/app/reward/redeem', {
    method: 'POST',
    data: {
      userId: Number(userId),
      goodsId: Number(goodsId),
    },
  });
}

export function getMessageList(userId: string | number) {
  return request<{ code: number; message: string; data: MessageItem[] }>(`/app/message/list?userId=${userId}`);
}

export function readMessage(id: string | number) {
  return request<{ code: number; message: string; data: MessageItem }>(`/app/message/read/${id}`, {
    method: 'POST',
  });
}

export function getFavoriteList(userId: string | number, targetType?: 'campaign' | 'article') {
  const query = targetType ? `&targetType=${targetType}` : '';
  return request<{ code: number; message: string; data: FavoriteItem[] }>(`/app/favorite/list?userId=${userId}${query}`);
}

export function toggleFavorite(userId: string | number, targetType: 'campaign' | 'article', targetId: string | number) {
  return request<{ code: number; message: string; data: { favorited: boolean } }>('/app/favorite/toggle', {
    method: 'POST',
    data: {
      userId: Number(userId),
      targetType,
      targetId: Number(targetId),
    },
  });
}

export function getCertificateList(userId: string | number) {
  return request<{ code: number; message: string; data: CertificateItem[] }>(`/app/certificate/list?userId=${userId}`);
}

export function getLearningRecordList(userId: string | number) {
  return request<{ code: number; message: string; data: LearningRecordItem[] }>(`/app/learning-record/list?userId=${userId}`);
}

export function getAgentReviewList(userId: string | number) {
  return request<{ code: number; message: string; data: Array<{ id: string; score: number; content?: string; createdAt: string }> }>(
    `/app/agent-review/list?userId=${userId}`,
  );
}

export function createFeedback(data: { userId?: string | number; type?: string; content: string; contact?: string }) {
  return request<{ code: number; message: string; data: { id: string } }>('/app/feedback/create', {
    method: 'POST',
    data: {
      userId: data.userId ? Number(data.userId) : undefined,
      type: data.type,
      content: data.content,
      contact: data.contact,
    },
  });
}
