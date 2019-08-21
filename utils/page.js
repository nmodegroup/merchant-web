const wxManager = require('../utils/wxManager');

class PageConfig {
  constructor() {}

  setupPageConfig(context) {
    this.context = context;
    // 初始化 toast
    this.context.Toast = this.context.selectComponent('#toast');
    // 初始化 modal
    this.context.modal = this.context.selectComponent('#modal');
  }

  /**
   * 请求包装类（包装了 loading，异常 toast 提示）
   * @param {object} service 请求 service
   */
  requestWrapper(service) {
    return new Promise((resolve, reject) => {
      wxManager.showLoading();
      service
        .then(res => {
          wxManager.hideLoading();
          resolve(res);
        })
        .catch(res => {
          wxManager.hideLoading();
          this.showToast(res.msg);
          reject(res);
        });
    });
  }

  /**
   * 新增、修改、删除请求成功后需要回到上一页的回调操作
   * @param {string} msg toast 消息
   */
  requestSuccessCallback(msg) {
    this.showSuccessToast('创建成功');
    setTimeout(() => {
      wxManager.navigateBack();
    }, 1500);
  }

  /**
   * 成功 toast
   * @param {string} msg 提示消息内容
   */
  showSuccessToast(msg) {
    if (!this.context.Toast) {
      throw new Error('Toast error: toast is not init in onLoad or toast id is not match（is wrong）');
    }
    this.context.Toast.showToast({
      content: msg,
      icon: 'success'
    });
  }

  /**
   * 普通文字 toast
   * @param {string} msg 提示消息内容
   */
  showToast(msg) {
    if (!this.context.Toast) {
      throw new Error('Toast error: toast is not init in onLoad or toast id is not match（is wrong）');
    }
    this.context.Toast.showToast({
      content: msg
    });
  }

  /**
   * 删除提示弹窗
   */
  showDeleteModal(content) {
    this.modal.showModal({
      content: content,
      title: '温馨提示',
      cancelText: '点错了',
      confirmText: '删除',
      hideCancel: false
    });
  }

  /**
   * 校验弹窗是否点击的确认
   * @param {object} event 点击事件
   */
  isModalConfirm(event) {
    return event.detail.result === 'confirm';
  }

  /**
   * 校验弹窗是否点击的取消
   * @param {object} event 点击事件
   */
  isModalCancel(event) {
    return event.detail.result === 'cancel';
  }
}

export const PageHelper = new PageConfig();
