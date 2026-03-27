import { request } from './request';

export interface ContentArticleItem {
  id: string;
  type: 'news' | 'help';
  title: string;
  summary?: string;
  cover?: string;
  category?: string;
  content?: string;
  publishedAt?: string;
  createdAt: string;
}

export function getContentList(type: 'news' | 'help') {
  return request<{ code: number; message: string; data: ContentArticleItem[] }>(`/app/content/list?type=${type}`);
}

export function getContentDetail(id: string | number) {
  return request<{ code: number; message: string; data: ContentArticleItem }>(`/app/content/detail/${id}`);
}
