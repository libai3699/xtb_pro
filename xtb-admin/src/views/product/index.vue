<template>
  <el-card v-loading="loading">
    <template #header>商品管理</template>
    <div class="toolbar">
      <el-button type="primary" @click="openDialog">新建商品</el-button>
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="title" label="商品名称" min-width="180" />
      <el-table-column label="所属活动" min-width="180">
        <template #default="{ row }">{{ row.campaign?.title || '-' }}</template>
      </el-table-column>
      <el-table-column prop="price" label="售价" width="100" />
      <el-table-column prop="originalPrice" label="原价" width="100" />
      <el-table-column prop="createdAt" label="创建时间" min-width="180" />
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="新建商品" width="640px">
    <el-form :model="form" label-width="90px">
      <el-form-item label="所属活动">
        <el-select v-model="form.campaignId" placeholder="请选择活动" style="width: 100%">
          <el-option v-for="item in campaigns" :key="item.id" :label="item.title" :value="Number(item.id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="售价">
        <el-input-number v-model="form.price" :min="0" :precision="2" />
      </el-form-item>
      <el-form-item label="原价">
        <el-input-number v-model="form.originalPrice" :min="0" :precision="2" />
      </el-form-item>
      <el-form-item label="封面">
        <el-input v-model="form.cover" placeholder="https://..." />
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
import { getCampaignList, type CampaignItem } from '@/api/campaign';
import { createProduct, getProductList, type ProductItem } from '@/api/product';

const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const list = ref<ProductItem[]>([]);
const campaigns = ref<CampaignItem[]>([]);

const form = reactive({
  campaignId: undefined as number | undefined,
  title: '',
  price: 0,
  originalPrice: undefined as number | undefined,
  cover: '',
  description: '',
});

function resetForm() {
  form.campaignId = undefined;
  form.title = '';
  form.price = 0;
  form.originalPrice = undefined;
  form.cover = '';
  form.description = '';
}

function openDialog() {
  resetForm();
  dialogVisible.value = true;
}

async function fetchList() {
  loading.value = true;
  try {
    const [productRes, campaignRes] = await Promise.all([getProductList(), getCampaignList()]);
    list.value = productRes.data;
    campaigns.value = campaignRes.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取商品失败');
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!form.campaignId || !form.title.trim()) {
    ElMessage.warning('请填写完整商品信息');
    return;
  }

  submitting.value = true;
  try {
    await createProduct({
      campaignId: form.campaignId,
      title: form.title,
      price: form.price,
      originalPrice: form.originalPrice,
      cover: form.cover || undefined,
      description: form.description || undefined,
    });
    ElMessage.success('创建成功');
    dialogVisible.value = false;
    await fetchList();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '创建商品失败');
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

