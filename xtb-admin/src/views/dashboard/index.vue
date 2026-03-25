<template>
  <div>
    <el-row :gutter="16" v-loading="loading">
      <el-col :span="6" v-for="card in cards" :key="card.label">
        <el-card>
          <div class="card-title">{{ card.label }}</div>
          <div class="card-value">{{ card.value }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="summary-card">
      <template #header>成交概览</template>
      <div class="summary-value">累计支付金额：{{ paidAmount }}</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getStatsOverview, type StatsOverview } from '@/api/stats';

const loading = ref(false);
const overview = ref<StatsOverview>({
  campaignCount: 0,
  agentCount: 0,
  leadCount: 0,
  orderCount: 0,
  paidAmount: 0,
});

const cards = computed(() => [
  { label: '活动数', value: overview.value.campaignCount },
  { label: '代理数', value: overview.value.agentCount },
  { label: '线索数', value: overview.value.leadCount },
  { label: '订单数', value: overview.value.orderCount },
]);

const paidAmount = computed(() => Number(overview.value.paidAmount || 0).toFixed(2));

async function fetchData() {
  loading.value = true;
  try {
    const res = await getStatsOverview();
    overview.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取统计失败');
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
</script>

<style scoped>
.summary-card {
  margin-top: 16px;
}

.card-title {
  color: #64748b;
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
}

.summary-value {
  font-size: 20px;
  font-weight: 600;
}
</style>
