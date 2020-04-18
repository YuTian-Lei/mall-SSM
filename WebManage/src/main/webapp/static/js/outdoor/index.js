$table = $("#dataGrid");
$(function () {
    initDataGrid();
});

function initDataGrid() {
    $table.bootstrapTable({
        height: tableModel.getHeight(),
        fixedColumns: true,
        // fixedNumber: 3,//固定列数
        idField: "id",
        columns: [
            {
                title: "序号",
                field: 'no',
                align: "center",
                width: 40,
                rowspan: 1,
                valign: 'middle',
                formatter: function (value, row, index) {
                    var options = $table.bootstrapTable('getOptions');
                    return options.pageSize * (options.pageNumber - 1) + index + 1;
                }
            },
            {title: "区属", align: "center", field: "regionName", rowspan: 1, valign: 'middle'},
            {title: "学校名称", align: "center", field: "schoolName", rowspan: 1, valign: 'middle'},
            {title: "年级", align: "center", field: "grade", rowspan: 1, valign: 'middle'},
            {title: "班级", align: "center", field: "className", rowspan: 1, valign: 'middle'},
            {title: "星期", align: "center", field: "week", rowspan: 1, valign: 'middle'},
            {title: "户外活动", align: "center", field: "checkFlag", rowspan: 1, valign: 'middle', formatter:checkFlagFormat},
            {title: "开始日期", align: "center", field: "startDate", rowspan: 1, valign: 'middle', formatter: tableModel.birthdayFormat},
            {title: "结束日期", align: "center", field: "endDate", rowspan: 1, valign: 'middle', formatter: tableModel.birthdayFormat},
            {title: "活动地点", align: "center", field: "activityPlace", rowspan: 1, valign: 'middle'},
            {title: "活动时长", align: "center", field: "activityTime", rowspan: 1, valign: 'middle'},
            {title: "人均活动时长", align: "center", field: "avgActivityTime", rowspan: 1, valign: 'middle'},
            {title: "活动形式", align: "center", field: "activityForm", rowspan: 1, valign: 'middle'},
            {title: "参加人数", align: "center", field: "attendNum", rowspan: 1, valign: 'middle'},
            {title: "登记日期", align: "center", field: "createDate", rowspan: 1, valign: 'middle', formatter: tableModel.dateFormat},
            {title: "操作", align: "center", rowspan: 1, valign: 'middle', events: operateEvents, formatter: operateFormatter}

        ],
        url: '/outdoor/activities/list',
        queryParams: function (params) {
            var param = $('#outdoor-form').serialize();
            param += '&page=' + params.offset + '&rows=' + params.limit;
            console.log(param)
            return param;
        },
        responseHandler: function (res) {
            return {
                rows: res.result.pageInfo.list, total: res.result.pageInfo.total
            }
        },
        sortName: 'createDate',
        sortOrder: 'desc',
        pagination: true,
        sidePagination: 'server',
        pageSize: 20,
        pageNumber: 1,
        pageList: [20, 40, 60, 80],
        toolbar: "#toolbar",
        showRefresh: false,
        showToggle: false,
        queryParamsType: 'limit'
    });
    $table.bootstrapTable('hideColumn', 'id');
}

function operateFormatter(value, row, index) {
    return [
        ' <a class="detail btn btn-success btn-xs" href="javascript:void(0);" >',
        '<i class="fa fa-search"></i>详情',
        '</a> ',
        ' <a class="update btn btn-primary btn-xs" href="javascript:void(0);" >',
        '<i class="fa fa-edit"></i>修改',
        '</a> ',
        '<a class="delete btn btn-warning btn-xs" href="javascript:void(0);" >',
        '<i class="fa fa-remove"></i>删除',
        '</a>  '
    ].join('');
}

window.operateEvents = {
    'click .detail': function (e, value, row, index) {
        $.modal.openDetail("登记详情",'/outdoor/activities/detail?id=' + row.id);
    },
    'click .update': function (e, value, row, index) {
        var url = '/outdoor/activities/edit?id=' + row.id;
        window.location.href = url;
    },
    'click .delete': function (e, value, row, index) {
        layer.confirm("确定删除该条信息吗？", {
            icon: 3,
            title: "系统提示",
            btn: ['确认', '取消']
        }, function (index) {
            layer.close(index);
            $.getJSON('/outdoor/activities/delete', {id: row.id,week:row.week}, function (ret) {
                if (ret.status) {
                    layer.msg(ret.msg, {icon: 1});
                    setTimeout(function () {
                        //刷新
                        location.reload();
                    }, 2000);
                    /*$table.bootstrapTable('remove', {
                        field: id,
                        values: [row.id]
                    });*/
                } else {
                    layer.msg(ret.msg, {icon: 2});
                }
            });
        });
        // operaModel.delRow(row.id, '/outdoor/activities/delete', 'id');
    }
}

function checkFlagFormat(value) {
    return value == 1 ? "是" : "否";
}

/**
 * 查询
 */
$('#search').click(function () {
    $table.bootstrapTable('refresh');
});