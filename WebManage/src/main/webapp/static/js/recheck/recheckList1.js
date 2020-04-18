$table = $("#dataGrid");

$(function() {
	initDate();
	initDataGrid();
	$("input[name='btSelectAll']").attr("id", "tableSelectALl");
	$("input[name='btSelectAll']").attr("onclick", "SelectALl()");
	/* $("#upteainput").change(function () {
		uploadFile();
	})  */

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
function importExcel() {
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
}

function initDataGrid() {
	$table.bootstrapTable("removeAll");
	$table.bootstrapTable({
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
					title : "姓名",
					field : "sutdentName",
					rowspan : 2,
					align : "center",
					valign : "middle",
					"class" : 'W120'
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
					field : "idCard",
					rowspan : 2,
					align : "center",
					valign : "middle"
				},
				{
                    field: 'idCarded',
                    rowspan : 2,
                    title: '隐藏身份证号',
                    align : "center",
                    visible: false   //这一列隐藏
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
				/*{
					title : "IOLMaster 700",
					valign : "middle",
					align : "center",
					colspan : 10,
					rowspan : 1
				},
				{
					title : "A超",
					valign : "middle",
					align : "center",
					colspan : 6,
					rowspan : 1
				},
				{
					title : "OCT",
					valign : "middle",
					align : "center",
					colspan : 2,
					rowspan : 1
				},*/
				{
					title : "眼压",
					valign : "middle",
					align : "center",
					colspan : 2,
					rowspan : 1
				},
				/*{
					title : "矫正视力",
					valign : "middle",
					align : "center",
					colspan : 2,
					rowspan : 1,
				},*/
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
					title : "屈光",
					valign : "middle",
					align : "center",
					colspan : 8,
					rowspan : 1
				},
				/*{
					title : "屈光",
					valign : "middle",
					align : "center",
					colspan : 4,
					rowspan : 1
				},
				{
					title : "屈光",
					valign : "middle",
					align : "center",
					colspan : 4,
					rowspan : 1
				},*/
				{
					title : "瞳距",
					valign : "middle",
					align : "center",
					field : "pupillaryDistance",
					colspan : 1,
					rowspan : 2,
				},
				
				
				{
					title : "裂隙灯",
					valign : "middle",
					align : "center",
					colspan : 10,
					rowspan : 1
				},
				/*{
					title : "眼睑",
					valign : "middle",
					align : "center",
					colspan : 2,
					rowspan : 1
				},
				{
					title : "结膜",
					valign : "middle",
					align : "center",
					colspan : 2,
					rowspan : 1
				},
				{
					title : "角膜",
					valign : "middle",
					align : "center",
					colspan : 2,
					rowspan : 1
				},
				{
					title : "前房",
					valign : "middle",
					align : "center",
					colspan : 2,
					rowspan : 1
				},
				{
					title : "晶状体",
					valign : "middle",
					align : "center",
					colspan : 2,
					rowspan : 1
				},*/
				{
					title : "散瞳电脑验光",
					valign : "middle",
					align : "center",
					colspan : 8,
					rowspan : 1
				},
				/*{
					title : "散瞳右眼",
					valign : "middle",
					align : "center",
					colspan : 4,
					rowspan : 1
				},
				{
					title : "散瞳左眼",
					valign : "middle",
					align : "center",
					colspan : 4,
					rowspan : 1
				},*/
				{
					title : "散瞳瞳距",
					valign : "middle",
					align : "center",
					field : "mydriasisPd",
					colspan : 1,
					rowspan : 2,
				},
				{
					title : "生物测量仪",
					valign : "middle",
					align : "center",
					colspan : 24,
					rowspan : 1
				},
				/*{
					title : "SW9000右眼",
					valign : "middle",
					align : "center",
					colspan : 12,
					rowspan : 1
				},
				{
					title : "SW9000左眼",
					valign : "middle",
					align : "center",
					colspan : 12,
					rowspan : 1
				},*/
				{
					title : "未检查原因",
					valign : "middle",
					align : "center",
					field : 'visionReason',
					colspan : 1,
					rowspan : 2,
					cellStyle : formatTableUnit,
					formatter : paramsMatter
				},
				{
					title : "配镜处方",
					valign : "middle",
					align : "center",
					field : 'prescription',
					colspan : 1,
					rowspan : 2,
					cellStyle : formatTableUnit,
					formatter : paramsMatter
				},
				{
					title : "复查日期",
					valign : "middle",
					align : "center",
					field : 'checkTime',
					colspan : 1,
					rowspan : 2,
					formatter : dateFormatYMD,
					"class" : 'W120'
				},
			/*	{
					title : "会诊/转诊",
					valign : "middle",
					align : "center",
					colspan : 1,
					rowspan : 2,
					events : consultationDetailEvents,
					formatter : consultationDetailFormatter,
					"class" : 'W120'
				},*/
				/*{
					title : "状态",
					valign : "middle",
					align : "center",
					field : 'recheckStatus',
					colspan : 1,
					rowspan : 2,
					"class" : 'W120'
				},*/
				{
					title : "趋势图",
					valign : "middle",
					align : "center",
					colspan : 1,
					rowspan : 2,
					events : quShiTuEvents,
					formatter : quShiTuFormatter,
					"class" : 'W60'
				},
				{
					title : "操作",
					valign : "middle",
					align : "center",
					colspan : 1,
					rowspan : 2,
					events : consultationOperateEvents,
					formatter : consultationOperateFormatter,
					"class" : 'W180'
				},

				/*{
					title : "操作",
					valign : "middle",
					align : "center",
					colspan : 1,
					rowspan : 2,
					events : operateEvents,
					formatter : operateFormatter,
					"class" : 'W180'
				},
				{
					title : "随访检查记录",
					valign : "middle",
					align : "center",
					colspan : 1,
					rowspan : 2,
					events : operateEvents1,
					formatter : operateFormatter1,
					"class" : 'W120'
				}*/
			],
			[
				/*{
					field : 'iolmasterRightAl',
					title : '右眼AL',
					valign : "middle",
					align : "center"
				},

				{
					field : 'iolmasterRightAcd',
					title : '右眼ACD',
					valign : "middle",
					align : "center"
				},
				{
					field : 'rightFrontCurvature',
					title : '右眼晶体前表面曲率',
					valign : "middle",
					align : "center"
				},
				{
					field : 'rightBlackCurvature',
					title : '右眼晶体后表面曲率',
					valign : "middle",
					align : "center"
				},
				{
					field : 'iolmasterRightCmt',
					title : '右眼中心凹厚度',
					valign : "middle",
					align : "center"
				},
				{
					field : 'iolmasterLeftAl',
					title : '左眼AL',
					valign : "middle",
					align : "center"
				},

				{
					field : 'iolmasterLeftAcd',
					title : '左眼ACD',
					valign : "middle",
					align : "center"
				},
				{
					field : 'leftFrontCurvature',
					title : '左眼晶体前表面曲率',
					valign : "middle",
					align : "center"
				},
				{
					field : 'leftBlackCurvature',
					title : '左眼晶体后表面曲率',
					valign : "middle",
					align : "center"
				},
				{
					field : 'iolmasterLeftCmt',
					title : '左眼中心凹厚度',
					valign : "middle",
					align : "center"
				},
				{
					field : 'acRightAx',
					title : '眼轴右眼',
					valign : "middle",
					align : "center"
				},
				{
					field : 'acRightCurvature1',
					title : '角膜曲率1右眼',
					valign : "middle",
					align : "center",
					valign : "middle"
				},

				{
					field : 'acRightCurvature2',
					title : '角膜曲率2右眼',
					valign : "middle",
					align : "center"
				},
				{
					field : 'acLeftAx',
					title : '眼轴左眼',
					valign : "middle",
					align : "center"
				},
				{
					field : 'acLeftCurvature1',
					title : '角膜曲率1左眼',
					valign : "middle",
					align : "center",
					valign : "middle"
				},

				{
					field : 'acLeftCurvature2',
					title : '角膜曲率2左眼',
					valign : "middle",
					align : "center"
				},
				{
					field : 'octLeft',
					title : '左眼',
					formatter : visionOctLeft,
					valign : "middle",
					align : "center"
				},
				{
					field : 'octRight',
					title : '右眼',
					formatter : visionOctRight,
					valign : "middle",
					align : "center"
				},*/
				{
					field : 'iopRight',
					title : '右(R)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'iopLeft',
					title : '左(L)',
					valign : "middle",
					align : "center"
				},
				
				
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
					title : '球镜(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneRightDc',
					title : '柱镜(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneRightAxis',
					title : '轴位(右)',
					valign : "middle",
					align : "center",
					valign : "middle"
				},
				{
					field : 'oneRightSe',
					title : '等效球镜(右)',
					valign : "middle",
					align : "center"
				},

				{
					field : 'oneLeftDs',
					title : '球镜(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneLeftDc',
					title : '柱镜(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneLeftAxis',
					title : '轴位(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'oneLeftSe',
					title : '等效球镜(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'eyelidRight',
					title : '眼睑(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'eyelidLeft',
					title : '眼睑(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'conjunctivaRight',
					title : '结膜(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'conjunctivaLeft',
					title : '结膜(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'corneaRight',
					title : '角膜(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'corneaLeft',
					title : '角膜(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'atriaRight',
					title : '前房(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'atriaLeft',
					title : '前房(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'lensRight',
					title : '晶状体(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'lensLeft',
					title : '晶状体(左)',
					valign : "middle",
					align : "center"
				},
				
				
				{
					field : 'mydriasisRightDs',
					title : '球镜(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'mydriasisRightDc',
					title : '柱镜(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'mydriasisRightAxis',
					title : '轴位(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'mydriasisRightSe',
					title : '等效球镜(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'mydriasisLeftDs',
					title : '球镜(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'mydriasisLeftDc',
					title : '柱镜(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'mydriasisLeftAxis',
					title : '轴位(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'mydriasisLeftSe',
					title : '等效球镜(左)',
					valign : "middle",
					align : "center"
				},
				
				
				{
					field : 'swOdAone',
					title : '轴位1(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdAtwo',
					title : '轴位2(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdAl',
					title : '眼轴长度(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdCct',
					title : '角膜厚度(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdAd',
					title : '前房深度(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdAst',
					title : '角膜散光(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdK1',
					title : '角膜曲率1(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdK2',
					title : '角膜曲率2(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdLt',
					title : '晶状体厚度(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdPd',
					title : '瞳孔大小(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdVt',
					title : '玻璃体厚度(右)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOdWtw',
					title : '白到白距离(右)',
					valign : "middle",
					align : "center"
				},
				
				
				{
					field : 'swOsAone',
					title : '轴位1(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsAtwo',
					title : '轴位2(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsAl',
					title : '眼轴长度(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsCct',
					title : '角膜厚度(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsAd',
					title : '前房深度(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsAst',
					title : '角膜散光(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsK1',
					title : '角膜曲率1(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsK2',
					title : '角膜曲率2(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsLt',
					title : '晶状体厚度(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsPd',
					title : '瞳孔大小(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsVt',
					title : '玻璃体厚度(左)',
					valign : "middle",
					align : "center"
				},
				{
					field : 'swOsWtw',
					title : '白到白距离(左)',
					valign : "middle",
					align : "center"
				}
			]
		],
		url : '/admin/recheck/list',
		queryParams : function(params) {
			var endDate = $("#endDate").val();
			if (endDate ) {
				endDate = endDate + " 23:59:59";
			}
			var param = {
				pageNumber : params.offset,
				pageSize : params.limit,
				sutdentName : $("#sutdentName").val(),
				sex : $("#sex").val(),
				idCard : $("#idCard").val(),
				birthday : $("#birthday").val(),
				phone : $("#phone").val(),
				startDate : $("#startDate").val(),
				endDate : endDate,
				hospital : $("#hospital").val(),
				type : 1
			};

			return param;
		},

		sortName : 'checkTime',
		sortOrder : 'desc',
		pagination : true,
		sidePagination : 'server',
		smartDisplay:false,
		pageSize : 10,
		pageNumber : 1,
		smartDisplay : false,
		pageList : [ 10, 40, 50, 100 ],
		toolbar : "#toolbar",
		showRefresh : false,
		showToggle : false,
		showHeader : true,
		queryParamsType : 'limit',
		fixedColumns : true, //固定列
		fixedNumber : 3, //固定前3列
		
	});

}

//导出Excel
function outExcel() {
	var array = $table.bootstrapTable('getSelections');

	if (array.length < 1) {
		$.message({
			message : '请至少选择一条数据',
			type : 'error',
			time : '3000'
		});
		return;
	}

	var texte = [];
	for (let index in array) {
		console.log(array[index])
		var idz = array[index].id;
		texte[index] = idz;
	}

	if (texte.length == 0) {

		layer.msg("请勾选需要导出的数据！", {
			icon : 2,
			shade : 0,
			offset : '40%',
			time : 2000
		});

		return;
	}

	window.location.href = "/admin/recheck/excelExport?id=" + texte;
}

function operateFormatter(value, row, index) {
	return [
		'<shiro:hasPermission name="recheck:view">',
		'<a class="look btn btn-warning btn-xs" href="javascript:void(0);" >',
		'<i class="fa fa-check-square-o"></i>详情',
		'</a>  ',
		'</shiro:hasPermission>',

		/*'<shiro:hasPermission name="recheck:edit">',
		'<a class="detail btn btn-warning btn-xs" href="javascript:void(0);" >',
		'<i class="fa fa-edit"></i>修改',
		'</a>  ',
		'</shiro:hasPermission>',*/


		'<shiro:hasPermission name="recheck:delete">',
		'<a class="deleted btn btn-warning btn-xs" href="javascript:void(0);" >',
		'<i class="fa fa-remove"></i>删除',
		'</a>  ',
		'</shiro:hasPermission>'
	].join('');
}


window.consultationOperateEvents = {
	'click .addConsultation' : function(e, value, row, index) {
		window.location.href = "/admin/recheck/toAddConsultationDetail?recheckId=" + row.id;
	},
	'click .detail' : function(e, value, row, index) {
		window.location.href = "/admin/recheck/toAddOrUpd?id=" + row.id + "&type=2";
	},
};

function consultationOperateFormatter(value, row, index) {
	return [
		'<shiro:hasAnyPermissions name="system:hospitalManager,system:admin">',
		row.reserve1 == '1' ? '<a class="btn btn-default btn-xs" href="javascript:void(0);" disabled="disabled">' :
		'<a class="addConsultation btn btn-warning btn-xs" href="javascript:void(0);" >',
		'<i class="fa"></i>会诊/转诊' ,
		'</a>  ',
		'</shiro:hasAnyPermissions>',

		'<shiro:hasPermission name="recheck:delete">',
		'<a class="detail btn btn-warning btn-xs" href="javascript:void(0);" >',
		'<i class="fa fa-search"></i>详情',
		'</a>  ',
		'</shiro:hasPermission>'
	].join('');
}

window.operateEvents = {
	'click .look' : function(e, value, row, index) {
		window.location.href = "/admin/recheck/toAddOrUpd?id=" + row.id + "&type=2";
	},
	'click .detail' : function(e, value, row, index) {
		window.location.href = "/admin/recheck/toAddOrUpd?id=" + row.id + "&type=1";
	},
	'click .deleted' : function(e, value, row, index) {
		layer.confirm("确认要删除吗？", {
			title : "删除确认"
		}, function(index) {
			$.post("/admin/recheck/deleteRecheck", {
				id : row.id
			}, function(data) {

				var num = data.resultCode == 1 ? 1 : 0;
				layer.msg(data.message, {
					icon : num,
					shade : 0.3,
					offset : '40%',
					time : 2000
				});
				setTimeout(function() {
					//刷新
					location.reload();
				}, 1000);
			});
		});
	}
};
function operateFormatter1(value, row, index) {
	return [
		'<shiro:hasPermission name="recheck:view">',
		'<a class="detail btn btn-warning btn-xs" href="javascript:void(0);" >',
		'<i class="fa fa-search"></i>查看',
		'</a>  ',
		'</shiro:hasPermission>',
		
		'<shiro:hasPermission name="recheck:create">',
		'<a class="add btn btn-warning btn-xs" href="javascript:void(0);" >',
		'<i class="fa fa-plus"></i>新增',
		'</a>  ',
		'</shiro:hasPermission>'
		
		].join('');
}

window.operateEvents1 = {
		'click .add' : function(e, value, row, index) {
			window.location.href = "/admin/followup/toFollowupAdd?id=" + row.id;
		},
		'click .detail' : function(e, value, row, index) {
			window.location.href = "/admin/followup/detail?id=" + row.id;
		}
};

function quShiTuFormatter(value, row, index) {
	return [
		'<a class="look btn btn-warning btn-xs" style="text-align: center" href="javascript:void(0);" >',
		'<i class="fa fa-search"></i>查看',
		'</a>  '
		
		].join('');
}

window.quShiTuEvents = {
		'click .look' : function(e, value, row, index) {
			var idCard = row.idCarded;
			if (idCard == '' || idCard == null) {
				$.message({
					message : "当前记录无学生身份证号，无法查看！",
					type : 'error',
					time : '3000'
				});
				return;
			}
			window.location.href = "/admin/recheck/toQuShiTuLook?idCard=" + idCard;
		},
};


function consultationDetailFormatter(value, row, index) {
	return [
		'<a class="look btn btn-warning btn-xs" href="javascript:void(0);" >',
		'<i class="fa"></i>详情',
		'</a>  ',

	].join('');
}

window.consultationDetailEvents = {
	'click .look' : function(e, value, row, index) {
		var idCard = row.idCarded;
		if (idCard == '' || idCard == null) {
			$.message({
				message : "当前记录无学生身份证号，无法查看！",
				type : 'error',
				time : '3000'
			});
			return;
		}
		window.location.href = "/admin/recheck/toConsultationDetail?hospitalId=" + row.hospitalId + "&recheckId=" + row.id;
	},
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
	var array = $table.bootstrapTable('getSelections');
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

//表格超出宽度鼠标悬停显示td内容
function paramsMatter(value, row, index, field) {
	var span = document.createElement('span');
	span.setAttribute('title', value);
	span.innerHTML = value;
	return value;
}
//td宽度以及内容超过宽度隐藏
function formatTableUnit(value, row, index) {
	return {
		css : {
			'white-space' : 'nowrap',
			'text-overflow' : 'ellipsis',
			'overflow' : 'hidden',
			'max-width' : '150px'
		}
	}
}


function dateFormat(value, row, index) {
	if (value != null && value != "") {
		return moment(value).format('YYYY-MM-DD');
	} else {
		return null;
	}
}

function dateFormatYMD(value, row, index) {
	if (value != null && value != "") {
		return moment(value).format('YYYY-MM-DD');
	} else {
		return null;
	}

}
function valueFormat(value, row, index) {
	return row.pupillaryDistance;
}

function isGlasses(value, row, index) {
	if (row.glasses == '2') {
		return "-";
	} else {
		return row.glasses == '1' ? "佩戴眼镜" : "不戴镜";
	}

}

function visionOctRight(value, row, index) {
	var s;
	if (row.octRight != null) {
		var url = row.octRight;
		s = '<a class = "view"  href="javascript:void(0)"><img style="width:300;height:40px;"  src="' + url + '" /></a>';
	}
	return s;
}

function visionOctLeft(value, row, index) {
	var s;
	if (row.octLeft != null) {
		var url = row.octLeft;
		s = '<a class = "view"  href="javascript:void(0)"><img style="width:300;height:40px;"  src="' + url + '" /></a>';
	}
	return s;
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
$('#search').click(function() {
	$table.bootstrapTable('refresh');
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
function initDate() {
	var date = (new Date().getFullYear()) + "-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate());
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	if (month.length == 1) {
		month = "0" + month;
	}
	var day = arr[2]; //获取当前日期的日

	document.getElementById("endDate").value = year + "-" + (month.length < 2 ? '0' + month : month) + "-" +
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
	document.getElementById("startDate").value = year2 + "-" + (month2.length < 2 ? '0' + month2 : month2) + "-" +
	(day2.length < 2 ? '0' + day2 : day2);
}