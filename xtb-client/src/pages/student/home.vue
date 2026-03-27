<template>
  <view class="page">
    <view class="topbar">
      <view class="location">校推宝Pro</view>
      <view class="message" @click="goMessages">
        消息
        <text v-if="unreadCount > 0" class="badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</text>
      </view>
    </view>

    <view class="search-card" @click="goCampaignList">
      <text class="search-icon">⌕</text>
      <text class="search-text">搜索活动、课程、校园热点</text>
    </view>

    <scroll-view class="category-tabs" scroll-x>
      <view v-for="item in categories" :key="item" :class="['category-chip', item === activeCategory ? 'active' : '']" @click="activeCategory = item">
        {{ item }}
      </view>
    </scroll-view>

    <view class="banner-card">
      <view class="banner-title">新学期热门活动进行中</view>
      <view class="banner-desc">精选校园活动、成长任务和报名项目，一键参与</view>
    </view>

    <view class="quick-grid">
      <view class="quick-item" @click="goCampaignList">
        <view class="quick-icon">活</view>
        <view class="quick-text">全部活动</view>
      </view>
      <view class="quick-item" @click="goReward">
        <view class="quick-icon">奖</view>
        <view class="quick-text">奖励中心</view>
      </view>
      <view class="quick-item" @click="goNews">
        <view class="quick-icon">讯</view>
        <view class="quick-text">校园资讯</view>
      </view>
      <view class="quick-item" @click="goMyActivities">
        <view class="quick-icon">我</view>
        <view class="quick-text">我的活动</view>
      </view>
    </view>

    <view class="section-header">
      <view class="section-title">推荐活动</view>
      <view class="section-link" @click="goCampaignList">查看全部</view>
    </view>

    <view v-if="loadingCampaign" class="empty-card">活动加载中...</view>
    <view v-else-if="!campaigns.length" class="empty-card">暂无活动</view>
    <view v-for="item in campaigns" :key="item.id" class="activity-card" @click="goCampaignDetail(item.id)">
      <image v-if="item.cover" :src="item.cover" class="activity-image" mode="aspectFill" />
      <view v-else class="activity-image placeholder">热门活动海报</view>
      <view class="activity-title">{{ item.title }}</view>
      <view class="activity-info">
        <view class="info-item">报名中</view>
        <view class="info-item">{{ item._count?.orders || 0 }} 人参与</view>
        <view class="info-item">{{ item.startTime || item.createdAt }}</view>
        <view class="info-item">{{ item.rewardDesc || '活动奖励待公布' }}</view>
      </view>
      <view class="activity-actions">
        <view class="reward-badge">{{ item.rewardDesc || '参与可得奖励' }}</view>
        <button class="join-btn" size="mini" type="primary">立即参与</button>
      </view>
    </view>

    <view class="section-header">
      <view class="section-title">校园资讯</view>
      <view class="section-link" @click="goNews">查看更多</view>
    </view>

    <view v-if="loadingNews" class="empty-card">资讯加载中...</view>
    <view v-else-if="!newsList.length" class="empty-card">暂无资讯</view>
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
const categories = ['全部', '推荐', '热门', '课程', '校园'];
const activeCategory = ref('全部');

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
  background: #f6f6f8;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
}

.location {
  font-size: 32rpx;
  font-weight: 700;
  color: #5b5fc7;
}

.message {
  position: relative;
  font-size: 24rpx;
  color: #667eea;
}

.badge {
  position: absolute;
  top: -10rpx;
  right: -24rpx;
  min-width: 28rpx;
  height: 28rpx;
  padding: 0 8rpx;
  border-radius: 999rpx;
  background: #ff4757;
  color: #fff;
  font-size: 18rpx;
  text-align: center;
  line-height: 28rpx;
}

.search-card,
.banner-card,
.activity-card,
.news-card,
.empty-card,
.quick-item {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.05);
}

.search-card {
  display: flex;
  align-items: center;
  padding: 22rpx 24rpx;
  margin-bottom: 18rpx;
}

.search-icon {
  color: #9ca3af;
  margin-right: 12rpx;
}

.search-text {
  font-size: 24rpx;
  color: #94a3b8;
}

.category-tabs {
  white-space: nowrap;
  margin-bottom: 18rpx;
}

.category-chip {
  display: inline-block;
  padding: 12rpx 22rpx;
  margin-right: 12rpx;
  border-radius: 999rpx;
  background: #fff;
  color: #64748b;
  font-size: 24rpx;
}

.category-chip.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.banner-card {
  padding: 30rpx;
  margin-bottom: 18rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.banner-title {
  font-size: 34rpx;
  font-weight: 700;
}

.banner-desc {
  margin-top: 10rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.92);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-bottom: 22rpx;
}

.quick-item {
  padding: 18rpx 10rpx;
  text-align: center;
}

.quick-icon {
  width: 56rpx;
  height: 56rpx;
  margin: 0 auto;
  border-radius: 18rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 24rpx;
  line-height: 56rpx;
  font-weight: 700;
}

.quick-text {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #475569;
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
  color: #667eea;
  font-size: 24rpx;
}

.empty-card {
  padding: 26rpx;
  color: #94a3b8;
  margin-bottom: 16rpx;
}

.activity-card {
  padding: 18rpx;
  margin-bottom: 16rpx;
}

.activity-image {
  width: 100%;
  height: 220rpx;
  border-radius: 18rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24rpx;
}

.activity-title {
  margin-top: 16rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: #1f2937;
}

.activity-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10rpx;
  margin-top: 14rpx;
}

.info-item {
  font-size: 22rpx;
  color: #6b7280;
}

.activity-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
}

.reward-badge {
  max-width: 70%;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  font-size: 22rpx;
}

.join-btn {
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.news-card {
  padding: 22rpx 24rpx;
  margin-bottom: 16rpx;
}

.news-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #1f2937;
}

.news-summary,
.news-time {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.6;
}
</style>
