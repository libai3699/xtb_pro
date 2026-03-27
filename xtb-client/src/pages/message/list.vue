<template>
  <view class="page">
    <view class="page-title">消息中心</view>
    <view v-if="loading" class="card muted">加载中...</view>
    <view v-else-if="!list.length" class="card muted">暂无消息</view>
    <view v-for="item in list" :key="item.id" :class="['message-card', item.isRead === 1 ? 'read' : '']" @click="handleRead(item.id)">
      <view class="message-title">{{ item.title }}</view>
      <view class="message-content">{{ item.content }}</view>
      <view class="message-meta">{{ item.type }} · {{ item.createdAt }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getMessageList, readMessage, type MessageItem } from '@/api/growth';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<MessageItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getMessageList(userStore.id);
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取消息失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

async function handleRead(id: string) {
  try {
    await readMessage(id);
    fetchList();
  } catch {
    // ignore
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/message/list');
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

.message-card,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.read {
  opacity: 0.72;
}

.message-title {
  font-size: 28rpx;
  font-weight: 700;
}

.message-content,
.message-meta,
.muted {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.6;
}
</style>
