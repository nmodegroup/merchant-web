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
    amount: 0,
    balance: 0,
    totalEarnAmount: 0,
    withdrawalAmount: 0,
    value: ""
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
    this.getBalance()
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
    const { amount } = this.data;
    if (amount < 1) {
      this.toast.showToast({
        content: "单次提现金额不能低于1元"
      });
      return
    }
    if (amount > 5000) {
      this.toast.showToast({
        content: "每日提现金额不能超过5000元"
      });
      return
    }
    // this.toast.showToast({
    //   content: "提现功能暂未开放"
    // });
    // return
    this.isLoadActivityFirst = true
    this.postExtract({
      amount: this.data.amount
    })
  },
  /*
* 余额信息
*/
  getBalance() {
    PageHelper.requestWrapper(centerService.getBalance()).then(res => {
      console.log(res)
      let { balance, totalEarnAmount, withdrawalAmount } = this.data;
      balance = res.balance;
      totalEarnAmount = res.total;
      withdrawalAmount = res.withdrawal;
      this.setData({ balance, totalEarnAmount, withdrawalAmount })
    }).catch(err => {
      console.error(err)
    })
  },
  postExtract(params){
    PageHelper.requestWrapper(
      centerService.postExtract(params),
      this.isLoadActivityFirst
    ).then(res => {
      console.log(res)
      this.isLoadActivityFirst = false;
      this.toast.showToast({
        content: "提现成功"
      });
      this.setData({
        amount: 0,
        enabled: false,
        value: ""
      })
      this.onReady()
    }).catch( err => {
      this.isLoadActivityFirst = false;
      if (err && err.msg) {
        this.toast.showToast({
          content: err.msg
        });
      }
    })
  },
  loadPage(){
    const pages = getCurrentPages()
    const perpage = pages[pages.length - 1]
    console.log(perpage)
    perpage.onLoad()  
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