const { md5 } = require('../md5');
const CONSTANT = require('./constant');
const ENV = require('./env');
const app = getApp();

/**
 * 普通请求
 * @param {object} req 请求参数
 */
function _request(req) {
  const { uri, params, method } = req;
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${ENV.host}${uri}`,
      data: params,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: getHeader(req),
      success: res => {
        if (res.code === CONSTANT.SUCCESS) {
          resolve(res.data);
        } else {
          reject(res.msg);
        }
      },
      fail: () => {
        reject('请求失败');
      }
    });
  });
}

/**
 * 文件上传
 * @param {object} req 上传参数
 */
function _uploadFile(req) {
  const { uri, formData, filePath, name, contentType } = req;
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${ENV.host}${uri}`,
      filePath: filePath,
      name: name,
      header: getHeader(req),
      formData: formData,
      success: res => {
        if (res.code === CONSTANT.SUCCESS) {
          resolve(res.data);
        } else {
          reject(res.msg);
        }
      },
      fail: () => {
        reject('上传失败');
      }
    });
  });
}

/**
 * 文件下载
 * @param {string} url 完整的下载地址
 */
function _downloadFile({ url }) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: url,
      success: res => {
        resolve(res);
      },
      fail: () => {
        reject('下载失败');
      }
    });
  });
}

/*
 * 生成签名 sign
 */
function generateSign(params) {
  const { token } = app.globalData;
  const { nonce, uri } = params;
  return md5(`${token}${ENV.api_key}${nonce}${uri}${ENV.api_secret}`);
}

function getHeader(req) {
  const { uri, contentType } = req;
  const EXPIRE_TIME = new Date().getTime() + 12000;
  const signData = { nonce: EXPIRE_TIME, uri: uri };
  // API过期时间戳
  return {
    token: app.globalData.token,
    key: ENV.api_key,
    nonce: EXPIRE_TIME,
    sign: generateSign(signData),
    'content-type': contentType
  };
}

module.exports = {
  _request,
  _uploadFile,
  _downloadFile
};
