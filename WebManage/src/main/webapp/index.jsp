<%--
  Created by IntelliJ IDEA.
  User: lenovo
  Date: 2020/2/24
  Time: 15:44
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()
            + "://"
            + request.getServerName()
            + ":"
            + request.getServerPort()
            + path
            + "/";
%>
<base href="<%=basePath%>">
<html>
<head>
    <title>Title</title>
</head>
<body>
<h1>未登录</h1>
<form name="uploade_img" action="manage/product/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="upload_file">
    <input type="submit" name="submit">
</form>

<form name="uploade_img" action="manage/product/richtext_img_upload" method="post"
      enctype="multipart/form-data">
    <input type="file" name="upload_file">
    <input type="submit" name="submit">
</form>
<div>模拟股票行情</div>
<div id="result"></div>
</body>
<script type="text/javascript" src="/static/js/jquery-2.2.4.min.js"></script>
<script type="text/javascript">
  //需要判断浏览器支不支持，可以去w3c进行查看
  var source = new EventSource('test/get_data');
  source.onmessage = function (event) {
    console.info(event.data);
    //将字符串反序列化为字符串
    var data = $.parseJSON(event.data);
    document.getElementById('result').innerText = data.time;
  };

  $(function () {
    testSSE();
  });

  //Server-Sent-event 检测
  function testSSE() {
    if (typeof (EventSource) !== "undefined") {
      // 是的！支持服务器发送事件！
      // 一些代码.....
      console.info("支持SSE");
    } else {
      // 抱歉！不支持服务器发送事件！
      console.info("不支持SSE");
    }
  }
</script>
</html>
