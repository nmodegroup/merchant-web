// pages/activity/activity.js
const wxManager = require('../../utils/wxManager');
const PageConstant = require('../../constant/page');
const activityService = require('../../service/activity');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initPageConfig();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    }
    this.requestActivityList();
  },

  handleGoReserveDetail(event) {
    console.log(event);
    wxManager.navigateTo(PageConstant.ACTIVITY_USER_URL, {
      id: event.currentTarget.dataset.id
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.requestActivityList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.hasmore) {
      return false;
    }
    this.requestActivityList(this.pageNum + 1);
  },

  /**
   * 初始化或重置页码数据
   */
  initPageConfig() {
    this.pageNum = 1;
    this.pageSize = 10;
  },

  /**
   * 分页加载参数
   * @param {number} currentPage 当前页码
   */
  queryParams(currentPage = this.pageNum) {
    return {
      pageNum: currentPage,
      pageSize: this.pageSize
    };
  },

  /**
   * 请求后重新设置页码
   */
  setPageNum(currentPage) {
    this.pageNum = currentPage;
  },

  /**
   * 校验是否有更多
   */
  checkHasmore(remotePageNum, remotePageSize, totalSize) {
    this.hasmore = this.pageSize * (remotePageNum - 1) + remotePageSize < totalSize;
  },

  requestActivityList(currentPage = 1) {
    wxManager.showLoading();
    const params = this.queryParams(currentPage);
    activityService
      .getActivityList(params)
      .then(result => {
        this.setPageNum(currentPage);
        this.checkHasmore(result.pageNum, result.pageSize, result.totalSize);
        const oldList = this.data.activityList;
        this.setData({
          activityList: currentPage === 1 ? result.list : oldList.concat(result.list)
        });
        wxManager.stopRefreshAndLoading();
      })
      .catch(e => {
        console.error(e);
        wxManager.stopRefreshAndLoading();
      });
  },

  /**
   * 审核失败原因
   */
  handleShowReason(event) {
    console.log(event);
  }
});
