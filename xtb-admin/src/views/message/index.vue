<template>
  <el-card v-loading="loading">
    <template #header>消息中心</template>
    <div class="toolbar">
      <el-button type="primary" @click="openDialog">发送消息</el-button>
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="用户" min-width="160">
        <template #default="{ row }">{{ row.user?.nickname || row.user?.account || row.userId }}</template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="180" />
      <el-table-column prop="content" label="内容" min-width="260" />
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column label="已读" width="80">
        <template #default="{ row }">{{ row.isRead === 1 ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="180" />
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="发送消息" width="680px">
    <el-form :model="form" label-width="90px">
      <el-form-item label="目标用户">
        <el-select v-model="form.userId" filterable style="width: 100%">
          <el-option v-for="item in users" :key="item.id" :label="`${item.nickname || '-'} / ${item.account || item.mobile || item.id}`" :value="Number(item.id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="消息类型">
        <el-input v-model="form.type" placeholder="system / activity / reward" />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.content" type="textarea" :rows="5" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { createMessage, getMessageListAdmin, type MessageItem } from '@/api/growth';
import { getAppUserList, type AppUserItem } from '@/api/user';

const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const list = ref<MessageItem[]>([]);
const users = ref<AppUserItem[]>([]);

const form = reactive({
  userId: undefined as number | undefined,
  title: '',
  content: '',
  type: 'system',
});

function resetForm() {
  form.userId = undefined;
  form.title = '';
  form.content = '';
  form.type = 'system';
}

function openDialog() {
  resetForm();
  dialogVisible.value = true;
}

async function fetchList() {
  loading.value = true;
  try {
    const [messageRes, userRes] = await Promise.all([getMessageListAdmin(), getAppUserList()]);
    list.value = messageRes.data;
    users.value = userRes.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取消息失败');
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!form.userId || !form.title.trim() || !form.content.trim()) {
    ElMessage.warning('请填写完整消息信息');
    return;
  }

  submitting.value = true;
  try {
    await createMessage({
      userId: form.userId,
      title: form.title.trim(),
      content: form.content.trim(),
      type: form.type.trim() || 'system',
    });
    ElMessage.success('发送成功');
    dialogVisible.value = false;
    await fetchList();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '发送失败');
  } finally {
    submitting.value = false;
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
