import { request } from './request';

export interface ContentArticleItem {
  id: string;
  type: 'news' | 'help';
  title: string;
  summary?: string;
  cover?: string;
  category?: string;
  content?: string;
  sort: number;
  status: number;
  publishedAt?: string;
  createdAt: string;
}

export interface ContentArticleFormData {
  type: 'news' | 'help';
  title: string;
  summary?: string;
  cover?: string;
  category?: string;
  content?: string;
  sort?: number;
  status?: number;
  publishedAt?: string;
}

export function getContentList(type?: 'news' | 'help') {
  const query = type ? `?type=${type}` : '';
  return request<{ code: number; message: string; data: ContentArticleItem[] }>(`/admin/content/list${query}`);
}

export function createContent(body: ContentArticleFormData) {
  return request<{ code: number; message: string; data: ContentArticleItem }>('/admin/content/create', {
    method: 'POST',
    body,
  });
}

export function updateContent(id: string, body: ContentArticleFormData) {
  return request<{ code: number; message: string; data: ContentArticleItem }>(`/admin/content/update/${id}`, {
    method: 'POST',
    body,
  });
}

export function deleteContent(id: string) {
  return request<{ code: number; message: string }>(`/admin/content/delete/${id}`, {
    method: 'POST',
  });
}
