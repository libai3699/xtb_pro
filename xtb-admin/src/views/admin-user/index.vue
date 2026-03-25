<template>
  <el-card v-loading="loading">
    <template #header>管理员</template>
    <div class="toolbar">
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="username" label="账号" min-width="140" />
      <el-table-column prop="name" label="姓名" min-width="120" />
      <el-table-column prop="mobile" label="手机号" min-width="140" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="180" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getAdminManagerList, type AdminManagerItem } from '@/api/user';

const loading = ref(false);
const list = ref<AdminManagerItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getAdminManagerList();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取管理员失败');
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

