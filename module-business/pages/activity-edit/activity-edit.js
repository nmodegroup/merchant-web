// module-business/pages/activity-edit/activity-edit.js
const activityService = require('../../../service/activity');
const commonService = require('../../../service/common');
const { isEdit, initValue, isEmpty } = require('../../../utils/global');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
const dateUtil = require('../../../utils/date');

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
    cityId: '', // 城市 id
    areaId: '', // 区域 id
    cityName: '', // 所在城市名称
    areaName: '', // 所在区域名称
    address: '', // 详细地址
    phone: '', // 联系电话
    guest: '', // 嘉宾信息
    quotaType: '', // 限制预订数量类型（0不限 1按系统已有桌位限制 2按固定名额限制）
    quota: '', // 预订限额数量
    banner: '', // 活动宣传 banner 图 url
    post: '', // 活动海报url
    verifyed: false, // 表单是否校验通过
    visibleStartTime: false, // 开始时间选择
    visibleEndTime: false, // 结束时间选择
    visibleArea: false, // 省市区选择
    areaList: [], // 省市区列表
    selectArea: '', // 选择的区域
    selectTime: '' // 选择的时间
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
    this.requestCityList();
  },

  requestCityList() {
    commonService.getCityAll().then(res => {
      this.setData({
        areaList: res
      });
    });
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

  onStartInput(event) {
    console.log('onStartInput', event);
    this.setData({
      currentDate: event.detail
    });
  },

  onEndInput(event) {
    console.log('onEndInput', event);
    this.setData({
      currentDate: event.detail
    });
  },

  /**
   * 点击 cell 事件，（时间、地区）
   */
  handleCellClick(event) {
    const { type } = event.currentTarget.dataset;
    const strategy = {
      beginTime: () => this.setVisible('visibleStartTime'),
      endTime: () => this.setVisible('visibleEndTime'),
      area: () => this.setVisible('visibleArea')
    };
    strategy[type]();
  },

  setVisible(visibleType) {
    this.setData({
      [visibleType]: true
    });
  },

  setUnvisible(unvisibleType) {
    this.setData({
      [unvisibleType]: false
    });
  },

  /**
   * 时间确认
   */
  onTimeConfirm(event) {
    const { type } = event.currentTarget.dataset;
    console.log('type', type);
    this.setData({
      [type]: dateUtil.formatDate(event.detail),
      visibleStartTime: false,
      visibleEndTime: false
    });
  },

  /**
   * 时间取消
   */
  onTimeCancel(event) {
    const { type } = event.currentTarget.dataset;
    const strategy = {
      beginTime: () => this.setUnvisible('visibleStartTime'),
      endTime: () => this.setUnvisible('visibleEndTime')
    };
    strategy[type]();
  },

  /**
   * 选择省市区确认
   */
  onCityConfirm(event) {
    const selectValues = event.detail.values;
    this.setData({
      visibleArea: false,
      selectArea: `${selectValues[0].name} ${selectValues[1].name} ${selectValues[2].name}`,
      cityName: selectValues[1].name,
      cityId: selectValues[1].code,
      areaName: selectValues[2].name,
      areaId: selectValues[2].code
    });
    this.refreshFormVerify();
  },

  /**
   * 选择省市区取消
   */
  onCityCancel() {
    this.setData({
      visibleArea: false
    });
  },

  /**
   * 限制预订切换
   */
  onRadioChange(event) {
    console.log(event);
    this.setData({
      quotaType: event.detail
    });
  },

  commitForm() {},

  requestCommitActivityInfo() {
    const params = {};
    PageHelper.requestWrapper(activityService.createOrEditActivy(params)).then(() => {});
  }
});
