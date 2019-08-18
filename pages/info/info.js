// pages/info/info.js
const wxManager = require('../../utils/wxManager');
const shopService = require('../../service/shop');
const commonService = require('../../service/common');
const pageConstant = require('../../constant/page');
const pageFlag = require('../../constant/pageFlag');
const { debounce } = require('../../utils/throttle-debounce/index');
const staticResource = require('./staticResource');
const regular = require('../../utils/regular');
const globalConstant = require('../../constant/global');
const { PageConfig } = require('../../utils/page');
const globalUtil = require('../../utils/global');
const store = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    enterType: pageFlag.INFO_TOTAL,
    verifyed: false, // 校验结果
    shopName: '', // 门店名称
    selectCity: '', // 省市区
    cityName: '',
    areaName: '',
    cityId: '',
    areaId: '',
    address: '', // 详细地址
    shopPhone: '', // 门店电话
    logo: '', // logo url
    visibleCity: false, // 选择城市 popup
    visibleShopType: false, // 店铺类型 popup
    latitude: '', // 纬度
    longitude: '', // 经度
    selectShopType: {}, // 选中的门店类型
    columns: staticResource.TYPE_LIST, // 门店类型数组
    areaList: [] // 省市区列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
    this.getLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  initData() {
    // 初始化 toast
    this.Toast = this.selectComponent('#toast');
    // 初始化店铺类型数据
    this.typeColumnList = [{}];
    // 输入防抖
    this.inputDebounce = debounce(300, event => {
      this.refreshFormVerify();
    });
    // 请求省市区
    this.requestCityList();
    // 初始化 pageConfig
    this.setupPageConfig();
  },

  requestCityList() {
    commonService.getCityAll().then(res => {
      this.setData({
        areaList: res
      });
    });
  },

  setupPageConfig() {
    this.pageConfig = new PageConfig(this);
  },

  getLocation() {
    wxManager
      .getLocation()
      .then(res => {
        console.log('location', res);
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      })
      .catch(e => {
        console.log(e);
        // TODO: 开启定位弹窗
      });
  },

  handleInput(event) {
    console.log(event);
    const type = event.currentTarget.dataset.type;
    const value = event.detail.value;
    this.setData({
      [type]: value
    });
    this.inputDebounce(event);
    console.log('handleInput');
  },

  /**
   * 刷新表单验证状态
   */
  refreshFormVerify() {
    this.setData({
      verifyed: this.verifyForm()
    });
  },

  /**
   * 验证表单
   */
  verifyForm() {
    const { shopName, address, shopPhone, cityId, areaId, selectShopType, logo } = this.data;
    console.log('data:', this.data);
    return shopName && address && shopPhone && cityId && areaId && Object.keys(selectShopType).length && logo;
  },

  showToast(content) {
    this.Toast.showToast({
      content: content
    });
  },

  onConfirm(event) {
    const { value } = event.detail;
    this.setData({
      selectShopType: value,
      visibleShopType: false
    });
    this.refreshFormVerify();
  },

  onCancel() {
    this.setData({
      visibleShopType: false
    });
  },

  /**
   * 点击 cell 事件
   */
  handleCellClick(event) {
    console.log(event);
    const { type } = event.currentTarget.dataset;
    switch (type) {
      case 'city':
        this.setVisible('visibleCity');
        break;
      case 'shopType':
        this.setVisible('visibleShopType');
        break;
      case 'logo':
        this.chooseImage();
        break;
      default:
        break;
    }
  },

  setVisible(target) {
    this.setData({
      [target]: true
    });
  },

  chooseImage() {
    wxManager
      .chooseImage()
      .then(res => {
        console.log(res);
        const tempFilePaths = res.tempFilePaths;
        // TODO:  图片需先上传，再展示
        this.requestUploadImage(tempFilePaths[0]);
        this.setData({
          logo: tempFilePaths[0]
        });
        this.refreshFormVerify();
      })
      .catch(e => {
        console.error(e);
      });
  },

  requestUploadImage(imageUrl) {
    const uploadParams = {
      filePath: imageUrl,
      name: globalUtil.getFileName(imageUrl),
      formData: {
        floder: globalConstant.FILE_FOLDER_LOGO
      }
    };
    console.log('uploadParams:', uploadParams);
    this.pageConfig.requestWrapper(commonService.uploadImage(uploadParams)).then(res => {
      console.log('uploadImage:', res);
    });
  },

  /**
   * 选择省市区确认
   */
  onCityConfirm(event) {
    console.log(event);
    const selectValues = event.detail.values;
    this.setData({
      visibleCity: false,
      selectCity: `${selectValues[0].name} ${selectValues[1].name} ${selectValues[2].name}`,
      cityName: selectValues[1].name,
      cityId: selectValues[1].code,
      areaName: selectValues[2].name,
      areaId: selectValues[2].code
    });
    this.refreshFormVerify();
  },

  /**
   * 选择省市区取消
   */
  onCityCancel() {
    this.setData({
      visibleCity: false
    });
  },

  commitForm() {
    if (!this.verifyForm()) {
      return false;
    }
    const { shopName, shopPhone } = this.data;

    /* 校验门店名称 */
    if (!regular.regCharChineseNumber(shopName) || regular.regAllNumber(shopName)) {
      return this.showToast('门店名称至少1个字符可包含中文', '字母数字但不能全为数字');
    }

    /* 校验手机号 */
    if (!regular.regPhoneNumber(shopPhone) || !regular.regStablePhone(shopPhone)) {
      return this.showToast('请输入正确的电话号码');
    }
    this.requestCommitInfo();
  },

  requestCommitInfo() {
    const params = this.queryParams();
    shopService
      .saveShopBasicInfo(params)
      .then(res => {})
      .catch(e => {});
  },

  queryParams() {
    const { shopName, shopPhone, cityId, cityName, areaId, areaName, address, selectShopType, logo, latitude, longitude } = this.data;
    return {
      name: shopName,
      cityId: cityId,
      areaId: areaId,
      cityName: cityName,
      areaName: areaName,
      address: address,
      type: selectShopType.type,
      phone: shopPhone,
      logo: logo,
      lng: longitude,
      lat: latitude
    };
  },

  handleSkip() {
    wxManager.switchTab(pageConstant.CENTER_URL);
  }
});
