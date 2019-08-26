// module-business/pages/week/week.js
const { createNumberArray } = require('../../../utils/global');
const { getEachWeekTitle } = require('../../../utils//date');
const wxManager = require('../../../utils/wxManager');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
// TODO： checkbox 样式
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
    console.log('weekList:', weekList);
    this.setData({
      weekList: weekList
    });
  },

  resolveWeekSelected(weekId) {
    console.log('weeks:', this.weeks);
    if (!this.weeks.length) {
      return false;
    }
    return this.weeks.includes(weekId);
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
        return item.id;
      });
    if (!selectWeeks.length) {
      console.log('showToast');
      // TODO: 文本
      return PageHelper.showToast('请选择时间');
    }
    // 将选择的时间回调给上个页面
    const curPages = getCurrentPages();
    curPages[curPages.length - 2].setData(
      {
        callbackWeeks: selectWeeks
      },
      () => {
        wxManager.navigateBack();
      }
    );
  }
});
