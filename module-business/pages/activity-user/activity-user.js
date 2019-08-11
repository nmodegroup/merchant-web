// module-business/pages/activity-user/activity-user.js
const activityService = require('../../../service/activity');
const wxManager = require('../../../utils/wxManager');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      {
        title: '微信昵称'
      },
      {
        title: '电话号码'
      },
      {
        title: '预定时间'
      }
    ],
    userList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.id = options.id;
    this.initPageConfig();
    this.requestUserList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.requestUserList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.hasmore) {
      return false;
    }
    this.requestUserList(this.pageNum + 1);
  },

  /**
   * 初始化或重置页码数据
   */
  initPageConfig() {
    this.pageNum = 1;
    this.pageSize = 20;
  },

  /**
   * 分页加载参数
   * @param {number} currentPage 当前页码
   */
  queryParams(currentPage = this.pageNum) {
    return {
      id: this.id,
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

  requestUserList(currentPage = 1) {
    wxManager.showLoading();
    const params = this.queryParams(currentPage);
    activityService
      .getActivityUser(params)
      .then(result => {
        this.setPageNum(currentPage);
        this.checkHasmore(result.pageNum, result.pageSize, result.totalSize);
        const oldList = this.data.userList;
        this.setData({
          userList: currentPage === 1 ? result.list : oldList.concat(result.list)
        });
        wxManager.stopRefreshAndLoading();
      })
      .catch(e => {
        console.error(e);
        wxManager.stopRefreshAndLoading();
      });
  },

  makeCall(event) {
    wxManager.makePhoneCall(event.currentTarget.dataset.phone);
  }
});
