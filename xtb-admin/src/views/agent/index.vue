<template>
  <el-card v-loading="loading">
    <template #header>代理管理</template>
    <div class="toolbar">
      <el-button type="primary" @click="openCreateDialog">新增代理</el-button>
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="昵称" min-width="120">
        <template #default="{ row }">{{ row.user?.nickname || '-' }}</template>
      </el-table-column>
      <el-table-column prop="realName" label="姓名" min-width="120" />
      <el-table-column prop="schoolName" label="学校" min-width="180" />
      <el-table-column prop="majorName" label="专业" min-width="150" />
      <el-table-column prop="gradeName" label="年级" width="100" />
      <el-table-column label="手机号" min-width="140">
        <template #default="{ row }">{{ row.user?.mobile || '-' }}</template>
      </el-table-column>
      <el-table-column prop="inviteCode" label="邀请码" min-width="120" />
      <el-table-column label="审核状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTagType[row.status]">{{ statusMap[row.status] || '未知' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="220" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status !== 1"
            type="primary"
            link
            @click="handleAudit(row.id)"
          >
            审核通过
          </el-button>
          <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px">
    <el-form :model="form" label-width="90px">
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.mobile" />
      </el-form-item>
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
      <el-form-item label="头像">
        <el-input v-model="form.avatar" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status">
          <el-option :value="0" label="待审核" />
          <el-option :value="1" label="已通过" />
          <el-option :value="2" label="已拒绝" />
        </el-select>
      </el-form-item>
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
  auditAgent,
  createAgent,
  deleteAgent,
  getAgentList,
  updateAgent,
  type AgentFormData,
  type AgentItem,
} from '@/api/agent';

const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const editingId = ref('');
const list = ref<AgentItem[]>([]);

const statusMap: Record<number, string> = {
  0: '待审核',
  1: '已通过',
  2: '已拒绝',
};

const statusTagType: Record<number, '' | 'success' | 'info' | 'warning' | 'danger'> = {
  0: 'warning',
  1: 'success',
  2: 'danger',
};

const form = reactive<AgentFormData>({
  nickname: '',
  mobile: '',
  realName: '',
  schoolName: '',
  majorName: '',
  gradeName: '',
  inviteCode: '',
  status: 0,
  avatar: '',
});

const dialogTitle = computed(() => (editingId.value ? '编辑代理' : '新增代理'));

function resetForm() {
  editingId.value = '';
  form.nickname = '';
  form.mobile = '';
  form.realName = '';
  form.schoolName = '';
  form.majorName = '';
  form.gradeName = '';
  form.inviteCode = '';
  form.status = 0;
  form.avatar = '';
}

function openCreateDialog() {
  resetForm();
  dialogVisible.value = true;
}

function openEditDialog(row: AgentItem) {
  editingId.value = row.id;
  form.nickname = row.user?.nickname || '';
  form.mobile = row.user?.mobile || '';
  form.realName = row.realName || '';
  form.schoolName = row.schoolName || '';
  form.majorName = row.majorName || '';
  form.gradeName = row.gradeName || '';
  form.inviteCode = row.inviteCode || '';
  form.status = (row.status ?? 0) as 0 | 1 | 2;
  form.avatar = '';
  dialogVisible.value = true;
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getAgentList();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取代理失败');
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!form.nickname.trim()) {
    ElMessage.warning('请填写昵称');
    return;
  }
  if (!form.mobile.trim()) {
    ElMessage.warning('请填写手机号');
    return;
  }
  if (!(form.realName || '').trim()) {
    ElMessage.warning('请填写真实姓名');
    return;
  }

  submitting.value = true;
  try {
    const payload = {
      nickname: form.nickname.trim(),
      mobile: form.mobile.trim(),
      realName: (form.realName || '').trim(),
      schoolName: (form.schoolName || '').trim() || undefined,
      majorName: (form.majorName || '').trim() || undefined,
      gradeName: (form.gradeName || '').trim() || undefined,
      inviteCode: (form.inviteCode || '').trim() || undefined,
      status: form.status,
      avatar: (form.avatar || '').trim() || undefined,
    };

    if (editingId.value) {
      await updateAgent(editingId.value, payload);
      ElMessage.success('更新成功');
    } else {
      await createAgent(payload);
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

async function handleAudit(id: string) {
  try {
    await auditAgent(id);
    ElMessage.success('审核成功');
    await fetchList();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '审核失败');
  }
}

async function handleDelete(row: AgentItem) {
  try {
    await ElMessageBox.confirm(`确认删除代理“${row.realName}”吗？`, '删除确认', {
      type: 'warning',
    });
    await deleteAgent(row.id);
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
