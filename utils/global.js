/**
 * 生成指定长度的数字数组
 * length:2 => return [1, 2]
 * @param {number} length 生成的数组长度
 */
export function createNumberArray(length) {
  return Array.from({ length }, (v, k) => k + 1);
}

/**
 * 获取文件的文件名
 * @param {string} path 文件路径
 */
export function getFileName(path) {
  const index = path.lastIndexOf('/');
  return path.substring(index + 1);
}
