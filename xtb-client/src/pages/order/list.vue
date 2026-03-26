<template>
  <view class="page">
    <view class="title">我的订单</view>
    <view v-if="loading" class="card muted">订单加载中...</view>
    <view v-else-if="!list.length" class="card muted">暂无订单</view>
    <view v-for="item in list" :key="item.id" class="card">
      <view class="head">
        <view class="name">{{ item.product?.title || item.orderNo }}</view>
        <view :class="['tag', `tag-${item.status}`]">{{ statusMap[item.status] || '未知' }}</view>
      </view>
      <view class="text">订单号：{{ item.orderNo }}</view>
      <view class="text">报名人：{{ item.studentName }}</view>
      <view class="text">手机号：{{ item.mobile }}</view>
      <view class="amount">￥{{ item.amount }}</view>
      <view class="time">{{ item.createdAt }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getMyOrders, type OrderItem } from '@/api/order';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<OrderItem[]>([]);

const statusMap: Record<number, string> = {
  0: '待支付',
  1: '已支付',
  2: '已取消',
};

async function fetchList() {
  loading.value = true;
  try {
    const res = await getMyOrders(userStore.id);
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取订单失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/order/list');
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

.title {
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 26rpx;
  margin-bottom: 16rpx;
}

.head {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  align-items: center;
}

.name {
  font-size: 30rpx;
  font-weight: 700;
}

.tag {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}

.tag-0 {
  background: #fff7ed;
  color: #c2410c;
}

.tag-1 {
  background: #ecfdf5;
  color: #15803d;
}

.tag-2 {
  background: #f1f5f9;
  color: #64748b;
}

.text,
.time {
  margin-top: 10rpx;
  color: #64748b;
  font-size: 24rpx;
}

.amount {
  margin-top: 16rpx;
  color: #dc2626;
  font-size: 34rpx;
  font-weight: 700;
}

.muted {
  color: #94a3b8;
}
</style>
