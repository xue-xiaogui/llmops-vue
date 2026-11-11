import request from '@/utils/request'

/**
 * AI 基础聊天机器人 - 发送消息
 * 接口：POST /apps/{app_id}/chat
 * 待确认：请求体字段（query、conversation_id 等）与响应结构需与后端契约对齐
 * @param {string} appId 应用 ID（UUID）
 * @param {object} [data] 请求体，如 { query: string, conversation_id?: string }
 * @param {import('axios').AxiosRequestConfig} [config] 支持 signal 取消请求等自定义配置
 * @returns {Promise<unknown>}
 */
export function sendChatMessage(appId, data = {}, config = {}) {
  return request.post(`/apps/${appId}/chat`, data, config)
}
