<template>
  <el-card>
    <template #header>订单管理</template>
    <el-table :data="[]" border>
      <el-table-column prop="orderNo" label="订单号" />
      <el-table-column prop="studentName" label="学生姓名" />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="status" label="状态" />
    </el-table>
  </el-card>
</template>

