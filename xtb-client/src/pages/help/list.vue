<template>
  <view class="page">
    <view class="page-title">帮助中心</view>
    <view v-if="loading" class="card muted">加载中...</view>
    <view v-else-if="!list.length" class="card muted">暂无帮助内容</view>
    <view v-for="item in list" :key="item.id" class="help-card" @click="goDetail(item.id)">
      <view class="help-title">{{ item.title }}</view>
      <view class="help-summary">{{ item.summary || '点击查看详情' }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getContentList, type ContentArticleItem } from '@/api/content';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<ContentArticleItem[]>([]);

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/content/detail?id=${id}` });
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getContentList('help');
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取帮助内容失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/help/list');
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

.help-card,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.help-title {
  font-size: 28rpx;
  font-weight: 700;
}

.help-summary,
.muted {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.6;
}
</style>
