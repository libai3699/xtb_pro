import type { UploadRequestOptions } from 'element-plus';
import { getAdminToken } from '@/utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api';

interface UploadResponse {
  code: number;
  message: string;
  data: {
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    path: string;
    url: string;
  };
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

export async function uploadImage(file: File) {
  const token = getAdminToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/admin/upload/image`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = (await response.json().catch(() => ({}))) as UploadResponse | { message?: string | string[]; error?: string };

  if (!response.ok) {
    throw new Error(normalizeErrorMessage(data));
  }

  const result = data as UploadResponse;
  if (result.code !== 0) {
    throw new Error(normalizeErrorMessage(result));
  }

  return result.data;
}

export async function uploadImageByRequest(options: UploadRequestOptions) {
  try {
    const result = await uploadImage(options.file as File);
    options.onSuccess?.(result);
    return result;
  } catch (error) {
    options.onError?.(error as never);
    throw error;
  }
}
