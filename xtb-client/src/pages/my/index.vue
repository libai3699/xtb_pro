<template>
  <view class="page">
    <view class="profile-card">
      <view class="profile-name">{{ userStore.nickname || '未命名用户' }}</view>
      <view class="profile-meta">{{ userStore.role === 'agent' ? '代理身份' : '学生身份' }}</view>
      <view class="profile-meta">账号：{{ userStore.account || '-' }}</view>
      <view class="profile-meta">手机号：{{ userStore.mobile || '-' }}</view>
    </view>

    <template v-if="userStore.role === 'student'">
      <view class="menu-card" @click="go('/pages/order/list')">
        <view class="menu-title">我的活动</view>
        <view class="menu-desc">查看活动参与记录和订单状态</view>
      </view>
      <view class="menu-card" @click="go('/pages/favorite/list')">
        <view class="menu-title">我的收藏</view>
        <view class="menu-desc">查看收藏的活动和资讯</view>
      </view>
      <view class="menu-card" @click="go('/pages/reward/orders')">
        <view class="menu-title">兑换记录</view>
        <view class="menu-desc">查看积分兑换订单状态</view>
      </view>
      <view class="menu-card" @click="go('/pages/certificate/list')">
        <view class="menu-title">我的证书</view>
        <view class="menu-desc">查看已发放的学习证书</view>
      </view>
      <view class="menu-card" @click="go('/pages/learning/list')">
        <view class="menu-title">学习记录</view>
        <view class="menu-desc">查看课程学习进度</view>
      </view>
    </template>

    <template v-else>
      <view class="menu-card" @click="go('/pages/agent/home')">
        <view class="menu-title">工作台</view>
        <view class="menu-desc">返回代理工作台首页</view>
      </view>
      <view class="menu-card" @click="go('/pages/agent/stats')">
        <view class="menu-title">推广数据</view>
        <view class="menu-desc">查看推广效果和收益情况</view>
      </view>
      <view class="menu-card" @click="go('/pages/share/list')">
        <view class="menu-title">推广记录</view>
        <view class="menu-desc">查看每个活动的浏览、留资和订单转化</view>
      </view>
    </template>

    <view class="menu-card" @click="go('/pages/message/list')">
      <view class="menu-title">消息中心</view>
      <view class="menu-desc">系统消息、活动提醒、奖励通知</view>
    </view>
    <view class="menu-card" @click="go('/pages/help/list')">
      <view class="menu-title">帮助中心</view>
      <view class="menu-desc">常见问题与参与说明</view>
    </view>
    <view class="menu-card" @click="go('/pages/feedback/create')">
      <view class="menu-title">意见反馈</view>
      <view class="menu-desc">提交问题、建议和使用体验反馈</view>
    </view>
    <view class="menu-card" @click="go('/pages/settings/index')">
      <view class="menu-title">账号设置</view>
      <view class="menu-desc">修改资料、头像和登录密码</view>
    </view>

    <view class="menu-card danger" @click="logout">
      <view class="menu-title">退出登录</view>
      <view class="menu-desc">清空登录态并返回登录页</view>
    </view>

    <app-tabbar current="my" />
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import AppTabbar from '@/components/app-tabbar.vue';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();

function go(url: string) {
  uni.navigateTo({ url });
}

function logout() {
  userStore.logout();
  redirectToLogin();
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/my/index');
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 140rpx;
  background: #f5f7fb;
}

.profile-card,
.menu-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 26rpx;
  margin-bottom: 16rpx;
}

.profile-card {
  background: linear-gradient(135deg, #111827 0%, #334155 100%);
  color: #fff;
}

.profile-name {
  font-size: 34rpx;
  font-weight: 700;
}

.profile-meta {
  margin-top: 10rpx;
  font-size: 24rpx;
  opacity: 0.9;
}

.menu-title {
  font-size: 28rpx;
  font-weight: 700;
}

.menu-desc {
  margin-top: 10rpx;
  color: #64748b;
  font-size: 24rpx;
}

.danger {
  color: #dc2626;
}
</style>
