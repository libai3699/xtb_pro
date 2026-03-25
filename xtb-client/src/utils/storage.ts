const USER_KEY = 'xtb_app_user';

export function saveUserStorage(data: unknown) {
  uni.setStorageSync(USER_KEY, data);
}

export function getUserStorage<T>() {
  return (uni.getStorageSync(USER_KEY) || null) as T | null;
}

export function clearUserStorage() {
  uni.removeStorageSync(USER_KEY);
}

