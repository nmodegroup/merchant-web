const httpManager = require('../lib/request/httpManager');

/**
 * 获取区域列表
 */
export function getTableAreaList() {
  return new Promise((resolve, reject) => {
    httpManager
      //   .get('/merchant/table/area')
      .get({
        url: 'https://api.bmkee.com/mock/21/merchant/table/area',
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
 * 新增/编辑 区域
 */
export function createTableArea(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post({
        url: '/merchant/table/area',
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

/**
 * 删除区域
 */
export function deleteTableArea(params) {
  return new Promise((resolve, reject) => {
    httpManager
      ._delete({
        url: '/merchant/table/area',
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

/**
 * 获取桌位列表
 */
export function getTableList() {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/table',
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
 * 新增/编辑 桌位
 */
export function createTable(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post({
        url: '/merchant/table',
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

/**
 * 删除桌位
 */
export function deleteTable(params) {
  return new Promise((resolve, reject) => {
    httpManager
      ._delete({
        url: '/merchant/table',
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
