import { request } from './request';

export interface RewardGoodsItem {
  id: string;
  title: string;
  cover?: string;
  points: number;
  stock: number;
  description?: string;
  sort: number;
  status: number;
  createdAt: string;
}

export interface RewardRedeemOrderItem {
  id: string;
  orderNo: string;
  userId: string;
  goodsId: string;
  points: number;
  status: number;
  createdAt: string;
  user?: {
    id: string;
    nickname?: string;
    account?: string;
    mobile?: string;
  };
  goods?: RewardGoodsItem;
}

export interface RewardGoodsFormData {
  title: string;
  cover?: string;
  points?: number;
  stock?: number;
  description?: string;
  sort?: number;
  status?: number;
}

export interface MessageItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: string;
  isRead: number;
  createdAt: string;
  user?: {
    id: string;
    nickname?: string;
    account?: string;
    role: string;
  };
}

export interface CertificateItem {
  id: string;
  userId: string;
  productId?: string;
  title: string;
  issuer?: string;
  cover?: string;
  fileUrl?: string;
  issuedAt?: string;
  status: number;
  createdAt: string;
  user?: {
    id: string;
    nickname?: string;
    account?: string;
  };
  product?: {
    id: string;
    title: string;
  };
}

export interface LearningRecordItem {
  id: string;
  userId: string;
  title: string;
  progress: number;
  durationMinutes: number;
  lastStudyAt?: string;
  user?: {
    id: string;
    nickname?: string;
    account?: string;
  };
  product?: {
    id: string;
    title: string;
  };
}

export interface FeedbackItem {
  id: string;
  userId?: string;
  type: string;
  content: string;
  contact?: string;
  status: number;
  createdAt: string;
  user?: {
    id: string;
    nickname?: string;
    account?: string;
  };
}

export interface AgentReviewItem {
  id: string;
  agentUserId: string;
  score: number;
  content?: string;
  status: number;
  createdAt: string;
  agentUser?: {
    id: string;
    nickname?: string;
    account?: string;
  };
}

export function getRewardGoodsListAdmin() {
  return request<{ code: number; message: string; data: RewardGoodsItem[] }>('/admin/reward-goods/list');
}

export function createRewardGoods(body: RewardGoodsFormData) {
  return request<{ code: number; message: string; data: RewardGoodsItem }>('/admin/reward-goods/create', {
    method: 'POST',
    body,
  });
}

export function getRewardRedeemOrderListAdmin() {
  return request<{ code: number; message: string; data: RewardRedeemOrderItem[] }>('/admin/reward-redeem-order/list');
}

export function updateRewardRedeemOrderStatus(id: string | number, status: number) {
  return request<{ code: number; message: string; data: RewardRedeemOrderItem }>(`/admin/reward-redeem-order/update-status/${id}`, {
    method: 'POST',
    body: { status },
  });
}

export function getMessageListAdmin(userId?: string) {
  const query = userId ? `?userId=${userId}` : '';
  return request<{ code: number; message: string; data: MessageItem[] }>(`/admin/message/list${query}`);
}

export function createMessage(body: {
  userId: number;
  title: string;
  content: string;
  type?: string;
  bizType?: string;
  bizId?: number;
}) {
  return request<{ code: number; message: string; data: MessageItem }>('/admin/message/create', {
    method: 'POST',
    body,
  });
}

export function getCertificateListAdmin(userId?: string) {
  const query = userId ? `?userId=${userId}` : '';
  return request<{ code: number; message: string; data: CertificateItem[] }>(`/admin/certificate/list${query}`);
}

export function createCertificate(body: {
  userId: number;
  productId?: number;
  title: string;
  issuer?: string;
  cover?: string;
  fileUrl?: string;
  issuedAt?: string;
  status?: number;
}) {
  return request<{ code: number; message: string; data: CertificateItem }>('/admin/certificate/create', {
    method: 'POST',
    body,
  });
}

export function getLearningRecordListAdmin(userId?: string) {
  const query = userId ? `?userId=${userId}` : '';
  return request<{ code: number; message: string; data: LearningRecordItem[] }>(`/admin/learning-record/list${query}`);
}

export function getFeedbackListAdmin() {
  return request<{ code: number; message: string; data: FeedbackItem[] }>('/admin/feedback/list');
}

export function getAgentReviewListAdmin() {
  return request<{ code: number; message: string; data: AgentReviewItem[] }>('/admin/agent-review/list');
}
