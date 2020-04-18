$table = $("#dataGrid");
btn = $("#qrcode");
$datas = 0;

$(function () {
    first = 0;
    // 获取学校
    var region = $("#region").val();
    // 异步加载学校
    getSchool(region);
    initDataGrid();
});

/**
 * 初始化表格
 */
function initDataGrid() {
    $table.bootstrapTable({
        height: tableModel.getHeight(),
        idField: "id",
        columns: [{
            title: "序号",
            field: 'no',
            align: "center",
            width: 50,
            formatter: function (value, row, index) {
                var options = $table.bootstrapTable('getOptions');
                return options.pageSize * (options.pageNumber - 1) + index + 1;
            }
        }, {
            checkbox: true
        }, {title: "姓名", align: "center", field: 'studentName'}, {
            title: "所在学校",
            align: "center",
            field: "schoolName"
        }, {title: "所在年级", align: "center", field: "gradeName"}, {
            title: "所在班级",
            align: "center",
            field: "className"
        }, {title: "性别", align: "center", field: "sex", formatter: tableModel.sexFormat}, {
            title: "生日",
            align: "center",
            field: "birthday",
            formatter: tableModel.birthdayFormat
        }, {title: "年龄", align: "center", field: "age"}

        ],
        url: '/admin/screeningPlan/indexNoScreeningForCenterList',
        queryParams: function (params) {
            var param = {
                page: params.offset,
                rows: params.limit,
                planYear: $("#years").val(),
                screeningCount: $("#screeningCount").val(),
                regionId: $("#region").val(),
                cardNo: $("#cardNo").val(),
                schoolId: $("#schoolId").val(),
                gradeName: $("#gradeName").val(),
                classId: $("#classId").val(),
                sex: $("#sex").val()
            };
            console.log("参数", param);
            return param;
        },
        responseHandler: function (res) {
            console.log("结果：", res)
            // 加载Ecahrts
            initUNScreenEcharts(res.result);
            // 加载EchartsTable
            initUNScreenEchartTables(res.result)
            $datas = res.result.pageInfo.total;

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
        queryParamsType: 'limit'
    });
}

/**
 * 初始化Ecahrts
 * @param data
 */
function initUNScreenEcharts(data) {

    var title = getSelectParam() + "未筛查人数";
    var option = {
        title: {
            text: title,
            subtext: '',
            left: 'left',
            top: '10%'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: '90%',
            top: '10%',
            show: false,
            data: ['已筛查', '未筛查']
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '50%',
                center: ['35%', '60%'],
                data: data.seriesData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
    /* 初始化 */
    echart = echarts.init(document.getElementById("echarts"));
    echart.setOption(option, window.onresize = echart.resize);

}

/**
 * 图形报表
 */
function initUNScreenEchartTables(data) {
    var screenCount = 0;
    var UnscreenCount = 0;
    var rate = "";
    data.seriesData.forEach((item) => {
        if (item.name == "已筛查") {
            screenCount = item.value;
        }
        if (item.name == "未筛查") {
            UnscreenCount = item.value;
        }
    })
    if (UnscreenCount > 0) {
        rate = UnscreenCount / (UnscreenCount + screenCount);
    }
    rate = formatRate(rate) + "%";
    var title = getSelectParam();
    var html = "             <td  class=\"text-center\">" + title + "</td>\n" +
        "                    <td  class=\"text-center\">" + screenCount + "</td>\n" +
        "                    <td  class=\"text-center\">" + UnscreenCount + "</td>\n" +
        "                    <td  class=\"text-center\">" + rate + "</td>"
    $('#ehcartTable').html(html);
}

/**
 * 格式化小数点2位数
 */
function formatRate(obj) {
    if (obj) {
        return (obj * 100).toFixed(2);
    }
    return '0.00';
}

/**
 * 选中参数
 */
function getSelectParam() {
    var title = "全市";
    var region = $('#region').val();
    if (region) {
        title = $('#region option:selected').html();
    }
    var school = $('#schoolId').val();
    if (school) {
        title = title + $('#schoolName').val();
    }
    var grade = $('#gradeName').val();
    if (grade) {
        title = title + $('#gradeName option:selected').html();
    }
    var className = $('#classId').val();
    if (className) {
        title = title + $('#classId option:selected').html();
    }
    return title;
}

/**
 * 初始化异步加载学校
 */
function getSchool(region) {
    $('#schoolSel_li').empty();
    $('#schoolSel_li').append('学校名称或代码：<select id="schoolSel" style="width: 250px"><option value="">--请选择或搜索--</option></select>');
    $.ajax({
        url: '/admin/school/getSchoolByUser?region=' + region,
        dataType: 'json',
        success: function (result) {
            var schools = result.result;
            if (schools.length > 0) {
                schools.forEach(item => {
                    $('#schoolSel').append(`<option value= ${item.id}>${item.schoolName}</option>`);
                })
            }
            initSelect();
        }
    });
}

/**
 *  初始化模糊搜索框
 */
function initSelect() {
    // 初始化学校下拉模糊查询框
    $('#schoolSel').searchableSelect({
            // 选中事件
            afterSelectItem: function () {
                var schoolId = this.holder.data("value");
                if (schoolId) {
                    var schoolName = this.holder[0].innerText;
                    $('#schoolId').val(schoolId);
                    $('#schoolName').val(schoolName);
                    $('#className').val("");
                    getGarde(schoolId)
                } else {
                    if (++first > 1) {
                        $('#schoolId').val("");
                        $('#schoolName').val("");
                        $('#className').val("");
                    } else {
                        schoolName = $('#schoolName').val();
                        if (schoolName) {
                            $('#holder').html(schoolName);
                        }
                    }
                }
            }
        }
    );
    // 调整搜索框及选中
    $('.searchable-select-input').css("width", "240");
    $('.searchable-select-holder').css("width", "250");
    $('.searchable-select-holder').css("height", "30");
}

/**
 * 初始化异步加载年级
 */
function getGarde(schoolId) {
    $('#gradeName').empty();
    $('#classId').empty();
    $('#gradeName').append(`<option value="">-- 全部 --</option>`);
    $('#classId').append(`<option value="">-- 全部 --</option>`);
    $.ajax({
        url: '/admin/school/getGarde',
        dataType: 'json',
        data: {"schoolId": schoolId},
        success: function (result) {
            // console.log(result)
            var grades = result.result;
            var selGrade = $('#gradeName').val();
            for (var grade of grades) {
                var selected = grade.grade == selGrade ? 'selected' : '';
                $('#gradeName').append('<option value=' + grade.grade + ' ' + selected + '>' + grade.grade + '</option>')
            }
        }
    });
};

/**
 * 初始化异步加载班级
 */
function getClass(grade) {
    $('#classId').empty();
    $('#classId').append(`<option value="">-- 全部 --</option>`);
    $.ajax({
        url: '/admin/school/getClass',
        dataType: 'json',
        data: {
            "grade": grade,
            "schoolId": $('#schoolId').val()
        },
        success: function (result) {
            var grades = result.result;
            var classId = $('#classId').val();
            grades.forEach(function (item) {
                var id = `${item.id}`;
                var selected = id == classId ? 'selected' : '';
                $('#classId').append(`<option value=${item.id} ` + selected + `>${item.className}</option>`)
            })
        }
    });
};


/**
 *  导出数据
 */
function exportExcel() {
    // 选中的学生
    var ids = getParams();
    var region = $('#region').val();
    var schoolId = $('#schoolId').val();
    var gradeName = $('#gradeName').val();
    var classId = $('#classId').val();
    var screeningCount = $('#screeningCount').val();

    if ($datas == 0) {
        layer.msg("&nbsp;&nbsp;暂无数据", {
            icon: 5
        });
        return;
    }

    if (isEmpty(ids) && isEmpty(region)) {
        layer.msg("&nbsp;&nbsp;请至少选择一个地区", {
            icon: 5
        });
        return;
    }

    var btn = $('#export');
    openShade(btn, "正在导出Excel,请稍后...");
    window.location.href = "/admin/screeningPlan/exportExcelForUnScreen?" +
        "ids=" + ids + '&regionId=' + region + '&schoolId=' + schoolId + '&gradeName=' + gradeName + '&classId=' + classId + '&screeningCount=' + screeningCount;
    hideShade(btn);
}

/**
 *  打印二维码
 */
function printQrcode() {
    // 选中的学生
    var ids = getParams();
    var schoolId = $('#schoolId').val();
    var region = $('#region').val();
    var gradeName = $('#gradeName').val();
    var classId = $('#classId').val();
    var screeningCount = $('#screeningCount').val();
    if ($datas == 0) {
        layer.msg("&nbsp;&nbsp;暂无数据", {
            icon: 5
        });
        return;
    }

    if (isEmpty(ids) && isEmpty(schoolId)) {
        layer.msg("&nbsp;&nbsp;请至少选择一个学校", {
            icon: 5
        });
        return;
    }
    // 选中单个下载
    if (ids.length > 0) {
        openShade(btn, "正在处理中，请稍后...");
        window.location.href = "/admin/student/printQrCode?ids=" + ids;
        btn.removeClass('disabled').prop('disabled', false).html(btn.html().replace("中...", '')).parent().find('span').remove();
        $.modal.closeLoading();
    } else {
        $.ajax({
            url: '/admin/screeningPlan/printnQrcodeDataDenter',
            type: 'post',
            dataType: 'json',
            data: {
                'schoolId': schoolId,
                'regionId': region,
                'gradeName': gradeName,
                'classId': classId,
                'screeningCount': screeningCount,
                'isUnScreen': true
            },
            success: function (data) {
                hideShade(btn);
                if (data.resultCode == "1") {
                    $.message({
                        message: '下载任务生成成功', type: 'success'
                    });
                } else {
                    $.message({
                        message: data.errormsg, type: 'error', time: '3000'
                    });
                }
            },
            error: function (data) {
                hideShade(btn);
                $.message({
                    message: '请求异常', type: 'error', time: '3000'
                });
            }
        });
    }
}

/**
 * 开启遮罩
 * @param obj
 */
function openShade(obj, msg) {
    $.modal.loading(msg);
    delCookie("state");
    obj.data("loading", true);
    obj.prop('disabled', true).html(obj.html() + "中...").addClass('disabled');
}

/**
 * 关闭遮罩
 * @param obj
 */
function hideShade(obj) {
    var icount = window.setInterval(function () {
        var cookie = getCookie("state");
        if (cookie == 'success') {
            obj.removeClass('disabled').prop('disabled', false).html(obj.html().replace("中...", '')).parent().find('span').remove();
            $.modal.closeLoading();
            delCookie("state");
            window.clearInterval(icount);
        }
    }, 300);
    // 超过1分钟自动关闭
    setTimeout(function () {
        obj.removeClass('disabled').prop('disabled', false).html(obj.html().replace("中...", '')).parent().find('span').remove();
        $.modal.closeLoading();
    }, 6000)
}

/**
 * 获取cookie
 * @param cookieName
 * @returns {string}
 */
function getCookie(cookieName) {
    //获取所有的cookie "user=test; name=admin"
    var totalCookie = document.cookie;
    //获取参数所在的位置
    var cookieStartAt = totalCookie.indexOf(cookieName + "=");
    //判断参数是否存在 不存在直接返回
    if (cookieStartAt == -1) {
        return;
    }
    //获取参数值的开始位置
    var valueStartAt = totalCookie.indexOf("=", cookieStartAt) + 1;
    //以;来获取参数值的结束位置
    var valueEndAt = totalCookie.indexOf(";", cookieStartAt);
    //如果没有;则是最后一位
    if (valueEndAt == -1) {
        valueEndAt = totalCookie.length;
    }
    //截取参数值的字符串
    var cookieValue = unescape(totalCookie.substring(valueStartAt, valueEndAt));
    return cookieValue;
}

/**
 * 删除cookie
 * @param name
 */
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
    }
}

/**
 * 获取/导出下载参数
 * @returns {string}
 */
function getParams() {
    var ids = '';
    var values = $table.bootstrapTable('getSelections');
    for (var i = 0; i < values.length; i++) {
        ids += values[i].id + ',';
    }
    if (ids) {
        return ids.endsWith(',') ? ids.substr(0, ids.length - 1) : ids;
    }
    return ids;
}

/* 筛选条件展示 */
$('select').change((item) => {
    // 元素的名称
    var id = item.currentTarget.id
    // 显示区域的元素ID
    var contentId = $('#' + id + "-content");

    // 元素选中的的值和文本
    var value = item.currentTarget.value;

    var text = $('#' + id + ' option:selected').text();
    if (value) {
        contentId.css('display', 'block')
        contentId.html(text);
    } else {
        contentId.css('display', 'none')
    }
});