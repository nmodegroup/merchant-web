const { md5 } = require('../md5');
const { Method, StatusCode } = require('./constant');
const wxManager = require('../../utils/wxManager');
const pageConstant = require('../../constant/page');
const ENV = require('./env');
const app = getApp();
const { joinPath } = require('../../utils/wxManager');

const failRequest = { code: -1, msg: '网络开小差~，刷新试试', data: '' };
const failUpload = { code: -1, msg: '上传失败', data: '' };
const failDownload = { code: -1, msg: '下载失败', data: '' };

/**
 * 普通请求
 * @param {object} req 请求参数
 */
function _request(req) {
  const { uri, params, method } = req;
  let url = uri.startsWith('http') ? uri : `${ENV.host}${uri}`;
  if (method === Method.DELETE) {
    url = joinPath(url, params);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      method: method,
      header: getHeader(req),
      success: res => {
        const data = res.data;
        if (data.code === StatusCode.SUCCESS) {
          resolve(data.data);
        } else if (data.code === StatusCode.NOT_LOGIN) {
          wxManager
            .showModal({
              title: '登录提示',
              content: '登录已过期，请重新登录'
            })
            .then(() => {
              wxManager.navigateTo(pageConstant.AUTH_URL);
            });
          reject(data);
        } else {
          reject(data);
        }
      },
      fail: () => {
        reject(failRequest);
      }
    });
  });
}

/**
 * 文件上传
 * @param {object} req 上传参数
 */
function _uploadFile(req) {
  const { uri, formData, filePath, name } = req;
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${ENV.host}${uri}`,
      filePath: filePath,
      name: name,
      header: getHeader(req),
      formData: formData,
      success: res => {
        let data = res.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        if (data.code === StatusCode.SUCCESS) {
          resolve(data.data);
        } else if (data.code === StatusCode.NOT_LOGIN) {
          wxManager
            .showModal({
              title: '登录提示',
              content: '登录已过期，请重新登录'
            })
            .then(() => {
              wxManager.navigateTo(pageConstant.AUTH_URL);
            });
          reject(data);
        } else {
          reject(data);
        }
      },
      fail: () => {
        reject(failUpload);
      }
    });
  });
}

/**
 * 文件下载
 * @param {string} url 完整的下载地址
 */
function _downloadFile({ url }) {
  console.log('_downloadFile', url);
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: url,
      success: res => {
        resolve(res);
      },
      fail: () => {
        reject(failDownload);
      }
    });
  });
}

/*
 * 生成签名 sign
 */
function generateSign(params) {
  const { token } = app.globalData;
  const { nonce, uri, method } = params;
  return md5(`${token}${ENV.api_key}${nonce}${uri}${ENV.api_secret}${method}`);
}

function getHeader(req) {
  const { uri, contentType, method } = req;
  // API过期时间戳
  const EXPIRE_TIME = new Date().getTime() + 120000;
  const signData = { nonce: EXPIRE_TIME, uri: uri, method: method };
  return {
    token: app.globalData.token,
    key: ENV.api_key,
    nonce: EXPIRE_TIME,
    sign: generateSign(signData),
    'Content-Type': contentType
  };
}

module.exports = {
  _request,
  _uploadFile,
  _downloadFile
};
