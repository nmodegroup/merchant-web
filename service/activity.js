const httpManager = require('../lib/request/httpManager');

/**
 * 获取活动列表
 */
export function getActivityList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/activity/list',
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
 * 预订人员列表
 */
export function getActivityUser(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/activity/user',
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
 * 活动-开启/关闭
 */
export function changeActivityStatus(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put({
        url: '/merchant/activity',
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
 * 活动-新增/编辑
 */
export function createOrEditActivy(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post({
        url: '/merchant/activity',
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
 * 活动-获取详情
 */
export function getActivityDetail(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/activity',
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
 * 活动-删除
 */
export function deleteActivy(params) {
  return new Promise((resolve, reject) => {
    httpManager
      ._delete({
        url: '/merchant/activity',
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
 * 活动-核销
*/
export function getActivityCancelList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/activity/cf/page',
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
 * 核销详情
*/
export function getActivityCancelDetail(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/activity/cf/detail',
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
 * 扫码后的劵码
*/
export function getActivityCancelTicket(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/activity/ticket/info',
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
 * 确认核销
*/
export function putCancelTicket(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put({
        url: '/merchant/activity/charge/off',
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