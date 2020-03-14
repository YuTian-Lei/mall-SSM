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
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
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

<form name="uploade_img" action="manage/product/richtext_img_upload" method="post" enctype="multipart/form-data">
    <input type="file" name="upload_file">
    <input type="submit" name="submit">
</form>
</body>
</html>
