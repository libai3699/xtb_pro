<template>
  <view class="page">
    <view class="topbar">
      <view class="location">活动广场</view>
      <view class="message" @click="goMessages">消息 {{ unreadCount > 0 ? `(${unreadCount})` : '' }}</view>
    </view>

    <view class="search-card" @click="goCampaignList">
      <text class="search-placeholder">搜索活动、课程、校园热点</text>
    </view>

    <view class="banner">新学期热门活动进行中</view>

    <view class="quick-grid">
      <view class="quick-item" @click="goCampaignList">
        <view class="quick-icon">◎</view>
        <view class="quick-text">全部活动</view>
      </view>
      <view class="quick-item" @click="goReward">
        <view class="quick-icon">✦</view>
        <view class="quick-text">奖励中心</view>
      </view>
      <view class="quick-item" @click="goNews">
        <view class="quick-icon">▣</view>
        <view class="quick-text">校园资讯</view>
      </view>
      <view class="quick-item" @click="goMyActivities">
        <view class="quick-icon">≡</view>
        <view class="quick-text">我的活动</view>
      </view>
    </view>

    <view class="section-header">
      <view class="section-title">推荐活动</view>
      <view class="section-link" @click="goCampaignList">查看全部</view>
    </view>

    <view v-if="loadingCampaign" class="card muted">活动加载中...</view>
    <view v-else-if="!campaigns.length" class="card muted">暂无活动</view>
    <view v-for="item in campaigns" :key="item.id" class="campaign-card" @click="goCampaignDetail(item.id)">
      <view class="campaign-title">{{ item.title }}</view>
      <view class="campaign-desc">{{ item.rewardDesc || item.description || '欢迎报名参与活动' }}</view>
      <view class="campaign-foot">
        <view>{{ item._count?.orders || 0 }} 人参与</view>
        <view>进入详情</view>
      </view>
    </view>

    <view class="section-header">
      <view class="section-title">校园资讯</view>
      <view class="section-link" @click="goNews">查看更多</view>
    </view>

    <view v-if="loadingNews" class="card muted">资讯加载中...</view>
    <view v-else-if="!newsList.length" class="card muted">暂无资讯</view>
    <view v-for="item in newsList" :key="item.id" class="news-card" @click="goArticleDetail(item.id)">
      <view class="news-title">{{ item.title }}</view>
      <view class="news-summary">{{ item.summary || '点击查看详情' }}</view>
      <view class="news-time">{{ item.publishedAt || item.createdAt }}</view>
    </view>

    <app-tabbar current="home" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppTabbar from '@/components/app-tabbar.vue';
import { getCampaignList, type CampaignItem } from '@/api/campaign';
import { getContentList, type ContentArticleItem } from '@/api/content';
import { getRewardOverview } from '@/api/growth';
import { useUserStore } from '@/store/user';
import { buildCampaignDetailPath, redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const campaigns = ref<CampaignItem[]>([]);
const newsList = ref<ContentArticleItem[]>([]);
const loadingCampaign = ref(false);
const loadingNews = ref(false);
const unreadCount = ref(0);

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

function goCampaignDetail(id: string) {
  uni.navigateTo({ url: buildCampaignDetailPath(id) });
}

function goCampaignList() {
  uni.navigateTo({ url: '/pages/campaign/list' });
}

function goReward() {
  uni.reLaunch({ url: '/pages/reward/index' });
}

function goNews() {
  uni.reLaunch({ url: '/pages/news/list' });
}

function goMessages() {
  uni.navigateTo({ url: '/pages/message/list' });
}

function goMyActivities() {
  uni.navigateTo({ url: '/pages/order/list' });
}

function goArticleDetail(id: string) {
  uni.navigateTo({ url: `/pages/content/detail?id=${id}` });
}

async function fetchCampaigns() {
  loadingCampaign.value = true;
  try {
    const res = await getCampaignList();
    campaigns.value = res.data.slice(0, 6);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取活动失败', icon: 'none' });
  } finally {
    loadingCampaign.value = false;
  }
}

async function fetchNews() {
  loadingNews.value = true;
  try {
    const res = await getContentList('news');
    newsList.value = res.data.slice(0, 4);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取资讯失败', icon: 'none' });
  } finally {
    loadingNews.value = false;
  }
}

async function fetchRewardOverview() {
  try {
    const res = await getRewardOverview(userStore.id);
    unreadCount.value = res.data.unreadMessageCount || 0;
  } catch {
    unreadCount.value = 0;
  }
}

onShow(() => {
  if (!ensureStudentLogin()) {
    return;
  }
  fetchCampaigns();
  fetchNews();
  fetchRewardOverview();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 140rpx;
  background: #f5f7fb;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
}

.location {
  font-size: 34rpx;
  font-weight: 700;
  color: #0f172a;
}

.message {
  font-size: 24rpx;
  color: #0f766e;
}

.search-card,
.banner,
.campaign-card,
.news-card,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.search-placeholder {
  color: #94a3b8;
}

.banner {
  color: #fff;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  font-size: 30rpx;
  font-weight: 700;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.quick-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 18rpx 10rpx;
  text-align: center;
}

.quick-icon {
  font-size: 32rpx;
  color: #0f766e;
}

.quick-text {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #334155;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24rpx 0 16rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
}

.section-link {
  color: #0f766e;
  font-size: 24rpx;
}

.campaign-title,
.news-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #0f172a;
}

.campaign-desc,
.news-summary,
.news-time,
.campaign-foot,
.muted {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.6;
}

.campaign-foot {
  display: flex;
  justify-content: space-between;
}
</style>
