<template>
  <view class="page">
    <view class="hero">
      <view class="hero-top">
        <view>
          <view class="title">你好，{{ userStore.nickname || '同学' }}</view>
          <view class="sub">这里可以查看活动、提交报名、直接下单。</view>
        </view>
        <view class="badge">学生端</view>
      </view>
      <view class="action-row">
        <view class="quick-card" @click="goCampaignList">
          <view class="quick-title">活动广场</view>
          <view class="quick-desc">查看全部可报名活动</view>
        </view>
        <view class="quick-card" @click="goOrders">
          <view class="quick-title">我的订单</view>
          <view class="quick-desc">跟踪报名与支付状态</view>
        </view>
      </view>
    </view>

    <view class="section-header">
      <view class="section-title">推荐活动</view>
      <view class="section-link" @click="goCampaignList">查看全部</view>
    </view>

    <view v-if="loading" class="card muted">活动加载中...</view>
    <view v-else-if="!list.length" class="card muted">当前暂无可报名活动</view>
    <view
      v-for="item in list"
      :key="item.id"
      class="campaign-card"
      @click="goDetail(item.id)"
    >
      <view class="campaign-head">
        <view class="campaign-title">{{ item.title }}</view>
        <view class="campaign-status">进行中</view>
      </view>
      <view class="campaign-desc">{{ item.rewardDesc || '欢迎报名体验课程与活动。' }}</view>
      <view class="campaign-foot">
        <view>{{ item._count?.orders || 0 }} 人报名</view>
        <view>查看详情</view>
      </view>
    </view>

    <app-tabbar current="home" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppTabbar from '@/components/app-tabbar.vue';
import { getCampaignList, type CampaignItem } from '@/api/campaign';
import { useUserStore } from '@/store/user';
import { buildCampaignDetailPath, redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<CampaignItem[]>([]);

function ensureStudentLogin() {
  if (!userStore.token) {
    redirectToLogin('/pages/student/home');
    return false;
  }
  if (userStore.role === 'agent') {
    uni.reLaunch({ url: '/pages/agent/home' });
    return false;
  }
  return true;
}

function goDetail(id: string) {
  uni.navigateTo({ url: buildCampaignDetailPath(id) });
}

function goCampaignList() {
  uni.reLaunch({ url: '/pages/campaign/list' });
}

function goOrders() {
  uni.reLaunch({ url: '/pages/order/list' });
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getCampaignList();
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取活动失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  if (!ensureStudentLogin()) {
    return;
  }
  fetchList();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 140rpx;
  background: #f5f7fb;
}

.hero {
  padding: 32rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #f97316 0%, #fb7185 100%);
  color: #fff;
  box-shadow: 0 24rpx 60rpx rgba(249, 115, 22, 0.2);
}

.hero-top {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
}

.sub {
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 1.7;
}

.badge {
  height: fit-content;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.18);
  font-size: 22rpx;
}

.action-row {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.quick-card {
  flex: 1;
  padding: 22rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.16);
}

.quick-title {
  font-size: 28rpx;
  font-weight: 700;
}

.quick-desc {
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.6;
  opacity: 0.92;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 28rpx 0 18rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
}

.section-link {
  color: #f97316;
  font-size: 24rpx;
}

.card,
.campaign-card {
  background: #fff;
  border-radius: 22rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.campaign-head,
.campaign-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.campaign-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
}

.campaign-status {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: #c2410c;
  background: #fff7ed;
}

.campaign-desc {
  margin: 14rpx 0 18rpx;
  color: #64748b;
  line-height: 1.7;
}

.campaign-foot,
.muted {
  color: #94a3b8;
  font-size: 24rpx;
}
</style>
