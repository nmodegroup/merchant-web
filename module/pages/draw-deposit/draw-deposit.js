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
    todayWithdrawalAmount: 0,
    withdrawalAmount: 0,
    text: ""
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
    this.getExtractAmount()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  regTest(val){
    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");//只允许存在一个点
    val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
    //需要注意$3处（‘\d\d).’）的那个点，见下图
    if (val.indexOf(".") < 0 && val != "") { //此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      val = parseFloat(val);   //parseFloat：字符串中第一个小数点是有效的，而第二个小数点就是无效的了
    } else if (val.indexOf(".") == 0) {
      val = val.replace(/[^$#$]/g, "0."); //将. 变为0.  ！！！！
      val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    }
    return val
  },
  bindKeyInput(e){
    let { text } = this.data
    const { value } = e.detail
    e.detail.value = this.regTest(value)
    text = e.detail.value
    this.setData({
      enabled: String(text).length > 0,
      amount: text * 1,
      text
    })
  },
  onClickBtn(){
    if (!this.data.enabled) return
    const { amount, todayWithdrawalAmount } = this.data;
    if (amount < 1) {
      this.toast.showToast({
        content: "单次提现金额不能低于1元"
      });
      return
    }
    if (amount > todayWithdrawalAmount) {
      this.toast.showToast({
        content: "今日剩余提现金额不能超过" + todayWithdrawalAmount + "元"
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
  getExtractAmount() {
    PageHelper.requestWrapper(centerService.getExtractAmount()).then(res => {
      console.log(res)
      let { balance, todayWithdrawalAmount, withdrawalAmount } = this.data;
      balance = res.balance;
      todayWithdrawalAmount = res.todayWithdrawal;
      withdrawalAmount = res.withdrawal;
      this.setData({ balance, todayWithdrawalAmount, withdrawalAmount })
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
        text: ""
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