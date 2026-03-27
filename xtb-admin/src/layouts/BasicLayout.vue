<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="logo">校推宝Pro</div>
      <el-menu :default-active="activeMenu" router background-color="#0f172a" text-color="#cbd5e1" active-text-color="#ffffff">
        <el-menu-item index="/dashboard">工作台</el-menu-item>

        <el-sub-menu index="/enrollment">
          <template #title>招生业务</template>
          <el-menu-item index="/business/campaign">活动管理</el-menu-item>
          <el-menu-item index="/business/product">商品管理</el-menu-item>
          <el-menu-item index="/business/lead">线索管理</el-menu-item>
          <el-menu-item index="/business/order">订单管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/member">
          <template #title>用户中心</template>
          <el-menu-item index="/business/user">用户管理</el-menu-item>
          <el-menu-item index="/business/agent">代理管理</el-menu-item>
          <el-menu-item index="/operation/message">消息中心</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/growth">
          <template #title>成长运营</template>
          <el-menu-item index="/operation/content">内容管理</el-menu-item>
          <el-menu-item index="/operation/reward-goods">积分商品</el-menu-item>
          <el-menu-item index="/operation/reward-redeem-order">兑换订单</el-menu-item>
          <el-menu-item index="/operation/certificate">证书管理</el-menu-item>
          <el-menu-item index="/operation/learning-record">学习记录</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/support">
          <template #title>服务支持</template>
          <el-menu-item index="/operation/agent-review">代理评价</el-menu-item>
          <el-menu-item index="/operation/feedback">意见反馈</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/system">
          <template #title>系统管理</template>
          <el-menu-item index="/system/admin-user">管理员</el-menu-item>
          <el-menu-item index="/system/login-log">登录日志</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">{{ currentTitle }}</div>
        <div class="header-right">
          <span class="user-name">{{ currentUser?.name || currentUser?.username || '未登录' }}</span>
          <el-button link type="primary" @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { clearAdminSession, getAdminUser } from '@/utils/auth';

const route = useRoute();
const router = useRouter();
const activeMenu = computed(() => route.path);
const currentUser = getAdminUser();
const currentTitle = computed(() => (route.meta.title as string) || '校推宝Pro 后台');

function logout() {
  clearAdminSession();
  router.push('/login');
}
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
  color: #fff;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.header-left {
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  color: #334155;
}
</style>
