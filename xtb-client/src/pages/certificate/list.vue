<template>
  <view class="page">
    <view class="page-title">我的证书</view>
    <view v-if="loading" class="card muted">加载中...</view>
    <view v-else-if="!list.length" class="card muted">暂无证书</view>
    <view v-for="item in list" :key="item.id" class="certificate-card">
      <view class="certificate-title">{{ item.title }}</view>
      <view class="certificate-meta">{{ item.issuer || '平台颁发' }}</view>
      <view class="certificate-meta">{{ item.issuedAt || '-' }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getCertificateList, type CertificateItem } from '@/api/growth';
import { useUserStore } from '@/store/user';
import { redirectToLogin } from '@/utils/app';

const userStore = useUserStore();
const loading = ref(false);
const list = ref<CertificateItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getCertificateList(userStore.id);
    list.value = res.data;
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '获取证书失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

onShow(() => {
  if (!userStore.token) {
    redirectToLogin('/pages/certificate/list');
    return;
  }
  fetchList();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f7fb;
}

.page-title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 18rpx;
}

.certificate-card,
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.certificate-title {
  font-size: 28rpx;
  font-weight: 700;
}

.certificate-meta,
.muted {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #64748b;
}
</style>
