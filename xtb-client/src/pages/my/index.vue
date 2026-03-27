<template>
  <view class="page">
    <template v-if="userStore.role === 'student'">
      <view class="profile-header">
        <view class="avatar">{{ (userStore.nickname || 'U').slice(0, 1) }}</view>
        <view class="user-name">{{ userStore.nickname || '未命名用户' }}</view>
        <view class="user-meta">{{ userStore.account || '-' }} · {{ userStore.mobile || '未绑定手机号' }}</view>
      </view>

      <view class="stats-section">
        <view class="stat-item">
          <view class="stat-value">{{ stats.orderCount }}</view>
          <view class="stat-label">我的活动</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ stats.favoriteCount }}</view>
          <view class="stat-label">我的收藏</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ stats.points }}</view>
          <view class="stat-label">我的积分</view>
        </view>
      </view>

      <view class="section-title">常用功能</view>
      <view class="menu-grid">
        <view class="menu-item" @click="go('/pages/order/list')">
          <view class="menu-icon">活</view>
          <view class="menu-label">我的活动</view>
        </view>
        <view class="menu-item" @click="go('/pages/reward/orders')">
          <view class="menu-icon">兑</view>
          <view class="menu-label">兑换记录</view>
        </view>
        <view class="menu-item" @click="go('/pages/certificate/list')">
          <view class="menu-icon">证</view>
          <view class="menu-label">我的证书</view>
        </view>
        <view class="menu-item" @click="go('/pages/favorite/list')">
          <view class="menu-icon">藏</view>
          <view class="menu-label">我的收藏</view>
        </view>
        <view class="menu-item" @click="go('/pages/learning/list')">
          <view class="menu-icon">学</view>
          <view class="menu-label">学习记录</view>
        </view>
        <view class="menu-item" @click="go('/pages/settings/index')">
          <view class="menu-icon">设</view>
          <view class="menu-label">设置</view>
        </view>
      </view>
    </template>

    <template v-else>
      <view class="profile-header agent">
        <view class="avatar">{{ (userStore.nickname || 'A').slice(0, 1) }}</view>
        <view class="user-name">{{ userStore.nickname || '代理用户' }}</view>
        <view class="user-meta">{{ userStore.account || '-' }} · 代理身份</view>
      </view>

      <view class="stats-section">
        <view class="stat-item">
          <view class="stat-value">{{ agentStats.pv }}</view>
          <view class="stat-label">浏览</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ agentStats.leadCount }}</view>
          <view class="stat-label">留资</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ agentStats.orderCount }}</view>
          <view class="stat-label">订单</view>
        </view>
      </view>

      <view class="section-title">代理工具</view>
      <view class="menu-grid">
        <view class="menu-item" @click="go('/pages/agent/home')">
          <view class="menu-icon">台</view>
          <view class="menu-label">工作台</view>
        </view>
        <view class="menu-item" @click="go('/pages/agent/stats')">
          <view class="menu-icon">数</view>
          <view class="menu-label">推广数据</view>
        </view>
        <view class="menu-item" @click="go('/pages/share/list')">
          <view class="menu-icon">推</view>
          <view class="menu-label">推广记录</view>
        </view>
        <view class="menu-item" @click="go('/pages/message/list')">
          <view class="menu-icon">信</view>
          <view class="menu-label">消息通知</view>
        </view>
        <view class="menu-item" @click="go('/pages/help/list')">
          <view class="menu-icon">助</view>
          <view class="menu-label">帮助中心</view>
        </view>
        <view class="menu-item" @click="go('/pages/settings/index')">
          <view class="menu-icon">设</view>
          <view class="menu-label">设置</view>
        </view>
      </view>
    </template>

    <view class="settings-list">
      <view class="list-item" @click="go('/pages/message/list')">
        <view class="list-title">消息中心</view>
        <view class="list-desc">系统通知、活动提醒、奖励消息</view>
      </view>
      <view class="list-item" @click="go('/pages/help/list')">
        <view class="list-title">帮助中心</view>
        <view class="list-desc">常见问题与参与说明</view>
      </view>
      <view class="list-item" @click="go('/pages/feedback/create')">
        <view class="list-title">意见反馈</view>
        <view class="list-desc">提交问题、建议和使用体验</view>
      </view>
    </view>

    <button class="logout-btn" @click="logout">退出登录</button>

    <app-tabbar current="my" />
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppTabbar from '@/components/app-tabbar.vue';
import { getMyAgentStats } from '@/api/agent';
import { getFavoriteList, getRewardOverview } from '@/api/growth';
import { getMyOrders } from '@/api/order';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const stats = reactive({
  orderCount: 0,
  favoriteCount: 0,
  points: 0,
});
const agentStats = reactive({
  pv: 0,
  leadCount: 0,
  orderCount: 0,
});

function go(url: string) {
  uni.navigateTo({ url });
}

function logout() {
  userStore.logout();
  redirectToLogin();
}

async function fetchStudentStats() {
  try {
    const [orderRes, favoriteRes, rewardRes] = await Promise.all([
      getMyOrders(userStore.id),
      getFavoriteList(userStore.id),
      getRewardOverview(userStore.id),
    ]);
    stats.orderCount = orderRes.data.length;
    stats.favoriteCount = favoriteRes.data.length;
    stats.points = rewardRes.data.points;
  } catch {
    stats.orderCount = 0;
    stats.favoriteCount = 0;
    stats.points = 0;
  }
}

async function fetchAgentStats() {
  try {
    const res = await getMyAgentStats(userStore.id);
    Object.assign(agentStats, res.data);
  } catch {
    agentStats.pv = 0;
    agentStats.leadCount = 0;
    agentStats.orderCount = 0;
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/my/index');
    return;
  }

  if (userStore.role === 'agent') {
    fetchAgentStats();
  } else {
    fetchStudentStats();
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 0 24rpx 140rpx;
  background: #f6f6f8;
}

.profile-header {
  margin: 24rpx 0 0;
  border-radius: 0 0 32rpx 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 34rpx 24rpx 36rpx;
  text-align: center;
}

.profile-header.agent {
  background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  margin: 0 auto 18rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  font-size: 42rpx;
  font-weight: 700;
  line-height: 120rpx;
}

.user-name {
  font-size: 36rpx;
  font-weight: 700;
}

.user-meta {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-top: -18rpx;
}

.stat-item,
.menu-item,
.list-item {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.05);
}

.stat-item {
  padding: 20rpx 12rpx;
  text-align: center;
}

.stat-value {
  font-size: 34rpx;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #6b7280;
}

.section-title {
  margin: 26rpx 0 16rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.menu-item {
  padding: 18rpx 10rpx;
  text-align: center;
}

.menu-icon {
  width: 64rpx;
  height: 64rpx;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 26rpx;
  font-weight: 700;
  line-height: 64rpx;
}

.menu-label {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #475569;
}

.settings-list {
  margin-top: 24rpx;
}

.list-item {
  padding: 22rpx 24rpx;
  margin-bottom: 16rpx;
}

.list-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #1f2937;
}

.list-desc {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.logout-btn {
  margin-top: 12rpx;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 18rpx;
}
</style>
