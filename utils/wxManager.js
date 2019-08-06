/**
 * 普通路由跳转
 * @param {string} url    目标页面地址
 * @param {object} params 携带的参数对象
 */
function navigateTo(url, params) {
  wx.navigateTo({
    url: joinPath(url, params)
  });
}

/**
 * path 拼接
 */
function joinPath(url, params) {
  if (!params || typeof params !== 'object') {
    return url;
  }
  const keys = Object.keys(params);
  if (keys && keys.length) {
    const path = keys.reduce((url, key) => {
      return `${url}${key}=${params[key]}&`;
    }, `${url}?`);
    return path.substring(0, path.length - 1);
  } else {
    return url;
  }
}

/**
 * 检测当前登录态
 */
function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: () => {
        resolve();
      },
      fail: () => {
        reject();
      }
    });
  });
}

/**
 * 微信登录
 */
function login() {
  return new Promise(resolve => {
    wx.login({
      success: res => {
        resolve(res.code);
      }
    });
  });
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo
          wx.getUserInfo({
            success: result => {
              console.log('userinfo', result);
              resolve(result);
            }
          });
        } else {
          reject();
        }
      }
    });
  });
}

/**
 * 请求定位信息
 */
function getLocation() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          // 已经授权，可以直接调用 getLocation
          getLocationDetail(resolve);
        } else {
          // 发起授权
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              getLocationDetail(resolve);
            },
            fail: () => {
              // 授权失败
              reject();
            }
          });
        }
      }
    });
  });
}

function getLocationDetail(resolve) {
  wx.getLocation({
    success: location => {
      console.log('location', location);
      resolve(location);
    }
  });
}

/**
 * 保存图片到相册
 */
function saveImageToPhotosAlbum(imagePath) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          // 已经授权，可以直接调用 getLocation
          saveImage(resolve, imagePath);
        } else {
          // 发起授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              saveImage(resolve, imagePath);
            },
            fail: () => {
              // 授权失败
              reject();
            }
          });
        }
      }
    });
  });
}

function saveImage(resolve, imagePath) {
  wx.saveImageToPhotosAlbum({
    filePath: imagePath,
    success: res => {
      resolve(res);
    }
  });
}

/**
 * 获取系统信息异步方法
 */
function getSystemInfo() {
  return new Promise(resolve => {
    wx.getSystemInfo({
      success: function(res) {
        // success
        resolve(res);
      }
    });
  });
}

/**
 * 获取系统信息同步方法
 */
function getSystemInfoSync() {
  return new Promise(resolve => {
    try {
      const res = wx.getSystemInfoSync();
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  navigateTo,
  checkSession,
  login,
  getUserInfo,
  getLocation,
  saveImageToPhotosAlbum,
  getSystemInfo,
  getSystemInfoSync
};
