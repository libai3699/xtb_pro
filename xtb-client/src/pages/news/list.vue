<template>
  <view class="page">
    <view class="page-title">校园资讯</view>
    <view v-if="loading" class="card muted">加载中...</view>
    <view v-else-if="!list.length" class="card muted">暂无资讯</view>
    <view v-for="item in list" :key="item.id" class="news-card" @click="goDetail(item.id)">
      <view class="news-title">{{ item.title }}</view>
      <view class="news-summary">{{ item.summary || '点击查看详情' }}</view>
      <view class="news-meta">{{ item.category || '校园资讯' }} · {{ item.publishedAt || item.createdAt }}</view>
    </view>
    <app-tabbar current="news" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppTabbar from '@/components/app-tabbar.vue';
import { getContentList, type ContentArticleItem } from '@/api/content';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<ContentArticleItem[]>([]);

function ensureStudentLogin() {
  if (!userStore.token) {
    redirectToLogin('/pages/news/list');
    return false;
  }
  return true;
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/content/detail?id=${id}` });
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getContentList('news');
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取资讯失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  if (!ensureStudentLogin()) return;
  fetchList();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 140rpx;
  background: #f5f7fb;
}

.page-title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 18rpx;
}

.news-card,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.news-title {
  font-size: 28rpx;
  font-weight: 700;
}

.news-summary,
.news-meta,
.muted {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.6;
}
</style>
