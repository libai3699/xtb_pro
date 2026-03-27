<template>
  <view class="page">
    <view class="title">创建活动</view>

    <view class="form-section">
      <view class="field">
        <view class="label">活动标题</view>
        <input v-model="form.title" class="input" placeholder="请输入活动标题" />
      </view>

      <view class="field">
        <view class="label">活动类型</view>
        <picker :range="campaignTypeOptions" range-key="label" @change="onCampaignTypeChange">
          <view class="picker-input">
            <text :class="form.campaignType ? 'picker-value' : 'picker-placeholder'">
              {{ campaignTypeLabel || '请选择活动类型' }}
            </text>
            <up-icon name="arrow-down-fill" :size="14" color="#94a3b8" />
          </view>
        </picker>
      </view>

      <view class="field">
        <view class="label">活动时间</view>
        <view class="date-grid">
          <picker mode="date" @change="onStartDateChange">
            <view class="date-input">
              <text :class="form.startDate ? 'picker-value' : 'picker-placeholder'">
                {{ form.startDate || '开始时间' }}
              </text>
              <up-icon name="calendar" :size="16" color="#64748b" />
            </view>
          </picker>
          <picker mode="date" @change="onEndDateChange">
            <view class="date-input">
              <text :class="form.endDate ? 'picker-value' : 'picker-placeholder'">
                {{ form.endDate || '结束时间' }}
              </text>
              <up-icon name="calendar" :size="16" color="#64748b" />
            </view>
          </picker>
        </view>
      </view>

      <view class="field">
        <view class="label">目标人数</view>
        <input v-model="form.targetCount" class="input" type="number" placeholder="请输入目标参与人数" />
      </view>

      <view class="field">
        <view class="label">活动地点</view>
        <view class="icon-input">
          <input v-model="form.location" class="input with-icon" placeholder="请输入活动地点" />
          <view class="suffix-icon">
            <up-icon name="map" :size="16" color="#64748b" />
          </view>
        </view>
      </view>

      <view class="field">
        <view class="label">活动描述</view>
        <textarea v-model="form.description" class="textarea" placeholder="请输入活动详细描述" />
      </view>

      <view class="field">
        <view class="label">活动封面</view>
        <view class="upload-card" @click="chooseCover">
          <image v-if="form.cover" :src="form.cover" mode="aspectFill" class="cover-preview" />
          <template v-else>
            <up-icon name="photo" :size="26" color="#6e79e5" />
            <view class="upload-title">点击上传活动封面图片</view>
            <view class="upload-tip">支持 JPG、PNG、WEBP，最大 5MB</view>
          </template>
        </view>
      </view>

      <view class="field">
        <view class="label">参与要求</view>
        <textarea v-model="form.requirement" class="textarea" placeholder="请输入参与活动的要求和条件" />
      </view>

      <view class="field">
        <view class="label">奖励设置</view>
        <textarea v-model="form.rewardDesc" class="textarea" placeholder="请输入活动奖励设置" />
      </view>
    </view>

    <view class="submit-wrap">
      <up-button type="primary" shape="circle" :loading="submitting || uploading" @click="submit">
        创建活动
      </up-button>
    </view>

    <up-toast ref="toastRef" />
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { createAppCampaign } from '@/api/campaign';
import { uploadAppImage } from '@/api/upload';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const toastRef = ref();
const submitting = ref(false);
const uploading = ref(false);

const campaignTypeOptions = [
  { label: '培训课程', value: 'training' },
  { label: '竞赛活动', value: 'competition' },
  { label: '工作坊', value: 'workshop' },
  { label: '研讨会', value: 'seminar' },
];

const form = reactive({
  title: '',
  campaignType: '',
  startDate: '',
  endDate: '',
  targetCount: '',
  location: '',
  description: '',
  cover: '',
  requirement: '',
  rewardDesc: '',
});

const campaignTypeLabel = computed(() => {
  return campaignTypeOptions.find((item) => item.value === form.campaignType)?.label || '';
});

function showMessage(message: string, type: 'success' | 'error' | 'default' = 'default') {
  toastRef.value?.show({
    message,
    type,
  });
}

function ensureAgentLogin() {
  if (!userStore.token) {
    redirectToLogin('/pages/campaign/create');
    return false;
  }
  if (userStore.role !== 'agent') {
    uni.reLaunch({ url: '/pages/student/home' });
    return false;
  }
  return true;
}

function onCampaignTypeChange(event: { detail: { value: number } }) {
  form.campaignType = campaignTypeOptions[event.detail.value]?.value || '';
}

function onStartDateChange(event: { detail: { value: string } }) {
  form.startDate = event.detail.value;
}

function onEndDateChange(event: { detail: { value: string } }) {
  form.endDate = event.detail.value;
}

async function chooseCover() {
  try {
    const chooseResult = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    });
    const filePath = chooseResult.tempFilePaths?.[0];
    if (!filePath) {
      return;
    }
    uploading.value = true;
    const result = await uploadAppImage(filePath);
    form.cover = result.url;
    showMessage('封面上传成功', 'success');
  } catch (error) {
    if (error && typeof error === 'object' && 'errMsg' in error && String(error.errMsg).includes('cancel')) {
      return;
    }
    showMessage(error instanceof Error ? error.message : '封面上传失败', 'error');
  } finally {
    uploading.value = false;
  }
}

function buildDateTime(value: string) {
  return value ? `${value}T00:00:00` : undefined;
}

function validateForm() {
  if (!form.title.trim()) {
    showMessage('请填写活动标题', 'error');
    return false;
  }
  if (!form.campaignType) {
    showMessage('请选择活动类型', 'error');
    return false;
  }
  if (!form.startDate || !form.endDate) {
    showMessage('请选择活动时间', 'error');
    return false;
  }
  if (!form.targetCount.trim()) {
    showMessage('请填写目标人数', 'error');
    return false;
  }
  if (!form.location.trim()) {
    showMessage('请填写活动地点', 'error');
    return false;
  }
  if (!form.description.trim()) {
    showMessage('请填写活动描述', 'error');
    return false;
  }
  if (!form.requirement.trim()) {
    showMessage('请填写参与要求', 'error');
    return false;
  }
  if (!form.rewardDesc.trim()) {
    showMessage('请填写奖励设置', 'error');
    return false;
  }
  return true;
}

async function submit() {
  if (!validateForm()) {
    return;
  }

  submitting.value = true;
  try {
    await createAppCampaign({
      title: form.title.trim(),
      campaignType: form.campaignType,
      startTime: buildDateTime(form.startDate),
      endTime: buildDateTime(form.endDate),
      targetCount: Number(form.targetCount),
      location: form.location.trim(),
      description: form.description.trim(),
      cover: form.cover || undefined,
      requirement: form.requirement.trim(),
      rewardDesc: form.rewardDesc.trim(),
      formConfig: {
        fields: ['name', 'mobile', 'schoolName'],
      },
    });

    showMessage('活动创建成功，已同步到后台', 'success');
    setTimeout(() => {
      uni.navigateBack({ delta: 1 });
    }, 800);
  } catch (error) {
    showMessage(error instanceof Error ? error.message : '创建活动失败', 'error');
  } finally {
    submitting.value = false;
  }
}

onShow(() => {
  ensureAgentLogin();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 60rpx;
  background: #f8fafc;
}

.title {
  font-size: 48rpx;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 28rpx;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.label {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f2937;
}

.input,
.picker-input,
.date-input,
.textarea {
  width: 100%;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16rpx;
  box-sizing: border-box;
  color: #111827;
}

.input,
.picker-input,
.date-input {
  min-height: 88rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.textarea {
  min-height: 180rpx;
  padding: 20rpx 24rpx;
}

.picker-placeholder {
  color: #9ca3af;
}

.picker-value {
  color: #111827;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.icon-input {
  position: relative;
}

.with-icon {
  padding-right: 72rpx;
}

.suffix-icon {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
}

.upload-card {
  min-height: 220rpx;
  border: 2rpx dashed #cbd5e1;
  border-radius: 20rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 24rpx;
  box-sizing: border-box;
}

.cover-preview {
  width: 100%;
  height: 260rpx;
  border-radius: 16rpx;
}

.upload-title {
  font-size: 28rpx;
  color: #334155;
}

.upload-tip {
  font-size: 22rpx;
  color: #94a3b8;
}

.submit-wrap {
  margin-top: 36rpx;
}
</style>
