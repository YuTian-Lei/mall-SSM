$table2 = $("#dataGrid2");
$(function() {
	initDate2();
	initDataGrid2();
	$("input[name='btSelectAll']").attr("id", "tableSelectALl");
	$("input[name='btSelectAll']").attr("onclick", "SelectALl()");
	/*$("#upteainput").change(function() {
		cloudUpload();
	})*/

});

function SelectALl() {
	if (!$("#tableSelectALl").is(':checked')) {
		$("input[name='btSelectItem']").each(function() {
			this.checked = true;
		})

	} else {
		$("input[name='btSelectItem']").each(function() {
			this.checked = false;
		})
	}

}
/*function importExcel() {
	$("#upteainput").val("");
	$("#upteainput").click();
}
function cloudUpload() {
	$('#upform').ajaxSubmit({
		type : 'post',
		success : function(data) {
			if (data.resultCode == "1") {
				$.message({
					message : '文件上传成功',
					type : 'success'
				});

			} else {
				$.message({
					message : data.errormsg,
					type : 'error',
					time : '3000'
				});
			}
			$("#upform").resetForm();
		}
	})
}*/

function initDataGrid2() {
	$table2.bootstrapTable({
		height : tableModel.getHeight(),
		columns : [
			[
				{
					field : 'state',
					checkbox : true,
					rowspan : 2,
					align : "center",
					valign : "middle"
				},
				{
					title : "关联筛查计划",
					field : "planName",
					rowspan : 2,
					align : "center",
					valign : "middle",
					"class" : 'W120'
				},
				{
					title : "姓名",
					field : "studentName",
					rowspan : 2,
					align : "center",
					valign : "middle",
					"class" : 'W60'
				},
				{
					title : "所属学校",
					field : "schoolName",
					rowspan : 2,
					align : "center",
					valign : "middle",
					"class" : 'W120'
				},
				{
					title : "年级",
					field : "gradeName",
					rowspan : 2,
					align : "center",
					valign : "middle",
					"class" : 'W120'
				},
				{
					title : " 班级",
					field : "className",
					rowspan : 2,
					align : "center",
					valign : "middle",
					"class" : 'W120'
				},
				{
					title : "性别",
					field : "sex",
					rowspan : 2,
					align : "center",
					valign : "middle",
					formatter : visionSex
				},
				{
					title : "身份证号",
					field : "cardNo",
					rowspan : 2,
					align : "center",
					valign : "middle"
				},
				{
					title : "出生日期",
					field : "birthday",
					rowspan : 2,
					align : "center",
					valign : "middle",
					formatter : dateFormat,
					"class" : 'W120'
				},
				{
					title : "联系电话",
					field : "phone",
					rowspan : 2,
					align : "center",
					valign : "middle"
				},
				{
					title : "裸眼视力",
					valign : "middle",
					align : "center",
					colspan : 2,
					rowspan : 1
				},
				{
					title : "戴镜视力",
					valign : "middle",
					align : "center",
					colspan : 2,
					rowspan : 1
				},
				{
					title : "屈光(右眼)",
					valign : "middle",
					align : "center",
					colspan : 4,
					rowspan : 1
				},
				{
					title : "屈光(左眼)",
					valign : "middle",
					align : "center",
					colspan : 4,
					rowspan : 1
				},
				{
					title : "瞳距",
					valign : "middle",
					align : "center",
					field : "pupillaryDistance",
					colspan : 1,
					rowspan : 2,
				},
				/*{
					title : "戴镜类型",
					valign : "middle",
					align : "center",
					colspan : 1,
					rowspan : 2,
					field : "glasses",
					formatter : isGlasses
				},*/
				{
					title : "初筛结果",
					valign : "middle",
					align : "center",
					field : "result",
					colspan : 1,
					rowspan : 2
				},
				{
					title : "检查人",
					valign : "middle",
					field : 'examinator',
					align : "center",
					colspan : 1,
					rowspan : 2
				},
				{
					title : "是否到院",
					valign : "middle",
					align : "center",
					field : 'hospitalFlag',
					formatter : visionHospitalflag,
					colspan : 1,
					rowspan : 2
				},
				{
					title : "关注类型",
					valign : "middle",
					align : "center",
					field : 'followType',
					formatter : visionFollowType,
					colspan : 1,
					rowspan : 2
				},
				{
					title : "检查日期",
					valign : "middle",
					align : "center",
					field : 'examDate',
					colspan : 1,
					rowspan : 2,
					formatter : dateFormatYMD,
					"class" : 'W120'
				},
				{
					title : "测试地点",
					valign : "middle",
					align : "center",
					field : 'checkAddress',
					colspan : 1,
					rowspan : 2
				},
				{
					title : "连续检查记录",
					valign : "middle",
					align : "center",
					colspan : 1,
					rowspan : 2
				},
				{
					title : "操作",
					valign : "middle",
					align : "center",
					colspan : 1,
					rowspan : 2,
					events : operateEvents2,
					formatter : operateFormatter2,
					"class" : 'W120'
				}
			],
			[
				{
					field : 'nakedVisionRight',
					title : '右(R)',
					valign : "middle",
					align : "center"
				},

				{
					field : 'nakedVisionLeft',
					title : '左(L)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'cvaRight',
					title : '右(R)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'cvaLeft',
					title : '左(L)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneRightDs',
					title : '球镜',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneRightDc',
					title : '柱镜',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneRightAxis',
					title : '轴位',
					valign : "middle",
					align : "center",
					valign : "middle"
				},
				{
					field : 'oneLeftSe',
					title : '等效球镜',
					valign : "middle",
					align : "center"
				},

				{
					field : 'oneLeftDs',
					title : '球镜',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneLeftDc',
					title : '柱镜',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneLeftAxis',
					title : '轴位',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneLeftSe',
					title : '等效球镜',
					valign : "middle",
					align : "center"
				},
			]
		],
		url : '/admin/highrisk/list',
		queryParams : function(params) {
			var param = {
				pageNumber : params.offset,
				pageSize : params.limit,
				planName : $("#planName2").val(),
				schoolNmae : $("#schoolName2").val(),
				className : $("#className2").val(),
				maxRange : $("#maxRange2").val(),
				minRange : $("#minRange2").val(),
				startDate : $("#startDate2").val(),
				endDate : $("#endDate2").val(),
				examinator : $("#examinator2").val(),
				hospitalFlag : 0,
				unitOfAttribution : $("#unitOfAttribution2").val(),
				type : 1
			};

			return param;
		},
		sortName : 'examDate',
		sortOrder : 'desc',
		pagination : true,
		sidePagination : 'server',
		smartDisplay:false,
		pageSize : 10,
		pageNumber : 1,
		pageList : [ 20, 40, 50, 100 ],
		toolbar : "#toolbar",
		showRefresh : false,
		showToggle : false,
		showHeader : true,
		queryParamsType : 'limit',
		fixedColumns : true, //固定列
		fixedNumber : 3, //固定前两列
	});

}

function operateFormatter2(value, row, index) {
	if (row.hospitalFlag == 0) {
		return [
			
			'<shiro:haspermission name="screeningMass:highriskdetail"><a class="toRecheck btn btn-warning btn-xs" href="javascript:void(0);" >',
			'<i class="fa fa-plus"></i>去复查',
			'</a></shiro:haspermission>  ',
			'<shiro:haspermission name="screeningMass:highriskdetail"><a class="detail btn btn-warning btn-xs" href="javascript:void(0);" >',
			'<i class="fa fa-search"></i>详情',
			'</a></shiro:haspermission>  '
			].join('');
	} else {
		return [
			'<shiro:haspermission name="screeningMass:highriskdetail"><a class="detail btn btn-warning btn-xs" href="javascript:void(0);" >',
			'<i class="fa fa-search"></i>详情',
			'</a></shiro:haspermission>  '
			].join('');
	}
}

window.operateEvents2 = {
	'click .detail' : function(e, value, row, index) {
		window.location.href = '/admin/highrisk/detail?id=' + row.id + '&type=1';
	},
	'click .toRecheck' : function(e, value, row, index) {
	window.location.href = '/admin/recheck/toRecheck?id=' + row.id;
}
};

function addTeacher() {
	layer.open({
		type : 2,
		title : '筛选详情',
		shadeClose : true,
		shade : false,
		maxmin : true,
		area : [ '500px', '400px' ],
		content : '/admin/teacher/detail'
	});
}

/*数据下载*/
function exportExcel() {
	var array = $table2.bootstrapTable('getSelections');
	var schoolName = $("#schoolNmae").val();
	if (array.length < 1 && schoolName == '') {
		$.message({
			message : '请至少选择一条数据或者一个学校',
			type : 'error',
			time : '3000'
		});
		return;
	}
	var ids = "";
	for (let index in array) {
		id = array[index].id;
		ids += id + ",";
	}



	$.post('/admin/alreadscreening/excelExport', {
		'ids' : ids,
		'schoolName' : $("#schoolNmae").val()
	}, function(data) {
		if (data.resultCode == "1") {
			$.message({
				message : '下载任务生成成功',
				type : 'success'
			});
		} else {
			$.message({
				message : data.errormsg,
				type : 'error',
				time : '3000'
			});
		}
	});


}

function dateFormat(value, row, index) {
	return moment(value).format('YYYY-MM-DD');
}

function dateFormatYMD(value, row, index) {
	return moment(value).format('YYYY-MM-DD');
}
function valueFormat(value, row, index) {
	return row.pupillaryDistance;
}

function isGlasses(value, row, index) {
	if (row.glasses == '0') {
		return "不戴镜";
	} else if (row.glasses == '1') {
		return "戴框架镜";
	} else if (row.glasses == '2') {
		return "塑形镜";
	} else if (row.glasses == '3') {
		return "矫正";
	}

}

function visionState(value, row, index) {
	return row.visionStatus == '1' ? "异常" : "正常";
}

function visionSex(value) {
	return value == '1' ? "男" : "女";
}
function visionHospitalflag(value) {
	return value == '1' ? "是" : "否";
}
function visionFollowType(value) {
	return "高危";
}
/**
 * 查询
 */
$('#search2').click(function() {
	$table2.bootstrapTable('refresh');
});



/* 视力筛查范围验证 */
function upperCase1(obj) {
	var val = obj.value;

	if (val < 0 || val > 5.3) {

		$.message({
			message : "视力范围应在0-5.3之间，请重新输入",
			type : 'error',
			time : '3000'
		});
		obj.value = '';
	}
}
function initDate2() {
	var date = (new Date().getFullYear()) + "-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate());
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	if (month.length == 1) {
		month = "0" + month;
	}
	var day = arr[2]; //获取当前日期的日

	document.getElementById("endDate2").value = year + "-" + (month.length < 2 ? '0' + month : month) + "-" +
	(day.length < 2 ? '0' + day : day);

	var days = new Date(year, month, 0);
	days = days.getDate(); //获取当前日期中月的天数
	var year2 = year;
	var month2 = parseInt(month) - 1;
	if (month2 == 0) {
		year2 = parseInt(year2) - 1;
		month2 = 12;
	}
	var day2 = day;
	var days2 = new Date(year2, month2, 0);
	days2 = days2.getDate();
	if (day2 > days2) {
		day2 = days2;
	}
	if (month2 < 10) {
		month2 = '0' + month2;
	}
	document.getElementById("startDate2").value = year2 + "-" + (month2.length < 2 ? '0' + month2 : month2) + "-" +
	(day2.length < 2 ? '0' + day2 : day2);
}