// module-business/pages/coupon-code/coupon-code.js
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
    selectIndex: 0,
    list: [],
    qrText: "",
    codeIds: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isLoadActivityFirst = true;
    PageHelper.setupPageConfig(this);
    if (options.qrText) {
      this.setData({ qrText: options.qrText })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getActivityCancelTicket(){
    const params = {
      qrText: this.data.qrText,
    }
    PageHelper.requestWrapper(
      activityService.getActivityCancelTicket(params),
      this.isLoadActivityFirst
    )
      .then(result => {
        this.isLoadActivityFirst = false
      })
  },
  putCancelTicket(){
    const params = {
      codeIds: this.data.codeIds,
    }
    PageHelper.requestWrapper(
      activityService.putCancelTicket(params)
    )
    .then( result => {
      console.log(result)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { list } = this.data
    list.map (item => {
      item.select = true
    }) 
  },
  
  onButton(event) {
    const type = event.detail.type;
    if (type === 'right') {
      this.putCancelTicket()
    } else {

    }
  },
  selcetAllCode(){

  },
  selectCode(){

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