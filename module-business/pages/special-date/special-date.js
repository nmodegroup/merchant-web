// module-business/pages/special-date/special-date.js
const wxManager = require('../../../utils/wxManager');
const timeService = require('../../../service/time');
const { PageHelper } = require('../../../utils/page');
const dateUtil = require('../../../utils/date');
const { getFormatTimeStamp } = require('../../../utils/date');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false,
    specialId: '',
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    visiblePicker: false,
    selectDate: ''
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
    PageHelper.setupPageConfig(this);
    this.setData({
      isEdit: !!options.specialId,
      specialId: options.specialId,
      selectDate: options.date
    });
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
    const { selectDate, isEdit, specialId } = this.data;
    if (!selectDate) {
      return PageHelper.showToast('请选择特殊日期');
    }
    const options = {
      date: selectDate
    };
    // 编辑传 id
    if (isEdit) {
      options.id = specialId;
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

  queryParams() {
    return {
      id: this.data.specialId
    };
  },

  requestDeleteDate() {
    const params = this.queryParams();
    PageHelper.requestWrapper(timeService.deleteSpecialTime(params))
      .then(res => {
        PageHelper.requestSuccessCallback('删除成功');
      })
      .catch(e => {});
  }
});
