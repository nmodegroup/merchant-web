//app.js
const { Event } = require('./lib/event');

App({
  onLaunch: function() {},

  /* 初始化 event 事件对象 */
  eventEmitter: new Event(),

  globalData: {
    token: '', // 登录标识 token
    phone: '', // 用户手机号
    userInfo: {}, // 用户信息
    isTable: false //是否设定了桌位
  }
});
