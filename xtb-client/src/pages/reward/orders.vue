<template>
  <view class="page">
    <view class="hero">
      <view class="title">兑换记录</view>
      <view class="sub">查看积分兑换订单状态</view>
    </view>

    <view v-if="loading" class="card muted">加载中...</view>
    <view v-else-if="!list.length" class="card muted">暂无兑换记录</view>
    <view v-for="item in list" :key="item.id" class="card">
      <view class="card-title">{{ item.goods?.title || `商品 #${item.goodsId}` }}</view>
      <view class="meta">订单号：{{ item.orderNo }}</view>
      <view class="meta">消耗积分：{{ item.points }}</view>
      <view class="status-row">
        <view class="meta">创建时间：{{ item.createdAt }}</view>
        <view :class="['status', `status-${item.status}`]">{{ statusLabelMap[item.status] || '未知' }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getRedeemOrderList, type RedeemOrderItem } from '@/api/growth';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<RedeemOrderItem[]>([]);
const statusLabelMap: Record<number, string> = {
  0: '待处理',
  1: '处理中',
  2: '已完成',
};

async function fetchList() {
  loading.value = true;
  try {
    const res = await getRedeemOrderList(userStore.id);
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取兑换记录失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/reward/orders');
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
  background: linear-gradient(135deg, #fb7185, #f97316);
  color: #fff;
}

.title {
  font-size: 38rpx;
  font-weight: 700;
}

.sub {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.card-title {
  font-size: 30rpx;
  font-weight: 700;
}

.meta,
.muted {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #64748b;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.status {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}

.status-0 {
  background: #fef3c7;
  color: #92400e;
}

.status-1 {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-2 {
  background: #dcfce7;
  color: #166534;
}
</style>
