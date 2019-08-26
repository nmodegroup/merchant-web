// module-business/pages/special-date/special-date.js
const timeService = require('../../../service/time');
const dateUtil = require('../../../utils/date');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();
// TODO: 退出编辑提示
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
      specialId: options.specialId || '',
      selectDate: options.date || ''
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
        PageHelper.requestSuccessCallback(isEdit ? '特殊日期编辑成功' : '特殊日期创建成功');
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
    PageHelper.showDeleteModal('是否确认删除特殊日期？').then(() => {
      this.requestDeleteDate();
    });
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
        PageHelper.requestSuccessCallback('特殊日期删除成功');
      })
      .catch(e => {});
  }
});
