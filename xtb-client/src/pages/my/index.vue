<template>
  <view class="page">
    <view class="profile-card">
      <view class="profile-top">
        <view>
          <view class="name">{{ userStore.nickname || '未命名用户' }}</view>
          <view class="meta">{{ userStore.role === 'agent' ? '代理身份' : '学生身份' }}</view>
        </view>
        <view class="tag">{{ userStore.role === 'agent' ? 'Agent' : 'Student' }}</view>
      </view>
      <view class="info-line">手机号：{{ userStore.mobile || '-' }}</view>
      <view v-if="userStore.role === 'agent'" class="info-line">浏览量：{{ stats.pv }}</view>
      <view v-if="userStore.role === 'agent'" class="info-line">留资 / 订单：{{ stats.leadCount }} / {{ stats.orderCount }}</view>
    </view>

    <view class="menu-card" @click="goRoleHomePage">
      <view class="menu-title">返回首页</view>
      <view class="menu-desc">回到当前身份首页</view>
    </view>

    <view class="menu-card" @click="goOrders">
      <view class="menu-title">我的订单</view>
      <view class="menu-desc">查看报名和支付状态</view>
    </view>

    <view class="menu-card danger" @click="logout">
      <view class="menu-title">退出登录</view>
      <view class="menu-desc">清空本地登录态并返回登录页</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getMyAgentStats } from '@/api/agent';
import { useUserStore } from '@/store/user';
import { goRoleHome, redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const stats = reactive({
  pv: 0,
  leadCount: 0,
  orderCount: 0,
  paidAmount: 0,
});

async function fetchStats() {
  if (userStore.role !== 'agent') {
    return;
  }
  try {
    const res = await getMyAgentStats(userStore.id);
    Object.assign(stats, res.data);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取统计失败', icon: 'none' });
  }
}

function goRoleHomePage() {
  goRoleHome(userStore.role);
}

function goOrders() {
  uni.navigateTo({ url: '/pages/order/list' });
}

function logout() {
  userStore.logout();
  redirectToLogin();
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/my/index');
    return;
  }
  fetchStats();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f7fb;
}

.profile-card,
.menu-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 26rpx;
  margin-bottom: 16rpx;
}

.profile-card {
  background: linear-gradient(135deg, #111827 0%, #334155 100%);
  color: #fff;
}

.profile-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
}

.name {
  font-size: 34rpx;
  font-weight: 700;
}

.meta {
  margin-top: 10rpx;
  font-size: 24rpx;
  opacity: 0.86;
}

.tag {
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.14);
  font-size: 22rpx;
}

.info-line {
  margin-bottom: 10rpx;
  font-size: 24rpx;
  opacity: 0.9;
}

.menu-title {
  font-size: 28rpx;
  font-weight: 700;
}

.menu-desc {
  margin-top: 10rpx;
  color: #64748b;
  font-size: 24rpx;
}

.danger {
  color: #dc2626;
}
</style>
