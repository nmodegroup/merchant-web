const wxManager = require('../utils/wxManager');

export class PageConfig {
  constructor(context) {
    this.context = context;
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
          this.context.showToast(res.msg);
          reject(res);
        });
    });
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
}
