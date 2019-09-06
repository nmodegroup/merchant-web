// components/select/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectList: {
      type: Object,
      value: []
    },
    value: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    index: 0 //选择的下拉列表下标
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectTap() {
      this.setData({
        show: !this.data.show
      });
    },

    // 点击下拉列表
    optionTap(e) {
      const { index, item } = e.currentTarget.dataset;
      this.setData({
        index: index,
        show: !this.data.show
      });
      this.triggerEvent('onChange', { selectOption: item });
    }
  }
});
