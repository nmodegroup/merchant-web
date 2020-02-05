/**
 * 普通路由跳转
 * @param {string} url    目标页面地址
 * @param {object} params 携带的参数对象
 */
export function navigateTo(url, params) {
  wx.navigateTo({
    url: joinPath(url, params)
  });
}

/**
 * 跳转并销毁当前页面
 */
export function redirectTo(url, params) {
  console.log('joinPath:', joinPath(url, params));
  wx.redirectTo({
    url: joinPath(url, params)
  });
}

/**
 * tabBar switch
 */
export function switchTab(url) {
  wx.switchTab({
    url: url
  });
}

/**
 * 返回上级页面
 */
export function navigateBack(delta = 1) {
  wx.navigateBack({
    delta: delta
  });
}

/**
 * path 拼接
 */
export function joinPath(url, params) {
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
export function checkSession() {
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
export function login() {
  return new Promise(resolve => {
    wx.login({
      success: res => {
        resolve(res.code);
      },
      fail: err => {
        reject('微信登录失败');
      }
    });
  });
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
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
          reject('获取用户信息失败');
        }
      }
    });
  });
}

/**
 * 请求定位信息
 */
export function getLocation() {
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
              reject('获取地理位置信息失败');
            }
          });
        }
      }
    });
  });
}

export function getLocationDetail(resolve) {
  wx.getLocation({
    success: location => {
      resolve(location);
    }
  });
}

/**
 * 调起客户端小程序设置界面
 */
export function openSetting() {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: result => {
        resolve(result);
      },
      fail: () => {
        reject('openSetting fail');
      }
    });
  });
}

/**
 * 保存图片到相册
 */
export function saveImageToPhotosAlbum(imagePath) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          // 已经授权，可以直接调用 getLocation
          saveImage(resolve, reject, imagePath);
        } else {
          // 发起授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              saveImage(resolve, reject, imagePath);
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

function saveImage(resolve, reject, imagePath) {
  wx.saveImageToPhotosAlbum({
    filePath: imagePath,
    success: res => {
      resolve(res);
    },
    fail: () => {
      reject();
    }
  });
}

/**
 * 从本地相册选择图片或使用相机拍照。
 */
export function chooseImage() {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        resolve(res);
      },
      fail: function() {
        reject('wxError: choose image fail from phone');
      }
    });
  });
}

/**
 * 获取系统信息异步方法
 */
export function getSystemInfo() {
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
export function getSystemInfoSync() {
  return new Promise(resolve => {
    try {
      const res = wx.getSystemInfoSync();
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * 显示 loading 提示框
 */
export function showLoading(title) {
  title = title ? title : '';
  wx.showLoading({
    title: title,
    mask: true
  });
}

/**
 * 隐藏 loading
 */
export function hideLoading() {
  wx.hideLoading();
}

/**
 * 隐藏 loading 关闭 refresh 动画
 */
export function stopRefreshAndLoading() {
  wx.hideLoading();
  wx.stopPullDownRefresh();
}

/**
 * 拨打电话
 *
 * @param {string || number} phone 电话号码
 */
export function makePhoneCall(phone) {
  wx.makePhoneCall({
    phoneNumber: phone
  });
}

/**
 * 预览图片
 * @param {string} imageUrl 图片地址
 */
export function previewImage(imageUrl) {
  wx.previewImage({
    // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
    urls: [imageUrl]
  });
}

/**
 * 打开地图选择位置
 */
export function chooseLocation() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          // 已经授权，可以直接调用 getLocation
          startChooseLocation(resolve);
        } else {
          // 发起授权
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              startChooseLocation(resolve);
            },
            fail: () => {
              // 授权失败
              reject('授权地理位置信息失败');
            }
          });
        }
      }
    });
  });
}

function startChooseLocation(resolve) {
  wx.chooseLocation({
    success: function(res) {
      // success
      resolve(res);
    }
  });
}

/**
 * 微信默认弹窗
 */
export function showModal({ title = '', content }) {
  return new Promise(resolve => {
    wx.showModal({
      title: title,
      content: content,
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: result => {
        if (result.confirm) {
          resolve();
        }
      }
    });
  });
}
/**
 * 扫码
*/

export function scanCode(resolve, reject){
  wx.scanCode({
    scanType: "qrCode",
    success(res) {
      console.log(res)
      resolve(res)
    },
    fail(err){
      console.error(err)
      if (err && err.errMsg === "scanCode:fail cancel") {
        return
      }
      reject({
        msg: "扫码失败"
      })
    }
  })
}