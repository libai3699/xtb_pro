import { getAdminToken } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api';

type RequestMethod = 'GET' | 'POST';

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
}

function normalizeErrorMessage(data: unknown) {
  const payload = data as { message?: string | string[]; error?: string };

  if (Array.isArray(payload?.message)) {
    return payload.message.join('；');
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload?.error === 'string' && payload.error.trim()) {
    return payload.error;
  }

  return '请求失败';
}

export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(normalizeErrorMessage(data));
  }

  return data as T;
}
