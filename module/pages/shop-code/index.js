// module/pages/code/code.js
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
const wxManager = require('../../../utils/wxManager');
const httpManager = require('../../../lib/request/httpManager');
const ENV = require('../../../lib/request/env');
const PageConstant = require('../../../constant/page');
const commonService = require('../../../service/common'); 
const { saveCodeBg } = require('../../../service/shop'); 
const { getFileName } = require('../../../utils/global');
const { Folder } = require('../../../constant/global');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    enabled: false,
    codeBgUrl: '',
    codeBgPath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    PageHelper.setupPageConfig(this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
  tapReplaceBg() {
    this.handleChooseCodeBg();
  },
  handleChooseCodeBg() {
    wxManager.chooseImage().then(res => {
      console.log(res)
      let tempFilePaths = res.tempFilePaths;
      let params = {
        type: 'shopCodeBg',
        src: tempFilePaths[0],
        callBack: 'callbackShopCodeBg'
      }
      wxManager.navigateTo(PageConstant.UPLOAD, params);
    });
  },
  callbackShopCodeBg(img){
    this.uploadImage(img, Folder.FILE_FOLDER_COVER).then(res => {
        console.log(res)
        this.setData({
          enabled: true,
          codeBgPath: res,
          codeBgUrl: `${ENV.sourceHost}${res}`
        });
      });
  },
  /**
   * 通用上传
   * @param {string} imageUrl 图片地址
   * @param {string} folder   存储的文件夹路径
   */
  uploadImage(imageUrl, folder) {
    return new Promise(resolve => {
      const uploadParams = this.queryUploadParams(imageUrl, folder);
      PageHelper.requestWrapper(commonService.uploadImage(uploadParams)).then(res => {
        resolve(res);
      });
    });
  },
  queryUploadParams(imagePath, floder) {
    return {
      filePath: imagePath,
      formData: {
        fileName: getFileName(imagePath),
        floder: floder
      }
    };
  },
  // 确认上传
  onClickBtn(){
    const { enabled, codeBgPath } = this.data;
    if (!enabled) return;
      PageHelper.requestWrapper(saveCodeBg({ imgPath: codeBgPath }))
      .then(res => {
        console.log("上传成功")
      })
      .catch(err => {
        PageHelper.showFailToast('上传失败，请重试');
      });
  }
});
