<template>
  <el-card v-loading="loading">
    <template #header>订单管理</template>
    <div class="toolbar">
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="orderNo" label="订单号" min-width="180" />
      <el-table-column prop="studentName" label="学生姓名" min-width="120" />
      <el-table-column label="商品" min-width="180">
        <template #default="{ row }">{{ row.product?.title || '-' }}</template>
      </el-table-column>
      <el-table-column label="来源活动" min-width="180">
        <template #default="{ row }">{{ row.campaign?.title || '-' }}</template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="100" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTagType[row.status]">{{ statusMap[row.status] || '未知' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="180" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getOrderList, type OrderItem } from '@/api/order';

const loading = ref(false);
const list = ref<OrderItem[]>([]);

const statusMap: Record<number, string> = {
  0: '待支付',
  1: '已支付',
  2: '已取消',
};

const statusTagType: Record<number, '' | 'success' | 'info' | 'warning' | 'danger'> = {
  0: 'warning',
  1: 'success',
  2: 'info',
};

async function fetchList() {
  loading.value = true;
  try {
    const res = await getOrderList();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取订单失败');
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

