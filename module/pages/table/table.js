// module/pages/table/table.js
const pageConstant = require('../../../constant/page');
const wxManager = require('../../../utils/wxManager');
const tableService = require('../../../service/table');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tableList: []
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
    this.requestTableList();
  },

  initData() {
    PageHelper.setupPageConfig(this);
  },

  requestTableList() {
    PageHelper.requestWrapper(tableService.getTableList()).then(res => {
      console.log('getTableList:', res);
      this.setData({
        tableList: res
      });
    });
  },

  handleActionClick(event) {
    console.log(event);
    const { type } = event.currentTarget.dataset;
    if (type === 'area') {
      wxManager.navigateTo(pageConstant.AREA_URL);
    } else {
      wxManager.navigateTo(pageConstant.TABLE_EDIT_URL);
    }
  },

  /**
   * 编辑桌位
   */
  handleTableItemClick(event) {
    console.log(event);
    const { areaname, areaid, item } = event.currentTarget.dataset;
    wxManager.navigateTo(pageConstant.TABLE_EDIT_URL, {
      areaName: areaname,
      areaId: areaid,
      tableName: item.name,
      tableId: item.id,
      tableNum: item.num
    });
  }
});
