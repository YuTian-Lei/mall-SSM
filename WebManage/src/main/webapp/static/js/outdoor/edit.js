$(function () {
    // 异步加载学校
    getSchool();
    // 初始化日期插件
    initDate();
    first = 0;


});

/**
 * 初始化 Date range picker
 */
function initDate() {
    //定义locale汉化插件
    var locale = {
        "format": 'YYYY-MM-DD',
        "separator": "  -  ",
        "applyLabel": "确定",
        "cancelLabel": "清空",
        "fromLabel": "起始时间",
        "toLabel": "结束时间'",
        "weekLabel": "W",
        "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
        "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        "firstDay": 1
    };
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    // 回显
    if (startDate && endDate) {
        $("#checkDate").html(formatPicker(new Date(startDate).format('yyyyMMdd'), new Date(endDate).format('yyyyMMdd')));
    }
    $('#checkDate').daterangepicker({
        'locale': locale,
        "opens": "center",
        // 初始化空值
        autoUpdateInput: false,
        // 默认时间区间范围
        startDate: startDate ? startDate : moment(),
        endDate: endDate ? endDate : moment().subtract(-30, 'days')
    }).on('cancel.daterangepicker', function (ev, picker) {
        $("#checkDate").html("____年__月__日 - ____年__月__日");
        $("#startDate").val("");
        $("#endDate").val("");
    }).on('apply.daterangepicker',
        function (ev, picker) {
            $("#startDate").val(picker.startDate.format('YYYY-MM-DD'));
            $("#endDate").val(picker.endDate.format('YYYY-MM-DD'));
            var start = picker.startDate.format('YYYYMMDD');
            var end = picker.endDate.format('YYYYMMDD');
            $("#checkDate").html(formatPicker(start, end));
        });
};

/**
 * 格式化日期
 * @param start
 * @param end
 */
function formatPicker(start, end) {
    var formatDate = '____年__月__日 - ____年__月__日';
    if (start && end) {
        formatDate = start.substring(0, 4) + '年' + start.substring(4, 6) + '月' + start.substring(6, 8) + '日' + ' - ' + end.substring(0, 4) + '年' + end.substring(4, 6) + '月' + end.substring(6, 8) + '日';
    }
    return formatDate;
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
 * 初始化异步加载学校
 */
function getSchool() {
    // $('.searchable-select-holder').remove();
    $('#schoolSel_li').empty();
    $('#schoolSel_li').append('学校名称或代码：<select id="schoolSel"><option value="">--请选择或搜索--</option></select>');
    $.ajax({
        url: '/admin/school/getSchoolByUser',
        dataType: 'json',
        success: function (result) {
            var schools = result.result;
            if (schools.length > 0) {
                schools.forEach(item => {
                    $('#schoolSel').append(`<option value= ${item.id}>${item.schoolName}</option>`);
                })
            }

            initSelect();
            // 加载相应班级
            var schoolId = $('#schoolId').val();
            if (schoolId) {
                getGarde(schoolId);
            }
        }
    });
}

/**
 * 初始化异步加载年级
 */
function getGarde(schoolId) {
    $('#grade').empty();
    $('#classId').empty();
    $('#grade').append(`<option value="">--全部--</option>`);
    $('#classId').append(`<option value="">--全部--</option>`);
    $.ajax({
        url: '/admin/school/getGarde',
        dataType: 'json',
        data: {"schoolId": schoolId},
        success: function (result) {
            // console.log(result)
            var grades = result.result;
            var selGrade = $('#selGrade').val();
            for (var grade of grades) {
                var selected = grade.grade == selGrade ? 'selected' : '';
                $('#grade').append('<option value=' + grade.grade + ' ' + selected + '>' + grade.grade + '</option>')
            }
            if (selGrade) {
                getClass(selGrade);
                $('#selGrade').val('');
            }
        }
    });
};

/**
 * 初始化异步加载班级
 */
function getClass(grade) {
    $('#classId').empty();
    $('#classId').append(`<option value="">--全部--</option>`);
    $.ajax({
        url: '/admin/school/getClass',
        dataType: 'json',
        data: {
            "grade": grade,
            "schoolId": $('#schoolId').val()
        },
        success: function (result) {
            var grades = result.result;
            var classId = $('#selClass').val();
            grades.forEach(function (item) {
                var id = `${item.id}`;
                var selected = id == classId ? 'selected' : '';
                $('#classId').append(`<option value=${item.id} ` + selected + `>${item.className}</option>`)
            })
        }
    });
};

/**
 * 关闭选项卡
 */
function closeTab() {
    var cantClose = true;
    $("input").each(function () {
        var value = $(this).val();
        if (value) {
            cantClose = false;
            return;
        }
    })
    // 判断是否输入了内容
    if (cantClose) {
        history.go(-1)
    } else {
        $.modal.confirm("取消之后填写功能将不被保存，\n" + "\n" + "确定取消么？\n", function () {
            history.go(-1)

        })
    }
}



