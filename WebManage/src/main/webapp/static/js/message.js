
/**
 * 娑堟伅鎻愮ず缁勪欢
 * 
 * 1.璋冪敤
 * 瀛楃涓茬被鍨嬪弬鏁帮細 $.message('鎴愬姛');
 * 瀵硅薄鍨嬪弬鏁帮細$.message({});
 * 
 * 2.鍙傛暟璇﹁В
 *  message:' 鎿嶄綔鎴愬姛',    //鎻愮ず淇℃伅
    time:'2000',           //鏄剧ず鏃堕棿锛堥粯璁わ細2s锛�
    type:'success',        //鏄剧ず绫诲瀷锛屽寘鎷�4绉嶏細success.error,info,warning
    showClose:false,       //鏄剧ず鍏抽棴鎸夐挳锛堥粯璁わ細鍚︼級
    autoClose:true,        //鏄惁鑷姩鍏抽棴锛堥粯璁わ細鏄級
 * 
 * type:success,error,info,warning
 */

$.extend({
  message: function(options) {
      var defaults={
          message:' 鎿嶄綔鎴愬姛',
          time:'5000',
          type:'success',
          showClose:false,
          autoClose:true,
          onClose:function(){}
      };
      
      if(typeof options === 'string'){
          defaults.message=options;
      }
      if(typeof options === 'object'){
          defaults=$.extend({},defaults,options);
      }
      //message妯＄増
      var templateClose=defaults.showClose?'<a class="c-message--close">脳</a>':'';
      var template='<div class="c-message messageFadeInDown">'+
          '<i class=" c-message--icon c-message--'+defaults.type+'"></i>'+
          templateClose+
          '<div class="c-message--tip">'+defaults.message+'</div>'+
      '</div>';
      var _this=this;
      var $body=$('body');
      var $message=$(template);
      var timer;
      var closeFn,removeFn;
      //鍏抽棴
      closeFn=function(){
          $message.addClass('messageFadeOutUp');
          $message.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
              removeFn();
          })
      };
      //绉婚櫎
      removeFn=function(){
          $message.remove();
          defaults.onClose(defaults);
          clearTimeout(timer);
      };
      //绉婚櫎鎵€鏈�
      $('.c-message').remove();
      $body.append($message);
      //灞呬腑
      $message.css({
          'margin-left':'-'+$message.width()/2+'px'
      })
      //鍘婚櫎鍔ㄧ敾绫�
      $message.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
          $message.removeClass('messageFadeInDown');
      });
      //鐐瑰嚮鍏抽棴
      $body.on('click','.c-message--close',function(e){
          closeFn();
      });
      //鑷姩鍏抽棴
      if(defaults.autoClose){
          timer=setTimeout(function(){
              closeFn();
          },defaults.time)
      }
  }
});