<template>
  <view class="page">
    <view class="hero">
      <view class="title">校推宝Pro</view>
      <view class="desc">一套代码切代理端和学生端</view>
    </view>

    <view class="card">
      <view class="label">当前体验身份</view>
      <view class="actions">
        <button type="primary" size="mini" @click="goAgent">代理端</button>
        <button size="mini" @click="goStudent">学生端</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

function goAgent() {
  userStore.setRole('agent');
  uni.navigateTo({ url: '/pages/agent/home' });
}

function goStudent() {
  userStore.setRole('student');
  uni.navigateTo({ url: '/pages/student/home' });
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.hero {
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  border-radius: 24rpx;
  color: #fff;
  padding: 40rpx 32rpx;
  margin-bottom: 24rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
}

.desc {
  margin-top: 12rpx;
  font-size: 28rpx;
  opacity: 0.92;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
}

.label {
  margin-bottom: 20rpx;
  font-size: 28rpx;
}

.actions {
  display: flex;
  gap: 16rpx;
}
</style>

