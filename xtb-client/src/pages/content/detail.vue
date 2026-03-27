<template>
  <view class="page">
    <view v-if="loading" class="card muted">加载中...</view>
    <template v-else-if="detail">
      <view class="title">{{ detail.title }}</view>
      <view class="meta">{{ detail.category || (detail.type === 'help' ? '帮助中心' : '校园资讯') }} · {{ detail.publishedAt || detail.createdAt }}</view>
      <view class="summary" v-if="detail.summary">{{ detail.summary }}</view>
      <view class="content">{{ detail.content || '暂无正文内容' }}</view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getContentDetail, type ContentArticleItem } from '@/api/content';

const loading = ref(false);
const detail = ref<ContentArticleItem | null>(null);

async function fetchDetail(id: string) {
  loading.value = true;
  try {
    const res = await getContentDetail(id);
    detail.value = res.data;
    uni.setNavigationBarTitle({ title: res.data.title });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取详情失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onLoad((query) => {
  if (query?.id) {
    fetchDetail(String(query.id));
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28rpx;
  background: #fff;
}

.title {
  font-size: 38rpx;
  font-weight: 700;
  line-height: 1.5;
  color: #0f172a;
}

.meta,
.summary {
  margin-top: 16rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 1.7;
}

.content,
.muted {
  margin-top: 28rpx;
  font-size: 28rpx;
  line-height: 1.9;
  color: #1f2937;
  white-space: pre-wrap;
}
</style>
