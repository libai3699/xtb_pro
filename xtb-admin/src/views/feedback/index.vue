<template>
  <el-card v-loading="loading">
    <template #header>意见反馈</template>
    <div class="toolbar">
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="用户" min-width="160">
        <template #default="{ row }">{{ row.user?.nickname || row.user?.account || '-' }}</template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="content" label="内容" min-width="300" />
      <el-table-column prop="contact" label="联系方式" min-width="160" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'warning' : 'success'">{{ row.status === 0 ? '待处理' : '已处理' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="提交时间" min-width="180" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getFeedbackListAdmin, type FeedbackItem } from '@/api/growth';

const loading = ref(false);
const list = ref<FeedbackItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getFeedbackListAdmin();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取反馈失败');
  } finally {
    loading.value = false;
  }
}

onMounted(fetchList);
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
