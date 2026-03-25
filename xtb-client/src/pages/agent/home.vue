<template>
  <view class="page">
    <view class="header">代理首页</view>
    <view class="grid">
      <view class="item">浏览量 0</view>
      <view class="item">留资数 0</view>
      <view class="item">订单数 0</view>
    </view>
    <view class="card" @click="goCampaign">查看活动详情</view>
    <view class="card" @click="goMy">我的</view>
  </view>
</template>

<script setup lang="ts">
function goCampaign() {
  uni.navigateTo({ url: '/pages/campaign/detail' });
}

function goMy() {
  uni.navigateTo({ url: '/pages/my/index' });
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.header {
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 24rpx;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.item,
.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
}

.card {
  margin-top: 16rpx;
}
</style>

