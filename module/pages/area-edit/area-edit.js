// module/pages/area-edit/area-edit.js
const tableService = require('../../../service/table');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
const { isEmpty } = require('../../../utils/global');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    isEdit: false,
    areaName: '',
    areaId: '' // 区域 id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(options);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 初始化数据
   *
   */
  initData({ areaName, id }) {
    // init PageHelper
    PageHelper.setupPageConfig(this);
    this.setData({
      title: !!id ? '编辑区域' : '新增区域',
      isEdit: !!id,
      areaId: PageHelper.getValue(id),
      areaName: PageHelper.getValue(areaName)
    });
  },

  /**
   * 新建区域
   */
  handleCreateArea() {
    const { areaName } = this.data;
    if (isEmpty(areaName)) {
      return false;
    }
    if (!areaName || areaName.length < 2 || areaName.length > 10) {
      return PageHelper.showFailToast('区域名2-10个字符\n可包含中文字母数字');
    }
    this.requestEditArea();
  },

  requestEditArea() {
    const { areaName, areaId, isEdit } = this.data;
    const params = {
      name: areaName
    };
    if (isEdit) {
      params.id = areaId;
    }
    PageHelper.requestWrapper(tableService.createTableArea(params)).then(res => {
      PageHelper.requestSuccessCallback(isEdit ? '区域编辑成功' : '区域创建成功');
    });
  },

  /**
   * 编辑、删除区域
   * @param {object} event
   */
  handleEditArea(event) {
    const { type } = event.detail;
    if (type === 'left') {
      this.requestEditArea();
    } else {
      PageHelper.showDeleteModal('是否确认删除区域?').then(() => {
        this.requestDeleteArea();
      });
    }
  },

  requestDeleteArea() {
    const params = {
      id: this.data.areaId
    };
    PageHelper.requestWrapper(tableService.deleteTableArea(params)).then(res => {
      PageHelper.requestSuccessCallback('删除区域成功');
    });
  },

  handleInput(event) {
    const { value } = event.detail;
    this.setData({
      areaName: value
    });
  }
});
