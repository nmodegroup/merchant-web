// module-business/pages/special-date/special-date.js
const pageConstant = require('../../../constant/page');
const wxManager = require('../../../utils/wxManager');
const timeService = require('../../../service/time');
const { PageHelper } = require('../../../utils/page');
const dateUtil = require('../../../utils/date');
const pageFlag = require('../../../constant/pageFlag');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    visiblePicker: false,
    selectDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
    this.setupPageConfig();
    this.setData({
      isEdit: options.flag === pageFlag.SPECIAL_EDIT
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  initData() {
    this.Toast = this.selectComponent('#toast');
  },

  setupPageConfig() {
    PageHelper.setupPageConfig(this);
  },

  handleSelectDate() {
    this.setData({
      visiblePicker: true
    });
  },

  onInput(event) {
    console.log(event);
    this.setData({
      currentDate: event.detail
    });
  },

  handleConfirm(event) {
    console.log('confirm:', event);
    this.setData({
      visiblePicker: false,
      selectDate: dateUtil.formatUnixDate(event.detail)
    });
  },

  handleCancel() {
    this.setData({
      visiblePicker: false
    });
  },

  handleSaveDate() {
    /* 校验 */
    const { selectDate, isEdit, dateId } = this.data;
    if (!selectDate) {
      return PageHelper.showToast('请选择特殊日期');
    }
    const options = {
      date: selectDate
    };
    // 编辑传 id
    if (isEdit) {
      options.id = dateId;
    }

    PageHelper.requestWrapper(timeService.editSpecialTime(options))
      .then(res => {
        PageHelper.requestSuccessCallback(isEdit ? '编辑成功' : '创建成功');
      })
      .catch(e => {
        console.log(e);
      });
  },

  /**
   * 编辑删除
   */
  handleEditSpecialDate(event) {
    const type = event.detail.type;
    if (type === 'right') {
      this.deleteDate();
    } else {
      this.handleSaveDate();
    }
  },

  deleteDate() {
    PageHelper.showDeleteModal('确认要删除吗');
  },

  onDeleteCallback(event) {
    if (PageHelper.isModalConfirm(event)) {
      this.requestDeleteDate();
    }
  },

  requestDeleteDate() {
    PageHelper.requestWrapper(timeService.deleteSpecialTime())
      .then(res => {
        PageHelper.requestSuccessCallback('删除成功');
      })
      .catch(e => {});
  }
});
