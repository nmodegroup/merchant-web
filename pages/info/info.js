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
const globalUtil = require('../../utils/global');
const ENV = require('../../lib/request/env');
const { PageConfig } = require('../../utils/page');
const PageHelper = new PageConfig();
const store = getApp().globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    enterType: pageFlag.INFO_TOTAL,
    isTotal: false,
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
    authPhoneSuccess: false, // 授权手机号状态
    price: '', // 人均消费
    covers: [
      {
        img: 'http://tmp/wxf07f687748208034.o6zAJs82uM9ZFMFQQBbRfju6jjfA.AmsFsiUncqyq69cbb191405df62d1a8dbce48c8b4382.jpeg'
      },
      2
    ], // 商铺封面图信息
    bartenders: [], // 商铺调酒师信息
    desc: '' // 店铺简介
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
    // 店铺信息
    this.requestMerchantInfo();
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

  requestMerchantInfo() {
    PageHelper.requestWrapper(shopService.getShopInfo()).then(res => {
      console.log(res);
      this.setData(
        {
          shopName: res.name || '',
          shopPhone: res.phone || '',
          cityId: res.cityId || '',
          areaId: res.areaId || '',
          cityName: res.cityName || '',
          areaName: res.areaName || '',
          selectCity: res.cityName ? `${res.cityName} ${res.areaName}` : '',
          address: res.address || '',
          selectShopType: this.getShopType(res.type),
          logo: res.logo || '',
          logoDisplay: res.logo ? `${ENV.sourceHost}${res.logo}` : '',
          price: res.price || '',
          // covers: res.covers || [],
          bartenders: res.bartenders || [],
          desc: res.desc || ''
        },
        () => {
          this.refreshFormVerify();
        }
      );
    });
  },

  getShopType(type) {
    const typeList = staticResource.TYPE_LIST.map(item => {
      return item.type;
    });
    if (!typeList.includes(type)) {
      return {};
    }
    return staticResource.TYPE_LIST.filter(item => {
      return type === item.type;
    })[0];
  },

  setupState(options) {
    console.log(options);
    this.setData({
      authPhoneSuccess: !!store.phone,
      enterType: options.enterType,
      isTotal: options.enterType === pageFlag.INFO_TOTAL
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
    if (PageHelper.isModalConfirm(event)) {
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
    const { isTotal, price, covers } = this.data;
    if (isTotal) {
      return this.verifyFormBase() && price && covers.length && bartenders.length && desc;
    }
    return this.verifyFormBase();
  },

  /**
   * 验证基础信息字段
   */
  verifyFormBase() {
    const { shopName, address, shopPhone, cityId, areaId, selectShopType, logo } = this.data;
    return shopName && address && shopPhone && cityId && areaId && Object.keys(selectShopType).length && logo;
  },

  onConfirm(event) {
    console.log(event);
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
    const { shopName, shopPhone, isTotal, latitude, longitude } = this.data;

    /* 校验门店名称 */
    if (!regular.regCharChineseNumber(shopName) || regular.regAllNumber(shopName)) {
      return PageHelper.showToast('门店名称至少1个字符可包含中文', '字母数字但不能全为数字');
    }

    /* 校验手机号 */
    if (!regular.regPhoneNumber(shopPhone) || !regular.regStablePhone(shopPhone)) {
      return PageHelper.showToast('请输入正确的电话号码');
    }

    /* 完善店铺信息需要更多校验 */
    if (isTotal) {
    }

    /* 地址位置授权校验 */
    if (!latitude || !longitude) {
      return this.showLocationModal();
    }

    if (isTotal) {
      this.requestSaveInfo();
    } else {
      this.requestCommitInfo();
    }
  },

  /**
   * 基础信息提交
   */
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
   * 保存店铺信息
   */
  requestSaveInfo() {
    const params = this.queryTotalParams();
    PageHelper.requestWrapper(shopService.saveShopInfo(params)).then(res => {
      PageHelper.showSuccessToast('提交成功');
      setTimeout(() => {
        wxManager.navigateBack();
      }, 1000);
    });
  },

  queryTotalParams() {
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

  handleChooseCover() {
    wxManager.chooseImage().then(res => {
      console.log(res);
    });
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
              // TODO: 获取手机号后直接请求
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
