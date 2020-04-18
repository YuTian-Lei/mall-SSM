$table = $("#dataGrid");
$(function () {

});

/**
 * 初始化Table
 */
function initDataGrid() {
    $table.bootstrapTable({
        height: tableModel.getHeight(),
        idField: "id",
        columns: [
            {
                title: "序号",
                field: 'no',
                align: "center",
                width: 50,
                formatter: function (value, row, index) {
                    var options = $table.bootstrapTable('getOptions');
                    return options.pageSize * (options.pageNumber - 1) + index + 1;
                }
            },
            {checkbox: true},
            {title: "省", align: "center", field: 'provinceName'},
            {title: "市", align: "center", field: 'cityName'},
            {title: "区/县", align: "center", field: 'regionName'},
            {title: "学校名称", align: "center", field: 'schoolName'},
            {title: "示范学校", align: "center", field: 'schoolType', formatter: schoolTypeFormat},
            {title: "调查问卷", align: "center", field: 'questionNaire'},
            {title: "操作时间", align: "center", field: 'updateDate', formatter: tableModel.dateFormat},
            {title: "操作", align: "center", valign: 'middle', events: operateEvents, formatter: operateFormatter}
        ],
        url: 'list',
        queryParams: function (params) {
            if(!$('#schoolSel').val()){
                $('#schoolId').val('');
            }
            var param = $('#question-form').serialize();
            param += '&page=' + params.offset + '&rows=' + params.limit;
            console.log(param);
            return param;
        },
        responseHandler: function (res) {
            return {
                rows: res.result.pageInfo.list, total: res.result.pageInfo.total
            }
        },
        sortOrder: 'desc',
        pagination: true,
        sidePagination: 'server',
        pageSize: 15,
        pageNumber: 1,
        pageList: [15, 25, 50, 100],
        toolbar: "#toolbar",
        showRefresh: false,
        showToggle: false,
        queryParamsType: 'limit',

    });
}

/**
 * 操作方法
 * @param value
 * @param row
 * @param index
 * @returns {string}
 */
function operateFormatter(value, row, index) {
    return [
        ' <a class="update btn btn-success btn-xs" href="javascript:void(0);" ><i class="fa fa-edit"></i>修改</a>',
        ' <a class="detail btn btn-info btn-xs"  href="javascript:void(0);" ><i class="fa fa-search"></i>详情</a>'
    ].join('');
}

/**
 * 操作实现
 * @type {{"click .detail": Window.operateEvents.click .detail}}
 */
window.operateEvents = {
    'click .update': function (e, value, row) {
        $('#id').val(row.id)
        $('#question').empty();
        $.post('toEdit', {'id': row.id}, function (data) {
            if (data.status == "1") {
                var questions = data.result.questions;
                var nairesPath = data.result.nairesPath;
                if (questions) {
                    for (var key in questions) {
                        // 预览地址
                        var filePath = nairesPath[key];
                        // 选中回显
                        var checked = row.questionType == key ? 'checked' : '';
                        $('#question').append(
                            '<label style="min-height: 30px;">' +
                            '<input type="radio" ' + checked + ' value="' + key + '" name="questionType">' +
                            '<input type="hidden" value="' + filePath + '" name="filePath">' +
                            '<label>' + questions[key] + '</label>' +
                            '</label>'+'<a class="btn btn-success btn-outline btn-xs" title="' + questions[key] + '" onclick="preView(this)">预览</a>'
                        );
                    }
                }
                $('#no_data').css("display", 'none');
            } else {
                $('#no_data').css("display", 'block');
            }
        })
        $('#update').modal('show');
    },
    'click .detail': function (e, value, row) {
        $.modal.openDetailById('问卷调查详情', '/question/naire/detail?id=' + row.id, '', 600);
    }
};

/**
 * 预览 调查问卷
 * @param o
 */
function preView(a) {
    var filePath = a.previousSibling.children[1].value;
    var fileName = a.previousSibling.children[2].innerHTML;
    createMenuItem(filePath,fileName)

    // $('#filePath').prop('src', filePath);
    // $('#pdfview').prop('data', filePath);
    // $('#download').prop('href', filePath);
    // $('#viewName').html(fileName);
    // $('#preview').modal('show');
}

/**
 * 学校类型
 * @param value
 * @param row
 * @param index
 * @returns {string}
 */
function schoolTypeFormat(value, row, index) {
    return isEmpty(value) ? '-' : value == 0 ? '<span class="label label-danger">否</span>' : '<span class="label label-success">是</span>';
}

/**
 * 查询
 */
$('#search').click(function () {
    $table.bootstrapTable('refresh');
});
/**
 * 重置
 */
$('#reset').click(function () {
    var province = $('#province option:eq(0)').val();
    getProvince(province)
});

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
    // console.log("切换区")
    getSchool(regionId);

}

/**
 * 初始化异步加载学校
 */
function getSchool(regionId) {
    $('#schoolSel').typeahead('destroy');
    $('#schoolId').val('');
    $('#schoolSel').val('');
    $.ajax({
        url: '/admin/school/getSchoolByRegion',
        dataType: 'json',
        data: {"region": regionId},
        success: function (result) {
            var schools = result.result;
            if (schools.length > 0) {
                var dataValue = [];
                schools.forEach(function (item, index) {
                    dataValue.push({"name": item.schoolName, "id": item.id, "ccn0": index});
                })
                // BootStrap-typeahead 模糊搜索
                $('#schoolSel').typeahead({
                    source: dataValue,
                    scrollHeight: 20,
                    afterSelect: function (item) {
                        $('#schoolId').val(item.id);
                    }
                });
            }
        }
    });
}