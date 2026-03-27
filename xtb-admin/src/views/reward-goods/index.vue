<template>
  <el-card v-loading="loading">
    <template #header>积分商品</template>
    <div class="toolbar">
      <el-button type="primary" @click="openDialog">新增商品</el-button>
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="title" label="商品名称" min-width="180" />
      <el-table-column prop="points" label="所需积分" width="120" />
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '上架' : '下架' }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="新增积分商品" width="680px">
    <el-form :model="form" label-width="90px">
      <el-form-item label="商品名称">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="封面">
        <el-input v-model="form.cover" placeholder="图片地址" />
      </el-form-item>
      <el-form-item label="所需积分">
        <el-input-number v-model="form.points" :min="0" />
      </el-form-item>
      <el-form-item label="库存">
        <el-input-number v-model="form.stock" :min="0" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sort" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status">
          <el-option :value="1" label="上架" />
          <el-option :value="0" label="下架" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" :rows="4" />
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
import { createRewardGoods, getRewardGoodsListAdmin, type RewardGoodsFormData, type RewardGoodsItem } from '@/api/growth';

const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const list = ref<RewardGoodsItem[]>([]);

const form = reactive<RewardGoodsFormData>({
  title: '',
  cover: '',
  points: 0,
  stock: 0,
  description: '',
  sort: 0,
  status: 1,
});

function resetForm() {
  form.title = '';
  form.cover = '';
  form.points = 0;
  form.stock = 0;
  form.description = '';
  form.sort = 0;
  form.status = 1;
}

function openDialog() {
  resetForm();
  dialogVisible.value = true;
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getRewardGoodsListAdmin();
    list.value = res.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取积分商品失败');
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!form.title?.trim()) {
    ElMessage.warning('请填写商品名称');
    return;
  }

  submitting.value = true;
  try {
    await createRewardGoods({
      title: form.title.trim(),
      cover: form.cover?.trim() || undefined,
      points: form.points ?? 0,
      stock: form.stock ?? 0,
      description: form.description?.trim() || undefined,
      sort: form.sort ?? 0,
      status: form.status ?? 1,
    });
    ElMessage.success('创建成功');
    dialogVisible.value = false;
    await fetchList();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '创建失败');
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
