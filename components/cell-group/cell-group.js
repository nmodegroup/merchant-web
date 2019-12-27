// components/action-buttom/index.js
const store = getApp().globalData;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    single: {
      type: Boolean,
      value: true
    },
    leftText: {
      type: String,
      value: '保存'
    },
    rightText: {
      type: String,
      value: '确认创建'
    },
    /* 按钮是否高亮 */
    enabled: {
      type: Boolean,
      value: true
    }
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
