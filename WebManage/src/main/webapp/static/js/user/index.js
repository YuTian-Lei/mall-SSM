$table = $("#dataGrid");
$(function () {
  initDataGrid();
});

function initDataGrid() {
  $('#dataGrid').bootstrapTable({
    height: tableModel.getHeight(),
    idField: "id",
    columns: [{title: "用户名", field: "username"}, {
      title: "角色",
      field: "roleList",
      formatter: getRole
    }, {title: "状态", field: "state",  formatter: function (value, row, index) {
    return statusTools(row);
  }}, {
      title: "创建时间",
      field: "createdAt",
      formatter:tableModel.dateFormat,
      sortable: true
    }, {title: "更新日期", field: "updatedAt", formatter:tableModel.dateFormat,sortable: true}, {
      title: "操作",
      field: "operate",
      align: 'center',
      // events: operateEvents,
      formatter: function (value, row, index) {
    return getOperateBtns(row,index, row.id);
  }
    }],
    url: '/admin/user/list',
    queryParams: function (params) {
        var param = {
    		page: params.offset,
    		rows: params.limit
        };

        return param;
    },
    responseHandler: function (res) {
      return {
        rows: res.result.pageInfo.list, total: res.result.pageInfo.total
      }
    },
    sortName: 'checkTime',
    sortOrder: 'desc',
    pagination: true,
    sidePagination: 'server',
    pageSize: 20,
    pageNumber: 1,
    smartDisplay:false,
    pageList: [20, 40, 50, 100],
    toolbar: "#toolbar",
    showRefresh: false,
    showToggle: false,
    showHeader:true,
    queryParamsType: 'limit',

    // 添加下列参数即可进行固定列,列数量过少不可使用
    // fixedColumns: true,
    // fixedNumber: 2
  });
}

function getRole(value, row, index) {
  if (row.system == 1) {
    return "超级管理（不受角色限制）"
  } else {
    return $.map(value, function (v) {
      return v.roleName;
    }).join(",");
  }
}
function getState(value, row, index) {
	if (row.state == true) {
		return "正常"
	} else {
		return "禁用";
	}
}

function getOperateBtns(row,index, id) {
  if (row.system == 0) {
    var html = "";
    $("#operateDiv").find("a").each(function () {
      var _srcid = $(this).attr("id");
      var _id = _srcid + index;
      $(this).attr("id", _id);
      if (_id == "editId_" + index) {
        $(this).attr("href", "/admin/user/edit_2?id=" + id);
      } else {
        $(this).attr("onclick", "javascript:delUser(" + id + ");");
      }
      html += this.outerHTML + "&nbsp;";
      $(this).attr("id", _srcid);
    });
    return html;
  }

}

/* 状态显示 */
function statusTools(row) {
  if(row.system==1){
    if (row.state) {
      return '<span class="label label-success">启用</span>';
    } else {
      return '<span class="label label-warning">关闭</span>';
    }
  }else{
    if (row.state) {
      return '<i class=\"fa fa-toggle-on text-green fa-2x\" onclick="disable(\'' + row.id + '\')"></i> ';
    } else {
      return '<i class=\"fa fa-toggle-off text-green fa-2x\" onclick="enable(\'' + row.id + '\')"></i> ';
    }
  }
}
function disable(userId) {
    layer.confirm("确认要停用用户吗？", {title: "系统提示"}, function (index) {
      $.post("/admin/user/changeState", { "id": userId, "state": 0 }, function (data) {
        var num = data.resultCode == 1 ? 1 : 0;
        layer.msg(data.message, {icon: num, shade: 0.3, offset: '40%', time: 2000});
        setTimeout(function () {
          location.reload();
        }, 1000);
      });
    });
}
/* 启用 */
function enable(userId) {
  layer.confirm("确认要启用用户吗？", {title: "系统提示"}, function (index) {
    $.post("/admin/user/changeState", { "id": userId, "state": 1 }, function (data) {
      var num = data.resultCode == 1 ? 1 : 0;
      layer.msg(data.message, {icon: num, shade: 0.3, offset: '40%', time: 2000});
      setTimeout(function () {
        location.reload();
      }, 1000);
    });
  });
}
function operateFormatter(value, row, index) {
  if (row.system == 0) {
    return ['<a class="btn btn-success btn-xs" href="/admin/user/edit?id='
    + row.id
    + '" >', '<i class="fa fa-edit"></i>修改', '</a>  ', '<a class="btn btn-danger btn-xs" href="javascript:void(0);">', '<i class="fa fa-remove"></i>删除', '</a>'].join('');
  }
}

function delUser(id){
  operaModel.delRow(id, '/admin/user/delete', 'id');
}
// window.operateEvents = {
//   'click .remove': function (e, value, row, index) {
//     operaModel.delRow(row.id, '/admin/user/delete', 'id');
//   }
// };