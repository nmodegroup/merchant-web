## mdal 弹窗组件

### Examples

初始化

```javascript
# 1、app.json 全局引入或者当前页面 .json 文件引入
"modal": "/components/modal/index"

# 2、在wxml引入 getResult接收组件确认或者取消回调 cancel取消 confirm确认
<modal id="modal" bind:get="getResult"></modal>

# 3、onLoad 初始化
this.modal = this.selectComponent('#modal');
```

# 4 getResult 接收组件确认或者取消回调 cancel 取消 confirm 确认

```javascript
getResult: function (e) {
  console.log(e.detail)
}
```

多行文字\n

```javascript
this.modal.showModal({
  content: '确定要删除此收藏吗？\n删除就没有了哦~',
  title: '温馨提示',
  cancelText: '拒绝',
  confirmText: '残忍删除',
  hideCancel: true
});
```

如果需要自定义弹窗内容

```javascript
# modal 组件已经开启了slot支持

# 1、将 custom 设置为 true，开启自定义
this.modal.showModal({
  content: '确定要删除此收藏吗？\n删除就没有了哦~',
  title: '温馨提示',
  cancelText: '拒绝',
  confirmText: '残忍删除',
  hideCancel: true,
  custom: true
});

# 2、在 modal 中自定义内容
<modal id="modal" bind:get="getResult">
  <view>我也是醉了</view>
</modal>
```

### API

| 参数        | 是否必须 | 说明           | 类型    | 默认值       |
| ----------- | -------- | -------------- | ------- | ------------ |
| content     | Y        | content 文字   | String  | 空           |
| title       | N        | modal 标题     | String  | 提示         |
| cancelText  | N        | 取消按钮文字   | String  | 取消         |
| confirmText | N        | 确认按钮文字   | String  | 确认         |
| hideCancel  | N        | 隐藏取消按钮   | boolean | false 不隐藏 |
| custom      | N        | 自定义弹窗内容 | boolean | false        |
