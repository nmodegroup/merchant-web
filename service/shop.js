const httpManager = require('../lib/request/httpManager');

/**
 * 店铺信息基本资料填写
 */
export function saveShopBasicInfo(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/merchant/info', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 保存店铺信息
 */
export function saveShopInfo(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put('/merchant/info', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 编辑店铺信息
 */
export function editShopInfo(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put('/merchant/info', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 编辑店铺信息
 */
export function getShopInfo() {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/merchant/info')
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}
