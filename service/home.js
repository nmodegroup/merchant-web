/*
 * @Description: In User Settings Edit
 * @Author: stone
 * @Date: 2019-08-10 15:29:32
 * @LastEditTime: 2019-08-11 16:41:07
 * @LastEditors: Please set LastEditors
 */
const httpManager = require('../lib/request/httpManager');

/**
 * 预定订单-获取今日预定列表
 */
export function getTodayOrderList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/table/order/today', // https://easy-mock.com/mock/5d4fcefa5bff847d28d02903/merchant/table/order/today
        params: params,
        contentType: httpManager.JSON
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 预定订单-获取未来预定列表
 */
export function getFutureOrderList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/table/order/future', // https://easy-mock.com/mock/5d4fcefa5bff847d28d02903/merchant/merchant/table/order/future
        params: params,
        contentType: httpManager.JSON
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 预定订单-获取历史预定列表
 */
export function getHistoryOrderList(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .get({
        url: '/merchant/table/order/history', // https://easy-mock.com/mock/5d4fcefa5bff847d28d02903/merchant/merchant/table/order/history
        params: params,
        contentType: httpManager.JSON
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 预定订单-确认/到店
 * type:（1确认通过  2确认不通过  3确认到店）
 */
export function confirmOrder(params) {
  return new Promise((resolve, reject) => {
    httpManager
      .put({
        url: '/merchant/table/order',
        params: params,
        contentType: httpManager.FORM_URLENCODED
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
