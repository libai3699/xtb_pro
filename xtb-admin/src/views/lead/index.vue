<template>
  <el-card v-loading="loading">
    <template #header>线索管理</template>
    <div class="toolbar">
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="name" label="学生姓名" min-width="120" />
      <el-table-column prop="mobile" label="手机号" min-width="130" />
      <el-table-column label="活动" min-width="180">
        <template #default="{ row }">{{ row.campaign?.title || '-' }}</template>
      </el-table-column>
      <el-table-column label="来源代理" min-width="150">
        <template #default="{ row }">{{ row.agentUser?.nickname || row.agentUser?.mobile || '-' }}</template>
      </el-table-column>
      <el-table-column prop="schoolName" label="学校" min-width="180" />
      <el-table-column prop="majorName" label="专业" min-width="150" />
      <el-table-column prop="createdAt" label="提交时间" min-width="180" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getLeadList, type LeadItem } from '@/api/lead';

const loading = ref(false);
const list = ref<LeadItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getLeadList();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取线索失败');
  } finally {
    loading.value = false;
  }
}

onMounted(fetchList);
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}
</style>

