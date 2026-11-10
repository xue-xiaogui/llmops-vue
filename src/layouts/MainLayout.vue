<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const displayName = computed(
  () => userStore.userInfo?.nickname || userStore.userInfo?.username || '管理员'
)

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  await userStore.logout()
  ElMessage.success('已退出登录')
  router.replace('/login')
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-100">
    <aside class="hidden w-56 shrink-0 flex-col bg-slate-900 md:flex">
      <div class="flex h-14 items-center gap-2 border-b border-white/10 px-4">
        <span
          class="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white"
        >
          LL
        </span>
        <span class="text-base font-semibold tracking-wide text-white">LLMOps</span>
      </div>

      <el-menu
        :default-active="route.path"
        router
        class="flex-1 border-r-0"
        background-color="#0f172a"
        text-color="#cbd5e1"
        active-text-color="#93c5fd"
      >
        <el-menu-item index="/dashboard">工作台</el-menu-item>
      </el-menu>

      <div class="border-t border-white/10 p-4 text-xs text-slate-400">
        Vue 3 · Element Plus · Tailwind
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6"
      >
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-slate-700">{{ route.meta.title || '后台管理' }}</span>
          <el-tag size="small" type="info" effect="plain">示例环境</el-tag>
        </div>

        <el-dropdown trigger="click">
          <span class="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <el-avatar :size="28">{{ displayName.slice(0, 1) }}</el-avatar>
            <span>{{ displayName }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </header>

      <main class="flex-1 overflow-auto p-4 md:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
