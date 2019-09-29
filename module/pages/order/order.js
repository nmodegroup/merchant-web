// module/pages/order/order.js
const { OrderType, OrderActionStatus } = require('../../../constant/global');
const homeService = require('../../../service/home');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      {
        title: '今日预订',
        checked: true,
        type: OrderType.TODAY
      },
      {
        title: '未来预订',
        checked: false,
        type: OrderType.FUTURE
      },
      {
        title: '历史预订',
        checked: false,
        type: OrderType.HISTORY
      }
    ],
    selectType: OrderType.TODAY,
    todayList: [],
    futureList: [],
    historyList: []
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
    if (!this.hasmore) {
      return false;
    }
    this.sendLoadMOreRequest();
  },

  initData() {
    PageHelper.setupPageConfig(this);
  },

  sendRefreshRequest() {
    const refreshStrategy = {
      [OrderType.TODAY]: () => this.requestTodayOrderList(),
      [OrderType.FUTURE]: () => this.requestFutureOrderList(),
      [OrderType.HISTORY]: () => this.requestHistoryOrderList()
    };
    refreshStrategy[this.data.selectType]();
  },

  sendLoadMOreRequest() {
    const loadMoreStrategy = {
      [OrderType.TODAY]: () => this.requestTodayOrderList(this.pageNum + 1),
      [OrderType.HISTORY]: () => this.requestHistoryOrderList(this.pageNum + 1)
    };
    loadMoreStrategy[this.data.selectType]();
  },

  /**
   * 今日预订列表
   */
  requestTodayOrderList(pageNum = this.pageNum) {
    const params = this.queryParams(pageNum);
    PageHelper.requestWrapper(homeService.getTodayOrderList(params))
      .then(res => {
        // 更新加载状态
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
        this.hasmore = PageHelper.checkHasmore(this.data.todayList.length, res.totalSize);
      })
      .catch(err => console.log(err));
  },

  /**
   * 未来预订列表
   */
  requestFutureOrderList() {
    PageHelper.requestWrapper(homeService.getFutureOrderList(), this.isLoadFeatureFirst)
      .then(res => {
        // 更新加载状态
        this.isLoadFeatureFirst = false;
        this.setData({
          futureList: res
        });
      })
      .catch(err => console.log(err));
  },

  /**
   * 历史预订列表
   */
  requestHistoryOrderList(pageNum = this.pageNum) {
    const params = this.queryParams(pageNum);
    PageHelper.requestWrapper(homeService.getHistoryOrderList(params))
      .then(res => {
        // 更新加载状态
        this.pageNum = pageNum;
        const { historyList } = this.data;
        if (pageNum === 1) {
          this.setData({
            historyList: res.list
          });
        } else {
          this.setData({
            historyList: historyList.concat(res.list)
          });
        }
        this.hasmore = PageHelper.checkHasmore(this.data.historyList.length, res.totalSize);
      })
      .catch(e => {
        console.error(e);
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
    const { type } = event.detail;
    this.setData({
      selectType: type
    });

    this.resetQuery();
    this.sendRefreshRequest();
  },

  /**
   * 确认预订
   */
  handleItemClick(event) {
    const { item } = event.detail;
    PageHelper.showOrderConfirmModal()
      .then(() => {
        this.requestConfirmOrder(item.id, OrderActionStatus.CONFIRM);
      })
      .catch(() => {
        this.requestConfirmOrder(item.id, OrderActionStatus.CONFIRM_NOT);
      });
  },

  /**
   * 确认已到店
   */
  handleArriveClick(event) {
    const { item } = event.detail;
    PageHelper.showOrderArrivalModal().then(() => {
      this.requestConfirmOrder(item.id, OrderActionStatus.ARRIVAL);
    });
  },

  requestConfirmOrder(orderId, actionType) {
    const params = {
      id: orderId,
      type: actionType
    };
    PageHelper.requestWrapper(homeService.confirmOrder(params))
      .then(() => {
        PageHelper.showSuccessToast('操作成功');
        this.sendRefreshRequest();
      })
      .catch(err => console.log(err));
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
