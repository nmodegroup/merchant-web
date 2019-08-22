// module/pages/business-time/business-time.js
const wxManager = require('../../../utils/wxManager');
const pageConstant = require('../../../constant/page');
const pageFlag = require('../../../constant/pageFlag');
const timeService = require('../../../service/time');
const { PageHelper } = require('../../../utils/page');

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
    const weekList = businessTime.weeks.map(week => {
      return getWeekTitle(week);
    });
    console.log('weekList', weekList);
    businessTime.weekListContent = weekList.reduce((pre, current, currentIndex) => {
      return `${pre}${current}${currentIndex === contentList.length - 1 ? '' : ' '}`;
    });
    return businessTime;
  },

  getWeekTitle(week) {
    switch (+week) {
      case 1:
        return '周一';
      case 2:
        return '周二';
      case 3:
        return '周三';
      case 4:
        return '周四';
      case 5:
        return '周五';
      case 6:
        return '周六';
      case 7:
        return '周日';
      default:
        return '';
    }
  },

  handleSwitchChange(event) {
    console.log(event);
    this.setData({
      checked: event.detail
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
      start: businessItem.start,
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

  handleClose(event) {
    console.log('event:', event);
    const { position, instance } = event.detail;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        console.log('delete');
        break;
    }
  },

  /**
   * 特殊日期
   */
  handleSpecialDate() {
    wxManager.navigateTo(pageConstant.SPECIAL_DATE_URL);
  }
});
