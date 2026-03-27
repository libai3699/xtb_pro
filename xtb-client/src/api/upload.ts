import { getUserStorage } from '@/utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api';

interface UploadResult {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
  url: string;
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

  return '上传失败';
}

export function uploadAppImage(filePath: string) {
  return new Promise<UploadResult>((resolve, reject) => {
    const user = getUserStorage<{ token?: string }>();

    uni.uploadFile({
      url: `${API_BASE_URL}/app/upload/image`,
      filePath,
      name: 'file',
      header: {
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
      },
      success: (res) => {
        const data = JSON.parse(res.data || '{}') as { code?: number; message?: string | string[]; error?: string; data?: UploadResult };
        if (res.statusCode >= 200 && res.statusCode < 300 && data.code === 0 && data.data) {
          resolve(data.data);
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
