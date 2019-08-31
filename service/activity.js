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
 * 预定人员列表
 */
export function getActivityUser(params) {
  return new Promise((resolve, reject) => {
    httpManager
      // .get('/merchant/activity/user', params)
      .get({
        url: 'https://easy-mock.com/mock/5d4fcefa5bff847d28d02903/merchant/activity/user',
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
