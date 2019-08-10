const httpManager = require('../lib/request/httpManager');

/**
 * 获取区域列表
 */
export function getTableAreaList() {
  return new Promise((resolve, reject) => {
    httpManager
      //   .get('/merchant/table/area')
      .get('https://api.bmkee.com/mock/21/merchant/table/area')
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 新增区域
 */
export function createTableArea(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/merchant/table/area', params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 编辑区域
 */
export function editTableArea(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/merchant/table/area', params)
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
      ._delete('/merchant/table/area', params)
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
      .get('/merchant/table')
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 新增桌位
 */
export function createTable(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/merchant/table', params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 编辑桌位
 */
export function editTable(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post('/merchant/table', params)
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
      ._delete('/merchant/table', params)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
