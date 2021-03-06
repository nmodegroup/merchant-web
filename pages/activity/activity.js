// pages/activity/activity.js
const wxManager = require('../../utils/wxManager');
const PageConstant = require('../../constant/page');
const activityService = require('../../service/activity');
const ENV = require('../../lib/request/env');
const { ActivityStatus } = require('../../constant/global');
const { PageConfig } = require('../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityList: [],
    isShowLoadingMore: false,
    showNomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.isLoadActivityFirst = true;
    this.initPageConfig();
    PageHelper.setupPageConfig(this);
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
    this.setData({
      isShowLoadingMore: true
    });
    this.requestActivityList(this.pageNum + 1);
  },

  onShareAppMessage() {
    return {
      path: PageConstant.AUTH_URL
    };
  },

  /**
   * 初始化或重置页码数据
   */
  initPageConfig() {
    this.pageNum = 1;
    this.pageSize = 4;
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

  requestActivityList(currentPage = 1) {
    const params = this.queryParams(currentPage);
    PageHelper.requestWrapper(activityService.getActivityList(params), this.isLoadActivityFirst)
      .then(result => {
        this.setPageNum(currentPage);
        const oldList = this.data.activityList;
        const activityList = this.resolveActivityList(result.list);
        this.setData({
          activityList: currentPage === 1 ? activityList : oldList.concat(activityList)
        });
        // 更新加载状态
        this.isLoadActivityFirst = false;
        this.hasmore = PageHelper.checkHasmore(this.data.activityList.length, result.totalSize);
        this.setData({
          showNomore: !this.hasmore,
          isShowLoadingMore: false
        });
      })
      .catch(() => {
        this.setData({
          isShowLoadingMore: false
        });
      });
  },

  resolveActivityList(list) {
    return list.map(item => {
      item.banner = `${ENV.sourceHost}${item.banner}`;
      return item;
    });
  },

  /**
   * 审核失败原因
   */
  handleShowReason(event) {
    console.log(event);
    const { reason } = event.currentTarget.dataset;
    if (reason) {
      this.modal.showModal({
        content: reason,
        title: '未通过原因',
        cancelText: '取消',
        confirmText: '去编辑',
        hideCancel: false,
        onConfirm: () => {
          this.handleEditActivity(event);
        }
      });
    }
  },

  handleCreateActivity() {
    PageHelper.checkAuditStatus().then(() => {
      wxManager.navigateTo(PageConstant.ACTIVITY_EDIT_URL);
    });
  },

  handleEditActivity(event) {
    wxManager.navigateTo(PageConstant.ACTIVITY_EDIT_URL, {
      activityId: event.currentTarget.dataset.id
    });
  },

  /**
   * 切换预订状态
   */
  onStatusChange(event) {
    console.log(event);
    const { item, index } = event.currentTarget.dataset;
    this.requestSwitchActivityStatus(item, index);
    if (parseInt(item.onStatus) === 1) {
    } else {
    }
  },

  requestSwitchActivityStatus(item, index) {
    let activity = Object.assign({}, item);
    const params = {
      id: activity.id
    };

    PageHelper.requestWrapper(activityService.changeActivityStatus(params)).then(() => {
      PageHelper.showSuccessToast(activity.onStatus === ActivityStatus.OPEN ? '已关闭预订' : '已开放预订');
      const key = `activityList[${index}]`;
      activity.onStatus = activity.onStatus === ActivityStatus.OPEN ? ActivityStatus.CLOSE : ActivityStatus.OPEN;
      this.setData({
        [key]: activity
      });
    });
  }
});
