// module/pages/arrival-time/arrival-time.js
const timeService = require('../../../service/time');
const { createNumberArray } = require('../../../utils/global');
const { getHours } = require('../../../utils/date');
const { AppointTimeStatus } = require('../../../constant/global');
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
    const hourArr = getHours();
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
    const { index, item } = event.currentTarget.dataset;
    this.requestSwitchStatus(item, index);
  },

  /**
   * 请求修改预约时间的开启、关闭状态
   * @param {object} item
   * @param {number} index
   */
  requestSwitchStatus(item, index) {
    let copyItem = Object.assign({}, item);
    const params = {
      id: copyItem.id
    };
    PageHelper.requestWrapper(timeService.switchAppointTime(params)).then(() => {
      PageHelper.showSuccessToast(parseInt(copyItem.onStatus) === AppointTimeStatus.OPEN ? '关闭成功' : '开启成功');
      copyItem.onStatus = parseInt(copyItem.onStatus) === AppointTimeStatus.OPEN ? AppointTimeStatus.CLOSE : AppointTimeStatus.OPEN;
      this.setData({
        [`timeList[${index}]`]: copyItem
      });
    });
  },

  handleActionClick() {
    const { hours, minutes } = this.data;
    this.isEdit = false;
    this.setData({
      selectHour: hours[0],
      selectMinute: minutes[0]
    });
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
    const { position, instance } = event.detail;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        instance.close();
        break;
      default:
        break;
    }
  },

  /**
   * 编辑时间
   */
  handleEdit(event) {
    this.isEdit = true;
    const item = event.currentTarget.dataset.item;
    const times = item.time.split(':');
    this.setData({
      selectHour: times[0],
      selectMinute: times[1],
      selectId: item.id
    });
    this.showSelectModal();
  },

  /**
   * 删除时间
   */
  handleDelete(event) {
    const { id } = event.currentTarget.dataset;
    this.handleDeleteModal(id);
  },

  handleDeleteModal(id) {
    PageHelper.showDeleteModal('确认删除预约到店时间？').then(() => {
      this.requestDetelteTime(id);
    });
  },

  requestDetelteTime(id) {
    const params = {
      id
    };
    PageHelper.requestWrapper(timeService.deleteAppointTime(params)).then(res => {
      PageHelper.showSuccessToast('删除成功');
      this.requestAppointTimeList();
    });
  },

  /**
   * 时间选择事件
   */
  handleSelectChange(event) {
    const type = event.currentTarget.dataset.type;
    const selectOption = event.detail.selectOption;
    this.setData({
      [type]: selectOption
    });
  }
});
