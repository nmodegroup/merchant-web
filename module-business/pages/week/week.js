// module-business/pages/week/week.js
const { createNumberArray } = require('../../../utils/global');
const { getEachWeekTitle } = require('../../../utils//date');
const wxManager = require('../../../utils/wxManager');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
const eventEmitter = getApp().eventEmitter;

Page({
  /**
   * 页面的初始数据
   */
  data: {},

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
    PageHelper.setupPageConfig(this);
    this.weeks = options.weeks ? JSON.parse(options.weeks) : [];
    this.createWeekList();
  },

  /**
   * 创建周数组
   */
  createWeekList() {
    const weekIdList = createNumberArray(7);
    const weekList = weekIdList.map(id => {
      return {
        id: id,
        title: getEachWeekTitle(id),
        selected: this.resolveWeekSelected(id)
      };
    });
    this.setData({
      weekList: weekList
    });
  },

  /**
   * 日期是否已选
   * @param {string} weekId 日期id
   */
  resolveWeekSelected(weekId) {
    if (!this.weeks.length) {
      return false;
    }
    return this.weeks.map(weekItem => weekItem.date).includes(weekId);
  },

  handleCellClick(event) {
    const { weekList } = this.data;
    const { selected } = event.currentTarget.dataset.item;
    const selectIndex = event.currentTarget.dataset.index;
    weekList[selectIndex].selected = !selected;
    this.setData({
      weekList: weekList
    });
  },

  handleSelectWeek() {
    const { weekList } = this.data;
    const selectWeeks = weekList
      .filter(week => {
        return week.selected;
      })
      .map(item => {
        return {
          date: item.id
        };
      });
    if (!selectWeeks.length) {
      return PageHelper.showToast('请选择要重复的日期');
    }
    // 将选择的时间回调给上个页面
    eventEmitter.emit('callbackWeeks', selectWeeks);
    wxManager.navigateBack();
  }
});
