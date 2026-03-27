<template>
  <view class="page">
    <view class="hero">
      <view class="title">账号设置</view>
      <view class="sub">维护昵称、头像、联系方式和登录密码</view>
    </view>

    <view class="card">
      <view class="section-title">基本资料</view>
      <input v-model="profileForm.nickname" class="input" placeholder="昵称" />
      <input v-model="profileForm.mobile" class="input" placeholder="手机号" />
      <input v-model="profileForm.avatar" class="input" placeholder="头像地址" />
      <template v-if="userStore.role === 'agent'">
        <input v-model="profileForm.realName" class="input" placeholder="真实姓名" />
        <input v-model="profileForm.schoolName" class="input" placeholder="学校名称" />
        <input v-model="profileForm.majorName" class="input" placeholder="专业名称" />
        <input v-model="profileForm.gradeName" class="input" placeholder="年级" />
        <input v-model="profileForm.inviteCode" class="input" placeholder="邀请码" />
      </template>
      <button type="primary" class="submit-btn" @click="saveProfile">保存资料</button>
    </view>

    <view class="card">
      <view class="section-title">修改密码</view>
      <input v-model="passwordForm.oldPassword" class="input" password placeholder="原密码" />
      <input v-model="passwordForm.newPassword" class="input" password placeholder="新密码" />
      <button class="submit-btn secondary" @click="savePassword">更新密码</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getAppProfile, updateAppPassword, updateAppProfile } from '@/api/user';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const profileForm = reactive({
  nickname: '',
  mobile: '',
  avatar: '',
  realName: '',
  schoolName: '',
  majorName: '',
  gradeName: '',
  inviteCode: '',
});
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
});

async function fetchProfile() {
  try {
    const res = await getAppProfile(userStore.id);
    profileForm.nickname = res.data.nickname || '';
    profileForm.mobile = res.data.mobile || '';
    profileForm.avatar = res.data.avatar || '';
    profileForm.realName = res.data.agentProfile?.realName || '';
    profileForm.schoolName = res.data.agentProfile?.schoolName || '';
    profileForm.majorName = res.data.agentProfile?.majorName || '';
    profileForm.gradeName = res.data.agentProfile?.gradeName || '';
    profileForm.inviteCode = res.data.agentProfile?.inviteCode || '';
    userStore.setUser({
      id: res.data.id,
      role: res.data.role,
      token: userStore.token,
      account: userStore.account,
      nickname: res.data.nickname,
      mobile: res.data.mobile,
      avatar: res.data.avatar,
    });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取资料失败', icon: 'none' });
  }
}

async function saveProfile() {
  if (!profileForm.nickname.trim()) {
    uni.showToast({ title: '昵称不能为空', icon: 'none' });
    return;
  }

  try {
    const res = await updateAppProfile({
      userId: Number(userStore.id),
      nickname: profileForm.nickname.trim(),
      mobile: profileForm.mobile.trim() || undefined,
      avatar: profileForm.avatar.trim() || undefined,
      realName: profileForm.realName.trim() || undefined,
      schoolName: profileForm.schoolName.trim() || undefined,
      majorName: profileForm.majorName.trim() || undefined,
      gradeName: profileForm.gradeName.trim() || undefined,
      inviteCode: profileForm.inviteCode.trim() || undefined,
    });

    userStore.setUser({
      id: res.data.id,
      role: res.data.role,
      token: userStore.token,
      account: userStore.account,
      nickname: res.data.nickname,
      mobile: res.data.mobile,
      avatar: res.data.avatar,
    });
    uni.showToast({ title: '资料已更新', icon: 'success' });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '保存失败', icon: 'none' });
  }
}

async function savePassword() {
  if (!passwordForm.oldPassword.trim() || !passwordForm.newPassword.trim()) {
    uni.showToast({ title: '请填写完整密码信息', icon: 'none' });
    return;
  }

  try {
    await updateAppPassword({
      userId: Number(userStore.id),
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });
    uni.showToast({ title: '密码修改成功', icon: 'success' });
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '修改失败', icon: 'none' });
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/settings/index');
    return;
  }
  fetchProfile();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f7fb;
}

.hero,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.hero {
  background: linear-gradient(135deg, #111827, #334155);
  color: #fff;
}

.title {
  font-size: 38rpx;
  font-weight: 700;
}

.sub {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.section-title {
  margin-bottom: 16rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.input {
  height: 88rpx;
  background: #f8fafc;
  border-radius: 18rpx;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
}

.submit-btn {
  background: #0f766e;
}

.secondary {
  background: #1d4ed8;
}
</style>
