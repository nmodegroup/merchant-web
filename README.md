## Ngiht Mode 商家端小程序

#### 1、整体采用小程序原生语法

#### 2、提交审核 TODO

- 将 env 中 NODE_ENV 切换为 prod

| 环境 | 说明         |
| ---- | ------------ |
| test | 本地测试环境 |
| prod | 生产环境     |

#### 3、项目结构描述

```
|-- nmode
    |-- .DS_Store
    |-- .gitignore	// 忽略文件
    |-- README.md	// 项目描述
    |-- app.js	// 小程序入口文件
    |-- app.json	// 小程序全局配置
    |-- app.wxss	// 页面通用样式
    |-- project.config.json	// 项目配置文件
    |-- sitemap.json
    |-- weui.wxss	// 微信小程序 UI 样式
    |-- components	// --------------自定义组件-------------
    |   |-- .DS_Store
    |   |-- action-bottom	// 底部操作按钮
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- action-wrapper	// 吸底包装组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- cell			// 通用单元格组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- cell-input		// 输入单元格组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- cell-left		// 左对齐单元格组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- choose-image	// 图片文件选择组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- form-button		// 提交按钮组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- loading-more	// 上拉加载组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- modal			// 通用弹窗组件
    |   |   |-- README.md
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- nav-bar			// 自定义导航栏组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- order-item		// 订单列表 item 组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- panel			// 标题面板组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- select			// 下拉选择组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- tab				// tab 切换组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- tag				// 标签组件
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- toast			// 通用弹窗吐司组件
    |   |   |-- README.md
    |   |   |-- index.js
    |   |   |-- index.json
    |   |   |-- index.wxml
    |   |   |-- index.wxss
    |   |-- vant-weapp		// 引入有赞小程序组件扩展库
    |       |-- .DS_Store
    |-- constant			// ----------常量------------
    |   |-- event.js		// 页面间事件通讯相关
    |   |-- global.js		// 全局通用
    |   |-- page.js			// 页面 route 跳转
    |   |-- pageFlag.js		// 页面标识
    |-- custom-tab-bar		// -----------自定义 tabBar-----------
    |   |-- index.js
    |   |-- index.json
    |   |-- index.wxml
    |   |-- index.wxss
    |-- image				// ---------------静态图片--------------
    |   |-- .DS_Store
    |   |-- activity		// 活动模块
    |   |   |-- icon_add.svg
    |   |   |-- icon_location.svg
    |   |   |-- radio-select.svg
    |   |   |-- radio-unselect.svg
    |   |-- center			// 个人中心模块
    |   |   |-- .DS_Store
    |   |   |-- center-top-bg.png
    |   |   |-- center_about.svg
    |   |   |-- center_arrival_time.svg
    |   |   |-- center_business_status.svg
    |   |   |-- center_business_time.svg
    |   |   |-- center_contact.svg
    |   |   |-- center_help.svg
    |   |   |-- center_modify.svg
    |   |   |-- center_order.svg
    |   |   |-- center_qr_code.svg
    |   |   |-- center_reserve.svg
    |   |   |-- center_seat.png
    |   |   |-- center_shop.png
    |   |-- global			// 全局通用
    |   |   |-- .DS_Store
    |   |   |-- cell_arrow.svg
    |   |   |-- close-modal.svg
    |   |   |-- icon_reason.svg
    |   |   |-- icon_tab_activity.png
    |   |   |-- icon_tab_activity_HL.png
    |   |   |-- icon_tab_home.png
    |   |   |-- icon_tab_home_HL.png
    |   |   |-- icon_tab_mine.png
    |   |   |-- icon_tab_mine_HL.png
    |   |   |-- nav-arrow.svg
    |   |   |-- nav_home.svg
    |   |-- table			// 桌位模块
    |   |   |-- table_add.svg
    |   |   |-- table_area.svg
    |   |-- time			// 时间模块
    |   |   |-- arrival-time-edit.svg
    |   |   |-- arrival_time_delete.svg
    |   |   |-- checkbox-select.svg
    |   |   |-- checkbox-unselect.svg
    |   |   |-- icon_select.svg
    |   |   |-- time_icon_special.svg
    |   |-- toast			// toast 组件相关
    |   |   |-- icon_fail.svg
    |   |   |-- icon_succed.svg
    |   |   |-- icon_wait.svg
    |   |   |-- icon_warn.svg
    |   |-- user			// 用户相关
    |       |-- add-image.svg
    |       |-- auth-add.svg
    |       |-- auth-userinfo.png
    |       |-- close.svg
    |       |-- edit.svg
    |       |-- introduction-x.png
    |       |-- introduction.png
    |-- lib				// --------------类库---------------
    |   |-- event.js	// event 事件
    |   |-- log.js		// 实时日志
    |   |-- md5.js		// md5 加密
    |   |-- request		// 网络请求封装
    |       |-- README.md
    |       |-- constant.js		// 常量
    |       |-- env.js			// 环境切换
    |       |-- httpManager.js	// 上层接口调用管理类
    |       |-- request.js		// 微信请求 api 封装
    |-- module			// --------------个人中心模块、桌位管理模块（分包）--------
    |   |-- .DS_Store
    |   |-- image
    |   |   |-- .DS_Store
    |   |   |-- code-bg.png
    |   |-- pages
    |       |-- about			// 关于我们
    |       |   |-- about.js
    |       |   |-- about.json
    |       |   |-- about.wxml
    |       |   |-- about.wxss
    |       |-- area			// 区域管理
    |       |   |-- area.js
    |       |   |-- area.json
    |       |   |-- area.wxml
    |       |   |-- area.wxss
    |       |-- area-edit		// 新增、编辑区域
    |       |   |-- area-edit.js
    |       |   |-- area-edit.json
    |       |   |-- area-edit.wxml
    |       |   |-- area-edit.wxss
    |       |-- code			// 商家二维码
    |       |   |-- code.js
    |       |   |-- code.json
    |       |   |-- code.wxml
    |       |   |-- code.wxss
    |       |-- order			// 我的订单
    |       |   |-- order.js
    |       |   |-- order.json
    |       |   |-- order.wxml
    |       |   |-- order.wxss
    |       |-- protocol		// 用户协议
    |       |   |-- protocol.js
    |       |   |-- protocol.json
    |       |   |-- protocol.wxml
    |       |   |-- protocol.wxss
    |       |-- replace			// 更换手机号码
    |       |   |-- replace.js
    |       |   |-- replace.json
    |       |   |-- replace.wxml
    |       |   |-- replace.wxss
    |       |-- table			// 桌位管理
    |       |   |-- table.js
    |       |   |-- table.json
    |       |   |-- table.wxml
    |       |   |-- table.wxss
    |       |-- table-edit		// 新增、编辑桌位
    |           |-- table-edit.js
    |           |-- table-edit.json
    |           |-- table-edit.wxml
    |           |-- table-edit.wxss
    |-- module-business			// -----------活动模块、营业时间、预约到店时间模块（分包）----
    |   |-- pages
    |       |-- activity-edit	// 新增、编辑活动
    |       |   |-- activity-edit.js
    |       |   |-- activity-edit.json
    |       |   |-- activity-edit.wxml
    |       |   |-- activity-edit.wxss
    |       |   |-- data.js
    |       |-- activity-user	// 活动参与列表
    |       |   |-- activity-user.js
    |       |   |-- activity-user.json
    |       |   |-- activity-user.wxml
    |       |   |-- activity-user.wxss
    |       |-- arrival-time	// 预约到店时间管理
    |       |   |-- arrival-time.js
    |       |   |-- arrival-time.json
    |       |   |-- arrival-time.wxml
    |       |   |-- arrival-time.wxss
    |       |-- business-time	// 营业时间管理
    |       |   |-- business-time.js
    |       |   |-- business-time.json
    |       |   |-- business-time.wxml
    |       |   |-- business-time.wxss
    |       |-- business-time-edit	// 新增、编辑营业时间
    |       |   |-- business-time-edit.js
    |       |   |-- business-time-edit.json
    |       |   |-- business-time-edit.wxml
    |       |   |-- business-time-edit.wxss
    |       |-- special-date	// 特殊时间设置
    |       |   |-- special-date.js
    |       |   |-- special-date.json
    |       |   |-- special-date.wxml
    |       |   |-- special-date.wxss
    |       |-- week			// 营业星期选择
    |           |-- week.js
    |           |-- week.json
    |           |-- week.wxml
    |           |-- week.wxss
    |-- pages					// ----------底部 tab、登录授权、店铺认证模块（主包）-------------
    |   |-- .DS_Store
    |   |-- activity			// 活动列表
    |   |   |-- activity.js
    |   |   |-- activity.json
    |   |   |-- activity.wxml
    |   |   |-- activity.wxss
    |   |-- auth				// 登录授权
    |   |   |-- auth.js
    |   |   |-- auth.json
    |   |   |-- auth.wxml
    |   |   |-- auth.wxss
    |   |-- center				// 个人中心
    |   |   |-- center.js
    |   |   |-- center.json
    |   |   |-- center.wxml
    |   |   |-- center.wxss
    |   |-- home				// 首页
    |   |   |-- home.js
    |   |   |-- home.json
    |   |   |-- home.wxml
    |   |   |-- home.wxss
    |   |-- info				// 店铺认证
    |       |-- info.js
    |       |-- info.json
    |       |-- info.wxml
    |       |-- info.wxss
    |       |-- staticResource.js
    |-- service				// ------------------接口请求包装----------------
    |   |-- activity.js		// 活动模块
    |   |-- center.js		// 个人中心模块
    |   |-- common.js		// 通用模块
    |   |-- home.js			// 订单模块
    |   |-- shop.js			// 店铺模块
    |   |-- table.js		// 桌位管理模块
    |   |-- time.js			// 时间管理模块
    |   |-- user.js			// 用户模块
    |-- utils				// ----------------工具类库--------------------
    |   |-- .DS_Store
    |   |-- date.js			// 时间处理
    |   |-- global.js		// 全局通用
    |   |-- page.js			// 页面组件调用
    |   |-- regular.js		// 正则
    |   |-- safeArea.js		// iphoneX 以上机型适配
    |   |-- wxManager.js	// 微信 api 二次封装
    |   |-- throttle-debounce	// 防抖节流
    |       |-- README.md
    |       |-- debounce.js
    |       |-- index.js
    |       |-- throttle.js
    |-- wxs					// --------------------过滤器----------------
        |-- activity.wxs	// 活动模块
        |-- center.wxs		// 个人中心模块
        |-- order.wxs		// 订单模块
        |-- time.wxs		// 时间模块

```
