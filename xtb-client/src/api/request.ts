const API_BASE_URL = 'http://127.0.0.1:3000/api';

interface RequestOptions {
  method?: 'GET' | 'POST';
  data?: Record<string, unknown>;
}

export function request<T>(url: string, options: RequestOptions = {}) {
  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
      },
      success: (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T);
        } else {
          const data = res.data as { message?: string };
          reject(new Error(data?.message || '请求失败'));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}

