/**
 * 图片存放的文件夹
 */
export class Folder {
  static FILE_FOLDER_LOGO = 'merchant/logo'; // 店铺 logo 文件夹
  static FILE_FOLDER_COVER = 'merchant/cover'; // 店铺封面文件夹
  static FILE_FOLDER_BARTENDER = 'merchant/bartender'; // 调酒师个人宣传照文件夹
}

/**
 * 订单类型
 */
export class OrderType {
  static TODAY = 1; // 今日预定
  static FUTURE = 2; // 未来订单
  static HISTORY = 3; // 历史订单
}

/**
 * 店铺资料审核状态
 */
export class AuditStatus {
  static NOT_AUDIT = -1; // 未提交资料
  static AUDITING = 0; // 待审核
  static AUDIT_SUCCESS = 1; // 审核通过
  static AUDIT_FAIL = 2; // 审核未通过
}

/**
 * 营业状态
 * 0营业中 1休业中
 */
export class BusinessStatus {
  static OPEN = 0;
  static CLOSE = 1;
}

/**
 * 预约设定状态
 * 0开启预约 1关闭预约
 */
export class AppointStatus {
  static OPEN = 0;
  static CLOSE = 1;
}
