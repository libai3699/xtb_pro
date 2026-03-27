<template>
  <el-card v-loading="loading">
    <template #header>内容管理</template>
    <div class="toolbar">
      <el-select v-model="currentType" style="width: 140px" @change="fetchList">
        <el-option value="news" label="校园资讯" />
        <el-option value="help" label="帮助中心" />
      </el-select>
      <el-button type="primary" @click="openCreateDialog">新增内容</el-button>
      <el-button @click="fetchList">刷新</el-button>
    </div>

    <el-table :data="list" border>
      <el-table-column prop="title" label="标题" min-width="220" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '发布中' : '下线' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publishedAt" label="发布时间" min-width="180" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="editingId ? '编辑内容' : '新增内容'" width="760px">
    <el-form :model="form" label-width="90px">
      <el-form-item label="类型">
        <el-select v-model="form.type">
          <el-option value="news" label="校园资讯" />
          <el-option value="help" label="帮助中心" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="form.summary" />
      </el-form-item>
      <el-form-item label="封面">
        <el-input v-model="form.cover" placeholder="图片地址" />
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="form.category" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sort" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status">
          <el-option :value="1" label="发布中" />
          <el-option :value="0" label="下线" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker v-model="form.publishedAt" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
      <el-form-item label="正文">
        <el-input v-model="form.content" type="textarea" :rows="8" />
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { createContent, deleteContent, getContentList, updateContent, type ContentArticleFormData, type ContentArticleItem } from '@/api/content';

const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const editingId = ref('');
const currentType = ref<'news' | 'help'>('news');
const list = ref<ContentArticleItem[]>([]);

const form = reactive<ContentArticleFormData>({
  type: 'news',
  title: '',
  summary: '',
  cover: '',
  category: '',
  content: '',
  sort: 0,
  status: 1,
  publishedAt: '',
});

function resetForm() {
  editingId.value = '';
  form.type = currentType.value;
  form.title = '';
  form.summary = '';
  form.cover = '';
  form.category = '';
  form.content = '';
  form.sort = 0;
  form.status = 1;
  form.publishedAt = '';
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getContentList(currentType.value);
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取内容失败');
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  resetForm();
  dialogVisible.value = true;
}

function openEditDialog(row: ContentArticleItem) {
  editingId.value = row.id;
  form.type = row.type;
  form.title = row.title;
  form.summary = row.summary || '';
  form.cover = row.cover || '';
  form.category = row.category || '';
  form.content = row.content || '';
  form.sort = row.sort;
  form.status = row.status;
  form.publishedAt = row.publishedAt || '';
  dialogVisible.value = true;
}

async function submit() {
  if (!form.title?.trim()) {
    ElMessage.warning('请填写标题');
    return;
  }

  submitting.value = true;
  try {
    const payload: ContentArticleFormData = {
      type: form.type,
      title: form.title.trim(),
      summary: form.summary?.trim() || undefined,
      cover: form.cover?.trim() || undefined,
      category: form.category?.trim() || undefined,
      content: form.content?.trim() || undefined,
      sort: form.sort ?? 0,
      status: form.status ?? 1,
      publishedAt: form.publishedAt || undefined,
    };

    if (editingId.value) {
      await updateContent(editingId.value, payload);
      ElMessage.success('更新成功');
    } else {
      await createContent(payload);
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

async function handleDelete(id: string) {
  try {
    await ElMessageBox.confirm('确认删除这条内容吗？', '删除确认', { type: 'warning' });
    await deleteContent(id);
    ElMessage.success('删除成功');
    await fetchList();
  } catch (error) {
    if (error === 'cancel') return;
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
