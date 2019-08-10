const httpManager = require('../lib/request/httpManager');

/**
 * 获取商家中心首页信息
 */
export function getCenterInfo() {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/merchant/index')
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
      .put('/merchant/business/status')
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 商家预定状态-开启/关闭
 */
export function changeAppointStatus() {
  return new Promise((resolve, reject) => {
    httpManager
      .put('/merchant/appoint/status')
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}
