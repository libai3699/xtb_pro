<template>
  <view class="tabbar">
    <view
      v-for="item in items"
      :key="item.key"
      :class="['tab-item', item.key === props.current ? 'active' : '']"
      @click="go(item.path)"
    >
      <up-icon :name="item.icon" :size="22" :color="item.key === props.current ? '#6e79e5' : '#94a3b8'" />
      <view class="tab-label">{{ item.label }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';

const props = defineProps<{ current: string }>();
const userStore = useUserStore();

const items = computed(() => {
  if (userStore.role === 'agent') {
    return [
      { key: 'home', label: '首页', path: '/pages/agent/home', icon: 'home-fill' },
      { key: 'campaign', label: '任务', path: '/pages/campaign/list', icon: 'list-dot' },
      { key: 'stats', label: '数据', path: '/pages/agent/stats', icon: 'grid-fill' },
      { key: 'my', label: '我的', path: '/pages/my/index', icon: 'account-fill' },
    ];
  }

  return [
    { key: 'home', label: '广场', path: '/pages/student/home', icon: 'home-fill' },
    { key: 'reward', label: '奖励', path: '/pages/reward/index', icon: 'gift-fill' },
    { key: 'news', label: '资讯', path: '/pages/news/list', icon: 'file-text-fill' },
    { key: 'my', label: '我的', path: '/pages/my/index', icon: 'account-fill' },
  ];
});

function go(path: string) {
  uni.reLaunch({ url: path });
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: rgba(255, 255, 255, 0.98);
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -8rpx 24rpx rgba(15, 23, 42, 0.04);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 30;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  padding: 14rpx 8rpx 16rpx;
  color: #94a3b8;
}

.tab-item.active {
  color: #6e79e5;
}

.tab-label {
  font-size: 24rpx;
  font-weight: 500;
}

.tab-item.active .tab-label {
  font-weight: 700;
}
</style>
