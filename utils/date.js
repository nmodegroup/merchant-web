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

/**
 * 将已格式化的时间转为时间戳
 * 2019-7-8 to 1567656768998
 */
export function getFormatTimeStamp(formatTime) {
  const newTime = formatTime.replace(/-/g, '/');
  return new Date(newTime).getTime();
}
