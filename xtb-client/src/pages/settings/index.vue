<template>
  <view class="page">
    <view class="header-card">
      <view class="page-title">设置</view>
      <view class="page-subtitle">管理您的账户和偏好设置</view>
    </view>

    <view class="section-card">
      <view class="section-title">账户设置</view>
      <input v-model="profileForm.nickname" class="input" placeholder="昵称" />
      <input v-model="profileForm.mobile" class="input" placeholder="手机号" />
      <input v-model="profileForm.avatar" class="input" placeholder="头像地址" />
      <template v-if="userStore.role === 'agent'">
        <input v-model="profileForm.realName" class="input" placeholder="真实姓名" />
        <input v-model="profileForm.schoolName" class="input" placeholder="学校名称" />
        <input v-model="profileForm.majorName" class="input" placeholder="专业名称" />
        <input v-model="profileForm.gradeName" class="input" placeholder="年级" />
      </template>
      <button class="save-btn" type="primary" @click="saveProfile">保存账户设置</button>
    </view>

    <view class="section-card">
      <view class="section-title">安全设置</view>
      <input v-model="passwordForm.oldPassword" class="input" password placeholder="原密码" />
      <input v-model="passwordForm.newPassword" class="input" password placeholder="新密码" />
      <button class="save-btn secondary" @click="savePassword">更新登录密码</button>
    </view>

    <view class="section-card">
      <view class="section-title">通知设置</view>
      <view class="setting-row">
        <view>
          <view class="setting-title">消息提醒</view>
          <view class="setting-desc">活动、奖励和系统通知</view>
        </view>
        <switch checked color="#667eea" />
      </view>
      <view class="setting-row">
        <view>
          <view class="setting-title">营销信息</view>
          <view class="setting-desc">接收精选活动推荐</view>
        </view>
        <switch checked color="#667eea" />
      </view>
    </view>

    <view class="section-card">
      <view class="section-title">通用设置</view>
      <view class="setting-row">
        <view>
          <view class="setting-title">帮助中心</view>
          <view class="setting-desc">查看常见问题与参与说明</view>
        </view>
        <text class="setting-arrow" @click="go('/pages/help/list')">></text>
      </view>
      <view class="setting-row">
        <view>
          <view class="setting-title">意见反馈</view>
          <view class="setting-desc">提交问题和建议</view>
        </view>
        <text class="setting-arrow" @click="go('/pages/feedback/create')">></text>
      </view>
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

function go(url: string) {
  uni.navigateTo({ url });
}

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
    uni.showToast({ title: '保存成功', icon: 'success' });
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
  background: #f6f6f8;
}

.header-card,
.section-card {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.05);
}

.header-card {
  padding: 28rpx 24rpx;
  margin-bottom: 18rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1f2937;
}

.page-subtitle {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.section-card {
  padding: 24rpx;
  margin-bottom: 18rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: 18rpx;
}

.input {
  height: 88rpx;
  background: #f8fafc;
  border-radius: 18rpx;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
}

.save-btn {
  margin-top: 10rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 18rpx;
}

.secondary {
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1px solid #f1f5f9;
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-title {
  font-size: 28rpx;
  color: #1f2937;
}

.setting-desc {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #6b7280;
}

.setting-arrow {
  color: #94a3b8;
  font-size: 30rpx;
}
</style>
