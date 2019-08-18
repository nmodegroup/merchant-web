// pages/home/home.js
const OrderConstant = require('../../constant/order');
const homeService = require('../../service/home');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      {
        title: '今日预定',
        checked: true,
        type: OrderConstant.TODAY
      },
      {
        title: '未来订单',
        checked: false,
        type: OrderConstant.FUTURE
      }
    ],
    currentType: OrderConstant.TODAY,
    todayList: [],
    futureList: [],
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.resetQuery();
    this.sendRefreshRequest();

    // TODO: test
    this.modal = this.selectComponent('#modal');
    this.modal.showModal({
      content: '确认为用户通过预订吗？通过后他将预\n订成功，并尽可能按照预订时间到店！',
      title: '温馨提示',
      cancelText: '不通过',
      confirmText: '通过',
      hideCancel: false
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
  },

  sendRefreshRequest() {
    const refreshStrategy = {
      [OrderConstant.TODAY]: () => this.requestTodayOrderList(),
      [OrderConstant.FUTURE]: () => this.requestFutureOrderList(),
      [OrderConstant.HISTORY]: () => this.requestHistoryOrderList()
    };
    refreshStrategy[this.data.currentType]();
  },

  sendLoadMOreRequest() {
    const loadMoreStrategy = {
      [OrderConstant.TODAY]: () => this.requestTodayOrderList(this.pageNum + 1),
      [OrderConstant.FUTURE]: () => this.requestFutureOrderList(),
      [OrderConstant.HISTORY]: () => this.requestHistoryOrderList(this.pageNum + 1)
    };
    loadMoreStrategy[this.data.currentType]();
  },

  /**
   * 今日预定列表
   */
  requestTodayOrderList(pageNum = this.pageNum) {
    const params = this.queryParams(pageNum);
    homeService
      .getTodayOrderList(params)
      .then(res => {
        console.log('requestTodayOrderList:', res);
        this.pageNum = pageNum;
        this.setData({
          todayList: res.list
        });
        this.stopPullDownRefresh();
      })
      .catch(e => {
        console.error(e);
        this.stopPullDownRefresh();
      });
  },

  /**
   * 未来预定列表
   */
  requestFutureOrderList() {
    homeService
      .getFutureOrderList(params)
      .then(res => {
        this.setData({
          futureList: res.orders
        });
        this.stopPullDownRefresh();
      })
      .catch(e => {
        console.error(e);
        this.stopPullDownRefresh();
      });
  },

  /**
   * 历史预定列表
   */
  requestHistoryOrderList(pageNum = this.pageNum) {
    const params = this.queryParams(pageNum);
    homeService
      .getHistoryOrderList(params)
      .then(res => {
        this.pageNum = pageNum;
        this.setData({
          historyList: res.list
        });
        this.stopPullDownRefresh();
      })
      .catch(e => {
        console.error(e);
        this.stopPullDownRefresh();
      });
  },

  checkHasMore() {},

  /**
   * query 参数
   */
  queryParams(pageNum) {
    return {
      pageNum: pageNum || this.pageNum,
      pageSize: this.pageSize
    };
  },

  /**
   * 重置页码和每页数量
   */
  resetQuery() {
    this.pageNum = 1;
    this.pageSize = 10;
  },

  handleTabChange(event) {
    console.log(event);
    const { tab, index } = event.currentTarget.dataset;
    // 已经选中不处理
    if (tab.checked) {
      return false;
    }
    this.resetTabListStatus(index, tab.type);
    this.resetQuery();
    this.sendRefreshRequest();
  },

  /**
   * 重置当前 tablist 选中项
   */
  resetTabListStatus(selectedIndex, type) {
    const tabList = this.data.tabList;
    tabList.forEach((element, index) => {
      element.checked = index === selectedIndex;
    });
    this.setData({
      tabList: tabList,
      currentType: type
    });
  },

  stopPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.resetQuery();
    this.sendRefreshRequest();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.sendLoadMOreRequest();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
