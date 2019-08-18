const httpManager = require('../lib/request/httpManager');

/**
 * 营业时间-获取时间列表
 */
export function getBusinessTime() {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/business/time',
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
 * 营业时间-新增/编辑
 */
export function editBusinessTime(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post({
        url: '/merchant/business/time',
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
 * 营业时间-开启/关闭
 */
export function switchBusinessTime(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put({
        url: '/merchant/business/time',
        params: params,
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
 * 营业时间-删除营业时间
 */
export function deleteBusinessTime(params) {
  return new Promise((resolve, reject) => {
    httpManager
      ._delete({
        url: '/merchant/business/time',
        params: params,
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
 * 特殊日期-新增/编辑
 */
export function editSpecialTime(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post({
        url: '/merchant/business/special',
        params: params,
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
 * 特殊日期-删除特殊日期
 */
export function deleteSpecialTime(params) {
  return new Promise((resolve, reject) => {
    httpManager
      ._delete({
        url: '/merchant/business/special',
        params: params,
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
 * 预约时间-获取时间列表
 */
export function getAppointTime() {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/appoint/time',
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
 * 预约时间-新增/编辑
 */
export function editAppointTime(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post({
        url: '/merchant/appoint/time',
        params: params,
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
 * 预约时间-删除
 */
export function deleteAppointTime(params) {
  return new Promise((resolve, reject) => {
    httpManager
      ._delete({
        url: '/merchant/appoint/time',
        params: params,
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
 * 预约时间-开启/关闭
 */
export function switchAppointTime(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put({
        url: '/merchant/appoint/time',
        params: params,
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
