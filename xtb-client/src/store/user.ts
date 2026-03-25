import { defineStore } from 'pinia';

export type UserRole = 'agent' | 'student';

export const useUserStore = defineStore('user', {
  state: () => ({
    role: 'student' as UserRole,
    token: '',
    nickname: '',
  }),
  actions: {
    setRole(role: UserRole) {
      this.role = role;
    },
  },
});

