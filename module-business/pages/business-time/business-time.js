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
    const weekList = businessTime.weeks.map(week => {
      return getWeekTitle(week);
    });
    console.log('weekList', weekList);
    businessTime.weekListContent = weekList.reduce((pre, current, currentIndex) => {
      return `${pre}${current}${currentIndex === weekList.length - 1 ? '' : ' '}`;
    });
    return businessTime;
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
        // TODO: 删除特殊日期
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
