
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<base href="<%=basePath%>">
<html>
<head>
    <title>Title</title>
    <link rel="stylesheet" href="/static/assets/bootstrap-3.3.5/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/static/assets/bootstrap-table/bootstrap-table.min.css">
    <link rel="stylesheet" href="/static/assets/bootstrap-fixed-columns/bootstrap-table-fixed-columns.css">
    <link rel="stylesheet" href="/static/assets/bootstrap-treeview/bootstrap-treeview.min.css" />
    <link rel="stylesheet" href="/static/assets/jquery-treegrid/jquery.treegrid.css" />
    <link rel="stylesheet" href="/static/select2/select2.min.css" />
    <link rel="stylesheet" href="/static/select2/select2-bootstrap.css" />
    <link rel="stylesheet" href="/static/assets/bootstrap-select/bootstrap-select.css" />
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


<!--加入模态框-->
<!-- 模态框（Modal） -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel" style="text-align: center">
                    复查通知设置
                </h4>
            </div>
            <form id="openAdvice" class="form-horizontal js-ajax-commit" enctype="multipart/form-data"
                  action="/admin/recheck/openRecheckAdvice" method="post">
                <div class="modal-body">
                    <!--通知年份-->
                    <div class="form-group">
                        <label for="year" class="col-md-3 control-label">通知年份</label>
                        <div class="col-md-9">
                            <select id="year" name="year" class="form-control input">
                                <option value="">--请选择--</option>
                                </option>
                            </select>
                        </div>
                    </div>

                    <div id="result" class="form-group"></div>

                    <!--通知类型-->
                    <div class="form-group">
                        <label class="col-md-3 control-label">通知类型</label>
                        <div class="col-md-4">
                            <input type="checkbox" value="1" name="typeView" onclick="return false;" checked>短信</label>
                        </div>
                        <div class="col-md-5">
                            <input type="checkbox" value="2" name="typeView" onclick="return false;" checked>公众号</label>
                        </div>
                    </div>

                    <!--学校列表模糊匹配-->
                    <div class="form-group">
                        <label for="school" class="col-md-3 control-label">推送学校</label>
                        <div class="col-md-9">
                            <input type="hidden" class="form-control" id="schoolId" name="schoolId"
                                   value="-1">
                            <input type="text" class="form-control" id="school" name="schoolName"
                                   oninput="setSchoolId()" list="schoolList" placeholder="请输入学校">
                            <datalist id="schoolList">
                            </datalist>
                        </div>
                    </div>

                    <!--推送内容-->
                    <div class="form-group">
                        <label for="normalContent" class="col-md-3 control-label">推送内容</label>
                        <div class="col-md-9" style="margin-left: 0px;">
                  <textarea rows="3" class="form-control" id="normalContent" name="normalContent"
                            maxlength="500">
                  </textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" style="margin-right: 200px;"
                                id="cancel"
                                data-dismiss="modal">取消
                        </button>
                        <button type="submit" class="btn btn-success js-ajax-commit"
                                style="margin-right: 100px;" id="confirm">开启推送
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

</body>
<script type="text/javascript" src="/static/assets/jquery-2.2.4.min.js"></script>
<script type="text/javascript" src="/static/assets/bootstrap-3.3.5/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/static/assets/typeahead/bootstrap3-typeahead.js"></script>
<script type="text/javascript" src="/static/assets/bootstrap-table/bootstrap-table.min.js"></script>
<script type="text/javascript" src="/static/assets/bootstrap-table/bootstrap-table-zh-CN.min.js"></script>
<script type="text/javascript" src="/static/assets/bootstrap-treeview/bootstrap-treeview.min.js"></script>
<%--<script type="text/javascript" src="/static/assets/bootstrap-treeview/additional-methods.min.js"></script>--%>
<script type="text/javascript" src="/static/assets/bootstrap-select/bootstrap-select.min.js"></script>
<script type="text/javascript" src="/static/assets/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
<script type="text/javascript" src="/static/assets/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.fr.js"></script>
<script type="text/javascript" src="/static/assets/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
<script type="text/javascript" src="/static/assets/bootstrap-fixed-columns/bootstrap-table-fixed-columns.js"></script>
<script type="text/javascript" src="/static/js/datepicker/bootstrap-datepicker.js"></script>
<script type="text/javascript">
  //全局队列
  var Queue = new Array();

  //弹窗提醒
  function pop() {
    if(!isEmpty()){
      var data = dequeue();
      document.getElementById('result').innerText = data.productName;
      setTimeout(function(){
        $('#myModal').modal('show');
      }, 1500);
    }
    return;
  }

  // 监听模态框关闭
  $('#myModal').on('hidden.bs.modal', function () {
    //弹窗提醒
    if(!isOpenStatus()) {
      pop();
    }
  });

  //需要判断浏览器支不支持，可以去w3c进行查看
  var source = new EventSource('/test/get_data');
  source.onmessage = function (event) {
    console.info(event.data);
    //将字符串反序列化为字符串
    var dataList = $.parseJSON(event.data);
    dataList.forEach(function (data) {
      console.info(data.productName);
      enQueue(data);
    });

    if(!isOpenStatus()) {
      pop();
    }
  };

  source.onerror = function (event) {
    console.info("SSE连接即将中断");
    source.close();
  }

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

  //队列操作
  //向队列尾部添加一个或多个新的元素
  function enQueue(data) {
    Queue.push(data);
  }
  //从队列顶部移除元素并返回
  function dequeue() {
    return Queue.shift();
  }
  //返回队列顶部元素，不对队列做任何操作
  function front() {
    return Queue[0];
  }
  //判断队列是否是空队列，是返回true，否则返回false
  function isEmpty() {
    return Queue.length==0;
  }
  //返回队列长度
  function size() {
    return Queue.length;
  }

  //判断模态框是否打开
  function isOpenStatus() {
    console.log("模态框是否打开:" + ($('#myModal').css('display') == "block"));
    return $('#myModal').css('display') == "block";
  }

</script>
</html>
