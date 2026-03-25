const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api';

type RequestMethod = 'GET' | 'POST';

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
}

export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error((data as { message?: string }).message || '请求失败');
  }

  return data;
}

