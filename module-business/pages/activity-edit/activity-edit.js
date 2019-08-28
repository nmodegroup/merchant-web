// module-business/pages/activity-edit/activity-edit.js
const activityService = require('../../../service/activity');
const { isEdit, initValue, isEmpty } = require('../../../utils/global');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    minDate: new Date().getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    title: '创建活动',
    theme: '', // 活动主题
    beginTime: '', // 活动开始时间
    endTime: '', // 活动结束时间
    cityId: '', // 城市id
    areaId: '', // 区域id
    cityName: '', // 所在城市名称
    areaName: '', // 所在区域名称
    address: '', // 详细地址
    phone: '', // 联系电话
    guest: '', // 嘉宾信息
    quotaType: '', // 限制预订数量类型（0不限 1按系统已有桌位限制 2按固定名额限制）
    quota: '', // 预订限额数量
    banner: '', // 活动宣传banner图url
    post: '', // 活动海报url
    verifyed: false, // 表单是否校验通过
    visibleDateTime: false, // 时间选择
    visibleArea: false // 省市区选择
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(options);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  initData(options) {
    const activityId = options.activityId;
    this.setData({
      isEdit: isEdit(activityId),
      title: isEdit(activityId) ? '编辑活动' : '创建活动',
      activityId: initValue(activityId)
    });
    PageHelper.setupPageConfig(this);
    this.requestActivityInfo();
  },

  /**
   * 活动详情
   */
  requestActivityInfo() {
    const activityId = this.data.activityId;
    if (isEmpty(activityId)) {
      return false;
    }
    const params = {
      id: activityId
    };
    PageHelper.requestWrapper(activityService.getActivityDetail(params)).then(res => {
      this.setData({
        ...res
      });
    });
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },

  /**
   * 点击 cell 事件
   */
  handleCellClick(event) {
    const { type } = event.currentTarget.dataset;
    const strategy = {
      time: () => this.setVisible('visibleDateTime'),
      area: () => this.setVisible('visibleArea')
    };
    strategy[type]();
  },

  setVisible(visibleType) {
    this.setData({
      [visibleType]: true
    });
  },

  commitForm() {},

  requestCommitActivityInfo() {
    const params = {};
    PageHelper.requestWrapper(activityService.createOrEditActivy(params)).then(() => {});
  }
});
