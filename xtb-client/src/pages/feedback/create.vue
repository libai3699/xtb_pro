<template>
  <view class="page">
    <view class="hero">
      <view class="title">意见反馈</view>
      <view class="sub">问题、建议、体验反馈都可以在这里提交</view>
    </view>

    <view class="card">
      <picker mode="selector" :range="typeOptions" range-key="label" @change="handleTypeChange">
        <view class="picker">反馈类型：{{ currentTypeLabel }}</view>
      </picker>
      <textarea v-model="form.content" class="textarea" placeholder="请描述你遇到的问题或建议" />
      <input v-model="form.contact" class="input" placeholder="联系方式选填" />
      <button class="submit-btn" type="primary" @click="submit">提交反馈</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { createFeedback } from '@/api/growth';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const typeOptions = [
  { label: '建议反馈', value: 'suggestion' },
  { label: '功能异常', value: 'bug' },
  { label: '活动问题', value: 'campaign' },
];

const form = reactive({
  type: 'suggestion',
  content: '',
  contact: '',
});

const currentTypeLabel = computed(() => typeOptions.find((item) => item.value === form.type)?.label || '建议反馈');

function handleTypeChange(event: { detail: { value: string } }) {
  form.type = typeOptions[Number(event.detail.value)]?.value || 'suggestion';
}

async function submit() {
  if (!form.content.trim()) {
    uni.showToast({ title: '请先填写反馈内容', icon: 'none' });
    return;
  }

  try {
    await createFeedback({
      userId: userStore.id || undefined,
      type: form.type,
      content: form.content.trim(),
      contact: form.contact.trim() || undefined,
    });
    uni.showToast({ title: '提交成功', icon: 'success' });
    form.content = '';
    form.contact = '';
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

.hero,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.hero {
  background: linear-gradient(135deg, #1d4ed8, #38bdf8);
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

.picker,
.input,
.textarea {
  width: 100%;
  box-sizing: border-box;
  border-radius: 18rpx;
  background: #f8fafc;
  margin-bottom: 16rpx;
}

.picker,
.input {
  height: 88rpx;
  padding: 0 24rpx;
  line-height: 88rpx;
}

.textarea {
  min-height: 260rpx;
  padding: 24rpx;
}

.submit-btn {
  background: #1d4ed8;
}
</style>
