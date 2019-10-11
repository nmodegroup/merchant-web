const activityService = require('../../../service/activity');
const commonService = require('../../../service/common');
const { isEdit, initValue, isEmpty, getFileName } = require('../../../utils/global');
const dateUtil = require('../../../utils/date');
const regular = require('../../../utils/regular');
const wxManager = require('../../../utils/wxManager');
const { debounce } = require('../../../utils/throttle-debounce/index');
const { QuotaType } = require('../../../constant/global');
const { Folder } = require('../../../constant/global');
const ENV = require('../../../lib/request/env');
const { quotaList } = require('./data');
const { PageConfig } = require('../../../utils/page');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    minDate: Date.now(),
    currentDate: Date.now(),
    quotaList: quotaList,
    isEdit: false, // 是否编辑状态
    theme: '', // 活动主题
    beginTime: '', // 活动开始时间
    endTime: '', // 活动结束时间
    cityId: '', // 城市 id
    areaId: '', // 区域 id
    cityName: '', // 所在城市名称
    areaName: '', // 所在区域名称
    address: '', // 详细地址
    phone: '', // 联系电话
    guest: '', // 嘉宾信息
    quotaType: '', // 限制预订数量类型（0不限 1按系统已有桌位限制 2按固定名额限制）
    quota: '', // 预订限额数量
    banner: '', // 活动宣传 banner 图 url
    post: '', // 活动海报 url
    displayBanner: '', // 活动宣传 banner 图完整 url
    displayPost: '', // 活动海报完整展示 url
    verifyed: false, // 表单是否校验通过
    visibleStartTime: false, // 开始时间选择
    visibleEndTime: false, // 结束时间选择
    visibleArea: false, // 省市区选择
    areaList: [], // 省市区列表
    selectArea: '', // 选择的区域
    selectTime: '', // 选择的时间
    longitude: '', // 经度
    latitude: '' // 纬度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(options);
    console.log('now', Date.now());
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  initData(options) {
    const activityId = options.activityId;
    this.setData({
      isEdit: isEdit(activityId),
      activityId: initValue(activityId),
      title: isEdit(activityId) ? '编辑活动' : '创建活动'
    });
    PageHelper.setupPageConfig(this);
    this.initDebounce();
    this.requestActivityInfo();
    this.requestCityList();
  },

  initDebounce() {
    // 输入防抖
    this.inputDebounce = debounce(300, () => {
      this.refreshFormVerify();
    });
  },

  requestCityList() {
    commonService.getCityAll().then(res => {
      this.setData({
        areaList: res
      });
    });
  },

  /**
   * 活动详情
   */
  requestActivityInfo() {
    const activityId = this.data.activityId;
    if (isEmpty(activityId)) {
      return false;
    }
    const params = {
      id: activityId
    };
    PageHelper.requestWrapper(activityService.getActivityDetail(params))
      .then(res => {
        this.setData({
          ...res,
          longitude: res.lng,
          latitude: res.lat,
          selectArea: isEmpty(res.cityName) ? '' : `${res.cityName} ${res.areaName}`,
          displayBanner: isEmpty(res.banner) ? '' : `${ENV.sourceHost}${res.banner}`,
          displayPost: isEmpty(res.post) ? '' : `${ENV.sourceHost}${res.post}`
        });
      })
      .catch(() => {
        // 加载出错退出
        PageHelper.showNetworkFailModal();
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
   * 选择活动开始时间
   */
  onStartInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },

  /**
   * 选择活动结束时间
   */
  onEndInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },

  /**
   * 点击 cell 事件，（时间、地区）
   */
  handleCellClick(event) {
    const { type } = event.currentTarget.dataset;
    const strategy = {
      beginTime: () => this.setVisible('visibleStartTime'),
      endTime: () => this.setVisible('visibleEndTime'),
      area: () => this.setVisible('visibleArea'),
      address: () => this.chooseLocation()
    };
    strategy[type]();
  },

  setVisible(visibleType) {
    this.setData({
      [visibleType]: true
    });
  },

  setUnvisible(unvisibleType) {
    this.setData({
      [unvisibleType]: false
    });
  },

  /**
   * 打开地图选择位置
   */
  chooseLocation() {
    wxManager
      .chooseLocation()
      .then(location => {
        const { address, latitude, longitude } = location;
        this.setData({
          address: address.split(',')[0], // 如果有逗号分隔截取前半部分
          latitude: latitude,
          longitude: longitude
        });
      })
      .catch(err => {
        this.showLocationModal();
      });
  },

  showLocationModal() {
    PageHelper.showLocationModal().then(() => {
      this.chooseLocation();
    });
  },

  /**
   * 时间确认
   */
  onTimeConfirm(event) {
    const { type } = event.currentTarget.dataset;
    const { beginTime, endTime } = this.data;
    const selectTime = dateUtil.formatDateNoSeconds(event.detail);
    if (type === 'beginTime' && endTime && selectTime > endTime) {
      return PageHelper.showToast('开始时间不能大于结束时间');
    }
    if (type === 'endTime' && beginTime && selectTime < beginTime) {
      return PageHelper.showToast('结束时间不能小于开始时间');
    }

    this.setData({
      [type]: selectTime,
      visibleStartTime: false,
      visibleEndTime: false
    });
    this.refreshFormVerify();
  },

  /**
   * 时间取消
   */
  onTimeCancel(event) {
    const { type } = event.currentTarget.dataset;
    const strategy = {
      beginTime: () => this.setUnvisible('visibleStartTime'),
      endTime: () => this.setUnvisible('visibleEndTime')
    };
    strategy[type]();
  },

  /**
   * 选择省市区确认
   */
  onCityConfirm(event) {
    const selectValues = event.detail.values;
    this.setData({
      visibleArea: false,
      selectArea: `${selectValues[0].name} ${selectValues[1].name} ${selectValues[2].name}`,
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
      visibleArea: false
    });
  },

  /**
   * 限制预订切换
   */
  onRadioChange(event) {
    console.log(event);
    this.setData({
      quotaType: parseInt(event.detail)
    });
    this.refreshFormVerify();
  },

  /**
   * 选择宣传 banner
   */
  handleChooseBanner() {
    wxManager.chooseImage().then(res => {
      this.uploadImage(res.tempFilePaths[0], Folder.FILE_FOLDER_ACTIVITY_BANNER).then(res => {
        this.setData({
          banner: res,
          displayBanner: `${ENV.sourceHost}${res}`
        });
        this.refreshFormVerify();
      });
    });
  },

  /**
   * 选择海报
   */
  handleChoosePoster() {
    wxManager.chooseImage().then(res => {
      this.uploadImage(res.tempFilePaths[0], Folder.FILE_FOLDER_ACTIVITY_BANNER).then(res => {
        this.setData({
          post: res,
          displayPost: `${ENV.sourceHost}${res}`
        });
        this.refreshFormVerify();
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
   * 校验输入字段，刷新校验状态
   */
  refreshFormVerify() {
    this.setData({
      verifyed: this.verifyedFrom()
    });
  },

  verifyedFrom() {
    const { theme, beginTime, endTime, cityId, address, phone, guest, quotaType, banner, post } = this.data;
    return (
      !isEmpty(theme) &&
      !isEmpty(beginTime) &&
      !isEmpty(endTime) &&
      !isEmpty(cityId) &&
      !isEmpty(address) &&
      !isEmpty(phone) &&
      !isEmpty(guest) &&
      !isEmpty(quotaType) &&
      !isEmpty(banner) &&
      !isEmpty(post)
    );
  },

  /**
   * 编辑、删除活动
   */
  handleEditActivity(event) {
    const type = event.detail.type;
    if (type === 'right') {
      this.deleteActivity();
    } else {
      this.commitForm();
    }
  },

  /**
   * 删除活动
   */
  deleteActivity() {
    PageHelper.showDeleteModal('确定要删除活动吗？ \n删除后不可恢复！').then(() => {
      this.requestDeleteActivity();
    });
  },

  requestDeleteActivity() {
    const params = {
      id: this.data.activityId
    };
    PageHelper.requestWrapper(activityService.deleteActivy(params)).then(() => {
      PageHelper.requestSuccessCallback('活动删除成功');
    });
  },

  /**
   * 提交表单
   */
  commitForm() {
    const { theme, phone, quotaType, quota, longitude, latitude } = this.data;
    if (!this.verifyedFrom()) {
      return false;
    }

    /* 校验门店名称 */
    if (theme.length === 0 || theme.length > 15 || regular.regAllNumber(theme)) {
      return PageHelper.showToast('活动主题1-15个字符可包含中文\n字母数字但不能全为数字');
    }

    /* 按固定名额限制需要填写限额数量 */
    if (quotaType === QuotaType.FIXED_LIMIT && isEmpty(quota)) {
      return PageHelper.showToast('请输入预订限额数量');
    }

    /* 地址位置授权校验 */
    if (!latitude || !longitude) {
      return this.showLocationModal();
    }

    this.requestCommitActivityInfo();
  },

  requestCommitActivityInfo() {
    const { isEdit, activityId } = this.data;
    const params = this.queryFormParams();
    if (isEdit) {
      params.id = activityId;
    }
    PageHelper.requestWrapper(activityService.createOrEditActivy(params)).then(() => {
      PageHelper.requestSuccessCallback(isEdit ? '活动编辑成功' : '创建成功\n您的活动信息需要平台审核\n请耐心等待');
    });
  },

  queryFormParams() {
    const {
      theme,
      beginTime,
      endTime,
      cityId,
      areaId,
      cityName,
      areaName,
      address,
      phone,
      guest,
      quotaType,
      quota,
      banner,
      post,
      latitude,
      longitude
    } = this.data;
    return {
      theme,
      beginTime,
      endTime,
      cityId,
      areaId,
      cityName,
      areaName,
      address,
      phone,
      guest,
      quotaType,
      quota,
      banner,
      post,
      lng: longitude,
      lat: latitude
    };
  }
});
