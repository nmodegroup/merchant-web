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
const { isEmpty, initValue, createEmptyObjArray, getFileName } = require('../../utils/global');
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
    sourceHost: ENV.sourceHost,
    isTotal: false, // false：提交基本信息，true：提交店铺信息
    verifyed: false, // 校验结果
    shopName: '', // 门店名称
    selectCity: '', // 省市区
    cityName: '',
    areaName: '',
    cityId: '',
    areaId: '',
    address: '', // 详细地址
    shopPhone: '', // 门店电话
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
    covers: [], // 商铺封面图信息
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
    // 初始化图片默认空数组
    this.initDefaultImages();
    // 输入防抖
    this.setupDebounce();
    // 请求省市区
    this.requestCityList();
    // 店铺信息
    this.requestMerchantInfo();
    // 初始化 pageConfig
    PageHelper.setupPageConfig(this);
  },

  initDefaultImages() {
    this.fillCovers = [];
    this.defaultCovers = createEmptyObjArray(3);
    this.defaultBartenders = createEmptyObjArray(5);
    this.setData({
      covers: this.defaultCovers,
      bartenders: this.defaultBartenders
    });
  },

  setupDebounce() {
    /* 输入防抖，func 为需要执行的函数，不传则默认 refreshFormVerify */
    this.inputDebounce = debounce(300, (func = this.refreshFormVerify) => {
      func();
    });
  },

  requestCityList() {
    commonService.getCityAll().then(res => {
      this.setData({
        areaList: res
      });
    });
  },

  requestMerchantInfo() {
    PageHelper.requestWrapper(shopService.getShopInfo())
      .then(res => {
        this.setData(
          {
            shopName: initValue(res.name),
            shopPhone: initValue(res.phone),
            cityId: initValue(res.cityId),
            areaId: initValue(res.areaId),
            cityName: initValue(res.cityName),
            areaName: initValue(res.areaName),
            selectCity: res.cityName ? `${res.cityName} ${res.areaName}` : '',
            address: initValue(res.address),
            selectShopType: this.getShopType(res.type),
            logo: initValue(res.logo),
            price: initValue(res.price),
            covers: isEmpty(res.covers) ? this.defaultCovers : Object.assign([], this.defaultCovers, res.covers),
            bartenders: isEmpty(res.bartenders) ? this.defaultBartenders : Object.assign([], this.defaultBartenders, res.bartenders),
            desc: initValue(res.desc)
          },
          () => {
            this.fillCovers = isEmpty(res.covers) ? [] : res.covers;
            this.defaultBartenders = this.data.bartenders;
            this.refreshFormVerify();
          }
        );
      })
      .catch(() => {
        // 加载出错退出
        PageHelper.showNetworkFailModal();
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
    this.setData({
      authPhoneSuccess: !!store.phone,
      enterType: options.enterType,
      isTotal: options.enterType === pageFlag.INFO_TOTAL
    });
  },

  getLocation() {
    PageHelper.requestWrapper(wxManager.getLocation())
      .then(res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      })
      .catch(e => {
        console.log(e);
        this.showLocationModal();
      });
  },

  /**
   * 定位授权弹窗
   */
  showLocationModal() {
    PageHelper.showLocationModal().then(() => {
      this.getLocation();
    });
  },

  handleInput(event) {
    const type = event.currentTarget.dataset.type;
    const value = event.detail.value;
    this.setData({
      [type]: value
    });
    this.inputDebounce();
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
    const { isTotal, price, desc } = this.data;
    if (isTotal) {
      return this.verifyFormBase() && !isEmpty(price) && !isEmpty(this.fillCovers) && this.checkBartenders() && !isEmpty(desc);
    }
    return this.verifyFormBase();
  },

  /**
   * 验证基础信息字段
   */
  verifyFormBase() {
    const { shopName, address, shopPhone, cityId, areaId, selectShopType, logo } = this.data;
    return (
      !isEmpty(shopName) &&
      !isEmpty(address) &&
      !isEmpty(shopPhone) &&
      !isEmpty(cityId) &&
      !isEmpty(areaId) &&
      Object.keys(selectShopType).length &&
      !isEmpty(logo)
    );
  },

  checkBartenders() {
    return !isEmpty(this.getFillBartenders());
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
    const strategy = {
      city: () => this.setVisible('visibleCity'),
      shopType: () => this.setVisible('visibleShopType'),
      logo: () => this.chooseImage()
    };
    strategy[type]();
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
        logo: res
      });
      this.refreshFormVerify();
    });
  },

  queryUploadParams(imagePath, floder) {
    return {
      filePath: imagePath,
      formData: {
        fileName: getFileName(imagePath),
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

  /**
   * 更新封面图数组
   */
  updateCovers() {
    const newCovers = Object.assign([], this.defaultCovers, this.fillCovers);
    this.setData({
      covers: newCovers
    });
    this.refreshFormVerify();
  },

  /**
   * 选择封面图片
   */
  handleChooseCover() {
    wxManager.chooseImage().then(res => {
      this.uploadImage(res.tempFilePaths[0], Folder.FILE_FOLDER_COVER).then(result => {
        this.fillCovers.push({
          img: result
        });
        this.updateCovers();
      });
    });
  },

  /**
   * 通用上传
   * @param {string} imageUrl 图片地址
   * @param {string} folder   存储的文件夹路径
   */
  uploadImage(imageUrl, folder) {
    return new Promise(resolve => {
      const uploadParams = this.queryUploadParams(imageUrl, folder);
      PageHelper.requestWrapper(commonService.uploadImage(uploadParams)).then(res => {
        resolve(res);
      });
    });
  },

  /**
   * 编辑封面
   */
  handleEditCover(event) {
    console.log(event);
    const { index } = event.currentTarget.dataset;
    wxManager.chooseImage().then(res => {
      this.uploadImage(res.tempFilePaths[0], Folder.FILE_FOLDER_COVER).then(result => {
        this.fillCovers[index].img = result;
        this.updateCovers();
      });
    });
  },

  /**
   * 删除封面
   */
  handleDeleteCover(event) {
    console.log(event);
    const { index } = event.currentTarget.dataset;
    this.fillCovers.splice(index, index + 1);
    this.updateCovers();
  },

  /**
   * 更新调酒师数组
   */
  updateBartenders() {
    this.setData({
      bartenders: this.defaultBartenders
    });
    this.refreshFormVerify();
  },

  /**
   * 选择调酒师宣传照
   */
  handleChooseBartenderImage(event) {
    const { index } = event.currentTarget.dataset;
    this.uploadBartenderImage(index);
  },

  /**
   * 上传调酒师宣传照
   */
  uploadBartenderImage(index) {
    wxManager.chooseImage().then(res => {
      this.uploadImage(res.tempFilePaths[0], Folder.FILE_FOLDER_BARTENDER).then(result => {
        console.log('uploadBartenderImage', this.defaultBartenders);
        this.defaultBartenders[index].img = result;
        this.updateBartenders();
      });
    });
  },

  /**
   * 编辑调酒师宣传照片
   */
  handleEditBartender(event) {
    const { index } = event.currentTarget.dataset;
    this.uploadBartenderImage(index);
  },

  /**
   * 删除调酒师信息
   */
  handleDeleteBartender(event) {
    const { index } = event.currentTarget.dataset;
    this.defaultBartenders[index] = {};
    this.updateBartenders();
  },

  /**
   * 调酒师信息输入
   */
  handleBartenderInput(event) {
    console.log('handleBartenderInput', event);
    const value = event.detail.value;
    const { type, index } = event.currentTarget.dataset;
    this.defaultBartenders[index][type] = value;
    this.inputDebounce(this.updateBartenders);
  },

  /**
   * 手机号授权回调
   */
  onGetPhoneCallback(event) {
    const { encryptedData, iv } = event.detail;
    if (encryptedData && iv) {
      this.requestParsePhone(encryptedData, iv);
    } else {
      PageHelper.showFailToast('授权失败');
    }
  },

  /**
   * 解析手机号
   */
  requestParsePhone(encryptedData, iv) {
    PageHelper.requestWrapper(wxManager.login())
      .then(code => {
        return {
          encrypted: encryptedData,
          iv: iv,
          code: code
        };
      })
      .then(params => {
        // 解析手机号
        PageHelper.requestWrapper(userService.parsePhone(params)).then(phone => {
          this.setData({
            authPhoneSuccess: true
          });
          // 将手机号存到全局
          store.phone = phone;
          this.commitForm();
        });
      });
  },

  handleSkip() {
    wxManager.switchTab(pageConstant.CENTER_URL);
  },

  commitForm() {
    if (!this.verifyForm()) {
      return false;
    }
    const { shopName, shopPhone, isTotal, latitude, longitude } = this.data;

    /* 校验门店名称 */
    if (!regular.regShopName(shopName) || regular.regAllNumber(shopName)) {
      return PageHelper.showToast('门店名称至少1个字符可包含中文\n字母数字但不能全为数字');
    }

    /* 完善店铺信息需要更多校验 */
    if (isTotal) {
      if (this.checkBartendersInfo()) {
        return PageHelper.showToast('调酒师信息填写不完整');
      }
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
   * 校验填写的完整性
   */
  checkBartendersInfo() {
    const incompleteBartenders = this.data.bartenders.filter(bartender => {
      // 过滤出未填写完整的调酒师信息
      return !this.isNotFill(bartender) && !this.isAllFill(bartender);
    });
    return !isEmpty(incompleteBartenders);
  },

  isNotFill(bartender) {
    return isEmpty(bartender.img) && isEmpty(bartender.desc) && isEmpty(bartender.cnName) && isEmpty(bartender.enName);
  },

  isAllFill(bartender) {
    return !isEmpty(bartender.img) && !isEmpty(bartender.desc) && !isEmpty(bartender.cnName) && !isEmpty(bartender.enName);
  },

  getFillBartenders() {
    return this.data.bartenders.filter(bartender => {
      return bartender.img && bartender.desc && bartender.cnName && bartender.enName;
    });
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
    const params = { ...this.queryParams(), ...this.queryTotalParams() };
    PageHelper.requestWrapper(shopService.saveShopInfo(params)).then(res => {
      PageHelper.requestSuccessCallback('提交成功');
    });
  },

  queryTotalParams() {
    const { price, desc } = this.data;
    return {
      price: Number(price),
      covers: this.fillCovers,
      bartenders: this.filterBartenders(),
      desc: desc
    };
  },

  filterBartenders() {
    return this.getFillBartenders().map(bartender => {
      return {
        img: bartender.img,
        desc: bartender.desc,
        cnName: bartender.cnName,
        enName: bartender.enName
      };
    });
  }
});
