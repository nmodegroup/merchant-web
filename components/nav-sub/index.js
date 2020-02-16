// components/select/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    selectIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击下拉列表
    tapSubItem(e) {
      const { type } = e.currentTarget.dataset;
      this.triggerEvent('onSubItem', { type });
    }
  }
});
