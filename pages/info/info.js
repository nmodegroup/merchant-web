// pages/info/info.js
const wxManager = require('../../utils/wxManager');
const authService = require('../../service/user');
const pageConstant = require('../../constant/page');
const pageFlag = require('../../constant/pageFlag');
const { debounce } = require('../../utils/throttle-debounce/index');
const store = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    enterType: pageFlag.INFO_TOTAL,
    verifyed: false, // 校验结果
    shopName: '',
    province: '',
    city: '',
    area: '',
    address: '',
    shopPhone: '',
    type: '',
    selectImageUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  initData() {
    // 输入防抖
    this.inputDebounce = debounce(300, event => {
      console.log('inputDebounce');
      console.log('this.verifyForm():', this.verifyForm());
      this.setData({
        verifyed: this.verifyForm()
      });
    });
  },

  handleInput(event) {
    console.log(event);
    const type = event.currentTarget.dataset.type;
    const value = event.detail.value;
    this.setData({
      [type]: value
    });
    this.inputDebounce(event);
    console.log('handleInput');
  },

  /**
   * 验证表单
   */
  verifyForm() {
    const { shopName, address, shopPhone } = this.data;
    console.log('data:', this.data);
    return shopName && address && shopPhone;
  },

  commitForm() {
    if (!this.verifyForm()) {
      return false;
    }
  },

  handleSkip() {
    wxManager.switchTab(pageConstant.CENTER_URL);
  }
});
