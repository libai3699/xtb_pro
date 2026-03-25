<template>
  <view class="page">
    <view class="hero">
      <view class="title">校推宝Pro</view>
      <view class="desc">先登录，再按身份进入代理端或学生端</view>
    </view>

    <view class="card">
      <view class="section-title">身份</view>
      <view class="role-group">
        <button :class="['role-btn', form.role === 'student' ? 'active' : '']" @click="form.role = 'student'">学生</button>
        <button :class="['role-btn', form.role === 'agent' ? 'active' : '']" @click="form.role = 'agent'">代理</button>
      </view>
    </view>

    <view class="card">
      <view class="section-title">登录</view>
      <input v-model="form.mobile" class="input" placeholder="请输入手机号" />
      <input v-model="form.nickname" class="input" placeholder="注册时请输入昵称，登录可不填" />
      <view class="action-row">
        <button type="primary" @click="handleLogin">登录</button>
        <button @click="handleRegister">注册</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { appLogin, appRegister } from '@/api/auth';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

const form = reactive({
  role: 'student' as 'agent' | 'student',
  mobile: '',
  nickname: '',
});

function routeHome(role: 'agent' | 'student') {
  uni.reLaunch({
    url: role === 'agent' ? '/pages/agent/home' : '/pages/student/home',
  });
}

async function handleLogin() {
  if (!form.mobile.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' });
    return;
  }

  try {
    const res = await appLogin({
      code: form.mobile,
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
    routeHome(res.data.user.role);
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
      mobile: form.mobile,
      nickname: form.nickname,
    });
    uni.showToast({ title: '注册成功，请登录', icon: 'success' });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '注册失败', icon: 'none' });
  }
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.hero {
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  border-radius: 24rpx;
  color: #fff;
  padding: 40rpx 32rpx;
  margin-bottom: 24rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
}

.desc {
  margin-top: 12rpx;
  font-size: 28rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  margin-bottom: 16rpx;
}

.role-group {
  display: flex;
  gap: 16rpx;
}

.role-btn {
  flex: 1;
  border: 1px solid #cbd5e1;
  background: #fff;
}

.role-btn.active {
  background: #0f766e;
  color: #fff;
  border-color: #0f766e;
}

.input {
  height: 84rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
}

.action-row {
  display: flex;
  gap: 16rpx;
}
</style>

