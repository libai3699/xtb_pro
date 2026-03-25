<template>
  <el-card>
    <template #header>代理管理</template>
    <el-table :data="[]" border>
      <el-table-column prop="realName" label="姓名" />
      <el-table-column prop="schoolName" label="学校" />
      <el-table-column prop="status" label="审核状态" />
    </el-table>
  </el-card>
</template>

