# html5-websocket
关于客户端websocket通信，二进制转换问题。

## 目录结构说明
|—index.html #入口文件
|—websocket.js #websocket文件
|—parseBlob.js #Blob数据转换成文本

```js
//调用方式
 createWebsocket({
      url:'ws://192.168.3.147:8080/ws',//请求地址
      datas:["001", "< ", " wangqibiao", "您好", ">"],//请求数据
      success:function (data) {//成功回调
        console.log("hdhdh=" + data);
      }
    });
```
