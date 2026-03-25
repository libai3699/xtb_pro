<template>
  <view class="page" v-if="detail">
    <view class="banner">{{ detail.title }}</view>

    <view class="card">
      <view class="title">活动介绍</view>
      <view class="text">{{ detail.description || '暂无详细介绍' }}</view>
    </view>

    <view class="card">
      <view class="title">奖励说明</view>
      <view class="text">{{ detail.rewardDesc || '暂无奖励说明' }}</view>
    </view>

    <view class="card">
      <view class="title">可报名商品</view>
      <view v-if="detail.products?.length">
        <view v-for="item in detail.products" :key="item.id" class="product-item">
          <view>{{ item.title }}</view>
          <view class="price">¥{{ item.price }}</view>
          <button size="mini" type="primary" @click="handleOrder(item.id, item.title)">立即下单</button>
        </view>
      </view>
      <view v-else class="text">当前活动还没有商品</view>
    </view>

    <button v-if="userStore.role === 'student'" type="primary" @click="goLeadForm">提交报名信息</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { createOrder } from '@/api/order';
import { getCampaignDetail, type CampaignItem } from '@/api/campaign';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const detail = ref<CampaignItem | null>(null);
const campaignId = ref('');

function goLeadForm() {
  uni.navigateTo({
    url: `/pages/lead/form?campaignId=${campaignId.value}`,
  });
}

async function handleOrder(productId: string, title: string) {
  if (userStore.role !== 'student') {
    uni.showToast({ title: '代理端不直接下单', icon: 'none' });
    return;
  }

  try {
    await createOrder({
      productId: Number(productId),
      campaignId: Number(campaignId.value),
      studentUserId: Number(userStore.id),
      studentName: userStore.nickname || '学生用户',
      mobile: userStore.mobile || '13800000000',
    });
    uni.showToast({ title: `${title} 下单成功`, icon: 'success' });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '下单失败', icon: 'none' });
  }
}

onLoad(async (options) => {
  campaignId.value = String(options?.id || '');
  if (!campaignId.value) {
    return;
  }
  const res = await getCampaignDetail(campaignId.value);
  detail.value = res.data;
});
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.banner {
  background: linear-gradient(135deg, #fb7185, #f97316);
  color: #fff;
  font-size: 40rpx;
  font-weight: 700;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  margin-bottom: 24rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.title {
  font-weight: 700;
  margin-bottom: 12rpx;
}

.text {
  color: #4b5563;
  line-height: 1.7;
}

.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  padding: 18rpx 0;
  border-bottom: 1px solid #f1f5f9;
}

.price {
  color: #ef4444;
  font-weight: 700;
}
</style>

