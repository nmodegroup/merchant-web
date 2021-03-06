Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    show: false,
    showClose: false, // 是否显示关闭按钮
    content: '提示内容',
    title: '提示',
    hideCancel: false,
    cancelText: '取消',
    confirmText: '确认',
    openType: '', // 微信开放能力
    custom: false,
    onConfirm: null, // 点击确认回调事件
    onCancel: null // 点击取消回调事件
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 显示toast，定义动画
     */
    showModal(form) {
      this.setData({
        show: true,
        showClose: form.showClose || false,
        content: form.content || '',
        title: form.title || '温馨提示',
        hideCancel: form.hideCancel || false,
        cancelText: form.cancelText || '取消',
        confirmText: form.confirmText || '确认',
        custom: form.custom || false,
        onConfirm: form.onConfirm || null,
        onCancel: form.onCancel || null,
        openType: form.openType || ''
      });
    },

    cancel() {
      const { onCancel } = this.data;
      this.setData({
        show: false
      });

      if (onCancel && typeof onCancel === 'function') {
        return onCancel();
      }
    },

    confirm() {
      const { onConfirm } = this.data;
      this.setData({
        show: false
      });

      if (onConfirm && typeof onConfirm === 'function') {
        return onConfirm();
      }
    },

    close() {
      this.setData({
        show: false
      });
    },

    onGetPhoneCallback(event) {
      console.log('onGetPhoneCallback', event);
      const { onConfirm } = this.data;
      this.setData({
        show: false
      });

      if (onConfirm && typeof onConfirm === 'function') {
        return onConfirm(event.detail);
      }
    }
  }
});
