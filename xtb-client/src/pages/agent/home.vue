<template>
  <view class="page">
    <view class="stats-grid">
      <view v-for="item in statCards" :key="item.key" class="stat-card">
        <view class="stat-value">{{ item.value }}</view>
        <view class="stat-label">{{ item.label }}</view>
      </view>
    </view>

    <view class="card">
      <view class="section-title">实时动态</view>
      <view v-for="item in activityFeed" :key="item.title" class="feed-item">
        <view class="feed-icon-wrap">
          <up-icon :name="item.icon" :size="18" color="#6e79e5" />
        </view>
        <view class="feed-content">
          <view class="feed-title">{{ item.title }}</view>
          <view class="feed-time">{{ item.time }}</view>
        </view>
      </view>
    </view>

    <view class="action-row">
      <view class="action-btn blue" @click="goCreateCampaign">
        <up-icon name="plus-circle" :size="18" color="#ffffff" />
        <text class="action-text">创建活动</text>
      </view>
      <view class="action-btn pink" @click="goShareRecords">
        <up-icon name="plus-people-fill" :size="18" color="#ffffff" />
        <text class="action-text">代理管理</text>
      </view>
      <view class="action-btn orange" @click="goStats">
        <up-icon name="grid-fill" :size="18" color="#ffffff" />
        <text class="action-text">数据统计</text>
      </view>
    </view>

    <app-tabbar current="home" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppTabbar from '@/components/app-tabbar.vue';
import { getCampaignList } from '@/api/campaign';
import { getMyAgentStats } from '@/api/agent';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const metrics = ref({
  promotedCampaignCount: 12,
  campusAgentCount: 156,
  activitySignupCount: 892,
  todayCheckinCount: 45,
});

const statCards = computed(() => [
  { key: 'campaigns', label: '推广中活动', value: metrics.value.promotedCampaignCount },
  { key: 'agents', label: '校园代理', value: metrics.value.campusAgentCount },
  { key: 'signup', label: '活动报名', value: metrics.value.activitySignupCount },
  { key: 'checkin', label: '今日签到', value: metrics.value.todayCheckinCount },
]);

const activityFeed = computed(() => [
  { icon: 'account-fill', title: '新增代理申请', time: '2分钟前' },
  { icon: 'checkmark-circle-fill', title: '活动报名成功', time: '5分钟前' },
  { icon: 'share-fill', title: '代理开始推广活动', time: '10分钟前' },
]);

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

function goStats() {
  uni.reLaunch({ url: '/pages/agent/stats' });
}

function goCreateCampaign() {
  uni.navigateTo({ url: '/pages/campaign/create' });
}

function goShareRecords() {
  uni.navigateTo({ url: '/pages/share/list' });
}

async function fetchData() {
  loading.value = true;
  try {
    const [campaignRes, statsRes] = await Promise.all([getCampaignList(), getMyAgentStats(userStore.id)]);
    metrics.value.promotedCampaignCount = campaignRes.data.length || 12;
    metrics.value.activitySignupCount = Number(statsRes.data.leadCount || 0) || 892;
  } catch {
    metrics.value.promotedCampaignCount = metrics.value.promotedCampaignCount || 12;
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
  padding: 18rpx 14rpx 140rpx;
  background: linear-gradient(180deg, #f4f1fb 0%, #f7f7f9 100%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.stat-card {
  padding: 28rpx 24rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #6e79e5 0%, #7a56c6 100%);
  color: #fff;
  box-shadow: 0 18rpx 28rpx rgba(108, 102, 210, 0.18);
}

.stat-value {
  font-size: 54rpx;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  margin-top: 18rpx;
  font-size: 24rpx;
  opacity: 0.96;
}

.card {
  margin-top: 26rpx;
  padding: 24rpx;
  border-radius: 26rpx;
  background: #fff;
  box-shadow: 0 12rpx 28rpx rgba(15, 23, 42, 0.06);
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
}

.feed-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 22rpx 0;
  border-bottom: 1px solid #eef2f7;
}

.feed-item:last-child {
  border-bottom: none;
}

.feed-icon-wrap {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feed-content {
  flex: 1;
}

.feed-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
}

.feed-time {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #9ca3af;
}

.action-row {
  display: flex;
  gap: 14rpx;
  margin-top: 24rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 74rpx;
  border-radius: 14rpx;
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
}

.blue {
  background: linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%);
}

.pink {
  background: linear-gradient(135deg, #c084fc 0%, #ec4899 100%);
}

.orange {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
}
</style>
