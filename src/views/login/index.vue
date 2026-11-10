<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const form = reactive({
  username: 'admin',
  password: '123456',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
}

/**
 * 只允许跳转到站内地址，避免开放重定向
 * @returns {string}
 */
function resolveRedirect() {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return '/'
}

async function handleSubmit() {
  if (loading.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    await userStore.login({ ...form })
    ElMessage.success('登录成功')
    router.replace(resolveRedirect())
  } catch (error) {
    // 拦截器已提示过的错误不再重复弹出
    if (!error?.handled) {
      ElMessage.error(error?.message || '登录失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 px-4"
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
      <div class="mb-8">
        <div class="mb-4 flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white"
          >
            LL
          </span>
          <div>
            <h1 class="text-xl font-semibold text-slate-900">LLMOps 管理平台</h1>
            <p class="mt-1 text-xs text-slate-500">企业级 Vue 3 前端基础框架</p>
          </div>
        </div>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            @keyup.enter="handleSubmit"
          />
        </el-form-item>
        <el-button type="primary" class="mt-2 w-full" :loading="loading" @click="handleSubmit">
          登录
        </el-button>
      </el-form>

      <p class="mt-6 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
        演示账号：admin / 123456。当前为模拟登录，未连接真实后端。
      </p>
    </div>
  </div>
</template>
