const wxManager = require('../utils/wxManager');
const pageConstant = require('../constant/page');
const pageFlag = require('../constant/pageFlag');
const { AuditStatus } = require('../constant/global');

export class PageConfig {
  constructor() {}

  setupPageConfig(context) {
    console.log('this:', this);
    this.context = context;
    // 初始化 toast
    this.currentPage().Toast = this.currentPage().selectComponent('#toast');
    // 初始化 modal
    this.currentPage().modal = this.currentPage().selectComponent('#modal');
  }

  currentPage() {
    return this.context;
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
          wxManager.stopRefreshAndLoading();
          resolve(res);
        })
        .catch(res => {
          wxManager.hideLoading();
          wxManager.stopRefreshAndLoading();
          this.showToast(res.msg);
          reject(res);
        });
    });
  }

  /**
   * 新增、修改、删除请求成功后需要回到上一页的回调操作
   * @param {string} msg toast 消息
   */
  requestSuccessCallback(msg = '创建成功', duration = 1500) {
    this.showSuccessToast(msg);
    setTimeout(() => {
      wxManager.navigateBack();
    }, duration);
  }

  /**
   * 检查店铺审核状态（认证状态）
   */
  checkAuditStatus(auditStatus) {
    return new Promise((resolve, reject) => {
      switch (+auditStatus) {
        case AuditStatus.NOT_AUDIT: // 未提交资料
          this.showAuthModal();
          break;
        case AuditStatus.AUDITING: // 待审核
          this.showAuthAuditingModal();
          break;
        case AuditStatus.AUDIT_SUCCESS: // 审核通过
          resolve();
          break;
        case AuditStatus.AUDIT_FAIL: // 审核未通过
          this.showAuthFailModal();
          break;
        default:
          reject('checkAuditStatus error: not match');
          break;
      }
    });
  }

  getValue(value) {
    return value || '';
  }

  /**
   * 成功 toast
   * @param {string} msg 提示消息内容
   */
  showSuccessToast(msg) {
    if (!this.currentPage().Toast) {
      throw new Error('Toast error: toast is not init in onLoad or toast id is not match（is wrong）');
    }
    this.currentPage().Toast.showToast({
      content: msg,
      icon: 'success'
    });
  }

  /**
   * 普通文字 toast
   * @param {string} msg 提示消息内容
   */
  showToast(msg) {
    if (!this.currentPage().Toast) {
      throw new Error('Toast error: toast is not init in onLoad or toast id is not match（is wrong）');
    }
    this.currentPage().Toast.showToast({
      content: msg
    });
  }

  /**
   * 未认证弹窗
   */
  showAuthModal() {
    console.log('showAuthModal');
    console.log('this', this);
    this.currentPage().modal.showModal({
      content: '您还没有进行店铺认证',
      cancelText: '取消',
      confirmText: '立即认证',
      hideCancel: false,
      onConfirm: () => {
        wxManager.navigateTo(pageConstant.INFO_URL, {
          enterType: pageFlag.INFO_TOTAL
        });
      }
    });
  }

  /**
   * 认证审核中弹窗
   */
  showAuthAuditingModal() {
    this.showSingleConfirmModal('您的店铺信息需要平台审核，\n请耐心等待！');
  }

  /**
   * 店铺认证失败弹窗
   */
  showAuthFailModal() {
    this.showSingleConfirmModal('您的店铺认证审核未通过，可以在“我的-店铺信息”中查看未通过原因哦~');
  }

  /**
   * 只有确认按钮的提示弹窗
   * @param {string} content 弹窗文案
   */
  showSingleConfirmModal(content) {
    return new Promise(resolve => {
      this.currentPage().modal.showModal({
        content: content,
        confirmText: '我知道了',
        hideCancel: true,
        onConfirm: () => {
          resolve();
        }
      });
    });
  }

  /**
   * 删除提示弹窗
   */
  showDeleteModal(content) {
    return new Promise(resolve => {
      this.currentPage().modal.showModal({
        content: content,
        title: '温馨提示',
        cancelText: '点错了',
        confirmText: '删除',
        hideCancel: false,
        onConfirm: () => {
          resolve();
        }
      });
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
