Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    visible: false,
    // 弹窗显示控制
    animationData: {},
    content: '提示内容',
    iconImg: '', //图标
    icon: {
      success: '/image/toast/icon_succed.svg',
      fail: '/image/toast/icon_fail.svg',
      warn: '/image/toast/icon_warn.svg',
      wait: '/image/toast/icon_wait.svg'
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 显示toast，定义动画
     */
    showToast({ content, icon }) {
      let iconImg = icon ? this.data.icon[icon] : '';
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease'
      });
      this.animation = animation;
      animation.opacity(1).step();
      this.setData({
        animationData: animation.export(),
        content: content,
        iconImg: iconImg || '',
        visible: true
      });
      /**
       * 延时消失
       */
      setTimeout(
        function() {
          animation.opacity(0).step();
          this.setData({
            animationData: animation.export(),
            visible: false
          });
        }.bind(this),
        1500
      );
    }
  }
});
