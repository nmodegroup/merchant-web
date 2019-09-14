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

  ready() {
    wxManager.getSystemInfo().then(systemInfo => {
      const reg = /ios/i;
      let pt = 20;
      let h = 44;
      if (reg.test(systemInfo.system)) {
        pt = systemInfo.statusBarHeight;
        h = 44;
      } else {
        pt = systemInfo.statusBarHeight;
        h = 48;
      }
      this.setData({
        navigationBarHeight: h + pt
      });
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTabChange(event) {
      console.log(event);
      const { tab, index } = event.currentTarget.dataset;
      const { selectIndex } = this.data;
      // 已经选中不处理
      if (selectIndex === index) {
        return false;
      }
      this.setData({
        selectIndex: index
      });

      const myEventDetail = { type: tab.type };
      this.triggerEvent('tabclick', myEventDetail);
    }
  }
});
