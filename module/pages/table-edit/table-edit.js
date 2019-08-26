// module/pages/table-edit/table-edit.js
const wxManager = require('../../../utils/wxManager');
const tableService = require('../../../service/table');
const { PageHelper } = require('../../../utils/page');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    isEdit: false,
    areaList: [],
    visibleArea: false,
    selectArea: {},
    areaName: '请选择区域', // 区域名
    areaId: '', // 区域id
    tableName: '', // 桌位名
    tableId: '', // 桌位id
    tableNum: '' // 桌位人数
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

  initData(options) {
    // init PageHelper
    PageHelper.setupPageConfig(this);
    // 请求区域列表
    this.requestAreaList();
    const { areaName, areaId, tableName, tableId, tableNum } = options;
    const isEdit = !!areaId;
    const getValue = PageHelper.getValue;
    this.setData({
      title: isEdit ? '编辑桌位' : '新增桌位',
      isEdit: isEdit,
      selectArea: this.resolveSelectArea(areaId, areaName),
      tableName: getValue(tableName),
      tableId: getValue(tableId),
      tableNum: getValue(tableNum)
    });
  },

  resolveSelectArea(areaId, areaName) {
    if (!areaId) {
      return {};
    }
    return {
      id: areaId,
      name: areaName
    };
  },

  requestAreaList() {
    PageHelper.requestWrapper(tableService.getTableAreaList()).then(res => {
      this.setData({
        areaList: res
      });
    });
  },

  handleCreateTable(event) {
    this.resolveFormData();
  },

  handleEditTable(event) {
    const type = event.detail.type;
    if (type === 'right') {
      PageHelper.showDeleteModal('是否确认删除桌位').then(() => {
        this.deleteTable();
      });
    } else {
      this.resolveFormData();
    }
  },

  resolveFormData() {
    this.checkFormData()
      .then(result => {
        this.requestEditTable(result);
      })
      .catch(msg => {
        PageHelper.showToast(msg);
      });
  },

  /**
   * 校验表单
   */
  checkFormData() {
    const { selectArea, tableName, tableNum } = this.data;
    return new Promise((resolve, reject) => {
      if (!selectArea.id) {
        return reject('请选择桌位所属区域');
      }
      if (!tableName) {
        return reject('请填写桌位名称');
      }
      if (!tableNum) {
        return reject('请填写桌位最多容纳人数');
      }
      resolve({
        tableAreaId: selectArea.id,
        name: tableName,
        num: tableNum
      });
    });
  },

  requestEditTable(params) {
    const { isEdit, tableId } = this.data;
    if (isEdit) {
      params.id = tableId;
    }
    PageHelper.requestWrapper(tableService.createTable(params)).then(res => {
      PageHelper.requestSuccessCallback(isEdit ? '桌位编辑成功' : '桌位创建成功');
    });
  },

  deleteTable() {
    const params = {
      id: this.data.tableId
    };
    PageHelper.requestWrapper(tableService.deleteTable(params)).then(res => {
      PageHelper.requestSuccessCallback('桌位删除成功');
    });
  },

  handleInput(event) {
    const type = event.currentTarget.dataset.type;
    const value = event.detail.value;
    if (type === 'name') {
      this.setData({
        tableName: value
      });
    } else {
      this.setData({
        tableNum: value
      });
    }
  },

  handleCellClick() {
    this.setData({
      visibleArea: true
    });
  },

  onConfirm(event) {
    console.log(event);
    const { value } = event.detail;
    this.setData({
      selectArea: value,
      visibleArea: false
    });
  },

  onCancel() {
    this.setData({
      visibleArea: false
    });
  }
});
