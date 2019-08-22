// module/pages/business-time-edit/busine.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false
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
    this.setData({
      isEdit: !!options.businessId,
      businessId: options.businessId
    });
  },

  handleCreateTime() {},

  handleEditTime(event) {
    const type = event.detail.type;
    if (type === 'right') {
      this.deleteBusinessTime();
    } else {
      this.resolveFormData();
    }
  },

  deleteBusinessTime() {}
});
