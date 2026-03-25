<template>
  <el-card v-loading="loading">
    <template #header>登录日志</template>
    <div class="toolbar">
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="loginAt" label="登录时间" min-width="180" />
      <el-table-column prop="loginType" label="类型" width="100" />
      <el-table-column prop="username" label="账号" min-width="140" />
      <el-table-column prop="role" label="角色" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.loginStatus === 1 ? 'success' : 'danger'">
            {{ row.loginStatus === 1 ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP" min-width="130" />
      <el-table-column prop="locationText" label="定位" min-width="260" show-overflow-tooltip />
      <el-table-column prop="userAgent" label="User-Agent" min-width="260" show-overflow-tooltip />
      <el-table-column prop="message" label="结果" min-width="150" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getLoginLogList, type LoginLogItem } from '@/api/login-log';

const loading = ref(false);
const list = ref<LoginLogItem[]>([]);

async function fetchList() {
  loading.value = true;
  try {
    const res = await getLoginLogList();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取登录日志失败');
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
