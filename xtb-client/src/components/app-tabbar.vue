<template>
  <view class="tabbar">
    <view
      v-for="item in items"
      :key="item.key"
      :class="['tab-item', item.key === props.current ? 'active' : '']"
      @click="go(item.path)"
    >
      <view class="tab-icon">{{ item.key === props.current ? item.activeIcon : item.icon }}</view>
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
      { key: 'home', label: '工作台', path: '/pages/agent/home', icon: '⌂', activeIcon: '⌂' },
      { key: 'campaign', label: '活动', path: '/pages/campaign/list', icon: '◫', activeIcon: '◩' },
      { key: 'stats', label: '数据', path: '/pages/agent/stats', icon: '◔', activeIcon: '◕' },
      { key: 'my', label: '我的', path: '/pages/my/index', icon: '○', activeIcon: '◉' },
    ];
  }

  return [
    { key: 'home', label: '广场', path: '/pages/student/home', icon: '⌂', activeIcon: '⌂' },
    { key: 'reward', label: '奖励', path: '/pages/reward/index', icon: '✦', activeIcon: '✸' },
    { key: 'news', label: '资讯', path: '/pages/news/list', icon: '◨', activeIcon: '▣' },
    { key: 'my', label: '我的', path: '/pages/my/index', icon: '○', activeIcon: '◉' },
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
  text-align: center;
  padding: 14rpx 8rpx 16rpx;
  color: #64748b;
}

.tab-item.active {
  color: #0f766e;
  font-weight: 700;
}

.tab-icon {
  font-size: 34rpx;
  line-height: 1;
}

.tab-label {
  margin-top: 6rpx;
  font-size: 24rpx;
}
</style>
