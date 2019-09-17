const wxManager = require('../utils/wxManager');
const pageConstant = require('../constant/page');
const pageFlag = require('../constant/pageFlag');
const { AuditStatus } = require('../constant/global');
const { isEmpty } = require('./global');
const store = getApp().globalData;

export class PageConfig {
  constructor() {
    this.isShowLoading = true;
  }

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
  requestWrapper(service, isShowLoading = true) {
    return new Promise((resolve, reject) => {
      if (isShowLoading) {
        wxManager.showLoading('加载中');
      }
      service
        .then(res => {
          if (isShowLoading) {
            wxManager.hideLoading();
          }
          wxManager.stopRefreshAndLoading();
          resolve(res);
        })
        .catch(res => {
          if (isShowLoading) {
            wxManager.hideLoading();
          }
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
  checkAuditStatus() {
    return new Promise((resolve, reject) => {
      switch (parseInt(store.auditStatus)) {
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
   * 失败 toast
   * @param {string} msg 提示消息内容
   */
  showFailToast(msg) {
    if (!this.currentPage().Toast) {
      throw new Error('Toast error: toast is not init in onLoad or toast id is not match（is wrong）');
    }
    this.currentPage().Toast.showToast({
      content: msg,
      icon: 'fail'
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
    if (isEmpty(msg)) {
      return console.error('showToast error: msg is null');
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
  showSingleConfirmModal(content, title) {
    return new Promise(resolve => {
      this.currentPage().modal.showModal({
        title: title,
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
        confirmText: '确定删除',
        hideCancel: false,
        onConfirm: () => {
          resolve();
        }
      });
    });
  }

  /**
   * 订单确认预定弹窗
   */
  showOrderConfirmModal() {
    return new Promise((resolve, reject) => {
      this.currentPage().modal.showModal({
        content: '确认为用户通过预订吗？通过后他将预\n订成功，并尽可能按照预订时间到店！',
        title: '温馨提示',
        cancelText: '不通过',
        confirmText: '通过',
        hideCancel: false,
        onConfirm: () => {
          resolve();
        },
        onCancel: () => {
          reject();
        }
      });
    });
  }

  /**
   * 订单确认到店弹窗
   */
  showOrderArrivalModal() {
    return new Promise(resolve => {
      this.currentPage().modal.showModal({
        content: '确认用户已按时到店，并为其签到吗？',
        title: '温馨提示',
        cancelText: '点错了',
        confirmText: '确认',
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
