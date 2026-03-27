<template>
  <el-card v-loading="loading">
    <template #header>代理评价</template>
    <div class="toolbar">
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="代理" min-width="180">
        <template #default="{ row }">{{ row.agentUser?.nickname || row.agentUser?.account || row.agentUserId }}</template>
      </el-table-column>
      <el-table-column prop="score" label="评分" width="100">
        <template #default="{ row }">{{ row.score }} / 5</template>
      </el-table-column>
      <el-table-column prop="content" label="评价内容" min-width="280" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '展示中' : '已隐藏' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="180" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getAgentReviewListAdmin, type AgentReviewItem } from '@/api/growth';

const loading = ref(false);
const list = ref<AgentReviewItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getAgentReviewListAdmin();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取代理评价失败');
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
