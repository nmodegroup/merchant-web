// module/pages/business-time/business-time.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  handleSwitchChange(event) {
    console.log(event);
    this.setData({
      checked: event.detail
    });
  },

  handleActionClick() {
    console.log('handleActionClick');
  },

  handleClose(event) {
    console.log('event:', event);
    const { position, instance } = event.detail;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        console.log('delete');
        break;
    }
  }
});
