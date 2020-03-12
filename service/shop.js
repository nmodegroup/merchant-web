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

/**
 * 店铺信息-获取商家分享图信息
 */
export function getShopCodeBg() {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/code/info',
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
 * 保存，修改二维吗背景图
 */
export function saveCodeBg(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post({
        url: '/merchant/code/back',
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
 * 
 */
export function codeKnow(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put({
        url: '/merchant/code/konw',
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