// module/pages/arrival-time/arrival-time.js
const timeService = require('../../../service/time');
const wxManager = require('../../../utils/wxManager');
const globalUtil = require('../../../utils/global');
const { PageConfig } = require('../../../utils/page');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hours: [],
    minutes: [],
    timeList: []
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
  onShow: function() {},

  initData() {
    // 初始化 toast
    this.Toast = this.selectComponent('#toast');
    // 初始化 modal
    this.modal = this.selectComponent('#modal');
    // 初始化 time select modal
    this.modalSelect = this.selectComponent('#modalSelect');
    // 生成小时和分钟数组
    this.generateArray();
    // 初始化 pageConfig
    this.setupPageConfig();
    // 请求数据
    this.requestAppointTimeList();
  },

  setupPageConfig() {
    this.pageConfig = new PageConfig(this);
  },

  generateArray() {
    const hourArr = globalUtil.createNumberArray(24);
    const minuteArr = ['00', '30'];
    this.setData({
      hours: hourArr,
      minutes: minuteArr,
      selectHour: hourArr[0],
      selectMinute: minuteArr[0]
    });
  },

  requestAppointTimeList() {
    this.pageConfig.requestWrapper(timeService.getAppointTime()).then(res => {
      this.setData({
        // TODO:
        // timeList: res,
        timeList: res.length || [{ id: 1, time: '20:00', onStatus: 0 }]
      });
    });
  },

  handleSwitchChange(event) {
    console.log(event);
    const { index } = event.currentTarget.dataset;
    const timeChangedList = this.data.timeList.map((element, i) => {
      if (index === i) {
        // 0 开启， 1 关闭
        element.onStatus = parseInt(element.onStatus) === 0 ? 1 : 0;
        return element;
      }
      return element;
    });
    this.setData({
      timeList: timeChangedList
    });
  },

  handleActionClick() {
    this.isEdit = false;
    this.modalSelect.showModal({
      title: '到店时间设置',
      cancelText: '取消',
      confirmText: '保存',
      hideCancel: false,
      custom: true
    });
  },

  requestEditTime() {
    this.pageConfig.requestWrapper(timeService.editAppointTime()).then(res => {
      this.showSuccessToast('编辑成功');
      this.requestAppointTimeList();
    });
  },

  requestCreateTime() {
    this.pageConfig.requestWrapper(timeService.editAppointTime()).then(res => {
      this.showSuccessToast('新增成功');
      this.requestAppointTimeList();
    });
  },

  handleClose(event) {
    console.log('event:', event);
    const { position, instance } = event.detail;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        instance.close();
        this.showDeteleModal();
        break;
      default:
        break;
    }
  },

  showDeteleModal() {
    this.modal.showModal({
      content: '确认将这项预约到店时间删除吗？',
      title: '温馨提示',
      cancelText: '点错了',
      confirmText: '删除',
      hideCancel: false
    });
  },

  deleteCallback(event) {
    console.log(event);
    if (this.modal.isConfirm(event.detail.result)) {
      this.requestDetelteTime();
    }
  },

  requestDetelteTime() {
    this.pageConfig.requestWrapper(timeService.deleteAppointTime()).then(res => {
      this.showSuccessToast('删除成功');
    });
  }
});
