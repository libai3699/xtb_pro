<template>
  <view class="page">
    <view class="hero">
      <view class="eyebrow">校推宝 Pro H5</view>
      <view class="title">招生推广与报名闭环</view>
      <view class="desc">学生可直接报名下单，代理可复制推广链接、查看线索与订单转化。</view>
    </view>

    <view class="panel">
      <view class="panel-title">选择身份</view>
      <view class="role-row">
        <view
          :class="['role-card', form.role === 'student' ? 'active student' : '']"
          @click="form.role = 'student'"
        >
          <view class="role-name">学生端</view>
          <view class="role-desc">浏览活动、提交报名、完成下单</view>
        </view>
        <view
          :class="['role-card', form.role === 'agent' ? 'active agent' : '']"
          @click="form.role = 'agent'"
        >
          <view class="role-name">代理端</view>
          <view class="role-desc">推广活动、复制链接、查看数据</view>
        </view>
      </view>
    </view>

    <view class="panel">
      <view class="panel-title">登录 / 注册</view>
      <input v-model="form.mobile" class="input" placeholder="请输入手机号" />
      <input v-model="form.nickname" class="input" placeholder="注册时填写昵称，登录可留空" />
      <button class="primary-btn" type="primary" @click="handleLogin">立即进入</button>
      <button class="ghost-btn" @click="handleRegister">没有账号，先注册</button>
      <view class="tips">
        <view>测试方式：第一版用手机号模拟微信登录。</view>
        <view>同一手机号可分别注册学生和代理身份。</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { appLogin, appRegister } from '@/api/auth';
import { useUserStore } from '@/store/user';
import { goRoleHome } from '@/utils/app';
import { consumeRedirectUrl } from '@/utils/storage';

const userStore = useUserStore();

const form = reactive({
  role: 'student' as 'agent' | 'student',
  mobile: '',
  nickname: '',
});

function resolveAfterLogin(role: 'agent' | 'student') {
  const redirectUrl = consumeRedirectUrl();
  if (redirectUrl) {
    uni.reLaunch({ url: redirectUrl });
    return;
  }
  goRoleHome(role);
}

async function handleLogin() {
  if (!form.mobile.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' });
    return;
  }

  try {
    const res = await appLogin({
      code: form.mobile.trim(),
      role: form.role,
    });

    userStore.setUser({
      id: res.data.user.id,
      role: res.data.user.role,
      token: res.data.token,
      nickname: res.data.user.nickname,
      mobile: res.data.user.mobile,
    });

    uni.showToast({ title: '登录成功', icon: 'success' });
    resolveAfterLogin(res.data.user.role);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '登录失败', icon: 'none' });
  }
}

async function handleRegister() {
  if (!form.mobile.trim() || !form.nickname.trim()) {
    uni.showToast({ title: '请填写手机号和昵称', icon: 'none' });
    return;
  }

  try {
    await appRegister({
      role: form.role,
      mobile: form.mobile.trim(),
      nickname: form.nickname.trim(),
    });
    uni.showToast({ title: '注册成功，正在登录', icon: 'success' });
    await handleLogin();
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '注册失败', icon: 'none' });
  }
}

onShow(() => {
  if (userStore.token) {
    resolveAfterLogin(userStore.role);
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28rpx;
  background:
    radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 32%),
    linear-gradient(180deg, #f5fbfa 0%, #f4f7fb 100%);
}

.hero {
  border-radius: 28rpx;
  padding: 40rpx 32rpx;
  color: #fff;
  background: linear-gradient(135deg, #0f766e 0%, #14b8a6 55%, #22c55e 100%);
  box-shadow: 0 24rpx 60rpx rgba(15, 118, 110, 0.24);
  margin-bottom: 24rpx;
}

.eyebrow {
  font-size: 22rpx;
  opacity: 0.9;
  letter-spacing: 2rpx;
}

.title {
  margin-top: 12rpx;
  font-size: 44rpx;
  font-weight: 700;
}

.desc {
  margin-top: 16rpx;
  font-size: 26rpx;
  line-height: 1.7;
}

.panel {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 20rpx 50rpx rgba(15, 23, 42, 0.06);
}

.panel-title {
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}

.role-row {
  display: flex;
  gap: 16rpx;
}

.role-card {
  flex: 1;
  padding: 24rpx;
  border-radius: 20rpx;
  background: #f8fafc;
  border: 2rpx solid transparent;
}

.role-card.active.student {
  border-color: #f97316;
  background: #fff7ed;
}

.role-card.active.agent {
  border-color: #0f766e;
  background: #f0fdfa;
}

.role-name {
  font-size: 28rpx;
  font-weight: 700;
}

.role-desc {
  margin-top: 10rpx;
  color: #64748b;
  line-height: 1.6;
  font-size: 24rpx;
}

.input {
  height: 88rpx;
  background: #f8fafc;
  border-radius: 18rpx;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
}

.primary-btn {
  margin-top: 8rpx;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
}

.ghost-btn {
  margin-top: 16rpx;
  background: #fff;
  color: #0f766e;
  border: 2rpx solid #99f6e4;
}

.tips {
  margin-top: 18rpx;
  font-size: 22rpx;
  color: #64748b;
  line-height: 1.8;
}
</style>
