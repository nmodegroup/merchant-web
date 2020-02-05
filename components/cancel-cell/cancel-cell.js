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
    name: {
      type: String,
      value: ''
    },
    date: {
      type: String,
      value: ''
    },
    sellNum: {
      type: Number,
      value: 0
    },
    useNum: {
      type: Number,
      value: 0
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
