/**
 * Created by wangqibiao on 2017/6/1.
 */
/*js解释数据包
做一个项目,服务器要给我发一个数据包,
格式为,前面16位short,后32位int,后面就全是string,我用javascript怎么去把这个数据包解读出来?
  用WebSocket,接收到的就是一个Blob对象.而我要给服务器返回的也是这种格式,我又怎么把我的数据封装成这样的数据包?
  */
  // ------解决方案--------------------
var reader = {
  readAs: function(type,blob,cb){
    var r = new FileReader();
    r.onloadend = function(){
      if(typeof(cb) === 'function') {
        cb.call(r,r.result);
      }
    }
    try{
      r['readAs'+type](blob);
    }catch(e){}
  }
};

function parseBlob(blob){
  var shortVar, intVar, stringVar;
  reader.readAs('ArrayBuffer',blob.slice(0,2),function(arr){
    shortVar = (new Int16Array(arr))[0];
    console.log(shortVar);
  });

  reader.readAs('ArrayBuffer',blob.slice(2,6),function(arr){
    intVar = (new Int32Array(arr))[0];
    console.log(intVar);
  });

  reader.readAs('Text',blob.slice(6,blob.size,'text/plain;charset=UTF-8'),function(result){
    stringVar = result;
    console.log(stringVar);
  });
}

var buffer = new ArrayBuffer(6);//建立6个字节的缓冲，前两个字节是short，后四个是int
var bufferView = new Int16Array(buffer); //建立16位的视图,那么视图的长度应该是3
bufferView[0] = 32767;
bufferView[1] = 0;
bufferView[2] = 1;
//现在buffer中的内容由低位到高位应该是
//11111111 11111110 00000000 00000000 100000000 00000000
var blob = new Blob([bufferView,"words words 文本文本文本文本"]);
//构造这个blob类型
//测试一下parseBlob函数是否正确
parseBlob(blob);
//32767
//65536
//words words 文本文本文本文本
//第一个short是32767
//第二个int，前16位为0，第17位为1，所以结果是65536
//第三个字符串，和我们构造blob的时候一样