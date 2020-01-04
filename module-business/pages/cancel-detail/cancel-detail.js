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
    id: "",
    isShowLoadingMore: false,
    showNomore: false,
    moreTips: "没有更多了~"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isLoadActivityFirst = true
    this.initPageConfig()
    PageHelper.setupPageConfig(this);
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
  initPageConfig() {
    this.pageNum = 1;
    this.pageSize = 15;
  },
  getActivityCancelDetail(){
    const params = {
      id: this.data.id,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
    PageHelper.requestWrapper(
      activityService.getActivityCancelDetail(params),
      this.isLoadActivityFirst
    ).then( result => {
      console.log(result)
      let { list } = this.data
      result.list.map(item => {
        item.code = item.code.replace(/\s/g, '').replace(/(.{4})/g, "$1 ")
      })
      if (this.pageNum <= 1){
        list = result.list
      } else {
        list = list.concat(result.list)
        this.setData({
          isShowLoadingMore: false
        })
      }
      if (result.list.length < this.pageSize) {
        this.setData({
          showNomore: true
        })
      }
      if (list.length <= 0) {
        console.log(list)
        this.setData({ moreTips: "暂无数据", showNomore: true })
      }
      this.setData({ list })
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
    const { isShowLoadingMore, showNomore } = this.data;
    if (isShowLoadingMore || showNomore) return
    this.setData({ isShowLoadingMore: true })
    this.pageNum++;
    this.getActivityCancelDetail()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})