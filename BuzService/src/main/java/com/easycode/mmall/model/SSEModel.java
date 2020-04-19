package com.easycode.mmall.model;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

/**
 * @Description: //TODO
 * @Date: 2020/4/16 21:56
 * @Author: pengfei.L
 */

public class SSEModel {
   //默认为message
   private String event = "message\n";
   //默认为3000(3秒)
   private String retry = "3000\n";
   private String data;


  public void setEvent(String event) {
    this.event = event + "\n";
  }

  public void setRetry(String retry) {
    this.retry = retry + "\n";
  }

  public void setData(Object data){
    this.data = JSONObject.toJSONString(data) + "\n\n";
  }



  @Override
  public String toString() {
    return "event:" + event + "retry:" + retry  + "data:" + data;
  }

  public String toErrorString(){return "event:" + "error\n" + "retry:" + retry  + "data:" + data;}
}
