<template>
  <el-card v-loading="loading">
    <template #header>代理管理</template>
    <div class="toolbar">
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="realName" label="姓名" min-width="120" />
      <el-table-column prop="schoolName" label="学校" min-width="180" />
      <el-table-column prop="majorName" label="专业" min-width="150" />
      <el-table-column prop="gradeName" label="年级" width="100" />
      <el-table-column label="手机号" min-width="140">
        <template #default="{ row }">{{ row.user?.mobile || '-' }}</template>
      </el-table-column>
      <el-table-column label="审核状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTagType[row.status]">{{ statusMap[row.status] || '未知' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button
            v-if="row.status !== 1"
            type="primary"
            link
            @click="handleAudit(row.id)"
          >
            审核通过
          </el-button>
          <span v-else>已通过</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { auditAgent, getAgentList, type AgentItem } from '@/api/agent';

const loading = ref(false);
const list = ref<AgentItem[]>([]);

const statusMap: Record<number, string> = {
  0: '待审核',
  1: '已通过',
  2: '已拒绝',
};

const statusTagType: Record<number, '' | 'success' | 'info' | 'warning' | 'danger'> = {
  0: 'warning',
  1: 'success',
  2: 'danger',
};

async function fetchList() {
  loading.value = true;
  try {
    const res = await getAgentList();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取代理失败');
  } finally {
    loading.value = false;
  }
}

async function handleAudit(id: string) {
  try {
    await auditAgent(id);
    ElMessage.success('审核成功');
    await fetchList();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '审核失败');
  }
}

onMounted(fetchList);
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}
</style>

