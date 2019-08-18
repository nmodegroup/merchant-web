// module/pages/area/area.js
const PageFlag = require('../../../constant/pageFlag');
const PageConstant = require('../../../constant/page');
const wxManager = require('../../../utils/wxManager');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    areaList: [
      {
        id: 1,
        name: '大厅'
      },
      {
        id: 2,
        name: '吧台'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  handleActionClick() {
    // 新建区域
    wxManager.navigateTo(PageConstant.AREA_EDIT_URL, {
      flag: PageFlag.AREA_CREATE
    });
  },

  handleCellClick(event) {
    console.log(event);
    // 编辑区域
    wxManager.navigateTo(PageConstant.AREA_EDIT_URL, {
      flag: PageFlag.AREA_EDIT,
      areaName: event.currentTarget.dataset.item.name
    });
  }
});
