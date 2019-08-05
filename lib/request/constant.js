/* 状态码 */
const SUCCESS = 1000; // 请求成功
const FAIL = 1001; // 请求失败
const NOT_LOGIN = 1002; // 用户未登录
const OPERATE_LIMIT = 1003; // 无操作权限
const ACCESS_LIMIT = 1004; // 无访问权限
const OTHER_ERROR = 1005; // 其它错误

module.exports = {
  SUCCESS,
  FAIL,
  NOT_LOGIN,
  OPERATE_LIMIT,
  ACCESS_LIMIT,
  OTHER_ERROR
};
