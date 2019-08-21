/**
 * 格式 yyyy-MM-dd hh:mm:ss
 *
 * @export
 * @param {string} timestamp 时间戳
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() + ' ';
  const h = date.getHours() + ':';
  const m = date.getMinutes() + ':';
  const s = date.getSeconds();
  return `${Y}${M}${D}${h}${m}${s}`;
}

export function formatUnixDate(timestamp) {
  const date = new Date(timestamp);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate();
  return `${Y}${M}${D}`;
}
