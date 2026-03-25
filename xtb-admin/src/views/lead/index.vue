<template>
  <el-card>
    <template #header>线索管理</template>
    <el-table :data="[]" border>
      <el-table-column prop="name" label="学生姓名" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="agentName" label="来源代理" />
    </el-table>
  </el-card>
</template>

