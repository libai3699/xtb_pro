<template>
  <view class="page">
    <view class="page-title">我的收藏</view>
    <view v-if="loading" class="card muted">加载中...</view>
    <view v-else-if="!list.length" class="card muted">暂无收藏</view>
    <view v-for="item in list" :key="item.id" class="favorite-card">
      <view class="favorite-title">{{ getTitle(item) }}</view>
      <view class="favorite-meta">{{ item.targetType === 'campaign' ? '活动收藏' : '文章收藏' }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getFavoriteList, type FavoriteItem } from '@/api/growth';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<FavoriteItem[]>([]);

function getTitle(item: FavoriteItem) {
  const target = item.target as Record<string, unknown> | null | undefined;
  return String(target?.title || '未命名内容');
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getFavoriteList(userStore.id);
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取收藏失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/favorite/list');
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

.favorite-card,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.favorite-title {
  font-size: 28rpx;
  font-weight: 700;
}

.favorite-meta,
.muted {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #64748b;
}
</style>
