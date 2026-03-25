const ADMIN_TOKEN_KEY = 'xtb_admin_token';
const ADMIN_USER_KEY = 'xtb_admin_user';

export interface AdminUserInfo {
  id: string;
  username: string;
  name: string;
  role: string;
  mobile?: string;
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getAdminUser() {
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  return raw ? (JSON.parse(raw) as AdminUserInfo) : null;
}

export function setAdminUser(user: AdminUserInfo) {
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminUser() {
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function clearAdminSession() {
  clearAdminToken();
  clearAdminUser();
}

