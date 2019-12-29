// components/action-buttom/index.js
const store = getApp().globalData;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleLeft: {
      type: String,
      value: 'left title'
    },
    titleRight: {
      type: String,
      value: 'right title'
    },
    twoTipsLeft: {
      type: String,
      value: 'twoTipsLeft'
    },
    twoTipsRight: {
      type: String,
      value: 'twoTipsRight'
    },
    threeTipsLeft: {
      type: String,
      value: 'threeTipsLeft'
    },
    threeTipsRight: {
      type: String,
      value: 'threeTipsRight'
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
