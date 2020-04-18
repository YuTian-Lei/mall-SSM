(function($) {
	$(function() {
		var $threeInput = $('#threeInput');
		$threeInput.validate({
			errorElement: 'span',
			success:'valid',
			onkeyup: true,
			ignore: ":hidden",//不验证的元素
			submitHandler:function(){
				
				/*blurCardNo();*/
		        var id = $("#id").val();
		        var planCode = $("#planCode").val();
		        var screeningPlanId = $("#screeningPlanId").val();
		        var schoolId = $("#schoolId").val();
		        var classId = $("#classId").val();
		        var examinator = $("#examinator").val();
		        
				var inputName = $("#inputName").val();
				var studentCard = $("#studentCard").val();
				var sex = $("#sex").val();
				var birthday = $("#birthday").val();
				var inputNumber = $("#inputNumber").val();
		        var studentName = $("#studentName").val();
		        var schoolName = $("#schoolName").val();
		        var gradeName = $("#gradeName").val();
		        var className = $("#className").val();
		        var planName = $("#planName").val();
		        var examDate = $("#examDate").val();
		        var glasses = $("#glasses").val();
		        var pupillaryDistance = $("#pupillaryDistance").val();
		        
		        var nakedVisionRight = $("#nakedVisionRight").val();
		        var nakedVisionLeft = $("#nakedVisionLeft").val();
		        var cvaRight = $("#cvaRight").val();
		        var cvaLeft = $("#cvaLeft").val();
		        
		        var oneRightDc = $("#oneRightDc").val();
		        var oneRightDs = $("#oneRightDs").val();
		        var oneRightAxis = $("#oneRightAxis").val();
		        /*var oneRightSe = $("#oneRightSe").val();*/
		        var oneLeftDc = $("#oneLeftDc").val();
		        var oneLeftDs = $("#oneLeftDs").val();
		        var oneLeftAxis = $("#oneLeftAxis").val();
		        /*var oneLeftSe = $("#oneLeftSe").val();*/
		        
		        var startDate = $("#startDate").val();
				
	            var fd = new FormData();
	            fd.append('id', id);
	            fd.append('planCode', planCode);
	            fd.append('screeningPlanId', screeningPlanId);
	            fd.append('schoolId', schoolId);
	            fd.append('classId', classId);
	            fd.append('examinator', examinator);
	            
	            fd.append('inputName', inputName);
	            fd.append('studentCard', studentCard);
	            fd.append('sex', sex);
	            fd.append('birthday', birthday);
	            fd.append('inputNumber', inputNumber);
	            fd.append('studentName', studentName);
	            fd.append('schoolName', schoolName);
	            fd.append('gradeName', gradeName);
	            fd.append('className', className);
	            fd.append('planName', planName);
	            fd.append('examDate', examDate);
	            fd.append('glasses', glasses);
	            fd.append('pupillaryDistance', pupillaryDistance);
	            
	            fd.append('nakedVisionRight', nakedVisionRight);
	            fd.append('nakedVisionLeft', nakedVisionLeft);
	            fd.append('cvaRight', cvaRight);
	            fd.append('cvaLeft', cvaLeft);
	            
	            fd.append('oneRightDc', oneRightDc);
	            fd.append('oneRightDs', oneRightDs);
	            fd.append('oneRightAxis', oneRightAxis);
	            /*fd.append('oneRightSe', oneRightSe);*/
	            fd.append('oneLeftDc', oneLeftDc);
	            fd.append('oneLeftDs', oneLeftDs);
	            fd.append('oneLeftAxis', oneLeftAxis);
	            /*fd.append('oneLeftSe', oneLeftSe);*/
	            
	            fd.append('startDate', startDate);
	            
	            layer.confirm("请检查数据是否完整", {
	            	title : "检查确认",
	            	btn : ['确认','取消'],
	            	btn1:function(){
	            		$.ajax({
    						url : '/admin/screeningBackTracking/save',
    						dataType : 'json',
    						type : 'POST',
    						data : fd,
    						async : false,
    						cache : false,
    						contentType : false, //不设置内容类型
    						processData : false, //不处理数据
    						success : function(data, status) {
    							console.log(data);
    							var num = data.resultCode ;
    							if (num == 1) {
    								layer.msg(data.message, {icon: num, shade: 0.3, offset: '40%', time: 3000});
    				                setTimeout(function () {
    				                    //刷新
    				                	window.location.href='/admin/screeningBackTracking/index';
    				                }, 1000);
    								
    							} else if (num == 3) {
    								layer.confirm("已将您录入的第三次数据上传至数据中心“已筛查数据管理”界面", {
    									title : "最终录入结果",
    									btn : [ '确认' /* ,  '取消'  */ ],
    									cancel : function(index, layero) {
    										//取消操作，点击右上角的X
    										window.location.href = '/admin/screeningBackTracking/index';
    									},
    								},
    									function() {
    										window.location.href = '/admin/screeningBackTracking/index';
    									}
    								)
    								/*$('#myModalThree').modal('show');
    								window.location.href='/admin/screeningBackTracking/index';*/
    							} else {
    								layer.msg(data.message, {icon: num, shade: 0.3, offset: '40%', time: 3000});
    							}
    						},
    						error: function (data){
    							layer.msg("操作错误！", {icon: 0, shade: 0.3, offset: '40%', time: 3000});
    							console.log(data);
    						}
    					})
                    },
                    btn2:function(){
                    	layer.closeAll();
                        return;
                    }
	            });
			},
			/*rules: {
				studentName :{required:true},
				idCard:{required:true},
				sex:{required:true},
				birthday:{required:true},
				phone:{required:true},
				checkTime:{required:true},
				hospital:{required:true}
			},
			messages: {
				studentName :{required:"请输入学生姓名"},
				idCard : {required: '请输入身份证号'},
				sex : {required: '请选择性别'},
				birthday : {required: '请输入出生日期'},
				phone : {required: '请输入手机号'},
				checkTime : {required: '请选择复查日期'},
				hospital : {required: '请输入复查医院'}
			}*/
		});
		
	});
})(jQuery);
