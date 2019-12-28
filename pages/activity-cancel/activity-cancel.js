// module-business/pages/activity-cancel/activity-cancel.js
const activityService = require('../../service/activity');
const { PageConfig } = require('../../utils/page');
const PageHelper = new PageConfig();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "活动核销"
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
  getCancelList(){
    const params = {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
    PageHelper.requestWrapper(
      activityService.getActivityList(params), 
      this.isLoadActivityFirst
      )
      .then(result => {
        console.log(result)
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})