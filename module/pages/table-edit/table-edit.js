// module/pages/table-edit/table-edit.js
const tableService = require('../../../service/table');
const { regAllNumber } = require('../../../utils/regular');
const { PageConfig } = require('../../../utils/page');
const { isEmpty } = require('../../../utils/global');
const { debounce } = require('../../../utils/throttle-debounce/index');
const PageHelper = new PageConfig();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false,
    columnList: [],
    numList: [],
    numStrList: [],
    codeList: [],
    areaList: [],
    visibleArea: false,
    selectArea: {},
    areaName: '请选择区域', // 区域名
    areaId: '', // 区域id
    tableName: '', // 桌位名
    tableId: '', // 桌位id
    tableNum: '', // 桌位人数
    verifyed: false, // 新建是否可点击,
    createWay: "sigin", // 新增桌位方式 sigin, multiple
    numType: 1, // 编号方式
    beginNum: "", // 开始编号 
    endNum: "", // 结束编号
    prefix: "", // 组合前缀
    methodsInfo: {
      startNum: "",
      endNum: "",
      startStr: "",
      endStr: "",
      str: "",
      startStrNum: "",
      endStrNum: "",
    },
    titleWay: "",
    bindWay: "",
    spaceWay: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(options);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  initData(options) {
    // init PageHelper
    PageHelper.setupPageConfig(this);
    this.setupDebounce();
    // 请求区域列表
    this.requestAreaList();
    const { areaName, areaId, tableName, tableId, tableNum } = options;
    const isEdit = !!areaId;
    const getValue = PageHelper.getValue;
    this.setData({
      isEdit: isEdit,
      selectArea: this.resolveSelectArea(areaId, areaName),
      tableName: getValue(tableName),
      tableId: getValue(tableId),
      tableNum: getValue(tableNum),
      title: isEdit ? '编辑桌位' : '新增桌位'
    });
    const numList = [];
    const numStrList = [];
    for (let i = 1; i < 100; i++) {
      numList.push(i)
      if (i <= 9) {
        numStrList.push(`0${i}`)
      } else {
        numStrList.push(i)
      }
    }
    const codeList = [];
    for (let i = 0; i <= 25; i++) {
      codeList.push(String.fromCharCode((65 + i)));
    }
    this.setData({ numList, codeList, numStrList })
  },
  handleSelectCreate(e){
    const type = e.currentTarget.id;
    this.setData({ createWay: type })
  },
  handleSelectWay(e){
    const type = Number(e.currentTarget.id);
    this.setData({ numType: type })
  },
  handleSelectNum(e){
    const type = e.currentTarget.dataset.type;
    const id = Number(e.currentTarget.dataset.id);
    const space =e.currentTarget.dataset.space;
    let columnList = [];
    let titleWay = "";
    if (type === "num") {
      // 暂时注释后期可能会放出来
      // if (id === 3) {
      //   columnList = this.data.numStrList;
      // } else {
        columnList = this.data.numList;
      // }
      titleWay = "选择数字";
    } else if (type === "code") {
      columnList = this.data.codeList;
      titleWay = "选择字母";
    } 
    this.setData({ columnList, visibleArea: true, bindWay: id, spaceWay: space, titleWay})
  },
  setupDebounce() {
    /* 输入防抖，func 为需要执行的函数，不传则默认 refreshFormVerify */
    this.inputDebounce = debounce(300, (func = this.refreshFormVerify) => {
      func();
    });
  },

  resolveSelectArea(areaId, areaName) {
    if (!areaId) {
      return {};
    }
    return {
      id: areaId,
      name: areaName
    };
  },

  requestAreaList() {
    PageHelper.requestWrapper(tableService.getTableAreaList()).then(res => {
      this.setData({
        areaList: res,
        columnList: res
      });
    });
  },

  /**
   * 刷新表单验证状态
   */
  refreshFormVerify() {
    this.setData({
      verifyed: this.verifyForm()
    });
  },

  verifyForm() {
    const { selectArea, tableName, tableNum, createWay, numType, methodsInfo, isEdit } = this.data;
    let commonIsEmpty = !isEmpty(selectArea.name) && !isEmpty(tableNum);
    let multipleTableName = false;
    if (createWay === "sigin" || isEdit)
      return commonIsEmpty && !isEmpty(tableName) ;
    if (!isEdit) {
      if (numType === 1) {
        multipleTableName = !isEmpty(methodsInfo.startNum)
          && !isEmpty(methodsInfo.endNum)
      } else if (numType === 2) {
        multipleTableName = !isEmpty(methodsInfo.startStr)
          && !isEmpty(methodsInfo.endStr)
      } else if (numType === 3) {
        multipleTableName = !isEmpty(methodsInfo.str)
          && !isEmpty(methodsInfo.startStrNum)
          && !isEmpty(methodsInfo.endStrNum)
      }
      return commonIsEmpty && multipleTableName
    }
  },

  handleCreateTable(event) {
    this.resolveFormData();
  },

  handleEditTable(event) {
    const type = event.detail.type;
    if (type === 'right') {
      PageHelper.showDeleteModal('是否确认删除桌位').then(() => {
        this.deleteTable();
      });
    } else {
      this.resolveFormData();
    }
  },

  resolveFormData() {
    this.checkFormData()
      .then(result => {
        this.requestEditTable(result);
      })
      .catch(msg => {
        PageHelper.showToast(msg);
      });
  },

  /**
   * 校验表单
   */
  checkFormData() {
    const { selectArea, tableName, tableNum, prefix, numType, beginNum, endNum, createWay, isEdit } = this.data;
    return new Promise((resolve, reject) => {
      if (!this.verifyForm()) {
        return false;
      }
      if (!regAllNumber(tableNum)) {
        return reject('桌位人数填写不正确');
      }
      let result = {
        tableAreaId: selectArea.id,
        num: tableNum,
      }
      if (createWay === "sigin" || isEdit) {
        resolve(Object.assign(result, {name: tableName}));
      } else if (createWay === "multiple"){
        resolve(Object.assign(result, {
          numType,
          beginNum,
          endNum,
          prefix
        }))
      }
    });
  },

  requestEditTable(params) {
    const { isEdit, tableId, createWay } = this.data;
    if (isEdit) {
      params.id = tableId;
    }
    if (createWay === "sigin" || isEdit) {
      PageHelper.requestWrapper(tableService.createTable(params)).then(res => {
        PageHelper.requestSuccessCallback(isEdit ? '桌位编辑成功' : '桌位创建成功');
      });
    } else if (createWay === "multiple") {
      PageHelper.requestWrapper(tableService.createTables(params)).then(res => {
        PageHelper.requestSuccessCallback(isEdit ? '桌位编辑成功' : '桌位批量创建成功');
      });
    }
  },

  deleteTable() {
    const params = {
      id: this.data.tableId
    };
    PageHelper.requestWrapper(tableService.deleteTable(params)).then(res => {
      PageHelper.requestSuccessCallback('桌位删除成功');
    });
  },

  handleInput(event) {
    const type = event.currentTarget.dataset.type;
    const value = event.detail.value;
    if (type === 'name') {
      this.setData({
        tableName: value
      });
    } else {
      this.setData({
        tableNum: value
      });
    }
    this.refreshFormVerify();
  },

  handleCellClick() {
    this.setData({
      bindWay: "area",
      titleWay: "选择区域",
      columnList: this.data.areaList,
      visibleArea: true
    });
  },

  onConfirm(event) {
    const { value } = event.detail;
    let { bindWay, spaceWay, beginNum, prefix }  = this.data;
    let postEndNum = this.data.endNum;
    let { startNum, endNum, startStr, endStr, str, startStrNum, endStrNum} = this.data.methodsInfo;
   
    if (bindWay === "area") {
      this.setData({
        selectArea: value,
        visibleArea: false
      });
    } else {
      if (bindWay === 1) {
        if (spaceWay === "left") {
          startNum = value;
          beginNum = value;
        } else {
          endNum = value;
          postEndNum = value
        }
      } else if (bindWay === 2) {
        if (spaceWay === "left") {
          startStr = value;
          beginNum = value;
        } else {
          endStr = value;
          postEndNum = value
        }
      } else if (bindWay === 3) {
        if (spaceWay === "left") {
          str = value;
          prefix = value;
        } else if (spaceWay === "center") {
          startStrNum = value;
          beginNum = value;
        } else {
          endStrNum = value;
          postEndNum = value
        }
      } 
      this.setData({
        beginNum,
        endNum: postEndNum,
        prefix,
        methodsInfo: { startNum, endNum, startStr, endStr, str, startStrNum, endStrNum },
        visibleArea: false
      });
    }
    this.refreshFormVerify();
  },

  onCancel() {
    this.setData({
      visibleArea: false
    });
  }
});
