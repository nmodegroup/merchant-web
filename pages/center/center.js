// pages/center/center.js
const PageConstant = require('../../constant/page');
const { throttle } = require('../../utils/throttle-debounce/index');
const WxManager = require('../../utils/wxManager');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navBgColor: 'none',
    contactPhoneNumber: '159 0904 0903', //TODO:手机号修改
    statusChecked: false, // 营业状态选中
    reserveChecked: false, // 预约开关
    hasPhoneAuth: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    WxManager.getSystemInfo().then(res => {
      this.scrollHeight = res.windowWidth * (180 / 375);
    });
    // 定义滚动节流函数
    this.scrollThrottle = throttle(100, event => {
      this.setData({
        navBgColor: `rgba(22, 21, 73, ${event.scrollTop / this.scrollHeight})`
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
  },

  /**
   * 监听用户滑动页面事件
   */
  onPageScroll(event) {
    const { scrollTop } = event;
    if (event.scrollTop > this.scrollHeight) {
      return false;
    }
    this.scrollThrottle(event);
  },

  handleGetPhoneNUmber() {},

  onStatusChange() {
    const { statusChecked } = this.data;
    this.setData({
      statusChecked: !statusChecked
    });
  },

  onReserveChange() {
    const { reserveChecked } = this.data;
    this.setData({
      reserveChecked: !reserveChecked
    });
  },

  handleCellClick(event) {
    console.log('event:', event);
    const { type } = event.detail;
    console.log('PageConstant:', PageConstant);
    const cellStrategy = {
      businessTime: () => this.navigation(PageConstant.BUSINESS_TIME_URL),
      arrivalTime: () => this.navigation(PageConstant.ARRIVAL_TIME_URL),
      order: () => this.navigation(PageConstant.ORDER_URL),
      qrCode: () => this.navigation(PageConstant.QR_CODE_URL),
      help: () => this.navigation(PageConstant.HELP_URL),
      contact: () => this.makePhoneCall(),
      about: () => this.navigation(PageConstant.ABOUT_URL)
    };
    return cellStrategy[type] ? cellStrategy[type]() : console.error('type error');
  },

  navigation(path) {
    wx.navigateTo({
      url: path
    });
  },

  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.contactPhoneNumber
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
