import { appConfig } from '@/config'

/**
 * Token 读写统一入口。
 * 当前使用 localStorage 便于演示；若项目安全要求更高（如防 XSS），
 * 可在此处改为 HttpOnly Cookie 方案，不影响其他业务代码。
 */

/**
 * 读取 Token
 * @returns {string}
 */
export function getToken() {
  return localStorage.getItem(appConfig.auth.tokenKey) || ''
}

/**
 * 写入 Token
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem(appConfig.auth.tokenKey, token)
}

/**
 * 清除 Token
 */
export function removeToken() {
  localStorage.removeItem(appConfig.auth.tokenKey)
}
