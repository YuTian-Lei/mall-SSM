
$(function(){
	$("#userLogin").submit(function(){
		var name= $("#username").val();
		if(name.trim()==""){
			 $(".errorInformation").html("请输入用户名！");
			 return false;
		}
		var password= $("#password").val();
		if(password.trim()==""){
			 $(".errorInformation").html("请输入密码！");
			 return false;
		}

	});
	
});


