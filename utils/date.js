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
  const D = date.getDate() < 10 ? `0${date.getDate()} ` : `${date.getDate()} `;
  const h = date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`;
  const m = date.getMinutes() < 10 ? `0${date.getMinutes()}:` : `${date.getMinutes()}:`;
  const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
  return `${Y}${M}${D}${h}${m}${s}`;
}

/**
 * 格式 yyyy-MM-dd hh:mm
 *
 * @export
 * @param {string} timestamp 时间戳
 */
export function formatDateNoSeconds(timestamp) {
  const date = new Date(timestamp);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() < 10 ? `0${date.getDate()} ` : `${date.getDate()} `;
  const h = date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`;
  const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
  return `${Y}${M}${D}${h}${m}`;
}

export function formatUnixDate(timestamp) {
  const date = new Date(timestamp);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() < 10 ? `0${date.getDate()} ` : `${date.getDate()} `;
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

/**
 * 周期匹配
 */
export function getWeekTitle(week) {
  switch (+week) {
    case 1:
      return '周一';
    case 2:
      return '周二';
    case 3:
      return '周三';
    case 4:
      return '周四';
    case 5:
      return '周五';
    case 6:
      return '周六';
    case 7:
      return '周日';
    default:
      return '';
  }
}

/**
 * 周期匹配
 */
export function getEachWeekTitle(week) {
  switch (+week) {
    case 1:
      return '每周一';
    case 2:
      return '每周二';
    case 3:
      return '每周三';
    case 4:
      return '每周四';
    case 5:
      return '每周五';
    case 6:
      return '每周六';
    case 7:
      return '每周日';
    default:
      return '';
  }
}

export function getHours() {
  const length = 23;
  return Array.from({ length }, (v, k) => k);
}

export function getMinutes() {
  const length = 59;
  return Array.from({ length }, (v, k) => {
    return k < 10 ? `0${k}` : k;
  });
}
