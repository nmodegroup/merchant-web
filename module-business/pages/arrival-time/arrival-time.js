// module/pages/arrival-time/arrival-time.js
const timeService = require('../../../service/time');
const globalUtil = require('../../../utils/global');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hours: [],
    minutes: [],
    timeList: [],
    selectHour: '',
    selectMinute: '',
    selectId: ''
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
        timeList: res
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
      this.requestEditTime();
    }
  },

  requestEditTime() {
    const { selectHour, selectMinute, selectId } = this.data;
    const params = {
      time: `${selectHour}:${selectMinute}`
    };
    if (this.isEdit) {
      params.id = selectId;
    }
    PageHelper.requestWrapper(timeService.editAppointTime(params)).then(res => {
      PageHelper.showSuccessToast(this.isEdit ? '编辑成功' : '新增成功');
      this.requestAppointTimeList();
    });
  },

  handleClose(event) {
    console.log('event:', event);
    const { position, instance } = event.detail;
    const { id } = event.currentTarget.dataset;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        instance.close();
        this.handleDeleteModal(id);
        break;
      default:
        break;
    }
  },

  handleDeleteModal(id) {
    PageHelper.showDeleteModal('确认删除预约到店时间？').then(() => {
      this.setData(
        {
          selectId: id
        },
        () => {
          this.requestDetelteTime();
        }
      );
    });
  },

  requestDetelteTime() {
    const params = {
      id: this.data.selectId
    };
    PageHelper.requestWrapper(timeService.deleteAppointTime(params)).then(res => {
      PageHelper.showSuccessToast('删除成功');
      this.requestAppointTimeList();
    });
  },

  handleCellClick(event) {
    this.isEdit = true;
    const item = event.currentTarget.dataset.item;
    const times = item.time.split(':');
    this.setData({
      selectHour: times[0],
      selectMinute: times[1],
      selectId: item.id
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
