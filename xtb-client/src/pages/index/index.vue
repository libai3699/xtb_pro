<template>
  <view class="page">
    <view class="hero">
      <view class="eyebrow">校推宝 Pro H5</view>
      <view class="title">招生推广与报名闭环</view>
      <view class="desc">学生端和代理端统一使用账号密码登录，注册字段和后台管理保持一致。</view>
    </view>

    <view class="panel">
      <view class="panel-title">选择身份</view>
      <view class="role-row">
        <view :class="['role-card', form.role === 'student' ? 'active student' : '']" @click="switchRole('student')">
          <view class="role-name">学生端</view>
          <view class="role-desc">报名活动、提交留资、查看订单</view>
        </view>
        <view :class="['role-card', form.role === 'agent' ? 'active agent' : '']" @click="switchRole('agent')">
          <view class="role-name">代理端</view>
          <view class="role-desc">推广活动、查看数据、管理个人推广</view>
        </view>
      </view>
    </view>

    <view class="panel">
      <view class="panel-title">账号入口</view>
      <view class="mode-tabs">
        <view :class="['mode-tab', mode === 'login' ? 'active' : '']" @click="mode = 'login'">登录</view>
        <view :class="['mode-tab', mode === 'register' ? 'active' : '']" @click="mode = 'register'">注册</view>
      </view>

      <input v-model="form.account" class="input" placeholder="请输入登录账号" />
      <input v-model="form.password" class="input" password placeholder="请输入登录密码" />

      <template v-if="mode === 'register'">
        <input v-model="form.nickname" class="input" placeholder="请输入昵称" />
        <input v-model="form.mobile" class="input" :placeholder="form.role === 'agent' ? '请输入手机号' : '手机号选填'" />

        <template v-if="form.role === 'agent'">
          <input v-model="form.realName" class="input" placeholder="请输入真实姓名" />
          <input v-model="form.schoolName" class="input" placeholder="请输入学校名称" />
          <input v-model="form.majorName" class="input" placeholder="请输入专业名称" />
          <input v-model="form.gradeName" class="input" placeholder="请输入年级" />
          <input v-model="form.inviteCode" class="input" placeholder="邀请码选填" />
        </template>
      </template>

      <button v-if="mode === 'login'" class="primary-btn" type="primary" @click="handleLogin">立即登录</button>
      <button v-else class="primary-btn" type="primary" @click="handleRegister">立即注册</button>

      <view class="tips">
        <view v-if="form.role === 'student' && mode === 'login'">学生登录必填：账号、密码。</view>
        <view v-if="form.role === 'student' && mode === 'register'">学生注册必填：账号、密码、昵称；手机号选填。</view>
        <view v-if="form.role === 'agent' && mode === 'login'">代理登录必填：账号、密码。</view>
        <view v-if="form.role === 'agent' && mode === 'register'">
          代理注册必填：账号、密码、昵称、手机号、真实姓名；学校、专业、年级、邀请码可补充。
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { appLogin, appRegister } from '@/api/auth';
import { useUserStore } from '@/store/user';
import { goRoleHome } from '@/utils/app';
import { consumeRedirectUrl } from '@/utils/storage';

const userStore = useUserStore();
const mode = ref<'login' | 'register'>('login');

const form = reactive({
  role: 'student' as 'agent' | 'student',
  account: '',
  password: '',
  nickname: '',
  mobile: '',
  realName: '',
  schoolName: '',
  majorName: '',
  gradeName: '',
  inviteCode: '',
});

function resetForm() {
  form.account = '';
  form.password = '';
  form.nickname = '';
  form.mobile = '';
  form.realName = '';
  form.schoolName = '';
  form.majorName = '';
  form.gradeName = '';
  form.inviteCode = '';
}

function switchRole(role: 'agent' | 'student') {
  form.role = role;
  mode.value = 'login';
  resetForm();
}

function resolveAfterLogin(role: 'agent' | 'student') {
  const redirectUrl = consumeRedirectUrl();
  if (redirectUrl) {
    uni.reLaunch({ url: redirectUrl });
    return;
  }
  goRoleHome(role);
}

async function handleLogin() {
  if (!form.account.trim()) {
    uni.showToast({ title: '请输入登录账号', icon: 'none' });
    return;
  }
  if (!form.password.trim()) {
    uni.showToast({ title: '请输入登录密码', icon: 'none' });
    return;
  }

  try {
    const res = await appLogin({
      role: form.role,
      account: form.account.trim(),
      password: form.password,
    });

    userStore.setUser({
      id: res.data.user.id,
      role: res.data.user.role,
      token: res.data.token,
      account: res.data.user.account,
      nickname: res.data.user.nickname,
      mobile: res.data.user.mobile,
      avatar: res.data.user.avatar,
    });

    uni.showToast({ title: '登录成功', icon: 'success' });
    resolveAfterLogin(res.data.user.role);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '登录失败', icon: 'none' });
  }
}

function validateRegister() {
  if (!form.account.trim()) {
    uni.showToast({ title: '请输入登录账号', icon: 'none' });
    return false;
  }
  if (!form.password.trim()) {
    uni.showToast({ title: '请输入登录密码', icon: 'none' });
    return false;
  }
  if (!form.nickname.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' });
    return false;
  }
  if (form.role === 'agent') {
    if (!form.mobile.trim()) {
      uni.showToast({ title: '请输入手机号', icon: 'none' });
      return false;
    }
    if (!form.realName.trim()) {
      uni.showToast({ title: '请输入真实姓名', icon: 'none' });
      return false;
    }
  }
  return true;
}

async function handleRegister() {
  if (!validateRegister()) {
    return;
  }

  try {
    await appRegister({
      role: form.role,
      account: form.account.trim(),
      password: form.password,
      nickname: form.nickname.trim(),
      mobile: form.mobile.trim() || undefined,
      realName: form.realName.trim() || undefined,
      schoolName: form.schoolName.trim() || undefined,
      majorName: form.majorName.trim() || undefined,
      gradeName: form.gradeName.trim() || undefined,
      inviteCode: form.inviteCode.trim() || undefined,
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
  margin-bottom: 18rpx;
}

.mode-tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 18rpx;
}

.mode-tab {
  flex: 1;
  text-align: center;
  padding: 18rpx 0;
  border-radius: 16rpx;
  background: #f1f5f9;
  color: #64748b;
}

.mode-tab.active {
  background: #0f766e;
  color: #fff;
  font-weight: 700;
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

.tips {
  margin-top: 18rpx;
  font-size: 22rpx;
  color: #64748b;
  line-height: 1.8;
}
</style>
