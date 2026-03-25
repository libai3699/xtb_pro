<template>
  <el-card v-loading="loading">
    <template #header>用户管理</template>
    <div class="toolbar">
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="nickname" label="昵称" min-width="140" />
      <el-table-column prop="mobile" label="手机号" min-width="140" />
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'agent' ? 'success' : 'info'">
            {{ row.role === 'agent' ? '代理' : '学生' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="代理资料" min-width="240">
        <template #default="{ row }">
          <span v-if="row.agentProfile">
            {{ row.agentProfile.realName }} / {{ row.agentProfile.schoolName || '-' }} / {{ row.agentProfile.gradeName || '-' }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间" min-width="180" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getAppUserList, type AppUserItem } from '@/api/user';

const loading = ref(false);
const list = ref<AppUserItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getAppUserList();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取用户失败');
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

