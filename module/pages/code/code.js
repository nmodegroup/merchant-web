// module/pages/code/code.js
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
const wxManager = require('../../../utils/wxManager');
const httpManager = require('../../../lib/request/httpManager');
const ENV = require('../../../lib/request/env');
const PageConstant = require('../../../constant/page');
const { getShopCodeBg, codeKnow } = require('../../../service/shop'); 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    codeBgUrl: '',
    codeImageUrl: '',
    shopName: '',
    clickBtn: "",
    state: "",
    showDialog: false,
    bgId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    PageHelper.setupPageConfig(this);
    this.getShopCodeBgWrap()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  getShopCodeBgWrap() {
    PageHelper.requestWrapper(getShopCodeBg())
      .then(res => {
        console.log(res)
        this.setData({
          codeBgUrl: `${ENV.sourceHost}${res.backImg}`,
          codeImageUrl: `${ENV.sourceHost}${res.codeImg}`,
          shopName: res.name,
          state: res.status,
          showDialog: res.isFirst == 1,
          bgId: res.id
        })
      })
      .catch(err => {
        console.log(err)
        // PageHelper.showFailToast('保存失败，请重试');
      });
  },
  handleCodeImage(e){
    const type = e.detail.type;
    this.setData({ clickBtn: type }, () => {
      this.handleSaveImage()
    })
    if (type === "left") { // 下载
      
    } else { // 保存
      this.handleSaveImage()
    }
  },
  handleKnow(){
    this.setData({ showDialog: false })
    PageHelper.requestWrapper(codeKnow({ id: this.data.bgId }))
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      });
  },
  handleSaveImage() {
    this.startDraw();
  },
  startDraw() {
    Promise.all([this.queryCanvasRect(), this.downloadCodeImage()])
      .then(result => {
        this.drawCanvas(result);
      })
      .catch(() => {
        PageHelper.showFailToast('保存失败，请重试');
      });
  },

  downloadCodeImage() {
    return new Promise((resolve, reject) => {
      const { codeImageUrl } = this.data;
      const params = {
        url: codeImageUrl
      };
      PageHelper.requestWrapper(httpManager.download(params))
        .then(res => {
          resolve(res.tempFilePath);
        })
        .catch(err => {
          PageHelper.showFailToast('保存失败，请重试');
        });
    });
  },

  /**
   * 得到 canvas 的宽高
   */
  queryCanvasRect() {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery();
      const { clickBtn } = this.data;
      let dom = "";
      if (clickBtn == "left") {// 下载
        dom = ".canvas-code"
      } else { // 保存
        dom = ".canvas"
      }
      //选择id
      query
        .select(dom)
        .boundingClientRect(rect => {
          this.setData({
            canvasHeight: rect.height,
            canvasWidth: rect.width
          });
          resolve(rect);
        })
        .exec();
    });
  },

  drawCanvas(result) {
    wxManager.showLoading();
    const { clickBtn } = this.data;
    if (clickBtn == "left") {
      this.myCodeCanvas(result)
    } else {
      this.myCanvas(result)
    }
  },

  // 背景图
  myCanvas(result){
    const rect = result[0];
    // code 图片路径
    const codeImagePath = result[1];
    // canvas 宽高
    const { height, width } = rect;
    // 背景色
    const WHITE_COLOR = '#FFFFFF';
    // code 半径
    const codeRadius = 37.5;

    // canvas 上下文
    const ctx = wx.createCanvasContext('myCanvas', this);
    ctx.setFillStyle(WHITE_COLOR);
    ctx.fillRect(0, 0, height, width);

    ctx.drawImage(this.data.codeBgUrl, 0, 0, width, height);

    // 二维码背景圆，圆的原点x坐标，y坐标，半径，起始弧度，终止弧度
    const arcRadius = 44;
    ctx.arc(0.5 * width, 368, arcRadius, 0, 2 * Math.PI);
    ctx.setFillStyle(WHITE_COLOR);
    ctx.fill();

    // 绘制二维码，图片路径，左上角x坐标，左上角y坐标，宽，高
    ctx.drawImage(this.data.codeImageUrl, 112, 330, 2 * codeRadius, 2 * codeRadius);
    ctx.restore();

    // 绘制商家店铺名称
    const shopName = this.data.shopName;
    ctx.setFontSize(12);
    ctx.setTextAlign('center');
    ctx.setFillStyle(WHITE_COLOR);
    ctx.setGlobalAlpha(0.8);
    ctx.fillText(shopName, 150, 430);
    //绘制到 canvas 上
    ctx.draw(false, () => {
      this.saveCanvasImage("myCanvas");
    });
  },

  // 二维码
  myCodeCanvas(result){
    const rect = result[0];
    // code 图片路径
    const codeImagePath = result[1];
    // canvas 宽高
    const { height, width } = rect;
    // 背景色
    const WHITE_COLOR = '#FFFFFF';
    // code 半径
    const codeRadius = 37.5;

    // canvas 上下文
    const ctx = wx.createCanvasContext('myCodeCanvas', this);
    ctx.setFillStyle(WHITE_COLOR);
    ctx.fillRect(0, 0, height, width);
    
    // 二维码背景圆，圆的原点x坐标，y坐标，半径，起始弧度，终止弧度
    // const arcRadius = 44;
    // ctx.arc(0.5 * width, 0.5 * height, arcRadius, 0, 2 * Math.PI);
    // ctx.setFillStyle(WHITE_COLOR);
    // ctx.fill();

    // 绘制二维码，图片路径，左上角x坐标，左上角y坐标，宽，高
    ctx.drawImage(codeImagePath, 6.5, 6.5, 2 * codeRadius, 2 * codeRadius);
    ctx.restore();

    // 绘制商家店铺名称
    const shopName = this.data.shopName;
    const BLACK = "#000"
    ctx.setFontSize(10);
    ctx.setTextAlign('center');
    ctx.setFillStyle(BLACK);
    ctx.setGlobalAlpha(0.8);
    ctx.fillText(shopName, 44, 100);
    //绘制到 canvas 上
    ctx.draw(false, () => {
      this.saveCanvasImage("myCodeCanvas");
    });
  },
  /**
   * canvas 转 image
   */
  saveCanvasImage(domId) {
    wx.canvasToTempFilePath({
      canvasId: domId,
      success: res => {
        this.setData({
          shareImageUrl: res.tempFilePath
        });
        this.saveToAlbum(res.tempFilePath);
      },
      complete: () => {
        wxManager.hideLoading();
      }
    });
  },

  saveToAlbum(imageSource) {
    wxManager
      .saveImageToPhotosAlbum(imageSource)
      .then(() => {
        PageHelper.showSuccessToast('保存成功');
      })
      .catch(() => {
        PageHelper.showSaveAlbumModal().then(() => {
          this.saveToAlbum(imageSource);
        });
      });
  },
  tapReplaceBg(){
    wxManager.navigateTo(PageConstant.SHOP_CODE_URL)
  }
});
