/**
 * 图片存放的文件夹
 */
export class Folder {
  static FILE_FOLDER_LOGO = 'merchant/logo'; // 店铺 logo 文件夹
  static FILE_FOLDER_COVER = 'merchant/cover'; // 店铺封面文件夹
  static FILE_FOLDER_BARTENDER = 'merchant/bartender'; // 调酒师个人宣传照文件夹
  static FILE_FOLDER_ACTIVITY_BANNER = 'merchant/activity/banner'; // 活动banner
  static FILE_FOLDER_ACTIVITY_POSTER = 'merchant/activity/poster'; // 活动海报
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

/**
 * 限制预订数量类型（0不限 1按系统已有桌位限制 2按固定名额限制）
 */
export class QuotaType {
  static NOT_LIMIT = 0;
  static EXIST_LIMIT = 1;
  static FIXED_LIMIT = 2;
}

/**
 * 活动启用状态
 * 启用状态(0开启 1关闭)
 */
export class ActivityStatus {
  static OPEN = 0;
  static CLOSE = 1;
}

/**
 * 可预约时间启用状态
 * 启用状态(0启用 1关闭)
 */
export class AppointTimeStatus {
  static OPEN = 0;
  static CLOSE = 1;
}

/**
 * 确认通过、确认到店操作
 * 1确认通过  2确认不通过  3确认到店
 */
export class OrderActionStatus {
  static CONFIRM = 1;
  static CONFIRM_NOT = 2;
  static ARRIVAL = 3;
}
