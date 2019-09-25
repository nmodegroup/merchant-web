// components/action/index.js
const store = getApp().globalData;
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: false
  },

  ready() {
    this.setData({
      isIphoneX: store.isIphoneX
    });
  }
});
