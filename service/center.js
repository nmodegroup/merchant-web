const httpManager = require('../lib/request/httpManager');

/**
 * 获取商家中心首页信息
 */
export function getCenterInfo() {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/index',
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
 * 商家营业状态-开启/关闭
 */
export function changeBusinessStatus() {
  return new Promise((resolve, reject) => {
    httpManager
      .put({
        url: '/merchant/business/status',
        contentType: httpManager.FORM_URLENCODED
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
 * 商家预订状态-开启/关闭
 */
export function changeAppointStatus() {
  return new Promise((resolve, reject) => {
    httpManager
      .put({
        url: '/merchant/appoint/status',
        contentType: httpManager.FORM_URLENCODED
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
 * 商家--余额
*/
export function getBalance() {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/account/balance',
        contentType: httpManager.JSON
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 账单-明细
*/

export function getStatement(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/account/statement',
        params: params,
        contentType: httpManager.JSON
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
/**
 * 提现
*/

export function postExtract(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post({
        url: '/merchant/account/extract',
        params: params,
        contentType: httpManager.FORM_URLENCODED
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}