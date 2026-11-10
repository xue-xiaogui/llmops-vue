import axios from 'axios'
import { appConfig } from '@/config'
import { getToken, removeToken } from '@/utils/auth'

const http = axios.create({
  baseURL: appConfig.apiBaseURL,
  timeout: appConfig.timeout,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

/** 错误提示去重，避免同一错误在短时间内重复弹出 */
const ERROR_DEDUPE_INTERVAL = 2000
let lastError = { message: '', time: 0 }

/**
 * 统一错误提示
 * @param {string} message
 * @param {object} [config] 请求配置，silent 为 true 时不弹出提示
 */
function notifyError(message, config) {
  if (!message || config?.silent) return
  const now = Date.now()
  if (message === lastError.message && now - lastError.time < ERROR_DEDUPE_INTERVAL) return
  lastError = { message, time: now }
  ElMessage.error(message)
}

/** HTTP 状态码对应提示，待确认后端错误文案 */
const HTTP_ERROR_MESSAGES = {
  400: '请求参数有误',
  401: '登录状态已失效，请重新登录',
  403: '没有权限访问该资源',
  404: '请求的资源不存在',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂不可用',
  504: '网关超时',
}

/**
 * Token 失效处理：清除本地登录状态并跳转登录页。
 * 使用动态导入，避免 request 与 router、store 形成循环依赖。
 */
async function handleUnauthorized() {
  removeToken()
  try {
    const [{ default: router }, { useUserStore }] = await Promise.all([
      import('@/router'),
      import('@/stores/modules/user'),
    ])
    useUserStore().clearAuth()
    const current = router.currentRoute.value
    if (current.path !== appConfig.loginPath) {
      router.replace({
        path: appConfig.loginPath,
        query: { redirect: current.fullPath },
      })
    }
  } catch (error) {
    console.error('[request] 处理登录失效时发生异常', error)
  }
}

/**
 * 判断是否为二进制响应（文件下载等），此类响应直接放行原始 response
 * @param {object} [config]
 * @returns {boolean}
 */
function isBinaryResponse(config) {
  return config?.responseType === 'blob' || config?.responseType === 'arraybuffer'
}

/**
 * 标记错误已被拦截器提示过，业务层据此避免重复弹窗
 * @param {Error} error
 * @returns {Error}
 */
function markHandled(error) {
  error.handled = true
  return error
}

http.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers[appConfig.auth.header] = `${appConfig.auth.prefix}${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => {
    // 文件流等二进制响应由调用方处理，不做业务解包
    if (isBinaryResponse(response.config)) return response

    const body = response.data
    // 非标准业务响应（没有 code 字段）直接返回原始数据
    if (!body || typeof body !== 'object' || !('code' in body)) return body

    const message = body.message || body.msg || '请求失败'

    if (appConfig.successCodes.includes(body.code)) {
      return body.data
    }

    if (body.code === 401) handleUnauthorized()
    notifyError(message, response.config)

    const error = new Error(message)
    error.code = body.code
    error.data = body
    return Promise.reject(markHandled(error))
  },
  (error) => {
    // 主动取消的请求不提示，交由调用方自行处理
    if (axios.isCancel(error)) return Promise.reject(error)

    const config = error.config
    const status = error.response?.status
    let message

    if (error.code === 'ECONNABORTED' || String(error.message).includes('timeout')) {
      message = '请求超时，请稍后重试'
    } else if (!error.response) {
      message = '网络连接异常，请检查网络后重试'
    } else {
      message = HTTP_ERROR_MESSAGES[status] || `请求失败（HTTP ${status}）`
    }

    if (status === 401) handleUnauthorized()
    notifyError(message, config)

    error.message = message
    return Promise.reject(markHandled(error))
  }
)

/**
 * GET 请求
 * @param {string} url
 * @param {object} [params] URL 查询参数
 * @param {import('axios').AxiosRequestConfig} [config] 支持 signal 取消请求等自定义配置
 * @returns {Promise<unknown>}
 */
export function get(url, params = {}, config = {}) {
  return http.get(url, { ...config, params })
}

/**
 * POST 请求
 * @param {string} url
 * @param {object} [data] 请求体
 * @param {import('axios').AxiosRequestConfig} [config]
 * @returns {Promise<unknown>}
 */
export function post(url, data = {}, config = {}) {
  return http.post(url, data, config)
}

/**
 * PUT 请求
 * @param {string} url
 * @param {object} [data]
 * @param {import('axios').AxiosRequestConfig} [config]
 * @returns {Promise<unknown>}
 */
export function put(url, data = {}, config = {}) {
  return http.put(url, data, config)
}

/**
 * DELETE 请求
 * @param {string} url
 * @param {object} [params]
 * @param {import('axios').AxiosRequestConfig} [config]
 * @returns {Promise<unknown>}
 */
export function del(url, params = {}, config = {}) {
  return http.delete(url, { ...config, params })
}

/**
 * PATCH 请求
 * @param {string} url
 * @param {object} [data]
 * @param {import('axios').AxiosRequestConfig} [config]
 * @returns {Promise<unknown>}
 */
export function patch(url, data = {}, config = {}) {
  return http.patch(url, data, config)
}

/**
 * 上传文件（FormData，支持 onUploadProgress）
 * @param {string} url
 * @param {File|Blob} file
 * @param {import('axios').AxiosRequestConfig} [config]
 * @param {string} [fieldName='file'] 文件字段名，待确认后端约定
 * @returns {Promise<unknown>}
 */
export function upload(url, file, config = {}, fieldName = 'file') {
  const formData = new FormData()
  formData.append(fieldName, file)
  return http.post(url, formData, config)
}

/**
 * 解析 Content-Disposition 中的文件名
 * @param {string} disposition
 * @returns {string}
 */
function parseFilename(disposition) {
  if (!disposition) return ''
  const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)/i)
  if (!match) return ''
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

/**
 * 下载文件并触发浏览器保存
 * @param {string} url
 * @param {object} [params]
 * @param {string} [filename] 指定文件名，未指定时读取响应头
 * @param {import('axios').AxiosRequestConfig} [config]
 * @returns {Promise<{ blob: Blob, filename: string }>}
 */
export async function download(url, params = {}, filename = '', config = {}) {
  const response = await http.get(url, {
    ...config,
    params,
    responseType: 'blob',
  })
  const blob = response.data
  if (!blob || blob.size === 0) {
    throw new Error('下载内容为空')
  }

  const disposition = response.headers['content-disposition'] || ''
  const name = filename || parseFilename(disposition) || 'download'

  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)

  return { blob, filename: name }
}

const request = { get, post, put, del, patch, upload, download }

export default request
