/**
 * 格式化日期时间
 * @param {Date|string|number} value 日期对象、时间戳或可被 Date 解析的字符串
 * @param {string} [pattern='YYYY-MM-DD HH:mm'] 支持 YYYY/MM/DD/HH/mm/ss
 * @returns {string}
 */
export function formatDateTime(value, pattern = 'YYYY-MM-DD HH:mm') {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (num) => String(num).padStart(2, '0')
  const map = {
    YYYY: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  }

  return Object.entries(map).reduce(
    (result, [key, val]) => result.replaceAll(key, String(val)),
    pattern
  )
}
