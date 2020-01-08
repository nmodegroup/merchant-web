// module/pages/draw-deposit/draw-deposit.js
const wxManager = require('../../../utils/wxManager');
const centerService = require('../../../service/center');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enabled: false,
    amount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent('#toast');
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
  bindKeyInput(e){
    const { value } = e.detail
    this.setData({
      enabled: value.length > 0,
      amount: value * 1
    })
  },
  onClickBtn(){
    if (!this.data.enabled) return
    this.toast.showToast({
      content: "提现功能暂未开放"
    });
    return
    this.isLoadActivityFirst = true
    this.postExtract({
      amount: this.data.amount
    })
  },
  postExtract(params){
    PageHelper.requestWrapper(
      centerService.postExtract(params),
      this.isLoadActivityFirst
    ).then(res => {
      console.log(res)
      this.isLoadActivityFirst = false
    }).catch( err => {
      this.isLoadActivityFirst = false
      if (err && err.msg) {
        this.toast.showToast({
          content: err.msg
        });
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