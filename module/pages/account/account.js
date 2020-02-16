// module/pages/account/account.js
const wxManager = require('../../../utils/wxManager');
const centerService = require('../../../service/center');
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
    queryType: -1,
    list: [],
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
    this.initData()
  },
  initPageConfig() {
    this.pageNum = 1;
    this.pageSize = 15;
  },
  initData(){
    this.getStatement({
      type: this.data.queryType,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    })
  },
  getStatement(params){
    PageHelper.requestWrapper(
      centerService.getStatement(params),
      this.isLoadActivityFirst
    ).then(res => {
      console.log(res)
      const { list } = this.data;

      let jempArr = []
      if (this.pageNum <= 1) {
        jempArr = res.list
      } else {
        jempArr = list.concat(res.list)
      }
      this.setData({ list: jempArr })
      this.isLoadActivityFirst = false;
      let { isShowLoadingMore, showNomore } = this.data;
      isShowLoadingMore = false;
      if (res.list.length < this.pageSize ) {
        if (this.pageNum > 1) {
          showNomore = true
        }
      }
      this.setData({ isShowLoadingMore, showNomore })
    }).catch( err => {
      console.error(err)
    })
  },
  onSubItem(e){
    const { type } = e.detail;
    let label;
    this.data.subNav.map( (item, index) => {
      if (item.type === type) {
        label = index -1;
        this.setData({
          selectIndex: index
        })
      }
    })
    let { list, queryType, isShowLoadingMore, showNomore } = this.data;
    list = [];
    queryType = label;
    isShowLoadingMore = false;
    showNomore = false;
    this.pageNum = 1;
    this.setData({ list, queryType, isShowLoadingMore, showNomore }, () => {
      this.isLoadActivityFirst = true;
      this.initData()
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
    this.initData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})