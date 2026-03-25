<template>
  <view class="page">
    <view class="card">
      <view class="title">提交报名信息</view>
      <input v-model="form.name" class="input" placeholder="姓名" />
      <input v-model="form.mobile" class="input" placeholder="手机号" />
      <input v-model="form.schoolName" class="input" placeholder="学校" />
      <input v-model="form.majorName" class="input" placeholder="专业" />
      <input v-model="form.gradeName" class="input" placeholder="年级" />
      <input v-model="form.remark" class="input" placeholder="备注" />
      <button type="primary" @click="handleSubmit">提交</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { submitLead } from '@/api/lead';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const campaignId = ref('');
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
      studentUserId: Number(userStore.id),
      name: form.name,
      mobile: form.mobile,
      schoolName: form.schoolName || undefined,
      majorName: form.majorName || undefined,
      gradeName: form.gradeName || undefined,
      remark: form.remark || undefined,
    });
    uni.showToast({ title: '提交成功', icon: 'success' });
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '提交失败', icon: 'none' });
  }
}
</script>

<style scoped>
.page {
  padding: 24rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
}

.title {
  font-weight: 700;
  margin-bottom: 16rpx;
}

.input {
  height: 84rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
}
</style>

