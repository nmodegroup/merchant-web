// module/pages/business-time-edit/busine.js
const wxManager = require('../../../utils/wxManager');
const pageConstant = require('../../../constant/page');
const { getWeekTitle, getHours, getMinutes } = require('../../../utils/date');
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const { callbackWeeks } = this.data;
    console.log('callbackWeeks:', callbackWeeks);
    if (callbackWeeks.length) {
      this.setData(
        {
          weeks: callbackWeeks, // 选择回调的星期赋值给 weeks
          callbackWeeks: [] // 清空
        },
        () => {
          this.resolveWeeks();
        }
      );
    }
  },

  initData(options) {
    this.setData(
      {
        isEdit: !!options.businessId,
        businessId: options.businessId || '',
        startDate: options.start || '',
        endDate: options.endDate || '',
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
    console.log('weekList', weekList);
    const weekListContent = weekList.reduce((pre, current, currentIndex) => {
      return `${pre}${current}${currentIndex === weekList.length - 1 ? '' : ' '}`;
    });
    console.log('weekListContent:', weekListContent);
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
