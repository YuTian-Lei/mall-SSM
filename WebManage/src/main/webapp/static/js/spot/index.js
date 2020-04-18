$table = $("#dataGrid");
$(function () {
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    if (startDate == '' && endDate == ''){
        operaModel.initDate();
    }
    initDataGrid();
    // 选择文件后上传
    /*$("#uploadFile").change(function () {
    	$("#uploadFile").val("");
        uploadFile();
    })*/

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
                width: 40,
                rowspan: 2,
                valign: 'middle',
                formatter: function (value, row, index) {
                    var options = $table.bootstrapTable('getOptions');
                    return options.pageSize * (options.pageNumber - 1) + index + 1;
                }
            },
            {title: "关联筛查计划", align: "center", field: "planName", rowspan: 2, valign: 'middle'},
            {title: "姓名", align: "center", field: "studentName", rowspan: 2, valign: 'middle'},
            {title: "学校", align: "center", field: "sschoolName", rowspan: 2, valign: 'middle'},
            {title: "年级", align: "center", field: "grade", rowspan: 2, valign: 'middle'},
            {title: "班级", align: "center", field: "cclassName", rowspan: 2, valign: 'middle'},
            {title: "性别", align: "center", field: "sex", rowspan: 2, valign: 'middle', formatter: tableModel.sexFormat},
            {title: "身份证号", align: "center", field: "cardNo", rowspan: 2, valign: 'middle'},
            {title: "出生日期", align: "center", field: "birthday", rowspan: 2, valign: 'middle', formatter: birthDayFormat},
            {title: "联系电话", align: "center", field: "mobilePhone", rowspan: 2, valign: 'middle'},
            {title: "裸眼视力", align: "center", colspan: 2, rowspan: 1, valign: 'middle'},
            {title: "戴镜类型", align: "center", field: "glasses", rowspan: 2, valign: 'middle',formatter: tableModel.glassFormat},
            {title: "戴镜视力", align: "center", colspan: 2, rowspan: 1, valign: 'middle'},
            {title: "屈光（右眼）", align: "center", colspan: 4, rowspan: 1, valign: 'middle'},
            {title: "屈光（左眼）", align: "center", colspan: 4, rowspan: 1, valign: 'middle'},
            {title: "瞳距", align: "center", field: "pupillaryDistance", rowspan: 2, valign: 'middle'},
            
            {title: "初筛结果", align: "center", field: "result", rowspan: 2, valign: 'middle'},
            {title: "检查人", align: "center", field: "examinator", rowspan: 2, valign: 'middle'},
            {title: "所属单位", align: "center", field: "unitOfAttribution", rowspan: 2, valign: 'middle'},
            {title: "是否到院", align: "center", field: "", rowspan: 2, valign: 'middle'},
            // {title: "关注类型", align: "center", field: "followType", rowspan: 2, valign: 'middle', formatter: fllowType},
            {title: "视力未筛查原因", align: "center", field: "visionReason", rowspan: 2, valign: 'middle'},
            {title: "屈光未筛查原因", align: "center", field: "refractReason", rowspan: 2, valign: 'middle'},
            {title: "检查日期", align: "center", field: "examDate", rowspan: 2, valign: 'middle', formatter: dateFormat},
            {title: "测试地点", align: "center", field: "checkAddress", rowspan: 2, valign: 'middle'},
            {title: "连续检查记录", align: "center", rowspan: 2, valign: 'middle'},
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
        url: '/admin/spot/list',
        queryParams: function (params) {
            // console.log("params\n",params)
            var param = $('#spot-form').serialize();
            param += '&page=' + params.offset + '&rows=' + params.limit;
            // console.log(param);
            return param;
        },
        responseHandler: function (res) {
            // console.log("res",res)
            return {
                rows: res.result.pageInfo.list, total: res.result.pageInfo.total
            }
        },
        sortName: 'examDate',
        sortOrder: 'desc',
        pagination: true,
        sidePagination: 'server',
        pageSize: 15,
        pageList: [15, 25, 50, 100],
        toolbar: "#toolbar",
        showRefresh: false,
        showToggle: false
    });
}

/* 保留整数 */
function formattedData1(value, row, index){
	return (value == '' || value == null)&& value!=0 ? "-" : value.toFixed(0);
}
/* 保留两位 */
function formattedData(value, row, index){
	return (value == '' || value == null)&& value!=0 ? "-" : value.toFixed(2);
}
/* 保留3位 */
function formattedData3(value, row, index){
	return (value == '' || value == null)&& value!=0 ? "-" : value.toFixed(3);
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
function operateFormatter(value, row, index) {
    return [
        ' <a class="detail btn btn-warning btn-xs" href="javascript:void(0);" >',
        '<i class="fa fa-search"></i>详情',
        '</a>  '
    ].join('');
}

window.operateEvents = {
    'click .detail': function (e, value, row, index) {
        window.location.href = '/admin/spot/detail?id=' + row.id
    }
};

function dateFormat(value, row, index) {
    return isEmpty(value) ? '-' : moment(value).format('YYYY-MM-DD');
}

function birthDayFormat(value, row, index) {
	return isEmpty(value) ? '-' : moment(value).format('YYYY-MM-DD');
}

function vision(value) {
	/*return Math.round(value * 10) / 10.0;*/
	return  (value== ''|| value == null ) ? "-" : value.toFixed(1);
}

function formattedCvaRightData1(value, row, index){
	if (row.glasses == 2) {
    	return "-";
    } else {
    	return (value == '' || value == null)&& value!=0 ? "-" : value.toFixed(1);
    }
}

/**
 * 查询
 */
$('#search').click(function () {
    $table.bootstrapTable('refresh');
});