//app.js
const { Event } = require('./lib/event');
const ald = require('./utils/ald-stat.js')

App({
  onLaunch: function() {},

  /* 初始化 event 事件对象 */
  eventEmitter: new Event(),

  globalData: {
    token: '', // 登录标识 token
    phone: '', // 用户手机号
    userInfo: {}, // 用户信息
    auditStatus: '', // 审核状态,
    isAuth: false, // 是否认证通过
    isIphoneX: false // 是否是 iPhone X 及以上机型
  }
});
