class Method {
  static GET = 'GET';
  static POST = 'POST';
  static PUT = 'PUT';
  static DELETE = 'DELETE';
}

/* 状态码 */
class StatusCode {
  static SUCCESS = 1000; // 请求成功
  static FAIL = 1001; // 请求失败
  static NOT_LOGIN = 1002; // 用户未登录
  static OPERATE_LIMIT = 1003; // 无操作权限
  static ACCESS_LIMIT = 1004; // 无访问权限
  static OTHER_ERROR = 1005; // 其它错误
}

module.exports = {
  Method,
  StatusCode
};
