<template>
  <el-card v-loading="loading">
    <template #header>兑换订单</template>
    <div class="toolbar">
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="orderNo" label="订单号" min-width="180" />
      <el-table-column label="用户" min-width="180">
        <template #default="{ row }">{{ row.user?.nickname || row.user?.account || row.userId }}</template>
      </el-table-column>
      <el-table-column label="商品" min-width="180">
        <template #default="{ row }">{{ row.goods?.title || row.goodsId }}</template>
      </el-table-column>
      <el-table-column prop="points" label="消耗积分" width="100" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTypeMap[row.status] || 'info'">{{ statusLabelMap[row.status] || '未知' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="180" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="updateStatus(row.id, 1)">标记处理中</el-button>
          <el-button size="small" type="success" @click="updateStatus(row.id, 2)">标记完成</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getRewardRedeemOrderListAdmin,
  type RewardRedeemOrderItem,
  updateRewardRedeemOrderStatus,
} from '@/api/growth';

const loading = ref(false);
const list = ref<RewardRedeemOrderItem[]>([]);
const statusLabelMap: Record<number, string> = {
  0: '待处理',
  1: '处理中',
  2: '已完成',
};
const statusTypeMap: Record<number, '' | 'warning' | 'success' | 'info'> = {
  0: 'warning',
  1: 'info',
  2: 'success',
};

async function fetchList() {
  loading.value = true;
  try {
    const res = await getRewardRedeemOrderListAdmin();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取兑换订单失败');
  } finally {
    loading.value = false;
  }
}

async function updateStatus(id: string, status: number) {
  try {
    await updateRewardRedeemOrderStatus(id, status);
    ElMessage.success('状态更新成功');
    await fetchList();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '状态更新失败');
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
