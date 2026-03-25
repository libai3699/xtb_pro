<template>
  <view class="page">
    <view class="title">活动列表</view>
    <view v-for="item in list" :key="item.id" class="card" @click="goDetail(item.id)">
      <view class="name">{{ item.title }}</view>
      <view class="text">{{ item.rewardDesc || item.description || '欢迎报名参与' }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getCampaignList, type CampaignItem } from '@/api/campaign';

const list = ref<CampaignItem[]>([]);

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/campaign/detail?id=${id}` });
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

.title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.name {
  font-weight: 700;
  margin-bottom: 10rpx;
}

.text {
  color: #64748b;
}
</style>
