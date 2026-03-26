import { getUserStorage } from '@/utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api';

interface RequestOptions {
  method?: 'GET' | 'POST';
  data?: Record<string, unknown>;
}

function normalizeErrorMessage(data: unknown) {
  const payload = data as { code?: number; message?: string | string[]; error?: string };

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

export function request<T>(url: string, options: RequestOptions = {}) {
  return new Promise<T>((resolve, reject) => {
    const user = getUserStorage<{ token?: string }>();

    uni.request({
      url: `${API_BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
      },
      success: (res) => {
        const data = res.data as { code?: number; message?: string | string[]; error?: string };

        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          if (typeof data.code === 'number' && data.code !== 0) {
            reject(new Error(normalizeErrorMessage(data)));
            return;
          }
          resolve(res.data as T);
          return;
        }

        reject(new Error(normalizeErrorMessage(data)));
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}
