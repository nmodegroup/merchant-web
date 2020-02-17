
const httpManager = require('../lib/request/httpManager');

/**
 * 上传图片
 */

// export function uploadImage(params) {
//   return new Promise((resolve, reject) => {
//     httpManager
//       .upload({
//         url: '/common/upload',
//         formData: _formData,
//         filePath: params.filePath,
//         name: params.name
//       })
//       .then(res => {
//         console.log('service:', res);
//         resolve(res);
//       })
//       .catch(e => {
//         reject(e);
//       });
//   });
// }

/**
 * 上传图片--- oss改版
 */
export async function uploadImage(params) {
  console.log(params)
  const ossFileSign = await getOssFileSign(params.formData)
  console.log(ossFileSign)
  const { policy, OSSAccessKeyId, success_action_status, signature, url, key } = ossFileSign
  let _formData = Object.assign(
    params.formData, {
      key,
      policy,
      OSSAccessKeyId,
      success_action_status,
      signature
    })
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: 'https://oss.nightmodeplus.com',
      filePath: params.filePath,
      name: 'file',
      formData: _formData,
      success: res => {
        console.log(res)
        resolve(key)
      },
      fail: (err) => {
        console.log(err)
        reject({ code: -1, msg: '上传失败', data: '' });
      }
    });
  });
}

/**
 * oss文件上传获取签名
 * */ 
export function getOssFileSign(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/common/file/sign',
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
 * 短信发送
 */
export function sendMessage(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .post({
        url: '/common/msg',
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
 * 获取省市区列表
 */
export function getCityAll(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/common/city/all',
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
 * 获取城市下的区列表
 */
export function getCityArea(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/common/city/area',
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
 * 获取省下的城市列表
 */
export function getCityList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/common/city/list',
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
 * 获取所属同一省下的城市信息
 */
export function getCityLevel(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/common/city/level',
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
