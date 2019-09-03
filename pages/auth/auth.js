// pages/auth/auth.js
const wxManager = require('../../utils/wxManager');
const authService = require('../../service/user');
const pageConstant = require('../../constant/page');
const pageFlag = require('../../constant/pageFlag');
const { isEmpty } = require('../../utils/global');
const store = getApp().globalData;
const { PageConfig } = require('../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    visibleAuthBtn: false,
    code: '' // 登录 code
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
    this.wxLogin();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  initData() {
    PageHelper.setupPageConfig(this);
  },

  /**
   * 微信登录
   *
   */
  wxLogin() {
    wxManager.login().then(code => {
      if (code) {
        this.setData({
          code
        });
        this.requestUserInfo();
      } else {
        this.Toast.showToast({
          content: '微信登录失败'
        });
      }
    });
  },

  requestUserInfo() {
    PageHelper.requestWrapper(wxManager.getUserInfo())
      .then(res => {
        this.setData({
          visibleAuthBtn: false
        });
        this.storeUserInfo(res.userInfo);
        this.requestLogin(res);
      })
      .catch(e => {
        this.setData({
          visibleAuthBtn: true
        });
      });
  },

  getUserInfoCallback(event) {
    console.log(event);
    const { userInfo } = event.detail;
    if (isEmpty(userInfo)) {
      this.Toast.showToast({
        content: '授权失败'
      });
    } else {
      this.storeUserInfo(userInfo);
      this.requestLogin(event.detail);
    }
  },

  /**
   * 用户信息存到全局
   */
  storeUserInfo(userInfo) {
    store.userInfo = userInfo;
  },

  /**
   * 请求微信登录
   *
   * @param {object} wxUserInfo 用户信息
   */
  requestLogin(wxUserInfo) {
    const { code } = this.data;
    const params = this.queryParams(code, wxUserInfo);
    PageHelper.requestWrapper(authService.login(params))
      .then(res => {
        store.token = res.token;
        store.phone = res.phone || '';
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
