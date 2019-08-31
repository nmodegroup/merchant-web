// components/choose-image/index.js
Component({
  externalClasses: ['empty-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    height: {
      type: String,
      value: '332rpx'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick() {
      this.triggerEvent('click');
    }
  }
});
