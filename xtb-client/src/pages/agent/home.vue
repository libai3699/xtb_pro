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

    <view class="quick-grid">
      <view class="quick-card" @click="goCampaignList">
        <view class="quick-title">活动列表</view>
        <view class="quick-desc">查看可推广活动</view>
      </view>
      <view class="quick-card" @click="goShareRecords">
        <view class="quick-title">推广记录</view>
        <view class="quick-desc">查看活动转化表现</view>
      </view>
      <view class="quick-card" @click="goMessages">
        <view class="quick-title">消息通知</view>
        <view class="quick-desc">处理系统提醒和任务通知</view>
      </view>
      <view class="quick-card" @click="goHelp">
        <view class="quick-title">帮助中心</view>
        <view class="quick-desc">查看规则和常见问题</view>
      </view>
    </view>

    <view class="section-header">
      <view class="section-title">可推广活动</view>
      <view class="section-link" @click="goStats">查看完整数据</view>
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

    <app-tabbar current="home" />
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppTabbar from '@/components/app-tabbar.vue';
import { createShareRecord, getCampaignList, type CampaignItem } from '@/api/campaign';
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

function goStats() {
  uni.reLaunch({ url: '/pages/agent/stats' });
}

function goCampaignList() {
  uni.navigateTo({ url: '/pages/campaign/list' });
}

function goShareRecords() {
  uni.navigateTo({ url: '/pages/share/list' });
}

function goMessages() {
  uni.navigateTo({ url: '/pages/message/list' });
}

function goHelp() {
  uni.navigateTo({ url: '/pages/help/list' });
}

async function copyShareLink(campaignId: string) {
  const link = buildH5CampaignShareUrl(campaignId, userStore.id);
  try {
    await createShareRecord({
      campaignId: Number(campaignId),
      agentUserId: Number(userStore.id),
      shareUrl: link,
    });
  } catch {
    // Ignore share record creation failures and keep copy action available.
  }

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
    const [campaignRes, statsRes] = await Promise.all([getCampaignList(), getMyAgentStats(userStore.id)]);
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
  padding: 24rpx 24rpx 140rpx;
  background:
    radial-gradient(circle at top left, rgba(20, 184, 166, 0.1), transparent 30%),
    #f5f7fb;
}

.hero,
.campaign-card,
.card,
.quick-card {
  border-radius: 28rpx;
  padding: 24rpx;
  background: #fff;
  margin-bottom: 16rpx;
}

.hero {
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

.stats-grid,
.quick-grid {
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

.quick-title {
  font-size: 28rpx;
  font-weight: 700;
}

.quick-desc,
.campaign-desc,
.muted {
  margin-top: 10rpx;
  color: #64748b;
  line-height: 1.7;
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

.campaign-title {
  font-size: 30rpx;
  font-weight: 700;
}

.campaign-foot {
  display: flex;
  justify-content: flex-end;
  gap: 12rpx;
  margin-top: 18rpx;
}
</style>
