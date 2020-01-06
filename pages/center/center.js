// pages/center/center.js
const PageConstant = require('../../constant/page');
const { throttle } = require('../../utils/throttle-debounce/index');
const WxManager = require('../../utils/wxManager');
const pageFlag = require('../../constant/pageFlag');
const centerService = require('../../service/center');
const userService = require('../../service/user');
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
    contactPhoneNumber: '130 2543 7441',
    isTable: false, // 桌位是否设定
    businessStatusOpen: false, // 营业状态
    appointOpen: false, // 预约开关
    avatarUrl: '',
    nickName: '',
    phone: '',
    auditStatus: AuditStatus.NOT_AUDIT,
    appointStatus: 1,
    reason: '',
    shareImg: '',
    balance: 0,
    totalEarnAmount: 0,
    withdrawalAmount: 0
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
    this.setupUserInfo();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.requestMerchantInfo();
  },

  onShareAppMessage() {
    return {
      path: PageConstant.AUTH_URL
    };
  },

  initData() {
    this.isLoadFirst = true; // 用于判断第二次加载不显示 loading
    PageHelper.setupPageConfig(this);
    this.setupScroll();
    this.getBalance();
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
  /*
  * 余额信息
  */
  getBalance(){
    PageHelper.requestWrapper(centerService.getBalance()).then( res => {
      console.log(res)
      let { balance, totalEarnAmount, withdrawalAmount } = this.data;
      balance = res.balance;
      totalEarnAmount = res.total;
      withdrawalAmount = res.withdrawal;
      this.setData({ balance, totalEarnAmount, withdrawalAmount })
    }).catch( err => {
     console.error(err)
    })
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
    PageHelper.requestWrapper(centerService.getCenterInfo(), this.isLoadFirst).then(res => {
      this.setData({
        auditStatus: initValue(res.auditStatus, AuditStatus.NOT_AUDIT),
        reason: initValue(res.reason),
        businessStatusOpen: this.isBusinessStatusOpen(initValue(res.businessStatus, BusinessStatus.CLOSE)),
        appointOpen: this.isAppointOpen(initValue(res.appointStatus, AppointStatus.CLOSE)),
        shareImg: initValue(res.shareImg), // 商家二维码图片链接
        isTable: initValue(res.isTable, false)
      });
      store.isAuth = initValue(res.isAuth, false);
      store.auditStatus = initValue(res.auditStatus, AuditStatus.NOT_AUDIT);
      // 更新加载状态
      this.isLoadFirst = false;
    });
  },

  isBusinessStatusOpen(businessStatus) {
    return businessStatus === BusinessStatus.OPEN;
  },

  isAppointOpen(appointStatus) {
    return appointStatus === AppointStatus.OPEN;
  },

  /**
   * 手机号授权
   */
  onGetPhoneClick() {
    // 先微信登录
    PageHelper.requestWrapper(WxManager.login())
      .then(code => {
        return code;
      })
      .then(code => {
        // 授权弹窗
        PageHelper.showGetPhoneNumberModal().then(result => {
          this.requestParsePhone(code, result);
        });
      });
  },

  requestParsePhone(code, result) {
    const { encryptedData, iv } = result;
    const params = {
      encrypted: encryptedData,
      iv: iv,
      code: code
    };
    // 解析手机号
    PageHelper.requestWrapper(userService.parsePhone(params)).then(phone => {
      // 将手机号存到全局
      store.phone = phone;
      this.setData({
        phone
      });
    });
  },

  /**
   * 切换营业状态
   */
  onStatusChange() {
    const { businessStatusOpen } = this.data;
    PageHelper.checkAuditStatus()
      .then(() => {
        if (businessStatusOpen) {
          return this.modal.showModal({
            content: '设置休业状态，用户将无法看到店铺',
            cancelText: '点错了',
            confirmText: '确定休业',
            hideCancel: false,
            onConfirm: () => {
              this.requestSwitchBusinessStatus();
            }
          });
        }
        this.requestSwitchBusinessStatus();
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
    const { appointOpen } = this.data;
    PageHelper.checkAuditStatus()
      .then(() => {
        this.modal.showModal({
          content: appointOpen ? '确定要关闭自动接单吗？' : '确定要开启自动接单吗？',
          cancelText: '点错了',
          confirmText: appointOpen ? '确定关闭' : '确定开启',
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

  /**
   * 店铺信息，桌位管理
   */
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
    // 审核中不能编辑
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
    PageHelper.showSingleConfirmModal(reason, '审核未通过原因');
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
      qrCode: () => this.goCodePage(),
      protocol: () => this.navigation(PageConstant.PROTOCOL_URL),
      contact: () => this.makePhoneCall(),
      remind: () => this.navigation(PageConstant.REMIND_URL)
    };
    return cellStrategy[type] ? cellStrategy[type]() : console.error('type error');
  },

  navigation(path, params) {
    WxManager.navigateTo(path, params);
  },
  handleLookAccount(){
    this.navigation(PageConstant.ACCOUNT_URL)
  },
  handleDraw(){
    this.navigation(PageConstant.DRAW_DEPOSIT_URL)
  }, 
  goCodePage() {
    const { shareImg } = this.data;
    PageHelper.checkAuditStatus().then(() => {
      this.navigation(PageConstant.QR_CODE_URL, {
        shareImg: shareImg
      });
    });
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
  }
});
