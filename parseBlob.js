/**
 * Created by wangqibiao on 2017/6/1.
 */
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
}