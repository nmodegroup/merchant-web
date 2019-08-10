// module/pages/area-edit/area-edit.js
const wxManager = require('../../../utils/wxManager.js');
const PageFlag = require('../../../constant/pageFlag');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    isEdit: false,
    areaName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(options);
    this.toast = this.selectComponent('#toast');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 初始化数据
   *
   */
  initData({ flag = PageFlag.AREA_CREATE, areaName }) {
    if (flag === PageFlag.AREA_CREATE) {
      this.setData({
        title: '新增区域',
        isEdit: false
      });
    } else if (flag === PageFlag.AREA_EDIT) {
      this.setData({
        title: '编辑区域',
        areaName: areaName,
        isEdit: true
      });
    }
  },

  /**
   * 新建区域
   */
  handleCreateArea() {
    const { areaName } = this.data;
    if (!areaName || areaName.length < 2) {
      return this.toast.showToast({
        content: '区域名2-10个字符',
        multContent: '可包含中文字母数字'
      });
    }
  },

  /**
   * 编辑区域
   * @param {object} event
   */
  handleEditArea(event) {
    const { type } = event.detail;
    if (type === 'left') {
      wx.showToast({
        title: '保存'
      });
    } else {
      wx.showToast({
        title: '删除'
      });
    }
  },

  handleInput(event) {
    const { value } = event.detail;
    this.setData({
      areaName: value
    });
  }
});
