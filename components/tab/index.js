// components/tab/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTabChange(event) {
      console.log(event);
      const { tab, index } = event.currentTarget.dataset;
      const { selectedIndex } = this.data;
      // 已经选中不处理
      if (selectedIndex === index) {
        return false;
      }
      this.setData({
        selectedIndex: index
      });

      const myEventDetail = { type: tab.type };
      this.triggerEvent('tabclick', myEventDetail);
    }
  }
});
