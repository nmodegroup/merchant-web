const userService = require('../../../service/user');
const commonService = require('../../../service/common');
const { isEmpty } = require('../../../utils/global');
const { debounce } = require('../../../utils/throttle-debounce/index');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
const store = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSecondStep: false, // 是否已经验证了旧手机，进入到下一步
    codeText: '获取验证码',
    isFormVerify: false, // 表单验证
    phone: '', // 新旧手机号
    oldCode: '', // 旧验证码
    newCode: '' // 新验证码
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

  onUnload() {
    this.clearCodeTimer();
  },

  initData() {
    PageHelper.setupPageConfig(this);
    // 输入防抖
    this.setupDebounce();
    // 回填手机号
    this.setData({
      phone: store.phone
    });
  },

  setupDebounce() {
    /* 输入防抖，func 为需要执行的函数，不传则默认 refreshFormVerify */
    this.inputDebounce = debounce(300, (func = this.refreshFormVerify) => {
      func();
    });
  },

  /**
   * 输入手机号
   */
  handlePhoneInput(event) {
    console.log(event);
    const { value } = event.detail;
    this.setData({
      phone: value
    });
    this.inputDebounce();
  },

  /**
   * 输入验证码
   */
  handleCodeInput(event) {
    console.log(event);
    const { value } = event.detail;
    const { isSecondStep } = this.data;
    if (isSecondStep) {
      this.setData({
        newCode: value
      });
    } else {
      this.setData({
        oldCode: value
      });
    }
    this.inputDebounce();
  },

  /**
   * 刷新表单验证状态
   */
  refreshFormVerify() {
    this.setData({
      isFormVerify: this.getFormVerify()
    });
  },

  getFormVerify() {
    const { phone, oldCode, newCode, isSecondStep } = this.data;
    if (isSecondStep) {
      return !isEmpty(phone) && !isEmpty(newCode);
    }
    console.log('phone', !isEmpty(phone));
    console.log('oldCode', !isEmpty(oldCode));
    return !isEmpty(phone) && !isEmpty(oldCode);
  },

  sendCode() {
    const { isSecondStep, phone } = this.data;

    // 判断是否已经发送验证码正在倒计时
    if (this.isCountdown) {
      return false;
    }

    if (isEmpty(phone)) {
      return false;
    }

    //  3商家端小程序旧手机验证发送短信 4商家端小程序新手机绑定发送短信
    const params = {
      phone: phone,
      type: isSecondStep ? 4 : 3
    };
    PageHelper.requestWrapper(commonService.sendMessage(params)).then(res => {
      this.startCountdown();
    });
  },

  /**
   * 验证码倒计时
   */
  startCountdown() {
    let times = 60;
    this.updateCodeText(`${times}s`);
    this.isCountdown = true;
    // timer 对象
    this.timer = setInterval(() => {
      if (times <= 0) {
        this.updateCodeText('重新发送');
        return this.clearCodeTimer();
      }
      times--;
      this.updateCodeText(`${times}s`);
    }, 1000);
  },

  updateCodeText(content) {
    this.setData({
      codeText: content
    });
  },

  clearCodeTimer() {
    if (isEmpty(this.timer)) {
      return false;
    }
    clearTimeout(this.timer);
    this.isCountdown = false;
  },

  verifyOldPhone() {
    console.log('verifyOldPhone');
    const { phone, oldCode } = this.data;

    if (isEmpty(phone) || isEmpty(oldCode)) {
      return false;
    }

    const params = {
      phone: phone,
      code: oldCode
    };
    PageHelper.requestWrapper(userService.verifyPhone(params)).then(res => {
      this.setData({
        isSecondStep: true,
        isFormVerify: false,
        phone: ''
      });
      this.updateCodeText('发送验证码');
      this.clearCodeTimer();
    });
  },

  commitFrom() {
    console.log('commitFrom');
    const { phone, oldCode, newCode } = this.data;

    if (isEmpty(phone) || isEmpty(oldCode) || isEmpty(newCode)) {
      return false;
    }

    const params = {
      oldCode,
      newCode,
      newPhone: phone
    };

    PageHelper.requestWrapper(userService.bindNewPhone(params)).then(res => {
      store.phone = res;
      PageHelper.requestSuccessCallback('您的手机号换绑成功');
    });
  }
});
