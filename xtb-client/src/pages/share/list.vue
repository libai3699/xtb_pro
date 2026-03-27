<template>
  <view class="page">
    <view class="hero">
      <view class="title">推广记录</view>
      <view class="sub">查看每个活动的浏览、留资和订单转化</view>
    </view>

    <view v-if="loading" class="card muted">加载中...</view>
    <view v-else-if="!list.length" class="card muted">暂无推广记录</view>
    <view v-for="item in list" :key="item.id" class="card">
      <view class="card-title">{{ item.campaign?.title || `活动 #${item.campaignId}` }}</view>
      <view class="card-desc">{{ item.campaign?.rewardDesc || '推广数据持续累计中' }}</view>
      <view class="stats-grid">
        <view class="stat-item">
          <view class="stat-value">{{ item.pv }}</view>
          <view class="stat-label">浏览</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ item.leadCount }}</view>
          <view class="stat-label">留资</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ item.orderCount }}</view>
          <view class="stat-label">订单</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ item.uv }}</view>
          <view class="stat-label">访客</view>
        </view>
      </view>
      <view class="meta">最近更新：{{ item.updatedAt }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getShareList, type ShareRecordItem } from '@/api/campaign';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<ShareRecordItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getShareList(userStore.id);
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取推广记录失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/share/list');
    return;
  }
  fetchList();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f7fb;
}

.hero,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.hero {
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  color: #fff;
}

.title {
  font-size: 38rpx;
  font-weight: 700;
}

.sub,
.card-desc,
.meta,
.muted {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #64748b;
}

.hero .sub {
  color: rgba(255, 255, 255, 0.9);
}

.card-title {
  font-size: 30rpx;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-top: 18rpx;
}

.stat-item {
  border-radius: 18rpx;
  background: #f8fafc;
  padding: 20rpx;
}

.stat-value {
  font-size: 34rpx;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #64748b;
}
</style>
