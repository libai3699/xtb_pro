<template>
  <view class="page">
    <view class="banner">暑期英语集训营</view>
    <view class="card">
      <view class="title">活动介绍</view>
      <view class="text">适合高校学生报名体验，第一版先打通活动、留资和下单流程。</view>
    </view>
    <view class="card">
      <view class="title">奖励说明</view>
      <view class="text">代理推广成功留资后，后台可统计来源数据。</view>
    </view>
    <button type="primary" @click="goMy">进入我的</button>
  </view>
</template>

<script setup lang="ts">
function goMy() {
  uni.navigateTo({ url: '/pages/my/index' });
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.banner {
  background: linear-gradient(135deg, #fb7185, #f97316);
  color: #fff;
  font-size: 40rpx;
  font-weight: 700;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  margin-bottom: 24rpx;
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
  line-height: 1.7;
}
</style>

