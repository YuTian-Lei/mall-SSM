(function($) {
	$(function() {
		var $updRecheck = $('#updRecheck');
		$updRecheck.validate({
			errorElement: 'span',
			success:'valid',
			onkeyup: true,
			ignore: ":hidden",//不验证的元素
			submitHandler:function(){
				
				var ele = $("#idCard").val();
				ele = ele.replace('(', '').replace(')', '').replace('（', '').replace('）', '').replace(/\s/g,'');
				/*var cardType = $("#cardType").val();*/
				if(!isIdCard(ele) || (ele== undefined || ele== null || ele == "")){
					if (!(/^(\s?[A-Z]{1,2}[0-9]{6,10}[0-9A-Z])$/.test(ele)) && !(/^[1|5|7][0-9]{6}[0-9A-Z]$/.test(ele)) && !(/^[a-zA-Z][0-9]{9}$/.test(ele))) {
						// 国际护照
						var regInternational = /^(\d{9}$)|([a-zA-Z]{2}[0-9]{6}$)|([0-9]{2}[a-zA-Z]{2}[0-9]{5}$)|([a-zA-Z]{2}[0-9]{7}$)|([a-zA-Z][a-zA-Z0-9]{7}[a-zA-Z]$)|([a-zA-Z]{3}[0-9]{6}$)/;
						// 国内护照
						var regChina = /^(1[45][0-9]{7}$)|((P|p|S|s)\d{7}$)|((S|s|G|g)\d{8}$)|((Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff)\d{8}$)|((H|h|M|m)\d{8,10}$)/;
						if (!regChina.test(ele) && !regInternational.test(ele)) {
							layer.msg("证件号码有误，请重新输入！", "", 1);
							$("#sub").attr("type","button"); 
							return ;
						}
		   			}
				}
				
				var ele = $("#phone").val();
			   	if(!(/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))+\d{8}$/.test(ele))&&!((ele==undefined || ele=="" || ele==null))){
			   		layer.msg("手机号有误，请重新输入！", "", 1);
					/* $("#phone").focus(); */
					return false; 
				}
			   	
			   	var hospitalName = $("#toselect").val();
				if (undefined == hospitalName || isEmpty(hospitalName)) {
					$.message({
		                message:'请输入医院',
		                type:'error',
		                time:'3000'
		            });
		            $("#btn").removeAttr("disabled");
		            return;
				}
				if (undefined != map[hospitalName] && !isEmpty(map[hospitalName])) {
					$("#hospitalId").val(map[hospitalName]);
				} else {
					$.message({
		                message:'医院不存在',
		                type:'error',
		                time:'3000'
		            });
		            $("#btn").removeAttr("disabled");
		            return;
				}
				var hospitalId = $("#hospitalId").val();
				
				var id = $("#id").val();
				var sutdentName = $("#sutdentName").val();
				var idCard = $("#idCard").val();
				var sex=$('input:radio[name="sex"]:checked').val();
				var birthday = $("#birthday").val();
				var phone = $("#phone").val();
				/*var hospital = $("#hospital").val();*/
				
				var iolmasterRightAl = $("#iolmasterRightAl").val();
				var iolmasterRightAcd = $("#iolmasterRightAcd").val();
				var rightFrontCurvature = $("#rightFrontCurvature").val();
				var rightBlackCurvature = $("#rightBlackCurvature").val();
				var iolmasterRightCmt = $("#iolmasterRightCmt").val();
				
				var iolmasterLeftAl = $("#iolmasterLeftAl").val();
				var iolmasterLeftAcd = $("#iolmasterLeftAcd").val();
				var leftFrontCurvature = $("#leftFrontCurvature").val();
				var leftBlackCurvature = $("#leftBlackCurvature").val();
				var iolmasterLeftCmt = $("#iolmasterLeftCmt").val();
				
				var acRightAx = $("#acRightAx").val();
				var acRightCurvature1 = $("#acRightCurvature1").val();
				var acRightCurvature2 = $("#acRightCurvature2").val();
				var acLeftAx = $("#acLeftAx").val();
				var acLeftCurvature1 = $("#acLeftCurvature1").val();
				var acLeftCurvature2 = $("#acLeftCurvature2").val();
				
				var iopLeft = $("#iopLeft").val();
				var iopRight = $("#iopRight").val();
				/*var cvaLeft = $("#cvaLeft").val();
				var cvaRight = $("#cvaRight").val();*/
				/*var octLeft = $("#octLeft").val();
				var octRight = $("#octRight").val();*/
				var checkTime = $("#checkTime").val();
				var prescription = $("#prescription").val();
				var visionReason = $("#visionReason").val();
				
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
				
				var picture1 = document.getElementById('picture1').files[0];//图片1
				var picture2 = document.getElementById('picture2').files[0];//图片2
	            /*if (pictures.length == 0) {
	            	showAlertMsg("请至少添加一张图片！");
	            }*/
	            /*for (var i = 0; i < pictures.length; i++) {
	            	var piId = pictures[i].id;
	            	pics.push(pictures[i].id);
	            }*/
				/*var pics = new Array();
	            if (pictures1.length > 0) {
	            	pics.push(pictures1[0].id);
	            }
	            if (pictures2.length > 0) {
	            	pics.push(pictures2[0].id);
	            }*/
	            
	            var fd = new FormData();
	            fd.append('hospitalId', hospitalId);
	            fd.append('id', id);
	            fd.append('sutdentName', sutdentName);
	            fd.append('idCard', idCard);
	            fd.append('sex', sex);
	            fd.append('birthday', birthday);
	            fd.append('phone', phone);
	            fd.append('hospital', hospitalName);
	            
	            fd.append('iolmasterRightAl', iolmasterRightAl);
	            fd.append('iolmasterRightAcd', iolmasterRightAcd);
	            fd.append('rightFrontCurvature', rightFrontCurvature);
	            fd.append('rightBlackCurvature', rightBlackCurvature);
	            fd.append('iolmasterRightCmt', iolmasterRightCmt);
	            
	            fd.append('iolmasterLeftAl', iolmasterLeftAl);
	            fd.append('iolmasterLeftAcd', iolmasterLeftAcd);
	            fd.append('leftFrontCurvature', leftFrontCurvature);
	            fd.append('leftBlackCurvature', leftBlackCurvature);
	            fd.append('iolmasterLeftCmt', iolmasterLeftCmt);
	            
	            fd.append('acRightAx', acRightAx);
	            fd.append('acRightCurvature1', acRightCurvature1);
	            fd.append('acRightCurvature2', acRightCurvature2);
	            fd.append('acLeftAx', acLeftAx);
	            fd.append('acLeftCurvature1', acLeftCurvature1);
	            fd.append('acLeftCurvature2', acLeftCurvature2);
	            
	            fd.append('iopLeft', iopLeft);
	            fd.append('iopRight', iopRight);
	            /*fd.append('cvaLeft', cvaLeft);
	            fd.append('cvaRight', cvaRight);*/
	            /*fd.append('octLeft', octLeft);
	            fd.append('octRight', octRight);*/
	            fd.append('checkTime', checkTime);
	            fd.append('prescription', prescription);
	            fd.append('visionReason', visionReason);
	            fd.append('picture1', picture1);
	            fd.append('picture2', picture2);
	            
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
	            
	            layer.confirm("请检查数据是否完整", {
	            	title : "检查确认",
	            	btn : ['确认','取消'],
	            	btn1:function(){
	            		$.ajax({
    						url : '/admin/recheck/saveRecheck',
    						dataType : 'json',
    						type : 'POST',
    						data : fd,
    						async : false,
    						cache : false,
    						contentType : false, //不设置内容类型
    						processData : false, //不处理数据
    						success : function(data, status) {
    		
    							console.log(data);
    							var num = data.resultCode == 1 ? 1 : 0;
    							if (num == 1) {
    								layer.msg(data.message, {icon: num, shade: 0.3, offset: '40%', time: 3000});
    				                setTimeout(function () {
    				                    //刷新
    				                	window.location.href='/admin/recheck/index';
    				                }, 1000);
    								
    							}else {
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
			rules: {
				sutdentName :{required:true},
				idCard:{required:true},
				sex:{required:true},
				birthday:{required:true},
				phone:{required:true},
				checkTime:{required:true},
				hospital:{required:true}
			},
			messages: {
				sutdentName :{required:"请输入学生姓名"},
				idCard : {required: '请输入身份证号'},
				sex : {required: '请选择性别'},
				birthday : {required: '请输入出生日期'},
				phone : {required: '请输入手机号'},
				checkTime : {required: '请选择复查日期'},
				hospital : {required: '请输入复查医院'}
			}
		});
		
	});
})(jQuery);

/**
 * 预览图片介绍
 */
function setImagePreview(obj,index) {
	//input
	var docObj = document.getElementById("picture"+index);
	var f = isPicture(docObj);
	if (!f) {
		$("#picture"+index).val("");
		return f;
	}
	//img
	var imgObjPreview = document.getElementById("preview"+index);
	//div
	var divs = document.getElementById("localImag"+index);
	if (docObj.files && docObj.files[0]) {
		$("#localImag"+index).css('display', 'block');
		//火狐下，直接设img属性
		imgObjPreview.style.display = 'block';
		/* imgObjPreview.style.width = '160px';
		imgObjPreview.style.height = '160px'; */
		$("#preview").css({
			'width' : '100px',
			'height' : '100px'
		});
		//imgObjPreview.src = docObj.files[0].getAsDataURL();
		//火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
		var fileSize=600000;
		if (obj.files) {
			//读取图片数据  
			var f = obj.files[0];
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				//加载图片获取图片真实宽度和高度  
				var image = new Image();
				image.onload = function() {
					if (f.size > fileSize) {
						layer.msg("图片超过限制600k,请重新选择！", {icon: 0, shade: 0.3, offset: '40%', time: 2000});
						$("#picture"+index).val("");
						return false;
					} else {
						imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
					};
				};
				image.src = data;
			};
			if (f != null) {
				reader.readAsDataURL(f);
			}
		}
	} else {
		$("#localImag"+index).css('display', 'block');
		//IE下，使用滤镜
		docObj.select();
		var imgSrc = document.selection.createRange().text;
		var localImagId = document.getElementById("localImag"+index);
		$("#preview").css({
			'width' : '100px',
			'height' : '100px'
		});
		//必须设置初始大小
		/* localImagId.style.width = "160px";
		localImagId.style.height = "160px"; */
		//图片异常的捕捉，防止用户修改后缀来伪造图片
		try {
			localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			localImagId.filters
				.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
		} catch (e) {
			layer.msg("您上传的图片格式不正确，请重新选择！", {icon: 0, shade: 0.3, offset: '40%', time: 2000});
			return false;
		}
		imgObjPreview.style.display = 'none';
		document.selection.empty();
	}
	return true;
}


/**
 * 
 * 验证图片
 */
function isPicture(docObj) {
	var val = docObj.value;
	//alert(val);
	if (val != "") {
		//检测类型
		if (/^.*?\.(gif|GIF|png|PNG|jpg|JPG|jpeg|JPEG|bmp|BMP)$/
				.test(val)) {
			return true;
		} else {
			layer.msg("只能上传gif, png, jpg, bmp格式的图片！", {icon: 0, shade: 0.3, offset: '40%', time: 2000});
			return false;
		}
	} else {
		layer.msg("请上传图片！", {icon: 0, shade: 0.3, offset: '40%', time: 2000});
		return false;
	}
}

//删除按钮
function removel(obj,index) {
	//input
	var docObj = document.getElementById("picture"+index);
	//img
	var imgObjPreview = document.getElementById("preview"+index);
	docObj.setAttribute("value", "");
	imgObjPreview.setAttribute("value", "");
	imgObjPreview.setAttribute("src", "");
}
