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
    selectedAll: false,
    name: "",
    theme: "",
    date: "",
    codes: [],
    qrText: "",
    codeIds: "",
    pageShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent('#toast');
    this.isLoadActivityFirst = true;
    PageHelper.setupPageConfig(this);
    console.log(options.qrText)
    if (options.qrText) {
      this.setData({ qrText: options.qrText })
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
    this.getActivityCancelTicket()
  },
  getActivityCancelTicket() {
    const params = {
      qrText: this.data.qrText,
    }
    PageHelper.requestWrapper(
      activityService.getActivityCancelTicket(params),
      this.isLoadActivityFirst
    )
      .then(result => {
        console.log(result)
        let { name, theme, date, codes } = result;
        codes.map(item => {
          item.code = item.code.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
          if (item.status === 1) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        })
        this.setData({ name, theme, date, codes, pageShow: true })
        this.isLoadActivityFirst = false
      }).catch( err => {
        if (err) {
          const tipsTimer = setTimeout( () => {
            clearTimeout(tipsTimer)
            wxManager.navigateBack()
          }, 2000)
        }
      })
  },
  putCancelTicket() {
    const params = {
      codeIds: this.data.codeIds,
    }
    PageHelper.requestWrapper(
      activityService.putCancelTicket(params)
    )
      .then(result => {
        console.log(result)
        this.toast.showToast({
          icon: "success",
          content: "券码核销成功"
        });
        const timer = setTimeout( () => {
          clearTimeout(timer)
          wxManager.navigateBack()
        }, 1000)
      })
  },
  scanQrCode() {
    wxManager.scanCode((res) => {
      console.log(res)
      wxManager.redirectTo(
        PageConstant.ACTIVITY_COUPON_CODE_URL,
        { qrText: res.result }
      )
    }, (err) => {
      console.log(err)
      if (err && err.msg) {
        this.toast.showToast({
          content: err.msg
        });
      }
    })
  },
  selcetAllCode(){
    let { codes, selectedAll } = this.data;
    selectedAll = !selectedAll;
    codes.map( item => {
      if (item.status == 0 ) {
        item.selected = selectedAll;
      }
    })
    this.setData({ codes, selectedAll })
  },
  selectCode(e){
    const dataset = e.currentTarget.dataset;
    const { index, status, selected } = dataset;
    console.log(dataset)
    let { codes, selectedAll } = this.data;
    // 券码状态(0待使用  1已使用  2已失效  3已过期)
    if (codes[Number(index)].status == 0) {
      codes[Number(index)].selected = !codes[Number(index)].selected;
      this.setData({ codes })
    }
    let flag = true;
    codes.map(item => {
      if (item.status == 0 && !item.selected) {
        flag = false
      }
    })
    this.setData({ selectedAll: flag })
  },
  onButton(event) {
    const type = event.detail.type;
    if (type === 'right') {
      let { codes } = this.data;
      let codeIds = "";
      codes.map(item => {
        if (item.status == 0 && item.selected) {
          codeIds += item.id + ","
        }
      })
      codeIds = codeIds.slice(0, -1);
      console.log(codes)
      console.log(codeIds)
      if (codeIds === "") {
        this.toast.showToast({
          content: "请选择要核销的劵码"
        });
        return
      }
      this.setData(
        { codeIds }, 
        () => {
          this.putCancelTicket()
      })
      
    } else {
      this.scanQrCode()
    }
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