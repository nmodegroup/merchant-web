const { _request, _uploadFile, _downloadFile } = require('./request');

function get(url, params) {
  return _request({
    uri: url,
    params: params || {},
    contentType: 'application/json',
    method: 'GET'
  });
}

function post(url, params) {
  return _request({
    uri: url,
    params: params || {},
    contentType: 'application/x-www-form-urlencoded',
    method: 'POST'
  });
}

function put(url, params) {
  return _request({
    uri: url,
    params: params || {},
    contentType: 'application/x-www-form-urlencoded',
    method: 'PUT'
  });
}

function _delete(url, params) {
  return _request({
    uri: url,
    params: params || {},
    contentType: 'application/x-www-form-urlencoded',
    method: 'DELETE'
  });
}

function upload({ url, formData, filePath, name }) {
  return _uploadFile({
    url: url,
    formData: formData,
    filePath: filePath,
    name: name,
    contentType: 'multipart/form-data'
  });
}

function download({ url }) {
  return _downloadFile(url);
}

module.exports = {
  get,
  post,
  put,
  _delete,
  upload,
  download
};
