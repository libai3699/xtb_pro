<template>
  <el-card v-loading="loading">
    <template #header>学习记录</template>
    <div class="toolbar">
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="用户" min-width="180">
        <template #default="{ row }">{{ row.user?.nickname || row.user?.account || row.userId }}</template>
      </el-table-column>
      <el-table-column prop="title" label="课程/记录" min-width="180" />
      <el-table-column label="关联商品" min-width="180">
        <template #default="{ row }">{{ row.product?.title || '-' }}</template>
      </el-table-column>
      <el-table-column prop="progress" label="进度" width="100">
        <template #default="{ row }">{{ row.progress }}%</template>
      </el-table-column>
      <el-table-column prop="durationMinutes" label="学习时长" width="120">
        <template #default="{ row }">{{ row.durationMinutes }} 分钟</template>
      </el-table-column>
      <el-table-column prop="lastStudyAt" label="最近学习时间" min-width="180" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getLearningRecordListAdmin, type LearningRecordItem } from '@/api/growth';

const loading = ref(false);
const list = ref<LearningRecordItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getLearningRecordListAdmin();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取学习记录失败');
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
