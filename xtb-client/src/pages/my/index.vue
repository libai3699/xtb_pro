<template>
  <view class="page">
    <view class="card">
      <view class="title">我的资料</view>
      <view class="text">身份：{{ userStore.role === 'agent' ? '代理' : '学生' }}</view>
      <view class="text">昵称：{{ userStore.nickname || '-' }}</view>
      <view class="text">手机号：{{ userStore.mobile || '-' }}</view>
    </view>

    <view class="card" @click="goOrders">我的订单</view>
    <view class="card danger" @click="logout">退出登录</view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

function goOrders() {
  uni.navigateTo({ url: '/pages/order/list' });
}

function logout() {
  userStore.logout();
  uni.reLaunch({ url: '/pages/index/index' });
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.title {
  font-weight: 700;
  margin-bottom: 12rpx;
}

.text {
  color: #4b5563;
  margin-bottom: 8rpx;
}

.danger {
  color: #dc2626;
}
</style>

