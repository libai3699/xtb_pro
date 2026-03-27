<template>
  <view class="page">
    <view class="page-title">学习记录</view>
    <view v-if="loading" class="card muted">加载中...</view>
    <view v-else-if="!list.length" class="card muted">暂无学习记录</view>
    <view v-for="item in list" :key="item.id" class="learning-card">
      <view class="learning-title">{{ item.title }}</view>
      <view class="learning-meta">学习进度 {{ item.progress }}%</view>
      <view class="learning-meta">学习时长 {{ item.durationMinutes }} 分钟</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getLearningRecordList, type LearningRecordItem } from '@/api/growth';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<LearningRecordItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getLearningRecordList(userStore.id);
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取学习记录失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/learning/list');
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

.page-title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 18rpx;
}

.learning-card,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.learning-title {
  font-size: 28rpx;
  font-weight: 700;
}

.learning-meta,
.muted {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #64748b;
}
</style>
