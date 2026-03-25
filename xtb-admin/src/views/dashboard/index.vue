<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="6" v-for="card in cards" :key="card.label">
        <el-card>
          <div class="card-title">{{ card.label }}</div>
          <div class="card-value">{{ card.value }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
const cards = [
  { label: '活动数', value: 0 },
  { label: '代理数', value: 0 },
  { label: '线索数', value: 0 },
  { label: '订单数', value: 0 },
];
</script>

<style scoped>
.card-title {
  color: #64748b;
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
}
</style>

