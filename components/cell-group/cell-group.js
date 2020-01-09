// components/action-buttom/index.js
const store = getApp().globalData;
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ["three-left"],
  properties: {
    titleLeft: {
      type: String,
      value: ''
    },
    titleRight: {
      type: String,
      value: ''
    },
    twoTipsLeft: {
      type: String,
      value: ''
    },
    twoTipsRight: {
      type: String,
      value: ''
    },
    threeTipsLeft: {
      type: String,
      value: ''
    },
    threeTipsRight: {
      type: String,
      value: ''
    },
  },

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
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
});
