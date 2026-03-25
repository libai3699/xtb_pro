import { defineStore } from 'pinia';
import { clearUserStorage, getUserStorage, saveUserStorage } from '@/utils/storage';

export type UserRole = 'agent' | 'student';

interface StoredUser {
  id: string;
  role: UserRole;
  token: string;
  nickname: string;
  mobile?: string;
}

const storageUser = getUserStorage<StoredUser>();

export const useUserStore = defineStore('user', {
  state: () => ({
    id: storageUser?.id || '',
    role: storageUser?.role || ('student' as UserRole),
    token: storageUser?.token || '',
    nickname: storageUser?.nickname || '',
    mobile: storageUser?.mobile || '',
  }),
  actions: {
    setRole(role: UserRole) {
      this.role = role;
      this.persist();
    },
    setUser(payload: { id: string; role: UserRole; token: string; nickname?: string; mobile?: string }) {
      this.id = payload.id;
      this.role = payload.role;
      this.token = payload.token;
      this.nickname = payload.nickname || '';
      this.mobile = payload.mobile || '';
      this.persist();
    },
    logout() {
      this.id = '';
      this.role = 'student';
      this.token = '';
      this.nickname = '';
      this.mobile = '';
      clearUserStorage();
    },
    persist() {
      saveUserStorage({
        id: this.id,
        role: this.role,
        token: this.token,
        nickname: this.nickname,
        mobile: this.mobile,
      });
    },
  },
});
