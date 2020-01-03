// module-business/pages/activity-user/activity-user.js
const activityService = require('../../../service/activity');
const wxManager = require('../../../utils/wxManager');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    peopleNum: 0,
    ticketNum: 0,
    btnShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.id = options.id;
    PageHelper.setupPageConfig(this);
    this.initPageConfig();
    this.requestUserList();
    this.getActivityData()
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

  requestUserList(currentPage = 1) {
    const params = this.queryParams(currentPage);
    PageHelper.requestWrapper(activityService.getActivityUser(params)).then(result => {
      this.setPageNum(currentPage);
      const oldList = this.data.userList;
      this.setData({
        userList: currentPage === 1 ? result.list : oldList.concat(result.list)
      });
      this.hasmore = PageHelper.checkHasmore(this.data.userList, result.totalSize);
    });
  },
  getActivityData(){
    const params = { id: this.id}
    PageHelper.requestWrapper(activityService.getActivityData(params)).then(result => {
      console.log(result)
      const { peopleNum, ticketNum, btnShow } = this.data
      if (Object.values(result).length > 0) {
        this.setData({
          btnShow: true,
          peopleNum: result.peopleNum,
          ticketNum: result.ticketNum
        })
      }
    })
  },
  makeCall(event) {
    wxManager.makePhoneCall(event.currentTarget.dataset.phone);
  }
});
