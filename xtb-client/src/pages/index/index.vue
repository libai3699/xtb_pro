<template>
  <view class="page">
    <view class="hero">
      <view class="hero-top">
        <view class="hero-badge">校推宝Pro</view>
        <view class="hero-role">{{ form.role === 'student' ? '学生端' : '代理端' }}</view>
      </view>
      <view class="hero-title">校园活动增长与报名闭环</view>
      <view class="hero-desc">统一账号体系，按学生端和代理端切换登录注册，注册字段和后台管理保持一致。</view>
    </view>

    <view class="auth-card">
      <view class="role-tabs">
        <view :class="['role-tab', form.role === 'student' ? 'active' : '']" @click="switchRole('student')">学生端</view>
        <view :class="['role-tab', form.role === 'agent' ? 'active' : '']" @click="switchRole('agent')">代理端</view>
      </view>

      <view class="mode-tabs">
        <view :class="['mode-tab', mode === 'login' ? 'active' : '']" @click="mode = 'login'">登录</view>
        <view :class="['mode-tab', mode === 'register' ? 'active' : '']" @click="mode = 'register'">注册</view>
      </view>

      <view class="form-card">
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

        <button v-if="mode === 'login'" class="submit-btn" type="primary" @click="handleLogin">立即登录</button>
        <button v-else class="submit-btn" type="primary" @click="handleRegister">立即注册</button>

        <view class="tips">
          <view v-if="mode === 'login'">登录必填：账号、密码</view>
          <view v-else-if="form.role === 'student'">学生注册必填：账号、密码、昵称；手机号选填</view>
          <view v-else>代理注册必填：账号、密码、昵称、手机号、真实姓名</view>
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
  background: linear-gradient(180deg, #eef1ff 0%, #f7f8fc 42%, #f5f7fb 100%);
}

.hero {
  border-radius: 32rpx;
  padding: 34rpx 30rpx 44rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 24rpx 60rpx rgba(102, 126, 234, 0.28);
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-badge,
.hero-role {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.16);
  font-size: 22rpx;
}

.hero-title {
  margin-top: 22rpx;
  font-size: 46rpx;
  font-weight: 700;
  line-height: 1.25;
}

.hero-desc {
  margin-top: 16rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.92);
}

.auth-card {
  margin-top: -24rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 26rpx;
  box-shadow: 0 18rpx 40rpx rgba(15, 23, 42, 0.08);
}

.role-tabs,
.mode-tabs {
  display: flex;
  gap: 12rpx;
}

.mode-tabs {
  margin-top: 18rpx;
}

.role-tab,
.mode-tab {
  flex: 1;
  text-align: center;
  padding: 18rpx 0;
  border-radius: 18rpx;
  font-size: 26rpx;
  background: #f3f4f6;
  color: #64748b;
}

.role-tab.active,
.mode-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 700;
}

.form-card {
  margin-top: 20rpx;
  padding: 12rpx 0 6rpx;
}

.input {
  height: 92rpx;
  background: #f8fafc;
  border-radius: 18rpx;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
  font-size: 26rpx;
}

.submit-btn {
  margin-top: 10rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 18rpx;
}

.tips {
  margin-top: 18rpx;
  font-size: 22rpx;
  color: #64748b;
  line-height: 1.8;
}
</style>
