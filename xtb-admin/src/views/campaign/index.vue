<template>
  <el-card v-loading="loading">
    <template #header>活动管理</template>
    <div class="toolbar">
      <el-button type="primary" @click="openDialog">新建活动</el-button>
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="title" label="活动标题" min-width="220" />
      <el-table-column prop="rewardDesc" label="奖励说明" min-width="180" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTagType[row.status]">{{ statusMap[row.status] || '未知' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="线索数" width="100">
        <template #default="{ row }">{{ row._count?.leads || 0 }}</template>
      </el-table-column>
      <el-table-column label="订单数" width="100">
        <template #default="{ row }">{{ row._count?.orders || 0 }}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="180" />
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="新建活动" width="640px">
    <el-form :model="form" label-width="90px">
      <el-form-item label="活动标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="封面">
        <el-input v-model="form.cover" placeholder="https://..." />
      </el-form-item>
      <el-form-item label="活动描述">
        <el-input v-model="form.description" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="奖励说明">
        <el-input v-model="form.rewardDesc" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status">
          <el-option :value="0" label="草稿" />
          <el-option :value="1" label="上线" />
          <el-option :value="2" label="下线" />
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
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { createCampaign, getCampaignList, type CampaignItem } from '@/api/campaign';

const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const list = ref<CampaignItem[]>([]);

const statusMap: Record<number, string> = {
  0: '草稿',
  1: '上线',
  2: '下线',
};

const statusTagType: Record<number, '' | 'success' | 'info' | 'warning' | 'danger'> = {
  0: 'info',
  1: 'success',
  2: 'warning',
};

const form = reactive({
  title: '',
  cover: '',
  description: '',
  rewardDesc: '',
  status: 1 as 0 | 1 | 2,
});

function resetForm() {
  form.title = '';
  form.cover = '';
  form.description = '';
  form.rewardDesc = '';
  form.status = 1;
}

function openDialog() {
  resetForm();
  dialogVisible.value = true;
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getCampaignList();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取活动失败');
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!form.title.trim()) {
    ElMessage.warning('请填写活动标题');
    return;
  }

  submitting.value = true;
  try {
    await createCampaign({
      title: form.title,
      cover: form.cover || undefined,
      description: form.description || undefined,
      rewardDesc: form.rewardDesc || undefined,
      status: form.status,
      formConfig: {
        fields: ['name', 'mobile', 'schoolName'],
      },
    });
    ElMessage.success('创建成功');
    dialogVisible.value = false;
    await fetchList();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '创建活动失败');
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

