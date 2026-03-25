<template>
  <view class="page">
    <view class="header">学生首页</view>
    <view class="sub">欢迎你，{{ userStore.nickname || '同学' }}</view>

    <view class="card" @click="goOrders">我的订单</view>
    <view class="card" @click="goMy">我的资料</view>

    <view class="section-title">活动列表</view>
    <view v-for="item in list" :key="item.id" class="campaign-card" @click="goDetail(item.id)">
      <view class="campaign-title">{{ item.title }}</view>
      <view class="campaign-desc">{{ item.rewardDesc || '欢迎报名体验' }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getCampaignList, type CampaignItem } from '@/api/campaign';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const list = ref<CampaignItem[]>([]);

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/campaign/detail?id=${id}` });
}

function goOrders() {
  uni.navigateTo({ url: '/pages/order/list' });
}

function goMy() {
  uni.navigateTo({ url: '/pages/my/index' });
}

async function fetchList() {
  const res = await getCampaignList();
  list.value = res.data;
}

onMounted(fetchList);
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.header {
  font-size: 36rpx;
  font-weight: 700;
}

.sub {
  color: #64748b;
  margin: 8rpx 0 20rpx;
}

.card,
.campaign-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.section-title {
  margin: 20rpx 0 16rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.campaign-title {
  font-weight: 700;
  margin-bottom: 10rpx;
}

.campaign-desc {
  color: #64748b;
}
</style>

