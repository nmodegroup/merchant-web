// module/pages/business-time-edit/busine.js
const wxManager = require('../../../utils/wxManager');
const pageConstant = require('../../../constant/page');
const { getWeekTitle, getHours, getMinutes } = require('../../../utils/date');
const { initValue, isEdit, isEmpty } = require('../../../utils/global');
const eventEmitter = getApp().eventEmitter;
const { createNumberArray } = require('../../../utils/global');
const timeService = require('../../../service/time');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hours: getHours(),
    minutes: getMinutes(),
    isEdit: false,
    businessId: '',
    currentBeginDate: '',
    currentEndDate: '',
    begin: '', // 编辑时营业开始时间
    end: '', // 编辑时营业结束时间
    weeks: [], // 重复日期数组
    weekListContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    PageHelper.setupPageConfig(this);
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
        // 将设置初始 value 和 变化设置的目标值分离，不然会触发 vant bug，无限 setData
        currentBeginDate: initValue(options.begin, '20:00'),
        currentEndDate: initValue(options.end, '02:00'),
        begin: initValue(options.begin, '20:00'),
        end: initValue(options.end, '02:00'),
        weeks: options.weeks ? JSON.parse(options.weeks) : this.createDefaultWeeks()
      },
      () => {
        this.resolveWeeks();
      }
    );
  },

  createDefaultWeeks() {
    const numberOfWeeks = createNumberArray(7);
    return numberOfWeeks.map(item => {
      return {
        date: item
      };
    });
  },

  resolveWeeks() {
    const { weeks } = this.data;
    if (isEmpty(weeks)) {
      return false;
    }
    const weekList = weeks.map(week => {
      return getWeekTitle(week.date);
    });
    const weekListContent = weekList.join(' ');
    this.setData({
      weekListContent: weekListContent
    });
  },

  handleStartInput(event) {
    this.setData({
      begin: event.detail
    });
  },

  handleEndInput(event) {
    this.setData({
      end: event.detail
    });
  },

  handleCreateTime() {
    this.requestEditTime();
  },

  handleEditTime(event) {
    const type = event.detail.type;
    if (type === 'right') {
      this.deleteBusinessTime();
    } else {
      this.requestEditTime();
    }
  },

  requestEditTime() {
    const { begin, end, weeks, isEdit, businessId } = this.data;
    const params = {
      begin,
      end,
      weeks
    };
    // 编辑带 id
    if (isEdit) {
      params.id = businessId;
    }
    PageHelper.requestWrapper(timeService.editBusinessTime(params))
      .then(() => {
        PageHelper.requestSuccessCallback(isEdit ? '营业时间编辑成功' : '营业时间创建成功');
      })
      .catch(e => {});
  },

  /**
   * 删除营业时间
   */
  deleteBusinessTime() {
    PageHelper.showDeleteModal('是否确定删除营业时间？').then(() => {
      this.requestDeleteBusinessTime();
    });
  },

  requestDeleteBusinessTime() {
    const params = {
      id: this.data.businessId
    };
    PageHelper.requestWrapper(timeService.deleteBusinessTime(params))
      .then(() => {
        PageHelper.requestSuccessCallback('营业时间删除成功');
      })
      .catch(e => {});
  },

  /**
   * 新增每周重复日期
   */
  handleCellClick() {
    wxManager.navigateTo(pageConstant.WEEK_URL, {
      weeks: JSON.stringify(this.data.weeks)
    });
  }
});
