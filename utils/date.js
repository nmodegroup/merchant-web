/**
 * 格式 yyyy-MM-dd hh:mm:ss
 *
 * @export
 * @param {string} timestamp 时间戳
 */
export function formatDate(timestamp) {
  const date = new Date(1398250549490);
  Y = date.getFullYear() + '-';
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  D = date.getDate() + ' ';
  h = date.getHours() + ':';
  m = date.getMinutes() + ':';
  s = date.getSeconds();
  return `${Y}${M}${D}${h}${m}${s}`;
}
