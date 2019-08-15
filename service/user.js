const httpManager = require('../lib/request/httpManager');

/**
 * 用户登录
 */
export function login(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/merchant/login', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 用户授权解析手机号
 */
export function parsePhone(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/merchant/phone', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 验证旧手机-下一步
 */
export function verifyPhone(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/merchant/phone', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 绑定新手机-完成
 */
export function editPhone(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put('/merchant/phone', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}
