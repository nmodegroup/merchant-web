// module/pages/business-time/business-time.js
const wxManager = require('../../../utils/wxManager');
const pageConstant = require('../../../constant/page');
const timeService = require('../../../service/time');
const { getWeekTitle } = require('../../../utils/date');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    businessTimeList: [],
    specialTimeList: []
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
    this.requestTimeList();
  },

  initData() {
    PageHelper.setupPageConfig(this);
  },

  requestTimeList() {
    PageHelper.requestWrapper(timeService.getBusinessTime()).then(res => {
      console.log('requestTimeList', res);
      this.setData({
        businessTimeList: this.resolveWeeks(res.businessTime),
        specialTimeList: res.specialTime
      });
    });
  },

  resolveWeeks(businessTime) {
    if (!businessTime.length) {
      return false;
    }
    businessTime.forEach(timeItem => {
      timeItem.weekListContent = timeItem.weeks
        .map(week => {
          return getWeekTitle(week.date);
        })
        .join(' ');
    });
    console.log('businessTime', businessTime);
    return businessTime;
  },

  handleSwitchChange(event) {
    console.log(event);
    this.requestSwitchBusinessStatus(event);
  },

  requestSwitchBusinessStatus(event) {
    const { item, index } = event.currentTarget.dataset;
    const switchStatus = event.detail;
    const params = {
      id: item.id
    };
    PageHelper.requestWrapper(timeService.switchBusinessTime(params)).then(() => {
      let selectItem = Object.assign({}, item);
      const key = `businessTimeList[${index}]`;
      selectItem.onStatus = switchStatus ? 0 : 1;
      this.setData({
        [key]: selectItem
      });
      PageHelper.showToast(switchStatus ? '已启用' : '已关闭');
    });
  },

  handleActionClick() {
    wxManager.navigateTo(pageConstant.BUSINESS_TIME_EDIT_URL);
  },

  /**
   * 营业时间编辑/删除
   */
  handleCellClick(event) {
    const businessItem = event.currentTarget.dataset.item;
    wxManager.navigateTo(pageConstant.BUSINESS_TIME_EDIT_URL, {
      businessId: businessItem.id,
      begin: businessItem.begin,
      end: businessItem.end,
      weeks: JSON.stringify(businessItem.weeks)
    });
  },

  /**
   * 特殊时间编辑/删除
   */
  handleSpecialCellClick(event) {
    const specialItem = event.currentTarget.dataset.item;
    wxManager.navigateTo(pageConstant.SPECIAL_DATE_URL, {
      specialId: specialItem.id,
      date: specialItem.date
    });
  },

  /**
   * 特殊日期
   */
  handleSpecialDate() {
    wxManager.navigateTo(pageConstant.SPECIAL_DATE_URL);
  }
});
