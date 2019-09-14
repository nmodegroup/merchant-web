const { _request, _uploadFile, _downloadFile } = require('./request');
const { Method } = require('./constant');

const FORM_URLENCODED = 'application/x-www-form-urlencoded';
const JSON = 'application/json';

function get({ url, params, contentType }) {
  return _request({
    uri: url,
    params: params || {},
    contentType: contentType || JSON,
    method: Method.GET
  });
}

function post({ url, params, contentType }) {
  return _request({
    uri: url,
    params: params || {},
    contentType: contentType || FORM_URLENCODED,
    method: Method.POST
  });
}

function put({ url, params, contentType }) {
  return _request({
    uri: url,
    params: params || {},
    contentType: contentType || FORM_URLENCODED,
    method: Method.PUT
  });
}

function _delete({ url, params, contentType }) {
  return _request({
    uri: url,
    params: params,
    contentType: contentType || FORM_URLENCODED,
    method: Method.DELETE
  });
}

function upload({ url, formData, filePath }) {
  return _uploadFile({
    uri: url,
    formData: formData,
    filePath: filePath,
    name: 'file',
    contentType: 'multipart/form-data'
  });
}

function download({ url }) {
  return _downloadFile({ url });
}

module.exports = {
  get,
  post,
  put,
  _delete,
  upload,
  download,
  FORM_URLENCODED,
  JSON
};
