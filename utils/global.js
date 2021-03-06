const store = getApp().globalData;

/**
 * 生成指定长度的数字数组
 * length:2 => return [1, 2]
 * @param {number} length 生成的数组长度
 */
export function createNumberArray(length) {
  return Array.from({ length }, (v, k) => k + 1);
}

/**
 * 生成指定长度的空对象数组
 * @param {number} length 生成的数组长度
 */
export function createEmptyObjArray(length) {
  return Array.from({ length }, () => {
    return {};
  });
}

/**
 * 获取文件的文件名
 * @param {string} path 文件路径
 */
export function getFileName(path) {
  const index = path.lastIndexOf('/');
  return path.substring(index + 1);
}

/* -------------------  user  --------------- */

/**
 * 是否授权手机号
 */
export function isAuthPhone() {
  return !!store.phone;
}

/**
 * 是否授权用户信息
 */
export function isAuthUserInfo() {
  return Object.keys(store.userInfo).length > 0;
}
/* -------------------  user  --------------- */

/**
 * 检测对象是否为空
 * null、undefined、'' 为 true
 * 空对象{}、空数组[] 为 true
 * @param {any} target
 */
export function isEmpty(target) {
  if (target == null || target === '') {
    return true;
  }
  const targetString = Object.prototype.toString.call(target).split(' ')[1];
  const type = targetString.substring(0, targetString.length - 1);
  switch (type) {
    case 'Object':
      return Object.keys(target).length === 0;
    case 'Array':
      return target.length === 0;
    default:
      return false;
  }
}

/**
 * 表单等数据初始赋值处理，防止出现 undefined 等情况报错
 * @param {any} target       目标赋值
 * @param {any} defaultValue 默认值
 */
export function initValue(target, defaultValue) {
  if (target == null) {
    return resolvePlaceHolder(defaultValue);
  }
  return target;
}

function resolvePlaceHolder(defaultValue) {
  if (defaultValue == null) {
    return '';
  }
  return defaultValue;
}

/**
 * 判断当前页面是否为编辑状态
 * @param {string} value
 */
export function isEdit(value) {
  if (value == null || value === '') {
    return false;
  }
  return true;
}
