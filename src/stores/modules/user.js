import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { getUserInfo, login as loginApi, logout as logoutApi } from '@/api/modules/auth'

/**
 * 用户状态：Token、用户信息与登录态。
 * Token 的读写通过 utils/auth 统一管理，避免多处直接操作存储。
 */
export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const userInfo = ref(null)
  const isLoggedIn = computed(() => Boolean(token.value))

  /**
   * 登录：成功后写入 Token，并同步用户信息
   * @param {{ username: string, password: string }} payload
   * @returns {Promise<object>}
   */
  async function login(payload) {
    const data = await loginApi(payload)
    if (!data?.token) {
      throw new Error('登录响应缺少 token 字段（待确认后端契约）')
    }
    token.value = data.token
    setToken(data.token)
    if (data.userInfo) {
      userInfo.value = data.userInfo
    } else {
      await fetchUserInfo()
    }
    return data
  }

  /**
   * 获取当前用户信息
   * @returns {Promise<object|null>}
   */
  async function fetchUserInfo() {
    const data = await getUserInfo()
    userInfo.value = data || null
    return userInfo.value
  }

  /**
   * 退出登录：无论服务端结果如何都清理本地登录状态
   * @returns {Promise<void>}
   */
  async function logout() {
    try {
      await logoutApi()
    } catch (error) {
      console.warn('[user] 退出登录接口调用失败，已清理本地状态', error)
    } finally {
      clearAuth()
    }
  }

  /**
   * 清空登录状态（登出、401 或 Token 失效时调用）
   */
  function clearAuth() {
    token.value = ''
    userInfo.value = null
    removeToken()
  }

  return { token, userInfo, isLoggedIn, login, fetchUserInfo, logout, clearAuth }
})
