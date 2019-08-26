// module/pages/area/area.js
const PageConstant = require('../../../constant/page');
const wxManager = require('../../../utils/wxManager');
const tableService = require('../../../service/table');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    areaList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.requestAreaList();
  },

  initData() {
    PageHelper.setupPageConfig(this);
  },

  requestAreaList() {
    PageHelper.requestWrapper(tableService.getTableAreaList()).then(res => {
      this.setData({
        areaList: res
      });
    });
  },

  handleActionClick() {
    // 新建区域
    wxManager.navigateTo(PageConstant.AREA_EDIT_URL);
  },

  handleCellClick(event) {
    console.log(event);
    const { name, id } = event.currentTarget.dataset.item;
    // 编辑区域
    wxManager.navigateTo(PageConstant.AREA_EDIT_URL, {
      id: id,
      areaName: name
    });
  }
});
