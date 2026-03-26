<template>
  <view class="page">
    <view class="title">活动广场</view>
    <input v-model="keyword" class="search" placeholder="搜索活动标题" />
    <view v-if="loading" class="card muted">活动加载中...</view>
    <view v-else-if="!filteredList.length" class="card muted">没有匹配的活动</view>
    <view
      v-for="item in filteredList"
      :key="item.id"
      class="card"
      @click="goDetail(item.id)"
    >
      <view class="name">{{ item.title }}</view>
      <view class="text">{{ item.rewardDesc || item.description || '欢迎报名参与' }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getCampaignList, type CampaignItem } from '@/api/campaign';
import { buildCampaignDetailPath } from '@/utils/app';

const loading = ref(false);
const keyword = ref('');
const list = ref<CampaignItem[]>([]);

const filteredList = computed(() => {
  const text = keyword.value.trim().toLowerCase();
  if (!text) {
    return list.value;
  }
  return list.value.filter((item) => item.title.toLowerCase().includes(text));
});

function goDetail(id: string) {
  uni.navigateTo({ url: buildCampaignDetailPath(id) });
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getCampaignList();
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取活动失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(fetchList);
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f7fb;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}

.search {
  height: 88rpx;
  background: #fff;
  border-radius: 18rpx;
  padding: 0 24rpx;
  margin-bottom: 18rpx;
}

.card {
  background: #fff;
  border-radius: 22rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 700;
}

.text,
.muted {
  margin-top: 10rpx;
  color: #64748b;
  line-height: 1.7;
}
</style>
