<template>
  <view class="page">
    <view class="header">代理首页</view>
    <view class="sub">欢迎你，{{ userStore.nickname || '代理' }}</view>

    <view class="stats-grid">
      <view class="item">浏览量 {{ stats.pv }}</view>
      <view class="item">留资 {{ stats.leadCount }}</view>
      <view class="item">订单 {{ stats.orderCount }}</view>
      <view class="item">成交额 {{ stats.paidAmount }}</view>
    </view>

    <view class="card" @click="goMy">我的资料</view>

    <view class="section-title">可推广活动</view>
    <view v-for="item in list" :key="item.id" class="campaign-card" @click="goDetail(item.id)">
      <view class="campaign-title">{{ item.title }}</view>
      <view class="campaign-desc">{{ item.rewardDesc || '推广后可带来留资和订单' }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { getCampaignList, type CampaignItem } from '@/api/campaign';
import { getMyAgentStats } from '@/api/agent';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const list = ref<CampaignItem[]>([]);
const stats = reactive({
  pv: 0,
  leadCount: 0,
  orderCount: 0,
  paidAmount: 0,
});

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/campaign/detail?id=${id}` });
}

function goMy() {
  uni.navigateTo({ url: '/pages/my/index' });
}

async function fetchData() {
  const [campaignRes, statsRes] = await Promise.all([
    getCampaignList(),
    getMyAgentStats(userStore.id),
  ]);
  list.value = campaignRes.data;
  Object.assign(stats, statsRes.data);
}

onMounted(fetchData);
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.item,
.card,
.campaign-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
}

.card {
  margin-bottom: 16rpx;
}

.section-title {
  margin: 20rpx 0 16rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.campaign-card {
  margin-bottom: 16rpx;
}

.campaign-title {
  font-weight: 700;
  margin-bottom: 10rpx;
}

.campaign-desc {
  color: #64748b;
}
</style>

