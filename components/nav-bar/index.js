// components/nav-bar/index.js
const PathConstant = require('../../constant/page');
const wxManager = require('../../utils/wxManager');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /* 标题 */
    title: {
      type: String,
      value: ''
    },
    /* 是否显示返回按钮 */
    back: {
      type: Boolean,
      value: false
    },
    /* 是否显示回到首页按钮 */
    home: {
      type: Boolean,
      value: false
    },
    /* 占位组件 */
    showHolder: {
      type: Boolean,
      value: true
    },
    /* 是否显示背景 */
    bgColor: {
      type: String,
      value: '#161549'
    },
    /* 是否拦截默认返回事件 */
    propagation: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 20,
    navigationBarHeight: 64
  },

  ready() {
    // 计算标题栏和状态栏高度
    wxManager.getSystemInfo().then(systemInfo => {
      console.log('systemInfo:', systemInfo);
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

      //计算当前页面是否在栈底
      const pages = getCurrentPages();
      this.setData({
        showBack: this.data.back && pages.length > 1,
        statusBarHeight: pt,
        navigationBarHeight: h + pt
      });
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleBack() {
      const { propagation } = this.data;
      if (propagation) {
        return this.triggerEvent('handleBack');
      }
      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
      });
    },

    handleGoHome() {
      console.log('handleGoHome:', '/pages/home/home');
      wx.switchTab({
        url: PathConstant.HOME_URL
      });
    }
  }
});
