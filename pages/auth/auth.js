// pages/auth/auth.js
const wxManager = require('../../utils/wxManager');
const authService = require('../../service/user');
const pageConstant = require('../../constant/page');
const pageFlag = require('../../constant/pageFlag');
const store = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    visibleAuthBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.Toast = this.selectComponent('#toast');
    this.requestUserInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  requestUserInfo() {
    wxManager
      .getUserInfo()
      .then(res => {
        this.setData({
          visibleAuthBtn: false
        });
        this.storeUserInfo(res.userInfo);
        this.wxLogin(res);
      })
      .catch(e => {
        this.setData({
          visibleAuthBtn: true
        });
      });
  },

  getUserInfoCallback(event) {
    console.log(event);
    if (!event.detail.userInfo) {
      this.Toast.showToast({
        content: '授权失败'
      });
    } else {
      this.storeUserInfo(event.detail.userInfo);
      this.wxLogin(event.detail);
    }
  },

  /**
   * 用户信息存到全局
   */
  storeUserInfo(userInfo) {
    store.userInfo = userInfo;
  },

  /**
   * 微信登录
   *
   * @param {object} wxUserInfo 用户信息
   */
  wxLogin(wxUserInfo) {
    wxManager.login().then(code => {
      if (code) {
        const params = this.queryParams(code, wxUserInfo);
        this.requestLogin(params);
      } else {
        this.Toast.showToast({
          content: '微信登录失败'
        });
      }
    });
  },

  requestLogin(params) {
    authService
      .login(params)
      .then(res => {
        store.token = res.token;
        store.phone = res.phone;
        if (res.isFirst) {
          this.goInfoPage();
        } else {
          this.goCenter();
        }
      })
      .catch(e => {
        this.Toast.showToast({
          content: e.msg || '登录失败，请重试'
        });
      });
  },

  /**
   * 去填写认证信息
   */
  goInfoPage() {
    wxManager.redirectTo(pageConstant.INFO_URL, {
      enterType: pageFlag.INFO_BASE
    });
  },

  /**
   * 去个人中心页
   */
  goCenter() {
    wxManager.switchTab(pageConstant.CENTER_URL);
  },

  queryParams(code, wxUserInfo) {
    const { encryptedData, iv, userInfo } = wxUserInfo;
    return {
      code: code,
      encrypted: encryptedData,
      iv: iv,
      nickName: userInfo.nickName,
      portrait: userInfo.avatarUrl,
      // 性别 0：未知、1：男、2：女
      sex: parseInt(userInfo.gender) - 1
    };
  }
});
