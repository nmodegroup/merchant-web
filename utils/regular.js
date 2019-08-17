/**
 * 判断是否全为数字
 */
export function regAllNumber(str) {
  const reg = /^[\d]+$/;
  return reg.test(str);
}

/**
 * 校验只能包含中文字母和数字
 */
export function regCharChineseNumber(str) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
  return reg.test(str);
}

/**
 * 校验是否为手机号码
 * @param {string} phone 手机号码
 */
export function regPhoneNumber(phone) {
  const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  return reg.test(phone);
}

/**
 * 校验是否为固定电话
 * @param {string} phone 手机号码
 */
export function regStablePhone(phone) {
  const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  return reg.test(phone);
}
