<template>
  <view class="page">
    <view class="hero">
      <view class="hero-title">我的积分</view>
      <view class="hero-points">{{ overview.points }}</view>
      <view class="hero-sub">已兑换 {{ overview.redeemCount }} 次</view>
    </view>

    <view class="quick-grid">
      <view class="quick-card" @click="goRedeemOrders">
        <view class="quick-title">兑换记录</view>
        <view class="quick-desc">查看积分商品兑换订单</view>
      </view>
      <view class="quick-card" @click="goMessages">
        <view class="quick-title">消息通知</view>
        <view class="quick-desc">未读 {{ overview.unreadMessageCount || 0 }} 条</view>
      </view>
    </view>

    <view class="section-title">热门兑换</view>
    <view v-if="loading" class="card muted">加载中...</view>
    <view v-else-if="!goodsList.length" class="card muted">暂无可兑换商品</view>
    <view v-for="item in goodsList" :key="item.id" class="goods-card">
      <view class="goods-title">{{ item.title }}</view>
      <view class="goods-desc">{{ item.description || '积分商品' }}</view>
      <view class="goods-foot">
        <view>{{ item.points }} 积分</view>
        <button class="redeem-btn" size="mini" @click="handleRedeem(item.id)">立即兑换</button>
      </view>
    </view>

    <view class="section-title">积分明细</view>
    <view v-for="item in records" :key="item.id" class="record-card">
      <view class="record-title">{{ item.remark || item.type }}</view>
      <view class="record-meta">{{ item.createdAt }}</view>
      <view :class="['record-value', item.changeValue >= 0 ? 'plus' : 'minus']">
        {{ item.changeValue >= 0 ? '+' : '' }}{{ item.changeValue }}
      </view>
    </view>

    <app-tabbar current="reward" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppTabbar from '@/components/app-tabbar.vue';
import {
  getPointRecordList,
  getRewardGoodsList,
  getRewardOverview,
  redeemReward,
  type PointRecordItem,
  type RewardGoodsItem,
  type RewardOverviewData,
} from '@/api/growth';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const goodsList = ref<RewardGoodsItem[]>([]);
const records = ref<PointRecordItem[]>([]);
const overview = ref<RewardOverviewData>({
  points: 0,
  redeemCount: 0,
  unreadMessageCount: 0,
  goodsList: [],
});

function ensureStudentLogin() {
  if (!userStore.token) {
    redirectToLogin('/pages/reward/index');
    return false;
  }
  return true;
}

function goRedeemOrders() {
  uni.navigateTo({ url: '/pages/reward/orders' });
}

function goMessages() {
  uni.navigateTo({ url: '/pages/message/list' });
}

async function fetchData() {
  loading.value = true;
  try {
    const [overviewRes, goodsRes, recordRes] = await Promise.all([
      getRewardOverview(userStore.id),
      getRewardGoodsList(),
      getPointRecordList(userStore.id),
    ]);
    overview.value = overviewRes.data;
    goodsList.value = goodsRes.data;
    records.value = recordRes.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取奖励数据失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

async function handleRedeem(goodsId: string) {
  try {
    await redeemReward(userStore.id, goodsId);
    uni.showToast({ title: '兑换成功', icon: 'success' });
    fetchData();
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '兑换失败', icon: 'none' });
  }
}

onShow(() => {
  if (!ensureStudentLogin()) return;
  fetchData();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 140rpx;
  background: #f5f7fb;
}

.hero,
.goods-card,
.record-card,
.card,
.quick-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.hero {
  background: linear-gradient(135deg, #fb7185, #f97316);
  color: #fff;
}

.hero-title {
  font-size: 26rpx;
}

.hero-points {
  margin-top: 12rpx;
  font-size: 56rpx;
  font-weight: 700;
}

.hero-sub,
.goods-desc,
.record-meta,
.muted,
.quick-desc {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #64748b;
}

.hero-sub {
  color: rgba(255, 255, 255, 0.88);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-top: 16rpx;
}

.quick-title {
  font-size: 28rpx;
  font-weight: 700;
}

.section-title {
  margin: 24rpx 0 16rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.goods-title,
.record-title {
  font-size: 28rpx;
  font-weight: 700;
}

.goods-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14rpx;
  font-size: 26rpx;
  color: #0f766e;
}

.redeem-btn {
  margin: 0;
  background: #0f766e;
  color: #fff;
}

.record-value {
  margin-top: 12rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.plus {
  color: #16a34a;
}

.minus {
  color: #dc2626;
}
</style>
