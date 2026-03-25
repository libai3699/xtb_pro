<template>
  <view class="page">
    <view class="title">我的订单</view>
    <view v-for="item in list" :key="item.id" class="card">
      <view class="name">{{ item.product?.title || item.orderNo }}</view>
      <view class="text">订单号：{{ item.orderNo }}</view>
      <view class="text">金额：¥{{ item.amount }}</view>
      <view class="text">状态：{{ statusMap[item.status] || '未知' }}</view>
    </view>
    <view v-if="!list.length" class="empty">暂无订单</view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getMyOrders, type OrderItem } from '@/api/order';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const list = ref<OrderItem[]>([]);

const statusMap: Record<number, string> = {
  0: '待支付',
  1: '已支付',
  2: '已取消',
};

async function fetchList() {
  const res = await getMyOrders(userStore.id);
  list.value = res.data;
}

onMounted(fetchList);
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.name {
  font-weight: 700;
  margin-bottom: 10rpx;
}

.text {
  color: #64748b;
  margin-bottom: 6rpx;
}

.empty {
  color: #94a3b8;
  text-align: center;
  margin-top: 80rpx;
}
</style>

