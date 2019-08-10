// module/pages/table-edit/table-edit.js
const PageFlag = require('../../../constant/pageFlag');
const wxManager = require('../../../utils/wxManager');
const tableService = require('../../../service/table');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    isEdit: false,
    areaList: [],
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
    this.Toast = this.selectComponent('#toast');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.requestAreaList();
  },

  initData(options) {
    const { flag, areaName, areaId, tableName, tableId, tableNum } = options;
    if (flag === PageFlag.TABLE_CREATE) {
      return this.setData({
        title: '新增桌位',
        isEdit: false
      });
    }
    this.setData({
      title: '编辑桌位',
      isEdit: true,
      areaName: areaName,
      areaId: areaId,
      tableName: tableName,
      tableId: tableId,
      tableNum: tableNum
    });
  },

  requestAreaList() {
    wxManager.showLoading();
    tableService
      .getTableAreaList()
      .then(res => {
        this.setData({
          areaList: res
        });
        wxManager.hideLoading();
      })
      .catch(e => {
        wxManager.hideLoading();
        this.showNormalToast(e.msg);
      });
  },

  handleCreateTable(event) {
    this.resolveFormData();
  },

  handleEditTable(event) {
    const type = event.detail.type;
    if (type === 'right') {
      this.deleteTable();
    } else {
      this.resolveFormData();
    }
  },

  resolveFormData() {
    this.checkFormData()
      .then(result => {
        console.log('res:', result);
        if (this.data.isEdit) {
          result.id = this.data.tableId;
          this.requestEditTable(result);
        }
        this.requestCreateTable(result);
      })
      .catch(msg => {
        this.showNormalToast(msg);
      });
  },

  /**
   * 校验表单
   */
  checkFormData() {
    const { areaId, tableName, tableNum } = this.data;
    return new Promise((resolve, reject) => {
      if (!areaId) {
        return reject('请选择桌位所属区域');
      }
      if (!tableName) {
        return reject('请填写桌位名称');
      }
      if (!tableNum) {
        return reject('请填写桌位最多容纳人数');
      }
      resolve({
        tableAreaId: areaId,
        name: tableName,
        num: tableNum
      });
    });
  },

  requestCreateTable(params) {
    wxManager.showLoading();
    tableService
      .createTable(params)
      .then(res => {
        wxManager.hideLoading();
        this.showSuccessToast('桌位创建成功');
      })
      .catch(e => {
        wxManager.hideLoading();
        this.showNormalToast(e.msg);
      });
  },

  requestEditTable(params) {
    wxManager.showLoading();
    tableService
      .editTable(params)
      .then(res => {
        wxManager.hideLoading();
        this.showSuccessToast('桌位编辑成功');
      })
      .catch(e => {
        wxManager.hideLoading();
        this.showNormalToast(e.msg);
      });
  },

  deleteTable() {
    const params = {
      id: this.data.tableId
    };
    wxManager.showLoading();
    tableService
      .editTable(params)
      .then(res => {
        wxManager.hideLoading();
        this.showSuccessToast('桌位删除成功');
      })
      .catch(e => {
        wxManager.hideLoading();
        this.showNormalToast(e.msg);
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

  showNormalToast(msg) {
    if (!msg) {
      return false;
    }
    this.Toast.showToast({
      content: msg
    });
  },

  showSuccessToast(msg) {
    if (!msg) {
      return false;
    }
    this.Toast.showToast({
      content: msg,
      icon: 'success'
    });
  }
});
