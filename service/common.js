const httpManager = require('../lib/request/httpManager');

/**
 * 上传图片
 */
export function uploadImage(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .upload({
        url: '/common/upload',
        formData: params.formData,
        filePath: params.filePath,
        name: params.name
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
 * 短信发送
 */
export function sendMessage(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/common/msg', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 获取省市区列表
 */
export function getCityAll(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/common/city/all', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 获取城市下的区列表
 */
export function getCityArea(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/common/city/area', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 获取省下的城市列表
 */
export function getCityList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/common/city/list', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 获取所属同一省下的城市信息
 */
export function getCityLevel(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/common/city/level', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}
