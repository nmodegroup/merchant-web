// module/pages/account/account.js
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
    subNav: [
      {
        type: "all",
        name: "全部"
      },
      {
        type: "earn",
        name: "收入"
      }, {
        type: "disburse",
        name: "支出"
      }
    ],
    selectIndex: 0,
    isShowLoadingMore: false,
    showNomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent('#toast');
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

  },
  initPageConfig() {
    this.pageNum = 1;
    this.pageSize = 15;
  },
  onSubItem(e){
    const { type } = e.detail
    this.data.subNav.map( (item, index) => {
      if (item.type === type) {
        this.setData({
          selectIndex: index
        })
      }
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