$(function (){
    $('#datetimepicker1').datetimepicker({
    	startView: 'month',
    	language:  'zh-CN',
    	minView: 2,
    	autoclose: 1,
        format: 'yyyy-mm-dd'
        
    });
});

/**
 * 重置
 */
function allClear() {
	$('#stuName').val('');
	$('#startTime').val('');
}

function selectAll() {
	var stuName = $('#stuName').val();
	var stime = $('#startTime').val();
	alert(stuName)
	alert(stime)
	location.href="/admin/student/index?stuName="+stuName+"&stime="+stime;
}





function initDataGrid() {
  $('#dataGrid').bootstrapTable({
    height: tableModel.getHeight(),
    idField: "id",
    columns: [{title: "用户名", field: "username"}, {
      title: "角色",
      field: "roleList",
      formatter: getRole
    }, {title: "状态", field: "state", formatter: tableModel.getState}, {
      title: "创建时间",
      field: "createdAt",
      formatter:tableModel.dateFormat,
      sortable: true
    }, {title: "更新日期", field: "updatedAt", formatter:tableModel.dateFormat,sortable: true}, {
      title: "操作",
      field: "operate",
      align: 'center',
      events: operateEvents,
      formatter: operateFormatter
    }],
    url: '/admin/user/list',
    queryParams: function (params) {
      return params;
    },
    responseHandler: function (res) {
      return {
        rows: res.result.pageInfo.list, total: res.result.pageInfo.total
      }
    },
    search: false,
    searchOnEnterKey: false,
    sortName: 'createdAt',
    sortOrder: 'asc',
    pagination: true,
    sidePagination: 'server',
    pageSize: 20,
    pageList: [20, 40, 50, 100],
    toolbar: "#toolbar",
    showRefresh: false,
    showToggle: false
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

function operateFormatter(value, row, index) {
  if (row.system == 0) {
    return ['<a href="/admin/user/edit?id='
    + row.id
    + '" >', '<i class="fa fa-edit"></i>修改', '</a>  ', '<a class="remove" href="javascript:void(0);">', '<i class="fa fa-remove"></i>删除', '</a>'].join('');
  }
}

window.operateEvents = {
  'click .remove': function (e, value, row, index) {
    operaModel.delRow(row.id, '/admin/user/delete', 'id');
  }
};