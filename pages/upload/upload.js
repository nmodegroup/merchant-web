import WeCropper from '../we-cropper/we-cropper.js';
const WxManager = require('../../utils/wxManager');
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 168
const cutWidth = device.windowWidth - 20
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 256) / 2,
        y: (height - 409.6) / 2,
        width: 256,
        height: 409.6
      }
    },
    isIphoneX: false
  },
  imgParam: { //剪切图左右两边预留25px
    mchLogo: {//商家logo 设计图98*75
      width: cutWidth,
      height: cutWidth / 98 * 75
    },
    mchBanner: {//商家banner 设计图375*180
      width: cutWidth,
      height: cutWidth / 375 * 180
    },
    mchBartender: {//调酒师图片 设计图286*390
      width: cutWidth,
      height: cutWidth / 286 * 390
    },
    activityBanner: {//活动封面图 设计图375*180
      width: cutWidth,
      height: cutWidth / 375 * 180
    },
    activityPost: {//活动宣传图 设计图345*600
      width: cutWidth,
      height: cutWidth / 345 * 600
    },
    shopCodeBg: { // 商家二维码底图 设计图310 * 513
      width: cutWidth,
      height: cutWidth / 300 * 496
    },
    callBack: '',//回调函数名字
    index: ''//编辑回调下标
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    this.wecropper.getCropperImage((img) => {
      if (img) {
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];
        prePage[this.callBack](img, this.index)
        wx.navigateBack({
          delta: 1
        })
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    this.countSzie(option)
    this.getSystemInfo()
  },
  //计算剪切范围
  countSzie (option) {
    let { type, src, callBack, index = '' } = option
    this.callBack = callBack
    this.index = index
    let imgW = this.imgParam[type].width
    let imgH = this.imgParam[type].height
    let renderH = ''//剪切框高度
    let renderW = ''//剪切框高度
    let maxHeight = height-84 //最大高度
    if (imgH > maxHeight) {
      renderH = maxHeight
      renderW = (maxHeight / imgH * imgW)
    } else {
      renderH = imgH
      renderW = imgW
    }
    let cut = {
      x: (width - renderW) / 2,
      y: (height - renderH) / 2,
      width: renderW,
      height: renderH
    }
    this.setData({
      'cropperOpt.cut': cut
    })
    this.renderCanvas(src)
  },
  //渲染canvas
  renderCanvas(src) {
    const {
      cropperOpt
    } = this.data
    cropperOpt.src = src
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
  },
  //获取机型修改底部样式
  getSystemInfo() {
    WxManager.getSystemInfoSync().then(({ model, screenHeight }) => {
      const iphoneX = /iphone x/i.test(model)
      const iphoneNew = /iPhone11/i.test(model) && screenHeight === 812
      this.setData({
        isIphoneX: iphoneX || iphoneNew
      })
    })
  }
})