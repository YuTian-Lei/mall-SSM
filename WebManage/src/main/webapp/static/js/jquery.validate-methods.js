
jQuery.validator.addMethod(
	"isFloatGtZero",
	function(value, element) { 
         value=parseFloat(value); 
         return this.optional(element) || value>0;
    },
    "浮点数必须大于0"
);

// 限制特殊字符
jQuery.validator.addMethod(
	"isLimit",
	function(value, element){
		return this.optional(element)||/^[\u4e00-\u9fa5a-zA-Z0-9\.]*$/.test(value);
	},$.validator.format("禁止输入特殊字符或空格!")
);

// 限制输入空格
jQuery.validator.addMethod(
	"Notblank",
	function(value, element){
		return this.optional(element)||!(/\s/g.test(value));
	},$.validator.format("输入字符包含空格!")
);

jQuery.validator.addMethod(
	"isFloat",
	function(value, element) {
		return this.optional(element)||/^[-\+]?\d{1,11}$/.test(value)||/^\d{1,9}(\.\d{1,2})?$/.test(value);
    },
    $.validator.format("只能输入整数或保留两位小数!")
);

jQuery.validator.addMethod(
		"noFloat",
		function(value, element) {
			return this.optional(element)||/^[+]?\d{1,2}$/.test(value)||/^\d{1,2}(\.\d{1,2})?$/.test(value);
	    },
	    $.validator.format("只能输入整数或保留两位小数!")
);

// 折扣(打折数额)
jQuery.validator.addMethod(
	"isRebate",
	function(value, element) {
		 value=parseFloat(value);
		return this.optional(element)||(value>0&&(/^\d{1}$/.test(value)||/^\d{1}(\.\d{1,2})?$/.test(value)));
	},
	$.validator.format("只能输入[1-9]的整数或保留两位小数!")
);

// 邮政编码验证      
jQuery.validator.addMethod(
	"isZipCode", 
	function(value, element) {
  		var zip = /^[0-9]{6}$/;
  		return this.optional(element) || (zip.test(value));
	}, 
	"请正确填写您的邮政编码!"
);
//密码验证
jQuery.validator.addMethod(
		"isPassword", 
		function(value, element) {
	  		var regEx = /^[0-9A-Za-z\._,]{6,20}$/;
	  		return regEx.test(value);
		}, 
		"密码为6-20位，可包含数字、字母、字符(,._)"
	);
//联系电话(手机/电话皆可)验证 
jQuery.validator.addMethod("isPhone", function(value,element) { 
  var length = value.length; 
  var mobile = /^((13[0-9])|(15[^4])|(18[0-9])|(17[0-8])|(14[0-9])|(166)|(199)|(198))\d{8}$/;
  var tel = /^\d{3,4}-?\d{7,9}$/; 
  return this.optional(element) || (tel.test(value) || mobile.test(value)); 

}, "请正确填写您的联系电话"); 


jQuery.validator.addMethod("isPhoneCode", function(value,element) { 
	  var length = value.length; 
	  var mobile = /^((13[0-9])|(15[^4])|(18[0-9])|(17[0-8])|(14[0-9])|(166)|(199)|(198))\d{8}$/;
	  return this.optional(element) || (mobile.test(value)); 

	}, "请正确填写您的手机号码"); 

jQuery.validator.addMethod("canAddAddress", function(value,element) { 
	  var length = value.length; 
	  var mobile = /^((13[0-9])|(15[^4])|(18[0-9])|(17[0-8])|(14[0-9])|(166)|(199)|(198))\d{8}$/;
	  return this.optional(element) || (mobile.test(value)); 

	}, "请正确填写您的手机号码"); 
jQuery.validator.addMethod("isLoginCode", function(value,element) { 
	  var mobile = /^[a-zA-Z0-9]{5,20}$/;
	  return mobile.test(value); 
	}, "请输入5-20位字母或字母数字的组合"); 

//密码验证
jQuery.validator.addMethod(
		"isDefaultPassword", 
		function(value, element) {
			if(value.length == 0) {
				return true;
			} else {
				var regEx = /^[0-9A-Za-z\._,]{6,20}$/;
		  		return regEx.test(value);
			}
	  		return false;
		}, 
		"密码为6-20位，可包含数字、字母、字符(,._)"
	);

jQuery.validator.addMethod(
		"isInteger",
		function(value, element) {
			return this.optional(element)||/^\d{1,11}$/.test(value);
	    },
	    $.validator.format("只能输入正整数!")
	);