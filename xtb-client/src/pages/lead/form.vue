<template>
  <view class="page">
    <view class="card">
      <view class="title">提交报名信息</view>
      <view class="tip">提交后机构后台会收到你的线索，后续可联系跟进。</view>
      <input v-model="form.name" class="input" placeholder="姓名" />
      <input v-model="form.mobile" class="input" placeholder="手机号" />
      <input v-model="form.schoolName" class="input" placeholder="学校" />
      <input v-model="form.majorName" class="input" placeholder="专业" />
      <input v-model="form.gradeName" class="input" placeholder="年级" />
      <input v-model="form.remark" class="input" placeholder="备注，如想咨询的班型" />
      <button type="primary" @click="handleSubmit">立即提交</button>
    </view>

    <view v-if="agentHint" class="referral-card">
      当前报名已绑定代理来源，提交后会自动归因。
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { submitLead } from '@/api/lead';
import { useUserStore } from '@/store/user';
import { getCampaignReferral } from '@/utils/storage';

const userStore = useUserStore();
const campaignId = ref('');
const agentUserId = ref('');
const agentHint = ref(false);

const form = reactive({
  name: '',
  mobile: '',
  schoolName: '',
  majorName: '',
  gradeName: '',
  remark: '',
});

onLoad((options) => {
  campaignId.value = String(options?.campaignId || '');
  const referral = getCampaignReferral(campaignId.value);
  agentUserId.value = referral?.agentUserId || '';
  agentHint.value = Boolean(agentUserId.value);
  form.name = userStore.nickname || '';
  form.mobile = userStore.mobile || '';
});

async function handleSubmit() {
  if (!campaignId.value || !form.name.trim() || !form.mobile.trim()) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
    return;
  }

  try {
    await submitLead({
      campaignId: Number(campaignId.value),
      agentUserId: agentUserId.value ? Number(agentUserId.value) : undefined,
      studentUserId: Number(userStore.id),
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      schoolName: form.schoolName.trim() || undefined,
      majorName: form.majorName.trim() || undefined,
      gradeName: form.gradeName.trim() || undefined,
      remark: form.remark.trim() || undefined,
    });
    uni.showToast({ title: '提交成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 500);
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '提交失败', icon: 'none' });
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f7fb;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
}

.title {
  font-size: 32rpx;
  font-weight: 700;
}

.tip {
  margin: 12rpx 0 20rpx;
  color: #64748b;
  line-height: 1.7;
  font-size: 24rpx;
}

.input {
  height: 88rpx;
  background: #f8fafc;
  border-radius: 18rpx;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
}

.referral-card {
  margin-top: 16rpx;
  background: #ecfeff;
  border-radius: 20rpx;
  padding: 22rpx 24rpx;
  color: #0f766e;
  font-size: 24rpx;
}
</style>
