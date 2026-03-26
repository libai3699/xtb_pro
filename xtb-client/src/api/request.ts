import { getUserStorage } from '@/utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api';

interface RequestOptions {
  method?: 'GET' | 'POST';
  data?: Record<string, unknown>;
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
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          const data = res.data as { code?: number; message?: string };
          if (typeof data.code === 'number' && data.code !== 0) {
            reject(new Error(data.message || '请求失败'));
            return;
          }
          resolve(res.data as T);
          return;
        }

        const data = res.data as { message?: string };
        reject(new Error(data?.message || '请求失败'));
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}
