/**
 * Created by wangqibiao on 2017/6/1.
 */
;(function (win) {
  //是否为数组返回true or false
  function isArray(o){
    return Object.prototype.toString.call(o)==='[object Array]';
  }
  var reader = {
    readAs: function(type,blob,cb){
      var r = new FileReader();
      r.onloadend = function(){
        if(typeof(cb) === 'function') {
          cb.call(r,r.result);
        }
      };
      try{
        r['readAs'+type](blob);
      }catch(e){}
    }
  };
  //Blob二进制类型值处理
  function processBlob(blob){
    var shortVar, intVar, stringVar;
    //前面16位short
    reader.readAs('ArrayBuffer',blob.slice(0,2),function(arr){
      shortVar = (new Int16Array(arr))[0];
      // console.log(shortVar);
    });
    //后32位int
    reader.readAs('ArrayBuffer',blob.slice(2,6),function(arr){
      intVar = (new Int32Array(arr))[0];
      // console.log(intVar);
    });
    //string
    reader.readAs('Text',blob.slice(0,blob.size,'text/plain;charset=UTF-8'),function(result){
      stringVar = result;
      console.log(stringVar);
    });
    return stringVar;
  }
  //主函数
  win.createWebsocket = function(opts) {
    // 创建安全WebSocket 连接（wss）
    // var ws = new WebSocket('wss://example.com/socket');
    var ws = new WebSocket(opts.url);
    // 连接建立时调用
    ws.onopen = function () {
      // 向服务端发送消息
      if (ws.readyState === WebSocket.OPEN) {
        //发送字符串
        var sendDatas = opts.datas;
        //发送二进制数据
        if (isArray(opts.datas)){
          sendDatas = new Blob(opts.datas);
        }
        ws.send(sendDatas);
      } else {
        //其他操作
      }
    };
    ws.onmessage = function (msg) {
      // 接收服务端发送的消息
      if (msg.data instanceof Blob) {
        // 处理二进制信息
        var blob = msg.data;
        reader.readAs('Text',blob.slice(0,blob.size,'text/plain;charset=UTF-8'),function(result){
          opts.success(result);
        });
      } else {// 处理文本信息
        // 处理文本信息
        opts.success(msg.data);
      }
    };
    // 错误处理
    ws.onerror = function (error) {
      throw new (error);
    };
    // 关闭时调用
    ws.onclose = function (e) {

    };
  }
})(window);

