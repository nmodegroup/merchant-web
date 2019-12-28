// module-business/pages/cancel-detail/cancel-detail.js
const wxManager = require('../../../utils/wxManager');
const activityService = require('../../../service/activity');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isShowLoadingMore: false,
    showNomore: false,
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isLoadActivityFirst = true
    if (options.id) {
      this.setData({ id: options.id })
    }
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
    this.getActivityCancelDetail()
  },
  getActivityCancelDetail(){
    const params = {
     id: this.data.id
    }
    PageHelper.requestWrapper(
      activityService.getActivityCancelDetail(params),
      this.isLoadActivityFirst
    ).then( result => {
      console.log(result)
      this.isLoadActivityFirst = false
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