<template>
  <el-card>
    <template #header>活动管理</template>
    <el-button type="primary" class="mb16">新建活动</el-button>
    <el-table :data="[]" border>
      <el-table-column prop="title" label="活动标题" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="createdAt" label="创建时间" />
    </el-table>
  </el-card>
</template>

<style scoped>
.mb16 {
  margin-bottom: 16px;
}
</style>

