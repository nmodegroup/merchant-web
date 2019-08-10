## 小程序接口请求文档说明

#### 1、API 鉴权 (适用于所有小程序 API，小程序登录接口无需鉴权)

- ① 前端根据以下参数顺序通过 MD5 算法生成签名 sign，并携带 token、key、nonce 字段置于请求头 Header 中随接口一起调用
- ② 鉴权传输字段说明（见下方）
- ③ 开发环境 API 调用凭证(生产环境上线前生成，前端自行保存)

#### 2、request 包说明

1️⃣ `constant`：
请求相关常量

2️⃣ `env`：环境相关配置

> NODE_ENV 字段代表当前环境，可选值为 prod（生产环境）、test（本地环境）

3️⃣ `request`：结合项目需求对微信请求 api 封装

4️⃣ `httpManager`：封装了 get、post、put、delete 等 api 网络请求调用

#### 3、使用说明

我们不直接在页面使用 httpManager 发起请求，在 service 目录中建立相关模块，统一使用 Promise 对具体请求进一步包装

① /service/center.js 中示例如下：

```javascript
// 引入 httpManager 基础库
const httpManager = require('../lib/request/httpManager');

/**
 * 获取区域列表
 */
export function getTableAreaList() {
  return new Promise((resolve, reject) => {
    httpManager
      .get('/merchant/table/area')
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
```

② 在页面使用 getTableAreaList 方法发起请求

```javascript
// 引入 service
const tableService = require('../../../service/table');

  requestAreaList() {
    wxManager.showLoading();
    tableService
      .getTableAreaList()
      .then(res => {
        this.setData({
          areaList: res
        });
        wxManager.hideLoading();
      })
      .catch(e => {
        wxManager.hideLoading();
        this.showNormalToast(e.msg);
      });
  },

```

③ 如果需要 mock 数据，只需在开发阶段替换对应的 uri，mock 的 url 需为完整路径

```
const httpManager = require('../lib/request/httpManager');

/**
 * 获取区域列表
 */
export function getTableAreaList() {
  return new Promise((resolve, reject) => {
    httpManager
      // .get('/merchant/table/area')
      .get('https://api.bmkee.com/mock/21/merchant/table/area')
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}


```

④ resolve 与 reject 数据说明

`resolve` 的 result 数据为请求成功后的 `data.data` 数据

`reject` 的 err 数据为携带 请求失败 `code`、`msg` 和空 `data` 的一个 json 对象，之所以返回完整错误对象体是因为页面可能有需要根据 `code` 做一些特定的操作的行为，而 `msg` 我们可以 `toast`给用户进行提示

⑤ httpManager 中请求方法说明

| 请求方法 | 说明             |
| -------- | ---------------- |
| get      | 发起 GET 请求    |
| post     | 发起 POST 请求   |
| put      | 发起 PUT 请求    |
| \_delete | 发起 DELETE 请求 |

#### 4、接口状态码（适用于所有项目 API）

| 状态码 | 说明       | 提示                                  |
| ------ | ---------- | ------------------------------------- |
| 1000   | 请求成功   | 无                                    |
| 1001   | 请求失败   | 网络异常，请稍后重试                  |
| 1002   | 用户未登录 | 您还没有登录哦/登录已过期，请重新登录 |
| 1003   | 无操作权限 | 您没有权限操作哦                      |
| 1004   | 无访问权限 | API 认证失败                          |
| 1005   | 其他错误   | 网络异常，请稍后重试                  |
