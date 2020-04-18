$table = $("#dataGrid");
$(function () {
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    if (startDate == '' && endDate == ''){
        operaModel.initDate();
    }
    initDataGrid();
    var errorRate = $("#errorRate").val();
    if (errorRate != "") {
        var rate = errorRate.replace("%", "");
        if (rate > 5) {
            $('#rate').css({color: "rgba(236,17,17,0.7)"});
        }
    }

});

function initDataGrid() {

    $table.bootstrapTable({
        height: tableModel.getHeight(),
        fixedColumns: true,
        fixedNumber: 3,//固定列数
        idField: "id",
        columns: [[
            {
                title: "序号",
                field: 'no',
                align: "center",
                width: 50,
                rowspan: 2,
                valign: 'middle',
                formatter: function (value, row, index) {
                    var options = $table.bootstrapTable('getOptions');
                    return options.pageSize * (options.pageNumber - 1) + index + 1;
                }
            },
            // {
            //     checkbox: true,
            //     valign: 'middle',
            //     rowspan: 2
            // },
            {title: "关联筛查计划", align: "center", field: "planName", rowspan: 2, valign: 'middle'},
            {
                title: "异常/正常",
                align: "center",
                field: "visionStatus",
                rowspan: 2,
                valign: 'middle'
            },
            {title: "姓名", align: "center", field: "studentName", rowspan: 2, valign: 'middle'},
            {title: "学校", align: "center", field: "schoolName", rowspan: 2, valign: 'middle'},
            {title: "班级", align: "center", field: "className", rowspan: 2, valign: 'middle'},
            {title: "年级", align: "center", field: "gradeName", rowspan: 2, valign: 'middle'},
            {title: "性别", align: "center", field: "sex", rowspan: 2, valign: 'middle', formatter: tableModel.sexFormat},
            {title: "身份证号", align: "center", field: "cardNo", rowspan: 2, valign: 'middle'},
            {title: "出生日期", align: "center", field: "birthday", rowspan: 2, valign: 'middle', formatter: birthDayFormat},
            {title: "联系电话", align: "center", field: "mobilePhone", rowspan: 2, valign: 'middle'},
            {title: "裸眼视力", align: "center", colspan: 2, rowspan: 1, valign: 'middle'},
            {title: "戴镜类型", align: "center", field: "glasses", rowspan: 2, valign: 'middle', formatter: tableModel.glassFormat},
            {title: "戴镜视力", align: "center", colspan: 2, rowspan: 1, valign: 'middle'},
            {title: "屈光（右眼）", align: "center", colspan: 4, rowspan: 1, valign: 'middle'},
            {title: "屈光（左眼）", align: "center", colspan: 4, rowspan: 1, valign: 'middle'},
            {title: "瞳距", align: "center", field: "pupillaryDistance", rowspan: 2, valign: 'middle'},
            
            {title: "初筛结果", align: "center", field: "result", rowspan: 2, valign: 'middle'},
            {title: "检查人", align: "center", field: "examinator", rowspan: 2, valign: 'middle'},
            {title: "是否到院", align: "center", field: "", rowspan: 2, valign: 'middle'},
            // {title: "关注类型", align: "center", field: "followType", rowspan: 2, valign: 'middle', formatter: fllowType},
            {title: "检查日期", align: "center", field: "examDate", rowspan: 2, valign: 'middle', formatter: dateFormat},
            {title: "测试地点", align: "center", field: "checkAddress", rowspan: 2, valign: 'middle'},
            {title: "连续检查记录", align: "center", rowspan: 2, valign: 'middle'},
            {title: "上传状态", valign: "middle",align: "center",field:'uploadFlag', colspan: 1, rowspan: 2,formatter:uploadFormatter},
            {title: "视力未筛查原因", align: "center", field: "visionReason", rowspan: 2, valign: 'middle'},
            {title: "屈光未筛查原因", align: "center", field: "refractReason", rowspan: 2, valign: 'middle'},
            {title: "第三次测量数据", align: "center", rowspan: 2, valign: 'middle', events: thirdEvents, formatter: thirdDetailFormatter},
            {title: "操作", align: "center", rowspan: 2, valign: 'middle', events: operateEvents, formatter: operateFormatter},

        ], [

            {title: "右（R）", align: "center", field: "nakedVisionRight", valign: 'middle', formatter: vision},
            {title: "左（L）", align: "center", field: "nakedVisionLeft", valign: 'middle', formatter: vision},
            {title: "右（R）", align: "center", field: "cvaRight", valign: 'middle', formatter: formattedCvaRightData1},
            {title: "左（L）", align: "center", field: "cvaLeft", valign: 'middle', formatter: formattedCvaRightData1},
            {title: "球镜", align: "center", field: "oneRightDs", valign: 'middle',formatter: formattedData4},
            {title: "柱镜", align: "center", field: "oneRightDc", valign: 'middle',formatter: formattedData},
            {title: "轴位", align: "center", field: "oneRightAxis", valign: 'middle',formatter: formattedData1},
            {title: "等效球镜", align: "center", field: "oneRightSe", valign: 'middle',formatter: formattedData3},
            {title: "球镜", align: "center", field: "oneLeftDs", valign: 'middle',formatter: formattedData4},
            {title: "柱镜", align: "center", field: "oneLeftDc", valign: 'middle',formatter: formattedData},
            {title: "轴位", align: "center", field: "oneLeftAxis", valign: 'middle',formatter: formattedData1},
            {title: "等效球镜", align: "center", field: "oneLeftSe", valign: 'middle',formatter: formattedData3}

        ]],
        url: '/admin/spot/listPerson',
        queryParams: function (params) {
            var param = $('#spot-form').serialize();
            param += '&page=' + params.offset + '&rows=' + params.limit;
            console.log("query student params:",param);
            return param;
        },
        responseHandler: function (res) {
            return {
                rows: res.result.pageInfo.list, total: res.result.pageInfo.total
            }
        },
        // 选中所有
        onCheckAll: function () {
            $('input[name="btSelectItem"]').prop('checked', true);
            // 取消所有
        }, onUncheckAll: function () {
            $('input[name="btSelectItem"]').prop('checked', false);
            // 选中单个
        }, onCheck: function () {
            var all = $('input[name="btSelectItem"]').length / 2;
            var checked = $table.bootstrapTable('getSelections').length;
            if (all == checked) {
                $('input[name="btSelectAll"]').prop('checked', true);
            }

            // 取消单个
        }, onUncheck: function () {
            $('input[name="btSelectAll"]').prop('checked', false);
        },
        onLoadSuccess: function (e) {  //加载成功时执行
            var arr = e.rows;
            var rows = $table[0].rows;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].reserve1 == 'true' ) {
                	rows[i + 2].setAttribute("style", "background:rgba(236, 17, 17, 0.48)");
                }
            }
        },
        sortName: 'examDate',
        sortOrder: 'desc',
        pagination: true,
        sidePagination: 'server',
        pageSize: 15,
        pageList: [20, 40, 50, 100],
        toolbar: "#toolbar",
        showRefresh: false,
        showToggle: false
    });
    $table.bootstrapTable('hideColumn', 'visionStatus');
}

function thirdDetailFormatter(value, row, index) {
	 if(row.viThird == 0 && row.reThird == 0){
		 return [
			 ' <p>',
			 '---',
			 '</p>'
			 ].join('');
	 }else{
		 return [
			 ' <a class="thirddetail btn btn-warning btn-xs" href="javascript:void(0)" >',
			 '<i class="fa fa-search"></i>详情',
			 '</a>'
			 ].join('');
		
	 }
}
window.thirdEvents = {
		'click .thirddetail': function (e, value, row, index) {
			window.location.href = '/admin/spot/thirdDetail?id=' + row.screenThird
		}
}

function operateFormatter(value, row, index) {
    var dis = '';
    var roleId = $("#roleId").val();
	if (roleId ==7 || row.screenThird != 0) {
		return [
			' <a class="detail btn btn-warning btn-xs" href="javascript:void(0)" >',
	        '<i class="fa fa-search"></i>详情',
	        '</a>'
        ].join('');
	} else {
    	return [
    		 '<a class="detail btn btn-warning btn-xs" href="javascript:void(0)" >',
    	        '<i class="fa fa-search"></i>详情',
    	        '</a>',
    	        '<a class="delete btn btn-warning btn-xs '+dis+'" href="javascript:void(0);" >',
    	        '<i class="fa fa-remove"></i>删除',
    	        '</a>  '
        ].join('');
	}
    
    
    
}

window.operateEvents = {
    'click .detail': function (e, value, row, index) {
        window.location.href = '/admin/spot/detailForLocal?id=' + row.id
    },
    'click .delete': function (e, value, row, index) {
        var id = row.id;
        // operaModel.delRow(row.id, '/admin/spot/deleteSpot', 'id');

        layer.confirm("确认要删除吗，删除后不能恢复", {title: "删除确认"}, function (index) {

            $.post("/admin/spot/deleteSpot", {id: id}, function (data) {
                var num = data.resultCode == 1 ? 1 : 0;
                layer.msg(data.msg, {icon: 1}, function () {
                    if (data.referer) {
                        operaModel.redirect(data.referer);//返回带跳转地址
                    } else {
                        if (data.state === 'success') {
                            operaModel.reloadPage(window);//刷新当前页
                        }
                    }
                });
                layer.msg(data.message, {icon: num, shade: 0.3, offset: '40%', time: 2000});
                setTimeout(function () {
                    //刷新
                    location.reload();
                }, 1000);
            });
        });
    }
}


function dateFormat(value, row, index) {
    if (isEmpty(value)){
        return "-";
    }
    return moment(value).format('YYYY-MM-DD');
}

function birthDayFormat(value, row, index) {
    if (isEmpty(value)){
        return "-";
    }
    return moment(value).format('YYYY-MM-DD');
}

/* 保留3位 */
function formattedData3(value, row, index){
	return (value == 0 ) ?  "0.000" : (value== ''|| value == null ) ? "-" : value.toFixed(3);
}
/* 保留2位并且正负号 */
function formattedData4(value, row, index){
	if (value != null) {
		se =  value.toFixed(2);
		if(se > 0){
			return "+"+se;
		}else{
			return se;
		}
	}
}

function fllowType(value, row, index) {
    if (value == '4'){
        return "高危预警";
    }else if (value == '5'){
        return "高危预警";
    }else {
        return "-";
    }

}

function vision(value) {
    /*return Math.round(value * 10) / 10.0;*/
    return (value == '' || value == null)&& value!=0 ? "-" : value.toFixed(1);
}
function formattedData1(value) {
	return (value == '' || value == null) && value!=0? "-" : value.toFixed(0);
}
function formattedData(value) {
	return (value == '' || value == null)&& value!=0 ? "-" : value.toFixed(2);
}

function formattedCvaRightData1(value, row, index){
	if (row.glasses == 2) {
    	return "-";
    } else {
    	return (value == '' || value == null)&& value!=0 ? "-" : value.toFixed(1);
    }
}


/**
 *  上传数据
 */
function uploadData() {
    // var ids = getParams();
    // $('#ids').val(ids);
    // window.location.href = "/admin/spot/upload?ids=" + ids;
}

/**
 * 获取/导出下载参数
 * @returns {string}
 */
function getParams() {
    var ids = '';
    var values = $table.bootstrapTable('getSelections');
    for (var i = 0; i < values.length; i++) {
        ids += values[i].id + ',';
    }
    var queryParam = ids;
    console.log(queryParam)
    return queryParam;
}

/**
 * 上传状态
 */
function uploadFormatter(value, row, index) {

    if (value==1){
      return  '<font color= "green">已上传</font>';
    }else {
       return "待上传";
    }

}

/**
 * 查询
 */
$('#search').click(function () {
    $table.bootstrapTable('refresh');
});