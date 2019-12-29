// module-business/pages/cancal-record/cancal-record.js
const wxManager = require('../../../utils/wxManager');
const PageConstant = require('../../../constant/page');
const activityService = require('../../../service/activity');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "活动核销",
    list: [],
    isShowLoadingMore: false,
    showNomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isLoadActivityFirst = true;
    this.initPageConfig();
    PageHelper.setupPageConfig(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCancelList()
  },
  initPageConfig() {
    this.pageNum = 1;
    this.pageSize = 15;
  },
  getCancelList() {
    const params = {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
    PageHelper.requestWrapper(
      activityService.getActivityCancelList(params),
      this.isLoadActivityFirst
    )
    .then(result => {
      console.log(result)
      let { list } = this.data.list
      if (this.pageNum <= 1) {
        list = result.list
      } else {
        list = list.concat(result.list)
        this.isShowLoadingMore = false;
      }
      if (result.list.length < this.pageSize) {
        this.setData({
          showNomore: true
        })
      }
      this.setData({ list })
      this.isLoadActivityFirst = false;
    })
  },
  tapGodetail(e) {
    console.log(e)
    const dataset = e.currentTarget.dataset;
    wxManager.navigateTo(
      PageConstant.ACTIVITY_CANCEL_DETAIL_URL, 
      { id: dataset.id }
    )
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { isShowLoadingMore, showNomore } = this.data;
    if (isShowLoadingMore || showNomore) return
    this.setData({ isShowLoadingMore: true })
    this.pageNum++;
    this.getCancelList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})