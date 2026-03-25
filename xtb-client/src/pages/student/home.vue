<template>
  <view class="page">
    <view class="header">学生首页</view>
    <view class="card" @click="goCampaign">暑期英语集训营</view>
    <view class="card" @click="goMy">我的报名</view>
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

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}
</style>

