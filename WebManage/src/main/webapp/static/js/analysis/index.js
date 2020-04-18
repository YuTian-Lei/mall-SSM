
/**
 * 省份切换
 */
function getProvince(val) {
    $('#city').empty();
    var cityId;
    $.ajax({
        async: true,
        type: 'post',
        url: '/admin/school/selectCity',
        dataType: 'json',
        data: {'proviceId': val},
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function (jsonResult) {
            var listCity = jsonResult.data.listCity
            // console.log("lisgt",listCity)
            cityId = listCity[0].regionId;
            listCity.forEach(function (item, index) {
                $('#city').append(`<option value=${item.regionId}>${item.regionName}</option>`)
            })
            getCity(cityId);
        }
    });
}

/**
 * 城市切换
 * @param val
 */
function getCity(val) {
    $('#region').empty();
    $.ajax({
        async: true,
        type: 'post',
        url: '/admin/school/selectCity',
        dataType: 'json',
        data: {'proviceId': val},
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function (jsonResult) {
            var listCity = jsonResult.data.listCity;
            var regionId = listCity[0].regionId;
            listCity.forEach(function (item, index) {
                $('#region').append(`<option value=${item.regionId}>${item.regionName}</option>`)
            })
            getRegion(regionId);
        }
    })
}

/**
 * 区县切换
 * @param val
 */
function getRegion(regionId) {
    $('#schoolId').empty();
    // console.log("切换区")
    getSchool(regionId);

}

/**
 * 学校切换
 */
function getClass(schoolId) {
    $('#grade').empty();
    getGarde(schoolId)
}

/**
 * 初始化异步加载学校
 */
function getSchool(regionId) {
    $('#schoolId').empty();
    $('#grade').empty();
    var schoolId;
    $.ajax({
        url: '/admin/school/getSchool',
        dataType: 'json',
        data: {"regionId": regionId},
        success: function (result) {
            if ((result.status == 2) && $('#schooleSel').css("display") != 'none') {
                $('#gradeSel').css('display', 'none');
                $('#schooleSel').css('display', 'none');
                layer.tips("暂无相关学校",'#schoolTab',{tips: [4,'#1597ac'],timeout: 4000});
                return;
            }
            var schools = result.result;
            // console.log('school count:'+schools.length);
            if (schools.length > 0) {
                schools.forEach(function (item) {
                    $('#schoolId').append(`<option value= ${item.id}>${item.schoolName}</option>`);
                })
                schoolId = schools[0].id;
                getGarde(schoolId);
            }

        }
    });
}

/**
 * 初始化异步加载班级
 */
function getGarde(schoolId) {
    $.ajax({
        url: '/admin/school/getGarde',
        dataType: 'json',
        data: {"schoolId": schoolId},
        success: function (result) {
            var grades = result.result
            grades.forEach(function (item) {
                $('#grade').append(`<option value=${item.id}>${item.grade}</option>`)
            })
        }
    });
};

/**
 * 获取查询参数（全局）
 */
function getParams() {

    var startTime = $('#startTime').val();
    var endTime = $('#endTime').val();
    var province = $('#province').val();
    var city = $('#city').val();
    var region = $('#region').val();
    var schoolId = $('#schoolId').val();
    var piaSex = $('#piaSex').val();
    var disSex = $('#disSex').val();
    var grade = $('#grade option:selected').text();
    var screeningCount = $('#screeningCount').val();

    if ($('#schooleSel').css('display') == 'none') {
        if (schoolId==null || schoolId=='') {
            schoolId=0;
        }else{
            schoolId = '';
        }
    }
    if ($('#gradeSel').css('display') == 'none') {
        grade = '';
    }


    var params = {
        startTime: startTime,
        endTime: endTime,
        province: province,
        city: city,
        region: region,
        schoolId: schoolId,
        grade: grade,
        piaSex: piaSex,
        disSex: disSex,
        screeningCount: screeningCount,
    };
    console.log("查询参数:" , JSON.stringify(params))
    return params;
}

/**
 * 动态获取ehcart滚动初始化条数
 * @param length
 * @returns {number}
 */
var dataZoom_start = function (length) {
    var dataZoom_start = length > 10 ? 100 - (9 / length) * 100 : 0;
    return dataZoom_start;
}