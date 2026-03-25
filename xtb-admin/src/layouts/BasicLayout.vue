<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="logo">校推宝Pro</div>
      <el-menu :default-active="activeMenu" router>
        <el-menu-item index="/dashboard">工作台</el-menu-item>
        <el-menu-item index="/campaign">活动管理</el-menu-item>
        <el-menu-item index="/agent">代理管理</el-menu-item>
        <el-menu-item index="/lead">线索管理</el-menu-item>
        <el-menu-item index="/order">订单管理</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">校推宝Pro 后台管理端</el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeMenu = computed(() => route.path);
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.aside {
  background: #0f172a;
  color: #fff;
}

.logo {
  padding: 20px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}

.header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  font-size: 18px;
  font-weight: 600;
}
</style>

