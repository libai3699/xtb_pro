<template>
  <el-card v-loading="loading">
    <template #header>用户管理</template>
    <div class="toolbar">
      <el-button type="primary" @click="openCreateDialog">新增用户</el-button>
      <el-button @click="fetchList">刷新</el-button>
    </div>

    <el-table :data="list" border>
      <el-table-column prop="nickname" label="昵称" min-width="140" />
      <el-table-column label="登录账号" min-width="140">
        <template #default="{ row }">
          <span>{{ row.role === 'student' ? row.account || '-' : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" min-width="140" />
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'agent' ? 'success' : 'info'">
            {{ row.role === 'agent' ? '代理' : '学生' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="代理资料" min-width="260">
        <template #default="{ row }">
          <span v-if="row.agentProfile">
            {{ row.agentProfile.realName }} / {{ row.agentProfile.schoolName || '-' }} / {{ row.agentProfile.gradeName || '-' }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间" min-width="180" />
      <el-table-column label="操作" min-width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="680px">
    <el-form :model="form" label-width="96px">
      <el-form-item label="角色">
        <el-select v-model="form.role">
          <el-option value="student" label="学生" />
          <el-option value="agent" label="代理" />
        </el-select>
      </el-form-item>

      <el-form-item label="昵称">
        <el-input v-model="form.nickname" />
      </el-form-item>

      <template v-if="form.role === 'student'">
        <el-form-item label="登录账号">
          <el-input v-model="form.account" placeholder="学生登录账号" />
        </el-form-item>
        <el-form-item :label="editingId ? '登录密码' : '登录密码 *'">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="editingId ? '留空则不修改密码' : '请输入登录密码'"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile" placeholder="选填" />
        </el-form-item>
      </template>

      <template v-else>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile" />
        </el-form-item>
      </template>

      <el-form-item label="头像">
        <el-input v-model="form.avatar" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status">
          <el-option :value="1" label="正常" />
          <el-option :value="0" label="禁用" />
        </el-select>
      </el-form-item>

      <template v-if="form.role === 'agent'">
        <el-form-item label="真实姓名">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="学校">
          <el-input v-model="form.schoolName" />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="form.majorName" />
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="form.gradeName" />
        </el-form-item>
        <el-form-item label="邀请码">
          <el-input v-model="form.inviteCode" />
        </el-form-item>
      </template>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createAppUser,
  deleteAppUser,
  getAppUserList,
  updateAppUser,
  type AppUserFormData,
  type AppUserItem,
} from '@/api/user';

const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const editingId = ref('');
const list = ref<AppUserItem[]>([]);

const form = reactive<AppUserFormData>({
  role: 'student',
  nickname: '',
  account: '',
  password: '',
  mobile: '',
  avatar: '',
  status: 1,
  realName: '',
  schoolName: '',
  majorName: '',
  gradeName: '',
  inviteCode: '',
});

const dialogTitle = computed(() => (editingId.value ? '编辑用户' : '新增用户'));

function resetForm() {
  editingId.value = '';
  form.role = 'student';
  form.nickname = '';
  form.account = '';
  form.password = '';
  form.mobile = '';
  form.avatar = '';
  form.status = 1;
  form.realName = '';
  form.schoolName = '';
  form.majorName = '';
  form.gradeName = '';
  form.inviteCode = '';
}

function openCreateDialog() {
  resetForm();
  dialogVisible.value = true;
}

function openEditDialog(row: AppUserItem) {
  editingId.value = row.id;
  form.role = row.role;
  form.nickname = row.nickname || '';
  form.account = row.account || '';
  form.password = '';
  form.mobile = row.mobile || '';
  form.avatar = row.avatar || '';
  form.status = (row.status ?? 1) as 0 | 1;
  form.realName = row.agentProfile?.realName || '';
  form.schoolName = row.agentProfile?.schoolName || '';
  form.majorName = row.agentProfile?.majorName || '';
  form.gradeName = row.agentProfile?.gradeName || '';
  form.inviteCode = row.agentProfile?.inviteCode || '';
  dialogVisible.value = true;
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getAppUserList();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取用户失败');
  } finally {
    loading.value = false;
  }
}

function validateForm() {
  if (!form.nickname.trim()) {
    ElMessage.warning('请填写昵称');
    return false;
  }

  if (form.role === 'student') {
    if (!(form.account || '').trim()) {
      ElMessage.warning('请填写学生登录账号');
      return false;
    }

    if (!editingId.value && !(form.password || '').trim()) {
      ElMessage.warning('请填写学生登录密码');
      return false;
    }

    return true;
  }

  if (!(form.mobile || '').trim()) {
    ElMessage.warning('请填写代理手机号');
    return false;
  }

  if (!(form.realName || '').trim()) {
    ElMessage.warning('代理用户必须填写真实姓名');
    return false;
  }

  return true;
}

async function submit() {
  if (!validateForm()) {
    return;
  }

  submitting.value = true;
  try {
    const payload: AppUserFormData = {
      role: form.role,
      nickname: form.nickname.trim(),
      account: form.role === 'student' ? (form.account || '').trim() : undefined,
      password: (form.password || '').trim() || undefined,
      mobile: (form.mobile || '').trim() || undefined,
      avatar: (form.avatar || '').trim() || undefined,
      status: form.status,
      realName: form.role === 'agent' ? (form.realName || '').trim() || undefined : undefined,
      schoolName: form.role === 'agent' ? (form.schoolName || '').trim() || undefined : undefined,
      majorName: form.role === 'agent' ? (form.majorName || '').trim() || undefined : undefined,
      gradeName: form.role === 'agent' ? (form.gradeName || '').trim() || undefined : undefined,
      inviteCode: form.role === 'agent' ? (form.inviteCode || '').trim() || undefined : undefined,
    };

    if (editingId.value) {
      await updateAppUser(editingId.value, payload);
      ElMessage.success('更新成功');
    } else {
      await createAppUser(payload);
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    await fetchList();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '提交失败');
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(row: AppUserItem) {
  try {
    await ElMessageBox.confirm(`确认删除用户“${row.nickname || row.mobile || row.account || row.id}”吗？`, '删除确认', {
      type: 'warning',
    });
    await deleteAppUser(row.id);
    ElMessage.success('删除成功');
    await fetchList();
  } catch (error) {
    if (error === 'cancel') {
      return;
    }
    ElMessage.error(error instanceof Error ? error.message : '删除失败');
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
