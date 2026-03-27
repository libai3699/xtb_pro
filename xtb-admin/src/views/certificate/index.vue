<template>
  <el-card v-loading="loading">
    <template #header>证书管理</template>
    <div class="toolbar">
      <el-button type="primary" @click="openDialog">新增证书</el-button>
      <el-button @click="fetchList">刷新</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="用户" min-width="160">
        <template #default="{ row }">{{ row.user?.nickname || row.user?.account || row.userId }}</template>
      </el-table-column>
      <el-table-column prop="title" label="证书名称" min-width="180" />
      <el-table-column prop="issuer" label="颁发方" min-width="140" />
      <el-table-column label="关联商品" min-width="160">
        <template #default="{ row }">{{ row.product?.title || '-' }}</template>
      </el-table-column>
      <el-table-column prop="issuedAt" label="颁发时间" min-width="180" />
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="新增证书" width="720px">
    <el-form :model="form" label-width="90px">
      <el-form-item label="所属用户">
        <el-select v-model="form.userId" filterable style="width: 100%">
          <el-option v-for="item in users" :key="item.id" :label="`${item.nickname || '-'} / ${item.account || item.mobile || item.id}`" :value="Number(item.id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="关联商品">
        <el-select v-model="form.productId" filterable clearable style="width: 100%">
          <el-option v-for="item in products" :key="item.id" :label="item.title" :value="Number(item.id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="证书名称">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="颁发方">
        <el-input v-model="form.issuer" />
      </el-form-item>
      <el-form-item label="封面">
        <el-input v-model="form.cover" />
      </el-form-item>
      <el-form-item label="文件地址">
        <el-input v-model="form.fileUrl" />
      </el-form-item>
      <el-form-item label="颁发时间">
        <el-date-picker v-model="form.issuedAt" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
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
import { createCertificate, getCertificateListAdmin, type CertificateItem } from '@/api/growth';
import { getProductList, type ProductItem } from '@/api/product';
import { getAppUserList, type AppUserItem } from '@/api/user';

const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const list = ref<CertificateItem[]>([]);
const users = ref<AppUserItem[]>([]);
const products = ref<ProductItem[]>([]);

const form = reactive({
  userId: undefined as number | undefined,
  productId: undefined as number | undefined,
  title: '',
  issuer: '',
  cover: '',
  fileUrl: '',
  issuedAt: '',
});

function resetForm() {
  form.userId = undefined;
  form.productId = undefined;
  form.title = '';
  form.issuer = '';
  form.cover = '';
  form.fileUrl = '';
  form.issuedAt = '';
}

function openDialog() {
  resetForm();
  dialogVisible.value = true;
}

async function fetchList() {
  loading.value = true;
  try {
    const [certificateRes, userRes, productRes] = await Promise.all([
      getCertificateListAdmin(),
      getAppUserList(),
      getProductList(),
    ]);
    list.value = certificateRes.data;
    users.value = userRes.data;
    products.value = productRes.data;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '获取证书失败');
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!form.userId || !form.title.trim()) {
    ElMessage.warning('请填写完整证书信息');
    return;
  }

  submitting.value = true;
  try {
    await createCertificate({
      userId: form.userId,
      productId: form.productId,
      title: form.title.trim(),
      issuer: form.issuer.trim() || undefined,
      cover: form.cover.trim() || undefined,
      fileUrl: form.fileUrl.trim() || undefined,
      issuedAt: form.issuedAt || undefined,
      status: 1,
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
