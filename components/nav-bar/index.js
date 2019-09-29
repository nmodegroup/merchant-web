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
    /* 是否拦截默认返回以及回首页事件 */
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
    // 初始化 modal
    this.modal = this.selectComponent('#modal');
    // 计算标题栏和状态栏高度
    wxManager.getSystemInfo().then(systemInfo => {
      const { statusBarHeight } = systemInfo;
      const rect = wx.getMenuButtonBoundingClientRect();
      const titleBarHeight = rect.bottom + rect.top - statusBarHeight * 2;

      //计算当前页面是否在栈底
      const pages = getCurrentPages();
      this.setData({
        showBack: this.data.back && pages.length > 1,
        statusBarHeight,
        navigationBarHeight: statusBarHeight + titleBarHeight
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
        this.triggerEvent('goback');
        return this.showGiveUpModal();
      }
      wxManager.navigateBack();
    },

    showGiveUpModal(isGOBack = true) {
      this.modal.showModal({
        content: '是否放弃本次编辑？',
        title: '温馨提示',
        cancelText: '点错了',
        confirmText: '放弃',
        hideCancel: false,
        onConfirm: () => {
          if (isGOBack) {
            wxManager.navigateBack();
          } else {
            this.goHome();
          }
        }
      });
    },

    handleGoHome() {
      const { propagation } = this.data;
      if (propagation) {
        this.triggerEvent('gohome');
        return this.showGiveUpModal(false);
      }
      this.goHome();
    },

    goHome() {
      wx.switchTab({
        url: PathConstant.HOME_URL
      });
    }
  }
});
