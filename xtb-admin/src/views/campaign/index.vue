<template>
  <el-card v-loading="loading">
    <template #header>活动管理</template>
    <div class="toolbar">
      <el-button type="primary" @click="openDialog">新建活动</el-button>
      <el-button @click="fetchList">刷新</el-button>
    </div>

    <el-table :data="list" border>
      <el-table-column label="封面" width="100" align="center">
        <template #default="{ row }">
          <el-image v-if="row.cover" :src="row.cover" fit="cover" class="cover-image" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="活动标题" min-width="180" />
      <el-table-column prop="campaignType" label="活动类型" width="120" />
      <el-table-column prop="targetCount" label="目标人数" width="100" />
      <el-table-column prop="location" label="活动地点" min-width="160" />
      <el-table-column prop="rewardDesc" label="奖励设置" min-width="180" />
      <el-table-column label="活动时间" min-width="220">
        <template #default="{ row }">
          <span>{{ formatDateRange(row.startTime, row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusTagType[row.status]">{{ statusMap[row.status] || '未知' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="线索数" width="90">
        <template #default="{ row }">{{ row._count?.leads || 0 }}</template>
      </el-table-column>
      <el-table-column label="订单数" width="90">
        <template #default="{ row }">{{ row._count?.orders || 0 }}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="180" />
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="新建活动" width="760px">
    <el-form :model="form" label-width="96px">
      <el-form-item label="活动标题">
        <el-input v-model="form.title" placeholder="请输入活动标题" />
      </el-form-item>

      <el-form-item label="活动类型">
        <el-select v-model="form.campaignType" placeholder="请选择活动类型">
          <el-option label="培训课程" value="training" />
          <el-option label="竞赛活动" value="competition" />
          <el-option label="工作坊" value="workshop" />
          <el-option label="研讨会" value="seminar" />
        </el-select>
      </el-form-item>

      <el-form-item label="活动时间">
        <div class="date-grid">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            placeholder="开始时间"
          />
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            placeholder="结束时间"
          />
        </div>
      </el-form-item>

      <el-form-item label="目标人数">
        <el-input-number v-model="form.targetCount" :min="0" :step="1" controls-position="right" />
      </el-form-item>

      <el-form-item label="活动地点">
        <el-input v-model="form.location" placeholder="请输入活动地点" />
      </el-form-item>

      <el-form-item label="活动描述">
        <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入活动详细描述" />
      </el-form-item>

      <el-form-item label="活动封面">
        <div class="upload-field">
          <el-image v-if="form.cover" :src="form.cover" fit="cover" class="preview-image" />
          <div class="upload-actions">
            <el-upload
              :show-file-list="false"
              accept=".jpg,.jpeg,.png,.gif,.webp"
              :http-request="handleCoverUpload"
            >
              <el-button :loading="uploading">上传封面</el-button>
            </el-upload>
            <el-button v-if="form.cover" link type="danger" @click="form.cover = ''">清空</el-button>
            <el-input v-model="form.cover" placeholder="上传后自动回填，也可手动输入图片地址" />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="参与要求">
        <el-input v-model="form.requirement" type="textarea" :rows="4" placeholder="请输入参与要求和条件" />
      </el-form-item>

      <el-form-item label="奖励设置">
        <el-input v-model="form.rewardDesc" type="textarea" :rows="3" placeholder="请输入活动奖励设置" />
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
import type { UploadRequestOptions } from 'element-plus';
import { ElMessage } from 'element-plus';
import { createCampaign, getCampaignList, type CampaignItem } from '@/api/campaign';
import { uploadImageByRequest } from '@/api/upload';

const loading = ref(false);
const submitting = ref(false);
const uploading = ref(false);
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
  campaignType: '',
  startTime: '',
  endTime: '',
  targetCount: undefined as number | undefined,
  location: '',
  description: '',
  cover: '',
  requirement: '',
  rewardDesc: '',
  status: 1 as 0 | 1 | 2,
});

function resetForm() {
  form.title = '';
  form.campaignType = '';
  form.startTime = '';
  form.endTime = '';
  form.targetCount = undefined;
  form.location = '';
  form.description = '';
  form.cover = '';
  form.requirement = '';
  form.rewardDesc = '';
  form.status = 1;
}

function openDialog() {
  resetForm();
  dialogVisible.value = true;
}

function formatDateRange(startTime?: string, endTime?: string) {
  if (!startTime && !endTime) {
    return '-';
  }
  return `${startTime || '-'} ~ ${endTime || '-'}`;
}

async function handleCoverUpload(options: UploadRequestOptions) {
  uploading.value = true;
  try {
    const result = await uploadImageByRequest(options);
    form.cover = result.url;
    ElMessage.success('封面上传成功');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '封面上传失败');
  } finally {
    uploading.value = false;
  }
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
  if (!form.campaignType) {
    ElMessage.warning('请选择活动类型');
    return;
  }

  submitting.value = true;
  try {
    await createCampaign({
      title: form.title.trim(),
      campaignType: form.campaignType,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
      targetCount: form.targetCount,
      location: form.location.trim() || undefined,
      description: form.description.trim() || undefined,
      cover: form.cover.trim() || undefined,
      requirement: form.requirement.trim() || undefined,
      rewardDesc: form.rewardDesc.trim() || undefined,
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

.cover-image {
  width: 56px;
  height: 56px;
  border-radius: 8px;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
}

.upload-field {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}

.preview-image {
  width: 120px;
  height: 90px;
  border-radius: 10px;
  background: #f5f7fb;
  flex-shrink: 0;
}

.upload-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
</style>
