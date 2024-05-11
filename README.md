# proxy-tool

代理脚本工具

## 使用指南

自用脚本工具，目前只支持 Surge 代理工具。

###

```js
const $ = new ProxyTool();

// 获取网络信息
$.network;

// 获取脚本信息
$.script;

// 获取环境
$.environment;

// request信息
$.request;

// response信息
$.response;

// 存储信息
$.setStorage("key", value);

// 获取存储信息
$.getStorage("key");

// 发起请求
$.fetch("https://www.baidu.com");

// 通知
$.notify("标题", "二级标题", "内容");

// 完成
$.done("内容");
```
