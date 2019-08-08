## toast 弹窗组件

### Examples

初始化

```
# 1、app.json 全局引入或者当前页面 .json 文件引入
"toast": "/components/toast/index"

# 2、在wxml引入
<toast id="toast"></toast>

# 3、onLoad 初始化
this.toast = this.selectComponent('#toast');
```

单行文字 toast

```
      this.toast.showToast({
        content: '区域名2-10个字符'
      });

```

多行文字 toast

```
      this.toast.showToast({
        content: '区域名2-10个字符',
        multContent: '可包含中文字母数字'
      });
```

需要显示图标 toast

```
      return this.toast.showToast({
        content: '区域名2-10个字符',
        icon: 'success'
      });
```

### API

| 参数        | 是否必须 | 说明             | 类型   | 默认值 |
| ----------- | -------- | ---------------- | ------ | ------ |
| content     | Y        | toast 文字       | String | 空     |
| multContent | N        | toast 第二行文字 | String | 空     |
| icon        | N        | toast 图标       | String | 空     |

### icon 可选值

| type    | 说明               |
| ------- | ------------------ |
| success | 成功图标           |
| fail    | 失败图标           |
| warn    | 警示图标           |
| wait    | 等待（加载中）图标 |
