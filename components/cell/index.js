// components/cell/index.js
Component({
  externalClasses: ['cell-extra'],
  /**
   * 组件的属性列表
   */
  properties: {
    /* 标题 */
    title: {
      type: String,
      value: ''
    },
    /* 二级次要内容, 位于标题下方 */
    minor: {
      type: String,
      value: ''
    },
    /* 是否显示左侧图标 */
    showIcon: {
      type: Boolean,
      value: true
    },
    /* 单元格背景颜色 */
    bgColor: {
      type: String,
      value: '#15153E'
    },
    /* 是否显示右侧箭头图片 */
    showArrow: {
      type: Boolean,
      value: true
    },
    /* cell 类型， 用于判断显示图片 */
    type: {
      type: String,
      value: ''
    },
    /* 是否显示底部 border 边框 */
    showBorder: {
      type: Boolean,
      value: true
    },
    /* border 是否含有右间距 */
    borderRightPadding: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    iconUrl: ''
  },

  ready() {
    if (this.data.showIcon) {
      this.setIconPath();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setIconPath() {
      const type = this.data.type;
      const strategy = {
        businessTime: '../../image/center/center_business_time.svg',
        businessStatus: '../../image/center/center_business_status.svg',
        reserve: '../../image/center/center_reserve.svg',
        arrivalTime: '../../image/center/center_arrival_time.svg',
        order: '../../image/center/center_order.svg',
        remind: '../../image/center/center_order.svg',
        qrCode: '../../image/center/center_qr_code.svg',
        protocol: '../../image/center/center_about.svg',
        contact: '../../image/center/center_contact.svg',
        about: '../../image/center/center_about.svg'
      };
      this.setData({
        iconUrl: strategy[type] ? strategy[type] : console.error('not match any type')
      });
    },

    onCellClick() {
      const myEventDetail = { type: this.data.type }; // detail对象，提供给事件监听函数
      this.triggerEvent('cellClick', myEventDetail);
    }
  }
});
