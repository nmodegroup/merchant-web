// pages/center/center.js
const PageConstant = require('../../constant/page');
const { throttle } = require('../../utils/throttle-debounce/index');
const WxManager = require('../../utils/wxManager');
const pageFlag = require('../../constant/pageFlag');
const centerService = require('../../service/center');
const { initValue } = require('../../utils/global');
const { AuditStatus, AppointStatus, BusinessStatus } = require('../../constant/global');
const store = getApp().globalData;
const { PageConfig } = require('../../utils/page');
const PageHelper = new PageConfig();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navBgColor: 'none',
    contactPhoneNumber: '159 0904 0903', //TODO:手机号修改
    businessStatusOpen: false, // 营业状态
    appointOpen: false, // 预约开关
    avatarUrl: '',
    nickName: '',
    phone: '',
    auditStatus: AuditStatus.NOT_AUDIT,
    appointStatus: 1,
    reason: '',
    shareImg: ''
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
  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
    this.requestMerchantInfo();
  },

  initData() {
    PageHelper.setupPageConfig(this);
    this.setupUserInfo();
    this.setupScroll();
  },

  setupUserInfo() {
    this.setData({
      nickName: store.userInfo.nickName,
      avatarUrl: store.userInfo.avatarUrl,
      phone: store.phone
    });
  },

  setupScroll() {
    WxManager.getSystemInfo().then(res => {
      this.scrollHeight = res.windowWidth * (180 / 375);
    });
    // 导航栏背景色渐变
    this.scrollThrottle = throttle(100, event => {
      this.setData({
        navBgColor: `rgba(22, 21, 73, ${event.scrollTop / this.scrollHeight})`
      });
    });
  },

  /**
   * 监听用户滑动页面事件
   */
  onPageScroll(event) {
    if (event.scrollTop > this.scrollHeight) {
      return false;
    }
    this.scrollThrottle(event);
  },

  requestMerchantInfo() {
    console.log('requestMerchantInfo');
    PageHelper.requestWrapper(centerService.getCenterInfo())
      .then(res => {
        this.setData({
          auditStatus: initValue(res.auditStatus, AuditStatus.NOT_AUDIT),
          reason: initValue(res.reason),
          businessStatusOpen: this.isBusinessStatusOpen(initValue(res.businessStatus, BusinessStatus.CLOSE)),
          appointOpen: this.isAppointOpen(initValue(res.appointStatus, AppointStatus.CLOSE)),
          shareImg: initValue(res.shareImg) // 商家二维码图片链接
        });
      })
      .catch(e => {});
  },

  isBusinessStatusOpen(businessStatus) {
    return businessStatus === BusinessStatus.OPEN;
  },

  isAppointOpen(appointStatus) {
    return appointStatus === AppointStatus.OPEN;
  },

  /**
   * 手机号授权回调
   */
  handleGetPhoneNUmber() {},

  /**
   * 切换营业状态
   */
  onStatusChange() {
    const { businessStatusOpen, auditStatus } = this.data;
    PageHelper.checkAuditStatus(auditStatus)
      .then(() => {
        this.modal.showModal({
          content: businessStatusOpen ? '设置休业状态，用户将无法看到店铺' : '设置营业状态，用户将看到店铺',
          cancelText: '点错了',
          confirmText: businessStatusOpen ? '确定修业' : '确定营业',
          hideCancel: false,
          onConfirm: () => {
            this.requestSwitchBusinessStatus();
          }
        });
      })
      .catch(e => {
        console.error(e);
      });
  },

  requestSwitchBusinessStatus() {
    const { businessStatusOpen } = this.data;
    PageHelper.requestWrapper(centerService.changeBusinessStatus()).then(res => {
      PageHelper.showSuccessToast(businessStatusOpen ? '已休业' : '开始营业');
      this.setData({
        businessStatusOpen: !businessStatusOpen
      });
    });
  },

  /**
   * 切换预约状态
   */
  onAppointChange() {
    const { appointOpen, auditStatus } = this.data;
    PageHelper.checkAuditStatus(auditStatus)
      .then(() => {
        this.modal.showModal({
          content: appointOpen ? '确认要开启预约吗？' : '确认要关闭预约吗？',
          cancelText: '取消',
          confirmText: '确认',
          hideCancel: false,
          onConfirm: () => {
            this.requestSwitchAppointStatus();
          }
        });
      })
      .catch(e => {
        console.error(e);
      });
  },

  requestSwitchAppointStatus() {
    const { appointOpen } = this.data;
    PageHelper.requestWrapper(centerService.changeAppointStatus()).then(() => {
      PageHelper.showSuccessToast(appointOpen ? '关闭成功' : '开启成功');
      this.setData({
        appointOpen: !appointOpen
      });
    });
  },

  handleColClick(event) {
    console.log(event);
    const type = event.currentTarget.dataset.type;
    const colStrategy = {
      shop: () => this.goInfoPage(),
      table: () => this.navigation(PageConstant.TABLE_URL)
    };
    return colStrategy[type] ? colStrategy[type]() : console.error('type error');
  },

  goInfoPage() {
    if (this.data.auditStatus === AuditStatus.AUDITING) {
      return PageHelper.showAuthAuditingModal();
    }
    this.navigation(PageConstant.INFO_URL, {
      enterType: pageFlag.INFO_TOTAL
    });
  },

  /**
   * 审核不通过原因
   */
  handleTagClick() {
    const { auditStatus, reason } = this.data;
    if (auditStatus !== AuditStatus.AUDIT_FAIL) {
      return false;
    }
    PageHelper.showSingleConfirmModal(reason).then(() => {});
  },

  /**
   * cell 单元格点击事件
   */
  handleCellClick(event) {
    const { type } = event.detail;
    const cellStrategy = {
      businessTime: () => this.navigation(PageConstant.BUSINESS_TIME_URL),
      arrivalTime: () => this.navigation(PageConstant.ARRIVAL_TIME_URL),
      order: () => this.navigation(PageConstant.ORDER_URL),
      qrCode: () => this.navigation(PageConstant.QR_CODE_URL),
      help: () => this.navigation(PageConstant.HELP_URL),
      contact: () => this.makePhoneCall()
    };
    return cellStrategy[type] ? cellStrategy[type]() : console.error('type error');
  },

  navigation(path, params) {
    WxManager.navigateTo(path, params);
  },

  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.contactPhoneNumber
    });
  },

  /**
   * 换绑手机号
   */
  handleReplacePhone() {
    WxManager.navigateTo(PageConstant.REPLACE_PHONE_URL);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
