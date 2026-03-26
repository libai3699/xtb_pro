<template>
  <view class="page">
    <view class="hero">
      <view class="hero-top">
        <view>
          <view class="title">代理工作台</view>
          <view class="sub">欢迎回来，{{ userStore.nickname || '代理' }}</view>
        </view>
        <view class="badge">代理端</view>
      </view>
      <view class="stats-grid">
        <view class="stat-item">
          <view class="stat-value">{{ stats.pv }}</view>
          <view class="stat-label">浏览量</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ stats.leadCount }}</view>
          <view class="stat-label">留资数</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ stats.orderCount }}</view>
          <view class="stat-label">订单数</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ stats.paidAmount }}</view>
          <view class="stat-label">成交额</view>
        </view>
      </view>
    </view>

    <view class="section-header">
      <view class="section-title">可推广活动</view>
      <view class="section-link" @click="goMy">我的主页</view>
    </view>

    <view v-if="loading" class="card muted">活动加载中...</view>
    <view v-else-if="!list.length" class="card muted">当前暂无可推广活动</view>
    <view v-for="item in list" :key="item.id" class="campaign-card">
      <view class="campaign-title">{{ item.title }}</view>
      <view class="campaign-desc">{{ item.rewardDesc || '推广后可持续带来线索和订单。' }}</view>
      <view class="campaign-foot">
        <button size="mini" @click="goDetail(item.id)">查看详情</button>
        <button size="mini" type="primary" @click="copyShareLink(item.id)">复制推广链接</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getCampaignList, type CampaignItem } from '@/api/campaign';
import { getMyAgentStats } from '@/api/agent';
import { useUserStore } from '@/store/user';
import { buildCampaignDetailPath, buildH5CampaignShareUrl, redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<CampaignItem[]>([]);
const stats = reactive({
  pv: 0,
  leadCount: 0,
  orderCount: 0,
  paidAmount: 0,
});

function ensureAgentLogin() {
  if (!userStore.token) {
    redirectToLogin('/pages/agent/home');
    return false;
  }
  if (userStore.role === 'student') {
    uni.reLaunch({ url: '/pages/student/home' });
    return false;
  }
  return true;
}

function goDetail(id: string) {
  uni.navigateTo({ url: buildCampaignDetailPath(id, userStore.id) });
}

function goMy() {
  uni.navigateTo({ url: '/pages/my/index' });
}

function copyShareLink(campaignId: string) {
  const link = buildH5CampaignShareUrl(campaignId, userStore.id);
  uni.setClipboardData({
    data: link,
    success: () => {
      uni.showToast({ title: '推广链接已复制', icon: 'success' });
    },
  });
}

async function fetchData() {
  loading.value = true;
  try {
    const [campaignRes, statsRes] = await Promise.all([
      getCampaignList(),
      getMyAgentStats(userStore.id),
    ]);
    list.value = campaignRes.data;
    Object.assign(stats, statsRes.data);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取数据失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  if (!ensureAgentLogin()) {
    return;
  }
  fetchData();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background:
    radial-gradient(circle at top left, rgba(20, 184, 166, 0.1), transparent 30%),
    #f5f7fb;
}

.hero {
  border-radius: 28rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
  color: #fff;
  box-shadow: 0 24rpx 60rpx rgba(15, 118, 110, 0.2);
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
}

.badge {
  height: fit-content;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.16);
  font-size: 22rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-top: 24rpx;
}

.stat-item {
  padding: 22rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.14);
}

.stat-value {
  font-size: 34rpx;
  font-weight: 700;
}

.stat-label {
  margin-top: 8rpx;
  font-size: 22rpx;
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
  color: #0f766e;
  font-size: 24rpx;
}

.card,
.campaign-card {
  background: #fff;
  border-radius: 22rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.campaign-title {
  font-size: 30rpx;
  font-weight: 700;
}

.campaign-desc {
  margin: 14rpx 0 18rpx;
  color: #64748b;
  line-height: 1.7;
}

.campaign-foot {
  display: flex;
  justify-content: flex-end;
  gap: 12rpx;
}

.muted {
  color: #94a3b8;
}
</style>
