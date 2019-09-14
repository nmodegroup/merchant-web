// module/pages/code/code.js
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
const wxManager = require('../../../utils/wxManager');
const httpManager = require('../../../lib/request/httpManager');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shareImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    PageHelper.setupPageConfig(this);
    this.setData({
      shareImg: options.shareImg
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  handlePreview() {
    const { shareImg } = this.data;
    wxManager.previewImage(shareImg);
  },

  handleSaveImage() {
    const { shareImg } = this.data;
    const params = {
      url: shareImg
    };
    PageHelper.requestWrapper(httpManager.download(params))
      .then(res => {
        this.saveToAlbum(res.tempFilePath);
      })
      .catch(err => {
        PageHelper.showFailToast('保存失败');
      });
  },

  saveToAlbum(imageSource) {
    wxManager
      .saveImageToPhotosAlbum(imageSource)
      .then(() => {
        PageHelper.showSuccessToast('保存成功');
      })
      .catch(() => {
        PageHelper.showFailToast('保存失败');
      });
  }
});
