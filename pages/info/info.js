// pages/info/info.js
const wxManager = require('../../utils/wxManager');
const shopService = require('../../service/shop');
const commonService = require('../../service/common');
const userService = require('../../service/user');
const pageConstant = require('../../constant/page');
const pageFlag = require('../../constant/pageFlag');
const { debounce } = require('../../utils/throttle-debounce/index');
const staticResource = require('./staticResource');
const regular = require('../../utils/regular');
const { Folder } = require('../../constant/global');
const { PageHelper } = require('../../utils/page');
const globalUtil = require('../../utils/global');
const ENV = require('../../lib/request/env');
const store = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    enterType: pageFlag.INFO_TOTAL,
    showBack: false,
    showSkip: false,
    verifyed: false, // 校验结果
    shopName: '', // 门店名称
    selectCity: '', // 省市区
    cityName: '',
    areaName: '',
    cityId: '',
    areaId: '',
    address: '', // 详细地址
    shopPhone: '', // 门店电话
    logoDisplay: '', // logo url
    logo: '', // 传回给后端的不完整图片路径
    visibleCity: false, // 选择城市 popup
    visibleShopType: false, // 店铺类型 popup
    latitude: '', // 纬度
    longitude: '', // 经度
    selectShopType: {}, // 选中的门店类型
    columns: staticResource.TYPE_LIST, // 门店类型数组
    areaList: [], // 省市区列表
    authPhoneSuccess: false // 授权手机号状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
    this.getLocation();
    this.setupState(options);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  initData() {
    // 初始化店铺类型数据
    this.typeColumnList = [{}];
    // 输入防抖
    this.inputDebounce = debounce(300, event => {
      this.refreshFormVerify();
    });
    // 请求省市区
    this.requestCityList();
    // 初始化 pageConfig
    PageHelper.setupPageConfig(this);
  },

  requestCityList() {
    commonService.getCityAll().then(res => {
      this.setData({
        areaList: res
      });
    });
  },

  setupState(options) {
    console.log(options);
    this.setData({
      authPhoneSuccess: !!store.phone,
      enterType: options.enterType,
      showBack: options.enterType === pageFlag.INFO_TOTAL,
      showSkip: options.enterType === pageFlag.INFO_BASE
    });
  },

  getLocation() {
    wxManager.showLoading();
    wxManager
      .getLocation()
      .then(res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        wxManager.hideLoading();
      })
      .catch(e => {
        console.log(e);
        this.showLocationModal();
        wxManager.hideLoading();
      });
  },

  showLocationModal() {
    this.modal.showModal({
      content: '授权定位功能失败，\n可打开设置页面进行手动授权',
      title: '温馨提示',
      cancelText: '取消',
      confirmText: '去授权',
      hideCancel: false
    });
  },

  onLocationClick(event) {
    // 点击了去授权
    if (PageHelper.isModalConfirm(event.detail.result)) {
      wxManager.openSetting().then(res => {
        console.log(res);
        if (res.authSetting['scope.userLocation']) {
          console.log('start get location');
          this.getLocation();
        }
      });
    }
  },

  handleInput(event) {
    const type = event.currentTarget.dataset.type;
    const value = event.detail.value;
    this.setData({
      [type]: value
    });
    this.inputDebounce(event);
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
        const tempFilePaths = res.tempFilePaths;
        this.requestUploadLogoImage(tempFilePaths[0]);
      })
      .catch(e => {
        console.error(e);
      });
  },

  requestUploadLogoImage(imageUrl) {
    const uploadParams = this.queryUploadParams(imageUrl, Folder.FILE_FOLDER_LOGO);
    PageHelper.requestWrapper(commonService.uploadImage(uploadParams)).then(res => {
      this.setData({
        logoDisplay: `${ENV.sourceHost}${res}`,
        logo: res
      });
      this.refreshFormVerify();
    });
  },

  queryUploadParams(imagePath, floder) {
    return {
      filePath: imagePath,
      formData: {
        fileName: globalUtil.getFileName(imagePath),
        floder: floder
      }
    };
  },

  /**
   * 选择省市区确认
   */
  onCityConfirm(event) {
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
    const { shopName, shopPhone, enterType, latitude, longitude } = this.data;

    /* 校验门店名称 */
    if (!regular.regCharChineseNumber(shopName) || regular.regAllNumber(shopName)) {
      return this.showToast('门店名称至少1个字符可包含中文', '字母数字但不能全为数字');
    }

    /* 校验手机号 */
    if (!regular.regPhoneNumber(shopPhone) || !regular.regStablePhone(shopPhone)) {
      return this.showToast('请输入正确的电话号码');
    }

    /* 完善店铺信息需要更多校验 */
    if (enterType === pageFlag.INFO_TOTAL) {
    }

    /* 地址位置授权校验 */
    if (!latitude || !longitude) {
      return this.showLocationModal();
    }

    this.requestCommitInfo();
  },

  requestCommitInfo() {
    const params = this.queryParams();
    PageHelper.requestWrapper(shopService.saveShopBasicInfo(params)).then(res => {
      PageHelper.showSuccessToast('提交成功');
      setTimeout(() => {
        wxManager.switchTab(pageConstant.CENTER_URL);
      }, 1000);
    });
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

  /**
   * 手机号授权回调
   */
  onGetPhoneCallback(event) {
    console.log(event);
    const { encryptedData, iv } = event.detail;
    if (encryptedData && iv) {
      this.requestParsePhone(encryptedData, iv);
    }
  },

  /**
   * 解析手机号
   */
  requestParsePhone(encryptedData, iv) {
    wxManager.showLoading();
    wxManager.login().then(
      code => {
        // 解析手机号
        userService
          .parsePhone({
            encrypted: encryptedData,
            iv: iv,
            code: code
          })
          .then(
            phone => {
              wxManager.hideLoading();
              this.setData({
                authPhoneSuccess: true
              });
              // 将手机号存到全局
              store.phone = phone;
            },
            e => {
              wxManager.hideLoading();
            }
          );
      },
      e => {
        wxManager.hideLoading();
      }
    );
  },

  handleSkip() {
    wxManager.switchTab(pageConstant.CENTER_URL);
  }
});
