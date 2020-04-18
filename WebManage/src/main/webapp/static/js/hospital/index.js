// $table = $("#dataGrid");
// $(function () {
//   initDataGrid();
// });

// function initDataGrid() {
//   $('#dataGrid').bootstrapTable({
//     height: tableModel.getHeight(),
//     idField: "id",
//     columns: [{title: "用户名", field: "username"}, {
//       title: "角色",
//       field: "roleList",
//       formatter: getRole
//     }, {title: "状态", field: "state", formatter: tableModel.getState}, {
//       title: "创建时间",
//       field: "createdAt",
//       formatter:tableModel.dateFormat,
//       sortable: true
//     }, {title: "更新日期", field: "updatedAt", formatter:tableModel.dateFormat,sortable: true}, {
//       title: "操作",
//       field: "operate",
//       align: 'center',
//       events: operateEvents,
//       formatter: operateFormatter
//     }],
//     url: '/admin/user/list',
//     queryParams: function (params) {
//       return params;
//     },
//     responseHandler: function (res) {
//       return {
//         rows: res.result.pageInfo.list, total: res.result.pageInfo.total
//       }
//     },
//     search: false,
//     searchOnEnterKey: false,
//     sortName: 'createdAt',
//     sortOrder: 'asc',
//     pagination: true,
//     sidePagination: 'server',
//     // pageSize: 20,
//     // pageList: [20, 40, 50, 100],
//     toolbar: "#toolbar",
//     showRefresh: false,
//     showToggle: false
//
//     // 添加下列参数即可进行固定列,列数量过少不可使用
//     // fixedColumns: true,
//     // fixedNumber: 2
//   });
// }



function selectProv() {
    var provinceId = $('#provinceId').val();
    $('#cityId').empty();
    $('#cityId').append('<option  disabled selected value="">--请选择--</option>');
    $('#regionId').empty();
    $('#regionId').append('<option  disabled selected value="">--请选择--</option>');

    $.ajax({
        type: 'post',
        url: '/admin/hospital/selectRegion',
        dataType: 'json',
        data: { 'parentId': provinceId },
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function(jsonResult) {
            var listCity = jsonResult.data.listCity;

            listCity.forEach(function(item, index) {
                $('#cityId').append(`<option value=${item.regionId}>${item.regionName}</option>`)
            })
        }
    })
}

function selectProv1() {
    var provinceId = $('#provinceId1').val();
    $("#quanbu").prop("checked",false);
    $('#cityId1').empty();
    $('#cityId1').append('<option  disabled selected value="">--请选择--</option>');
    $('#regionId1').empty();
    $('#regionId1').append('<option  disabled selected value="">--请选择--</option>');
    $.ajax({
        type: 'post',
        url: '/admin/hospital/selectRegion',
        dataType: 'json',
        data: { 'parentId': provinceId },
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function(jsonResult) {
            var listCity = jsonResult.data.listCity;

            listCity.forEach(function(item, index) {
                $('#cityId1').append(`<option value=${item.regionId}>${item.regionName}</option>`)
            })
            $.post("/admin/screening/findSchools",{"province":$("#provinceId1").val(),"city":"","region":""}, function(data) {
                var objData = jQuery.parseJSON(data);
                var array = objData.schoolList;
    			var availableTags = [];
    			var schoolId = [];
    			$('.checkList').html("");
    			for (var i = 0; i < array.length; i++) {
    				$(".checkList").append('<input type="checkbox" class="checkSchool"><span class="checkSchoolId hidden">'+array[i].id+'</span>&nbsp;&nbsp;&nbsp;<span class="checkSchoolName">'+array[i].schoolName+'</span>&nbsp;&nbsp;&nbsp;')
    				if((i+1)%2 == 0){
    					$(".checkList").append('<br/>')
    				}
    			}
    			$(".checkSchool").each(function(index){
    		    	$(this).click(function(){
    		    		var schoolName = document.getElementsByClassName("checkSchoolName")[index];
		    			var schoolId = document.getElementsByClassName("checkSchoolId")[index];
		    			var schoolIds = document.getElementsByName("schoolIds");
    		    		if($(this).is(":checked")){
    		    			for(var i=0;i<schoolIds.length;i++){
    		    				if(schoolIds[i].value == schoolId.innerHTML){
    		    					layer.msg("管辖学校中已存在该学校", {icon: 2, shade: 0.3, offset: '40%', time: 2000});
    		    					return;
    		    				}
    		    			}
    		    			$(".checkedSchoolList").append('<li class="select2-selection__choice" title="'+schoolName.innerHTML+'" data-select2-id="42"><input hidden="hidden" name="schoolIds" value="'+schoolId.innerHTML+'"><span class="select2-selection__choice__remove" onclick="(removeSchoolName(this))">×</span>'+schoolName.innerHTML+'</li>');
    		    		} else {
    		    			for(var i=0;i<schoolIds.length;i++){
    		    				if(schoolIds[i].value == schoolId.innerHTML){
    		    					schoolIds[i].parentNode.parentNode.removeChild(schoolIds[i].parentNode);
    		    				}
    		    			}
    		    		}
    		    	});
    		    })
            });
        }
    })
}
function removeSchoolName(obj){
	obj.parentNode.parentNode.removeChild(obj.parentNode);
}
function selectAll(obj){
	if(!$("#quanbu").is(":checked")){
		$(".checkSchool").prop("checked",false);
		$(".checkSchoolId").each(function(index){
			var num=0;
			var schoolName = document.getElementsByClassName("checkSchoolName")[index];
			var schoolIds = document.getElementsByName("schoolIds");
			var schoolId = document.getElementsByClassName("checkSchoolId")[index];
			for(var i=0;i<schoolIds.length;i++){
				if(schoolIds[i].value == schoolId.innerHTML){
					schoolIds[i].parentNode.parentNode.removeChild(schoolIds[i].parentNode);
				}
			}
		})
		
	}else{
		$(".checkSchool").prop("checked","checked");
		var schoolIds = document.getElementsByName("schoolIds");
		$(".checkSchool").each(function(index){
			var num=0;
			var schoolName = document.getElementsByClassName("checkSchoolName")[index];
			var schoolId = document.getElementsByClassName("checkSchoolId")[index];
			for(var i=0;i<schoolIds.length;i++){
				if(schoolIds[i].value == schoolId.innerHTML){
					num++;
				}
			}
			if(num == 0){
				$(".checkedSchoolList").append('<li class="select2-selection__choice" title="'+schoolName.innerHTML+'" data-select2-id="42"><input hidden="hidden" name="schoolIds" value="'+schoolId.innerHTML+'"><span class="select2-selection__choice__remove" onclick="(removeSchoolName(this))">×</span>'+schoolName.innerHTML+'</li>');
			}
		})
		
	}
	
}
function selectCity1() {
    var cityId = $('#cityId1').val();
    $('#regionId1').empty();
    $("#quanbu").prop("checked",false);
    $('#regionId1').append('<option  disabled selected value="">--请选择--</option>');
    $.ajax({
        type: 'post',
        url: '/admin/hospital/selectRegion',
        dataType: 'json',
        data: { 'parentId': cityId },
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function(jsonResult) {
            var listRegion = jsonResult.data.listCity;

            listRegion.forEach(function(item, index) {
                $('#regionId1').append(`<option value=${item.regionId}>${item.regionName}</option>`)
            });
            $.post("/admin/screening/findSchools",{"province":$("#provinceq").val(),"city":$("#cityId1").val(),"region":""}, function(data) {
                var objData = jQuery.parseJSON(data);
                var array = objData.schoolList;
    			var availableTags = [];
    			var schoolId = [];
    			$('.checkList').html("");
    			for (var i = 0; i < array.length; i++) {
    				$(".checkList").append('<input type="checkbox" class="checkSchool"><span class="checkSchoolId hidden">'+array[i].id+'</span>&nbsp;&nbsp;&nbsp;<span class="checkSchoolName">'+array[i].schoolName+'</span>&nbsp;&nbsp;&nbsp;')
    				if((i+1)%2 == 0){
    					$(".checkList").append('<br/>')
    				}
    			}
    			$(".checkSchool").each(function(index){
    		    	$(this).click(function(){
    		    		var schoolName = document.getElementsByClassName("checkSchoolName")[index];
		    			var schoolId = document.getElementsByClassName("checkSchoolId")[index];
		    			var schoolIds = document.getElementsByName("schoolIds");
    		    		if($(this).is(":checked")){
    		    			for(var i=0;i<schoolIds.length;i++){
    		    				if(schoolIds[i].value == schoolId.innerHTML){
    		    					layer.msg("管辖学校中已存在该学校", {icon: 2, shade: 0.3, offset: '40%', time: 2000});
    		    					return;
    		    				}
    		    			}
    		    			$(".checkedSchoolList").append('<li class="select2-selection__choice" title="'+schoolName.innerHTML+'" data-select2-id="42"><input hidden="hidden" name="schoolIds" value="'+schoolId.innerHTML+'"><span class="select2-selection__choice__remove" onclick="(removeSchoolName(this))">×</span>'+schoolName.innerHTML+'</li>');
    		    		} else {
    		    			for(var i=0;i<schoolIds.length;i++){
    		    				if(schoolIds[i].value == schoolId.innerHTML){
    		    					schoolIds[i].parentNode.parentNode.removeChild(schoolIds[i].parentNode);
    		    				}
    		    			}
    		    		}
    		    	});
    		    })
            });
        }
    })
    
}

function selectRegion1() {
    var regionId1 = $('#regionId1').val();
    $("#quanbu").prop("checked",false);
    $(".checkSchool").prop("checked",false);
            $.post("/admin/screening/findSchools",{"province":$("#provinceId1").val(),"city":$("#cityId1").val(),"region":regionId1}, function(data) {
                var objData = jQuery.parseJSON(data);
                var array = objData.schoolList;
    			var availableTags = [];
    			var schoolId = [];
    			$('.checkList').html("");
    			for (var i = 0; i < array.length; i++) {
    				$(".checkList").append('<input type="checkbox" class="checkSchool"><span class="checkSchoolId hidden">'+array[i].id+'</span>&nbsp;&nbsp;&nbsp;<span class="checkSchoolName">'+array[i].schoolName+'</span>&nbsp;&nbsp;&nbsp;')
    				if((i+1)%2 == 0){
    					$(".checkList").append('<br/>')
    				}
    			}
    			$(".checkSchool").each(function(index){
    		    	$(this).click(function(){
    		    		var schoolName = document.getElementsByClassName("checkSchoolName")[index];
		    			var schoolId = document.getElementsByClassName("checkSchoolId")[index];
		    			var schoolIds = document.getElementsByName("schoolIds");
    		    		if($(this).is(":checked")){
    		    			for(var i=0;i<schoolIds.length;i++){
    		    				if(schoolIds[i].value == schoolId.innerHTML){
    		    					layer.msg("管辖学校中已存在该学校", {icon: 2, shade: 0.3, offset: '40%', time: 2000});
    		    					return;
    		    				}
    		    			}
    		    			$(".checkedSchoolList").append('<li class="select2-selection__choice" title="'+schoolName.innerHTML+'" data-select2-id="42"><input hidden="hidden" name="schoolIds" value="'+schoolId.innerHTML+'"><span class="select2-selection__choice__remove" onclick="(removeSchoolName(this))">×</span>'+schoolName.innerHTML+'</li>');
    		    		} else {
    		    			for(var i=0;i<schoolIds.length;i++){
    		    				if(schoolIds[i].value == schoolId.innerHTML){
    		    					schoolIds[i].parentNode.parentNode.removeChild(schoolIds[i].parentNode);
    		    				}
    		    			}
    		    		}
    		    	});
    		    })
            });
    
}

function selectCity() {
    var cityId = $('#cityId').val();
    $('#regionId').empty();
    $('#regionId').append('<option  disabled selected value="">--请选择--</option>');
    $.ajax({
        type: 'post',
        url: '/admin/hospital/selectRegion',
        dataType: 'json',
        data: { 'parentId': cityId },
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function(jsonResult) {
            var listRegion = jsonResult.data.listCity;

            listRegion.forEach(function(item, index) {
                $('#regionId').append(`<option value=${item.regionId}>${item.regionName}</option>`)
            });
        }
    })
}


