const httpManager = require('../lib/request/httpManager');

/**
 * 获取活动列表
 */
export function getActivityList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      // .get('/merchant/activity/list', params)
      .get('https://easy-mock.com/mock/5d4fcefa5bff847d28d02903/merchant/activity/list', params)
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
      .get('https://easy-mock.com/mock/5d4fcefa5bff847d28d02903/merchant/activity/user', params)
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
      .put('/merchant/activity', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 活动-新增
 */
export function createActivy(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/merchant/activity', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

/**
 * 活动-编辑
 */
export function editActivy(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/merchant/activity', params)
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
      .get('/merchant/activity', params)
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
      ._delete('/merchant/activity', params)
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}
