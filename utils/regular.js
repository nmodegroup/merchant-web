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
export function regShopName(str) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
  return reg.test(str);
}

/**
 * 校验是否为手机号码
 * @param {string} phone 手机号码
 */
export function regPhoneNumber(phone) {
  const reg = /^(?:(?:\+|00)86)?1\d{10}$/;
  return reg.test(phone);
}
