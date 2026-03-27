<template>
  <view v-if="detail" class="page">
    <view class="hero">
      <view class="hero-title">{{ detail.title }}</view>
      <view class="hero-desc">{{ detail.rewardDesc || '沉浸式活动页，支持报名与下单。' }}</view>
      <view class="hero-meta">
        <view>{{ detail._count?.leads || 0 }} 条线索</view>
        <view>{{ detail._count?.orders || 0 }} 笔订单</view>
      </view>
    </view>

    <view class="card">
      <view class="card-title">活动介绍</view>
      <view class="card-text">{{ detail.description || '暂无详细介绍' }}</view>
    </view>

    <view v-if="agentHint" class="card tip-card">
      <view class="card-title">推广来源</view>
      <view class="card-text">当前页面已绑定代理来源，报名和下单会自动归因。</view>
    </view>

    <view class="card">
      <view class="card-title">可报名商品</view>
      <view v-if="detail.products?.length">
        <view v-for="item in detail.products" :key="item.id" class="product-item">
          <view class="product-main">
            <view class="product-title">{{ item.title }}</view>
            <view class="product-desc">{{ item.description || '点击下单后会生成报名订单。' }}</view>
          </view>
          <view class="product-side">
            <view class="price">￥{{ item.price }}</view>
            <view v-if="item.originalPrice" class="origin-price">￥{{ item.originalPrice }}</view>
            <button size="mini" type="primary" @click="handleOrder(item.id, item.title)">立即下单</button>
          </view>
        </view>
      </view>
      <view v-else class="card-text">当前活动暂无商品</view>
    </view>

    <view class="action-bar">
      <button v-if="!userStore.token" @click="goLogin">登录后报名</button>
      <button v-else-if="userStore.role === 'agent'" @click="copyShareLink">复制推广链接</button>
      <template v-else>
        <button @click="goLeadForm">提交报名信息</button>
        <button type="primary" @click="goOrders">我的订单</button>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { createShareRecord, getCampaignDetail, visitShareRecord, type CampaignItem } from '@/api/campaign';
import { createOrder } from '@/api/order';
import { useUserStore } from '@/store/user';
import { buildCampaignDetailPath, buildH5CampaignShareUrl, redirectToLogin } from '@/utils/app';
import { getCampaignReferral, saveCampaignReferral } from '@/utils/storage';

const userStore = useUserStore();
const detail = ref<CampaignItem | null>(null);
const campaignId = ref('');
const routeAgentUserId = ref('');

const agentHint = computed(() => Boolean(getActiveAgentUserId()));

function getActiveAgentUserId() {
  if (routeAgentUserId.value) {
    return routeAgentUserId.value;
  }
  if (!campaignId.value) {
    return '';
  }
  return getCampaignReferral(campaignId.value)?.agentUserId || '';
}

function goLeadForm() {
  if (!userStore.token) {
    goLogin();
    return;
  }
  uni.navigateTo({
    url: `/pages/lead/form?campaignId=${campaignId.value}`,
  });
}

function goOrders() {
  uni.navigateTo({ url: '/pages/order/list' });
}

function goLogin() {
  redirectToLogin(buildCampaignDetailPath(campaignId.value, getActiveAgentUserId() || undefined));
}

async function copyShareLink() {
  const shareLink = buildH5CampaignShareUrl(campaignId.value, userStore.id);
  try {
    await createShareRecord({
      campaignId: Number(campaignId.value),
      agentUserId: Number(userStore.id),
      shareUrl: shareLink,
    });
  } catch {
    // Ignore share record creation failures and keep copy action available.
  }

  uni.setClipboardData({
    data: shareLink,
    success: () => uni.showToast({ title: '推广链接已复制', icon: 'success' }),
  });
}

async function handleOrder(productId: string, title: string) {
  if (!userStore.token) {
    goLogin();
    return;
  }

  if (userStore.role !== 'student') {
    uni.showToast({ title: '代理端请复制推广链接给学生报名', icon: 'none' });
    return;
  }

  try {
    await createOrder({
      productId: Number(productId),
      campaignId: Number(campaignId.value),
      agentUserId: getActiveAgentUserId() ? Number(getActiveAgentUserId()) : undefined,
      studentUserId: Number(userStore.id),
      studentName: userStore.nickname || '学生用户',
      mobile: userStore.mobile || '13800000000',
    });
    uni.showToast({ title: `${title} 下单成功`, icon: 'success' });
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/order/list' });
    }, 500);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '下单失败', icon: 'none' });
  }
}

onLoad(async (options) => {
  campaignId.value = String(options?.id || '');
  routeAgentUserId.value = String(options?.agentUserId || '');

  if (campaignId.value && routeAgentUserId.value) {
    saveCampaignReferral({
      campaignId: campaignId.value,
      agentUserId: routeAgentUserId.value,
    });

    try {
      await visitShareRecord({
        campaignId: Number(campaignId.value),
        agentUserId: Number(routeAgentUserId.value),
      });
    } catch {
      // Ignore share visit failures in the UI layer.
    }
  }

  if (!campaignId.value) {
    return;
  }

  try {
    const res = await getCampaignDetail(campaignId.value);
    detail.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取活动失败', icon: 'none' });
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 160rpx;
  background: #f5f7fb;
}

.hero {
  border-radius: 28rpx;
  padding: 40rpx 32rpx;
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
  color: #fff;
  margin-bottom: 18rpx;
}

.hero-title {
  font-size: 42rpx;
  font-weight: 700;
}

.hero-desc {
  margin-top: 14rpx;
  font-size: 24rpx;
  line-height: 1.7;
}

.hero-meta {
  display: flex;
  gap: 20rpx;
  margin-top: 18rpx;
  font-size: 22rpx;
  opacity: 0.92;
}

.card {
  background: #fff;
  border-radius: 22rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.tip-card {
  background: #eff6ff;
}

.card-title {
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: 14rpx;
}

.card-text {
  color: #64748b;
  line-height: 1.8;
}

.product-item {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  padding: 20rpx 0;
  border-bottom: 1px solid #f1f5f9;
}

.product-item:last-child {
  border-bottom: none;
}

.product-main {
  flex: 1;
}

.product-title {
  font-size: 28rpx;
  font-weight: 700;
}

.product-desc {
  margin-top: 10rpx;
  color: #64748b;
  line-height: 1.7;
  font-size: 24rpx;
}

.product-side {
  min-width: 180rpx;
  text-align: right;
}

.price {
  color: #dc2626;
  font-size: 32rpx;
  font-weight: 700;
}

.origin-price {
  margin: 8rpx 0 12rpx;
  color: #94a3b8;
  font-size: 22rpx;
  text-decoration: line-through;
}

.action-bar {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: 24rpx;
  display: flex;
  gap: 16rpx;
  padding: 18rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -8rpx 40rpx rgba(15, 23, 42, 0.08);
}

.action-bar button {
  flex: 1;
}
</style>
