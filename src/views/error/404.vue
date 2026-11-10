<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
    <el-result icon="warning" title="404" sub-title="你访问的页面不存在或已被移除">
      <template #extra>
        <el-button type="primary" @click="router.replace('/')">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>
