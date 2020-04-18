$table = $("#dataGrid");
$(function () {
  initDataGrid();
});

function initDataGrid() {
  $('#dataGrid').bootstrapTable({
    height: tableModel.getHeight(),
    idField: "id",
    columns: [{title: "登录名", field: "username"}, {
      title: "角色",
      field: "roleName",
      /*formatter: getRole*/
    },
      {title: "真实姓名", field: "nickname"},
      {title: "所属组长", field: "leaderName"},
      {title: "创建时间", field: "createdAt", formatter:tableModel.dateFormat, sortable: true },
      {title: "更新日期", field: "updatedAt", formatter:tableModel.dateFormat,sortable: true},
      {
      title: "操作",
      field: "operate",
      align: 'center',
      events: operateEvents,
      formatter: operateFormatter
    }],
    url: '/admin/userTeam/list',
    /*responseHandler: function (res) {
      return {
        rows: res.result.pageInfo.list, total: res.result.pageInfo.total
      }
    },*/
    queryParams : function(params) {
      console.log('queryParams',params)
      var param = {
        page : (params.offset/params.limit) +1,
        pageSize : params.limit,
        username : $("#username").val()
      };
      return param;
    },

    /*queryParams: function (params) {
      return params;
    },*/

    sortName: 'createdAt',
    sortOrder: 'asc',
    pagination: true,
    sidePagination: 'server',
    pageNumber : 1,
    pageSize: 15,
    pageList: [20, 40, 50, 100],
    showHeader : true,
    queryParamsType : 'limit',
    toolbar: "#toolbar",
    showRefresh: false,
    showToggle: false

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

function operateFormatter(value, row, index) {
  if (row.system == 0) {
	  
	  var roleId = $("#roleId").val();
		if (roleId ==7) {
			return [
				
	        ].join('');
		} else {
			 return ['<shiro:haspermission name="team:edit"><a class="btn btn-success btn-xs" href="/admin/userTeam/edit?id='
				    + row.id
				    + '" >', '<i class="fa fa-edit"></i>修改', '</a></<shiro:haspermission> '].join('');
		}
	  
  }
}

window.operateEvents = {
  'click .remove': function (e, value, row, index) {
    operaModel.delRow(row.id, '/admin/user/delete', 'id');
  }
};


/**
 * 查询
 */
$('#search').click(function () {
  $table.bootstrapTable('refresh');
});