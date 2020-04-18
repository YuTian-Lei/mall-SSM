(function($) {
	$(function() {
		var $saveHospitalStaff = $('#saveHospitalStaff');
		$saveHospitalStaff.validate({
			errorElement: 'span',
			success:'valid',
			onkeyup: true,
			ignore: ":hidden",//不验证的元素
			submitHandler:function(){
				
				var id = $("#id").val();
				var staffName = $("#staffName").val();
				var idCard = $("#idCard").val();
				var sex = $("#sex").val();
				var hospitalId = $("#hospitalId").val();
				var hSize = $("#hSize").val();
				var train=$('input:radio[name="train"]:checked').val();
				if (train == undefined) {
					layer.msg("是否培训选择有误，请选择！", "", 1);
					$("#sub").attr("type","button");
					return ;
				}
				if (hSize == 0) {
					layer.msg("当前登陆者没有可操作医院", {icon: 0, shade: 0.3, offset: '40%', time: 3000});
					return;
				} else if (hospitalId == null) {
					layer.msg("请选择所属医院", {icon: 0, shade: 0.3, offset: '40%', time: 3000});
					return;
				}
				var qualification = $("#qualification").val();
				var picture1 = document.getElementById('picture1').files[0];//图片1
	            var fd = new FormData();
	            fd.append('id', id);
	            fd.append('staffName', staffName);
	            fd.append('idCard', idCard);
	            fd.append('sex', sex);
	            fd.append('qualification', qualification);
	            fd.append('hospitalId', hospitalId);
	            fd.append('picture1', picture1);
	            fd.append('train', train);

	            $.ajax({
					url : '/admin/hospitalStaff/save',
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
			                    window.location.href='/admin/hospitalStaff/index';
			                }, 1000);
							
						}else {
							layer.msg(data.message, {icon: num, shade: 0.3, offset: '40%', time: 3000});
						}
					},
					error: function (data){
						layer.msg("操作错误！", {icon: 0, shade: 0.3, offset: '40%', time: 3000});
						console.log(data);
					}
				});
	            
			},
			rules: {
				staffName :{required:true},
				idCard:{required:true},
				qualification:{required:true},
//				phone:{required:true},
//				hospitalId:{required:true}
			},
			messages: {
				staffName :{required:"请输入医院人员姓名"},
				idCard : {required: '请输入身份证号'},
				qualification : {required: '请输入人员资质'},
//				phone : {required: '请输入手机号'},
//				hospitalId : {required: '请输入医院'}
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
