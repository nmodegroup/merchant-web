// pages/home/home.js
const { OrderType } = require('../../constant/global');
const homeService = require('../../service/home');
const { PageConfig } = require('../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      {
        title: '今日预定',
        type: OrderType.TODAY
      },
      {
        title: '未来订单',
        type: OrderType.FUTURE
      }
    ],
    selectType: OrderType.TODAY,
    todayList: [],
    futureList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
    this.resetQuery();
    this.sendRefreshRequest();
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

  initData() {
    this.isLoadTodayFirst = true;
    this.isLoadFeatureFirst = true;
    PageHelper.setupPageConfig(this);
  },

  sendRefreshRequest() {
    const refreshStrategy = {
      [OrderType.TODAY]: () => this.requestTodayOrderList(),
      [OrderType.FUTURE]: () => this.requestFutureOrderList()
    };
    const func = refreshStrategy[this.data.selectType];
    return func ? func() : '';
  },

  sendLoadMOreRequest() {
    const loadMoreStrategy = {
      [OrderType.TODAY]: () => this.requestTodayOrderList(this.pageNum + 1)
    };
    const func = loadMoreStrategy[this.data.selectType];
    return func ? func() : '';
  },

  /**
   * 今日预定列表
   */
  requestTodayOrderList(pageNum = this.pageNum) {
    const params = this.queryParams(pageNum);
    PageHelper.requestWrapper(homeService.getTodayOrderList(params), this.isLoadTodayFirst)
      .then(res => {
        // 更新加载状态
        this.isLoadTodayFirst = false;
        this.pageNum = pageNum;
        const { todayList } = this.data;
        if (pageNum === 1) {
          this.setData({
            todayList: res.list
          });
        } else {
          this.setData({
            todayList: todayList.concat(res.list)
          });
        }
      })
      .catch(err => console.log(err));
  },

  /**
   * 未来预定列表
   */
  requestFutureOrderList() {
    PageHelper.requestWrapper(homeService.getFutureOrderList(), this.isLoadFeatureFirst)
      .then(res => {
        // 更新加载状态
        this.isLoadFeatureFirst = false;
        this.setData({
          futureList: res.orders
        });
      })
      .catch(err => console.log(err));
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
    const { type } = event.detail;
    this.setData({
      selectType: type
    });

    this.resetQuery();
    this.sendRefreshRequest();
  },

  /**
   * 确认预定，确认已到达
   */
  handleItemClick(event) {
    console.log('handleItemClick', event);
    this.modal.showModal({
      content: '确认为用户通过预订吗？通过后他将预\n订成功，并尽可能按照预订时间到店！',
      title: '温馨提示',
      cancelText: '不通过',
      confirmText: '通过',
      hideCancel: false
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
