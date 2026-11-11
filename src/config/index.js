/**
 * 项目级配置。
 * 与后端契约相关的字段（接口地址、业务状态码、Token 请求头）集中在此维护，
 * 后端确认后只需修改本文件。
 */
export const appConfig = {
  title: import.meta.env.VITE_APP_TITLE || 'LLMOps 管理平台',
  apiBaseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  /** 请求超时时间（毫秒） */
  timeout: 15000,
  /** 是否启用演示登录，接入真实后端后关闭 */
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
  /** 业务成功状态码，待确认后端约定 */
  successCodes: [0, 200, "success"],
  auth: {
    /** localStorage 中 Token 的键名 */
    tokenKey: 'llmops_token',
    /** Token 请求头名称与前缀，待确认 */
    header: 'Authorization',
    prefix: 'Bearer ',
  },
  loginPath: '/login',
}
