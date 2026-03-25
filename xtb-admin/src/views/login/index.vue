<template>
  <div class="page">
    <div class="panel">
      <div class="brand">
        <div class="title">校推宝Pro</div>
        <div class="desc">高校招生智能营销平台后台</div>
      </div>

      <el-form :model="loginForm" label-position="top">
        <el-form-item label="账号">
          <el-input v-model="loginForm.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-button type="primary" class="full" :loading="submitting" @click="handleLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { adminLogin } from '@/api/auth';
import { setAdminToken, setAdminUser } from '@/utils/auth';

const router = useRouter();
const submitting = ref(false);

const loginForm = reactive({
  username: 'admin',
  password: '123456',
});

async function handleLogin() {
  if (!loginForm.username.trim() || !loginForm.password.trim()) {
    ElMessage.warning('请填写账号和密码');
    return;
  }

  submitting.value = true;
  try {
    const res = await adminLogin(loginForm);
    setAdminToken(res.data.token);
    setAdminUser(res.data.user);
    ElMessage.success('登录成功');
    router.push('/dashboard');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败');
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top left, rgba(20, 184, 166, 0.25), transparent 30%),
    radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.2), transparent 30%),
    #f8fafc;
}

.panel {
  width: 460px;
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
}

.brand {
  margin-bottom: 20px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
}

.desc {
  margin-top: 8px;
  color: #64748b;
}

.full {
  width: 100%;
}
</style>
