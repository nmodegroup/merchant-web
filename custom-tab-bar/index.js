Component({
  data: {
    show: true,
    selected: 0,
    color: '#7A7E83',
    selectedColor: '#3cc51f',
    list: [
      {
        pagePath: '/pages/home/home',
        iconPath: '/image/global/icon_tab_home.png',
        selectedIconPath: '/image/global/icon_tab_home_HL.png'
      },
      {
        pagePath: '/pages/activity/activity',
        iconPath: '/image/global/icon_tab_activity.png',
        selectedIconPath: '/image/global/icon_tab_activity_HL.png'
      },
      {
        pagePath: '/pages/center/center',
        iconPath: '/image/global/icon_tab_mine.png',
        selectedIconPath: '/image/global/icon_tab_mine_HL.png'
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
      this.setData({
        selected: data.index
      });
    }
  }
});
