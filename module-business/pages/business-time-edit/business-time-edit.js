// module/pages/business-time-edit/busine.js
const wxManager = require('../../../utils/wxManager');
const pageConstant = require('../../../constant/page');
const { getWeekTitle, getHours, getMinutes } = require('../../../utils/date');
const { initValue, isEdit } = require('../../../utils/global');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
const eventEmitter = getApp().eventEmitter;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hours: getHours(),
    minutes: getMinutes(),
    isEdit: false,
    businessId: '',
    startDate: '', // 编辑时营业开始时间
    endDate: '', // 编辑时营业结束时间
    weeks: [], // 重复日期数组
    callbackWeeks: [], // 已选中的日期数组（星期几）
    weekListContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(options);
    this.registerCallbacks();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  onUnload() {
    /* 解注册 */
    eventEmitter.off('callbackWeeks');
  },

  /**
   * 注册监听星期选择回调
   */
  registerCallbacks() {
    eventEmitter.on('callbackWeeks', this.setSelectWeeks);
  },

  setSelectWeeks(selectWeeks) {
    this.setData({
      weeks: selectWeeks
    });
    this.resolveWeeks();
  },

  initData(options) {
    this.setData(
      {
        isEdit: isEdit(options.businessId),
        businessId: initValue(options.businessId),
        startDate: initValue(options.start),
        endDate: initValue(options.endDate),
        weeks: options.weeks ? JSON.parse(options.weeks) : []
      },
      () => {
        this.resolveWeeks();
      }
    );
  },

  resolveWeeks() {
    const { weeks } = this.data;
    if (!weeks.length) {
      return false;
    }
    const weekList = weeks.map(week => {
      return getWeekTitle(week);
    });
    const weekListContent = weekList.join(' ');
    this.setData({
      weekListContent: weekListContent
    });
  },

  handleCreateTime() {},

  handleEditTime(event) {
    const type = event.detail.type;
    if (type === 'right') {
      this.deleteBusinessTime();
    } else {
      this.resolveFormData();
    }
  },

  deleteBusinessTime() {},

  /**
   * 新增每周重复日期
   */
  handleCellClick() {
    wxManager.navigateTo(pageConstant.WEEK_URL);
  }
});
