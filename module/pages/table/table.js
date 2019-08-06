// module/pages/table/table.js
const pageConstant = require('../../../constant/page');
const wxManager = require('../../../utils/wxManager');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    areaList: [
      {
        id: 1,
        name: '大厅',
        tables: [
          {
            id: 1,
            name: '晚间',
            num: 4
          },
          {
            id: 1,
            name: '晚间',
            num: 4
          },
          {
            id: 1,
            name: '晚间',
            num: 4
          },
          {
            id: 1,
            name: '晚间',
            num: 4
          },
          {
            id: 1,
            name: '晚间',
            num: 4
          },
          {
            id: 1,
            name: '晚间',
            num: 4
          },
          {
            id: 1,
            name: '晚间',
            num: 4
          },
          {
            id: 1,
            name: '晚间',
            num: 4
          },
          {
            id: 1,
            name: '晚间',
            num: 4
          },
          {
            id: 1,
            name: '晚间',
            num: 4
          }
        ]
      },
      {
        id: 2,
        name: '吧台',
        tables: []
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  handleActionClick(event) {
    console.log(event);
    const { type } = event.currentTarget.dataset;
    if (type === 'area') {
      wxManager.navigateTo(pageConstant.AREA_URL);
    } else {
      wxManager.navigateTo(pageConstant.TABLE_EDIT_URL);
    }
  }
});
