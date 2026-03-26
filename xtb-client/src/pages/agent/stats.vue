<template>
  <view class="page">
    <view class="hero">
      <view class="title">代理数据中心</view>
      <view class="sub">查看当前推广带来的浏览、留资和订单情况。</view>
    </view>

    <view class="stats-grid">
      <view class="stat-card">
        <view class="stat-value">{{ stats.pv }}</view>
        <view class="stat-label">浏览量</view>
      </view>
      <view class="stat-card">
        <view class="stat-value">{{ stats.uv }}</view>
        <view class="stat-label">访客数</view>
      </view>
      <view class="stat-card">
        <view class="stat-value">{{ stats.leadCount }}</view>
        <view class="stat-label">留资数</view>
      </view>
      <view class="stat-card">
        <view class="stat-value">{{ stats.orderCount }}</view>
        <view class="stat-label">订单数</view>
      </view>
    </view>

    <view class="summary-card">
      <view class="summary-title">成交额</view>
      <view class="summary-value">￥{{ stats.paidAmount }}</view>
      <view class="summary-text">后续接入真实分享点击上报后，这里的数据会更加完整。</view>
    </view>

    <app-tabbar current="stats" />
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppTabbar from '@/components/app-tabbar.vue';
import { getMyAgentStats } from '@/api/agent';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const stats = reactive({
  pv: 0,
  uv: 0,
  leadCount: 0,
  orderCount: 0,
  paidAmount: 0,
});

async function fetchStats() {
  try {
    const res = await getMyAgentStats(userStore.id);
    Object.assign(stats, res.data);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取统计失败', icon: 'none' });
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/agent/stats');
    return;
  }
  if (userStore.role !== 'agent') {
    uni.reLaunch({ url: '/pages/student/home' });
    return;
  }
  fetchStats();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 140rpx;
  background: #f5f7fb;
}

.hero {
  border-radius: 28rpx;
  padding: 34rpx 30rpx;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #fff;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
}

.sub {
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 1.7;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-top: 20rpx;
}

.stat-card,
.summary-card {
  background: #fff;
  border-radius: 22rpx;
  padding: 24rpx;
}

.stat-value,
.summary-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #0f766e;
}

.stat-label {
  margin-top: 10rpx;
  color: #64748b;
  font-size: 24rpx;
}

.summary-card {
  margin-top: 18rpx;
}

.summary-title {
  font-size: 28rpx;
  font-weight: 700;
}

.summary-value {
  margin-top: 12rpx;
}

.summary-text {
  margin-top: 12rpx;
  color: #64748b;
  line-height: 1.7;
  font-size: 24rpx;
}
</style>
