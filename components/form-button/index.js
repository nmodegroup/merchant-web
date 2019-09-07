// components/commit-button/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    enabled: {
      type: Boolean,
      value: false
    },
    buttonText: {
      type: String,
      value: '确认提交'
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
      this.triggerEvent('commit');
    }
  }
});
