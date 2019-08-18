const httpManager = require('../lib/request/httpManager');

/**
 * 店铺信息基本资料填写
 */
export function saveShopBasicInfo(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post({
        url: '/merchant/info',
        params: params,
        contentType: httpManager.JSON
      })
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 保存/编辑 店铺信息
 */
export function saveShopInfo(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put({
        url: '/merchant/info',
        params: params,
        contentType: httpManager.JSON
      })
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 店铺信息-获取详情
 */
export function getShopInfo() {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/info',
        contentType: httpManager.JSON
      })
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}
