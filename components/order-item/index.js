const WxManager = require('../../utils/wxManager');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 等待确认状态时可以确认预订操作，已确认或到点超时状态下可以确认已到达操作
     */
    handleConfirm() {
      const myEventDetail = { item: this.data.order };
      this.triggerEvent('itemClick', myEventDetail);
    },

    handleArrive() {
      const myEventDetail = { item: this.data.order };
      this.triggerEvent('arriveClick', myEventDetail);
    },

    onMakePhoneCall(event) {
      const { phone } = event.currentTarget.dataset;
      WxManager.makePhoneCall(phone);
    }
  }
});
