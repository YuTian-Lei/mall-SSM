(function($) {
	$(function() {
		var $addFollowup = $('#addFollowup');
		$addFollowup.validate({
			errorElement: 'span',
			success:'valid',
			onkeyup: true,
			ignore: ":hidden",//不验证的元素
			submitHandler:function(){
				var recheckId = $("#recheckId").val();
				var age = $("#age").val();
				var worseSe = $("#worseSe").val();
				var warning = $("#warning").val();
				
				var picture1 = document.getElementById('picture1').files[0];//图片1
				if (undefined == picture1) {
					layer.msg("请添加图片！", {icon: 0, shade: 0.3, offset: '40%', time: 2000});
					return;
				}
				if (warning == '') {
					layer.msg("请输入危险程度提示！", {icon: 0, shade: 0.3, offset: '40%', time: 2000});
					return;
				}
				
	            var fd = new FormData();
	            fd.append('recheckId', recheckId);
	            fd.append('age', age);
	            fd.append('worseSe', worseSe);
	            fd.append('warning', warning);
	            fd.append('picture1', picture1);
	            
	            layer.confirm("请检查数据是否完整", {
	            	title : "检查确认",
	            	btn : ['确认','取消'],
	            	btn1:function(){
	            		$.ajax({
        					url : '/admin/followup/saveFollowup',
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
        				});
                    },
                    btn2:function(){
                    	layer.closeAll();
                        return;
                    }
                })
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
	$("#picture"+index).val("");
	/*docObj.setAttribute("value", "");*/
	imgObjPreview.setAttribute("value", "");
	imgObjPreview.setAttribute("src", "");
}
