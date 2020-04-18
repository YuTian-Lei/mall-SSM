$(function () {
  //设置复查时间
  setRecheckDate();

  $("#saveConsultation").validate({
    errorElement: 'span',
    success:'valid',
    onkeyup: true,
    ignore: ":hidden",
    rules:{
      type:{isChosen:true,required:true},
      regionId:{required:true, number: true},
      hospitalId:{
        required:true,
        number:true,
        isSameHospital:true
      },
      crtime:{required:true,date:true},
    },
    messages : {
        type:"",
        regionId:{
        required:"请选择正确的医院所属区域信息",
        number:"请选择正确的医院所属区域信息"
      },
      hospitalId:{
        required:"请选择正确的医院信息",
        number:"请选择正确的医院信息"
      },
      crtime:{
        required:"请选择日期",
        date:"请输入合法的日期"
      }
    },
    submitHandler: function(form){
      form.submit();
    }
  });
});


//是否同医院
jQuery.validator.addMethod("isSameHospital", function(value, element) {
  var currentHospitalId = $("#currentHospitalId").val();
  return this.optional(element) || (currentHospitalId != value);}, "院内无法会诊/转诊");

jQuery.validator.addMethod("isChosen", function(value, element) {
  var val = $('input:radio[name="type"]:checked').val();
  if(val == null){
    layer.msg("请选择会诊/转诊!",{icon: 5, time: 1000});
  }
  return this.optional(element) || (val != null);}, "");

/**
 * 城市切换
 * @param val
 */
function getHospitalList(regionId) {
  emptyHospital();
  if (!regionId == "" && regionId != null && regionId != undefined) {
    // hospitalMold 医院类型: 0-筛查医院 1-复查医院
    $.ajax({
      async: true,
      type: 'post',
      url: '/admin/recheck/getHospitalList',
      dataType: 'json',
      data: {'regionId': regionId, "hospitalMold" : 1},
      contentType: 'application/x-www-form-urlencoded;charset=utf-8',
      success: function (jsonResult) {
        var hospitalList = jsonResult.data.hospitalList;
        hospitalList.forEach(function (item) {
          $('#hospital').append(`<option value=${item.id}>${item.hospitalName}</option>`);
        })
      }
    });
  }
}

function emptyHospital() {
  $('#hospital').empty();
  $('#hospital').append("<option value=''>会诊/转诊医院</option>");
}

function setRecheckDate() {
  $("#recheckDate").val(new Date().format("yyyy-MM-dd"));
}
