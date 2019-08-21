// module/pages/arrival-time/arrival-time.js
const timeService = require('../../../service/time');
const wxManager = require('../../../utils/wxManager');
const globalUtil = require('../../../utils/global');
const { PageHelper } = require('../../../utils/page');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hours: [],
    minutes: [],
    timeList: [],
    selectHour: '',
    selectMinute: ''
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
    PageHelper.setupPageConfig(this);
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
    PageHelper.requestWrapper(timeService.getAppointTime()).then(res => {
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
    this.showSelectModal();
  },

  showSelectModal() {
    this.modalSelect.showModal({
      title: '到店时间设置',
      cancelText: '取消',
      confirmText: '保存',
      hideCancel: false,
      custom: true
    });
  },

  selectCallback(event) {
    if (PageHelper.isModalConfirm(event)) {
      if (this.isEdit) {
        return this.requestEditTime();
      }
      this.requestCreateTime();
    }
  },

  requestEditTime() {
    const { selectHour, selectMinute } = this.data;
    const editParams = {
      time: `${selectHour}:${selectMinute}`
      // id:
    };
    PageHelper.requestWrapper(timeService.editAppointTime(editParams)).then(res => {
      this.showSuccessToast('编辑成功');
      this.requestAppointTimeList();
    });
  },

  requestCreateTime() {
    const { selectHour, selectMinute } = this.data;
    const createParams = {
      time: `${selectHour}:${selectMinute}`
    };
    PageHelper.requestWrapper(timeService.editAppointTime(createParams)).then(res => {
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
        PageHelper.showDeleteModal('确认将这项预约到店时间删除吗？');
        break;
      default:
        break;
    }
  },

  deleteCallback(event) {
    console.log(event);
    if (PageHelper.isModalConfirm(event.detail.result)) {
      this.requestDetelteTime();
    }
  },

  requestDetelteTime() {
    PageHelper.requestWrapper(timeService.deleteAppointTime()).then(res => {
      this.showSuccessToast('删除成功');
    });
  },

  handleCellClick(event) {
    this.isEdit = true;
    const item = event.currentTarget.dataset.item;
    const times = item.time.split(':');
    this.setData({
      selectHour: times[0],
      selectMinute: times[1]
    });
  },

  /**
   * 时间选择事件
   */
  handleSelectChange(event) {
    console.log(event);
    const type = event.currentTarget.dataset.type;
    const selectOption = event.detail.selectOption;
    this.setData({
      [type]: selectOption
    });
  }
});
