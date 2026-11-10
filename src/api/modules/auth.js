import request from '@/utils/request'
import { appConfig } from '@/config'

/**
 * 模拟登录（仅开发环境演示用）。
 * 接入真实后端后将 .env.development 中 VITE_USE_MOCK 设为 false。
 * @param {{ username: string, password: string }} data
 * @returns {Promise<{ token: string, userInfo: object }>}
 */
function mockLogin({ username, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        resolve({
          token: `mock-token-${Date.now()}`,
          userInfo: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            roles: ['admin'],
          },
        })
      } else {
        reject(new Error('演示账号或密码错误'))
      }
    }, 600)
  })
}

/**
 * 登录
 * 待确认：接口路径、入参和响应字段需与后端契约对齐
 * @param {{ username: string, password: string }} data
 * @returns {Promise<{ token: string, userInfo?: object }>}
 */
export function login(data) {
  if (appConfig.useMock) return mockLogin(data)
  return request.post('/auth/login', data)
}

/**
 * 退出登录
 * 待确认：后端是否要求调用注销接口
 * @returns {Promise<unknown>}
 */
export function logout() {
  if (appConfig.useMock) return Promise.resolve()
  return request.post('/auth/logout')
}

/**
 * 获取当前登录用户信息
 * 待确认：接口路径与响应字段
 * @returns {Promise<object>}
 */
export function getUserInfo() {
  if (appConfig.useMock) {
    return Promise.resolve({
      id: 1,
      username: 'admin',
      nickname: '管理员',
      roles: ['admin'],
    })
  }
  return request.get('/user/info')
}
