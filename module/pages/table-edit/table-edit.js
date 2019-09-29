// module/pages/table-edit/table-edit.js
const tableService = require('../../../service/table');
const { regAllNumber } = require('../../../utils/regular');
const { PageConfig } = require('../../../utils/page');
const { isEmpty } = require('../../../utils/global');
const { debounce } = require('../../../utils/throttle-debounce/index');
const PageHelper = new PageConfig();

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
    tableNum: '', // 桌位人数
    verifyed: false // 新建是否可点击
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
    this.setupDebounce();
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

  setupDebounce() {
    /* 输入防抖，func 为需要执行的函数，不传则默认 refreshFormVerify */
    this.inputDebounce = debounce(300, (func = this.refreshFormVerify) => {
      func();
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

  /**
   * 刷新表单验证状态
   */
  refreshFormVerify() {
    this.setData({
      verifyed: this.verifyForm()
    });
  },

  verifyForm() {
    const { selectArea, tableName, tableNum } = this.data;
    return !isEmpty(selectArea.name) && !isEmpty(tableName) && !isEmpty(tableNum);
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
      if (!this.verifyForm()) {
        return false;
      }
      if (!regAllNumber(tableNum)) {
        return reject('桌位人数填写不正确');
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
    this.refreshFormVerify();
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
    this.refreshFormVerify();
  },

  onCancel() {
    this.setData({
      visibleArea: false
    });
  }
});
