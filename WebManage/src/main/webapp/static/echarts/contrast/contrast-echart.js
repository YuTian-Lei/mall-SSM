/* 全局字段 */
$table = $("#dataGrid");
/*动态字段数组*/
var columnsArr = [];
/*报表*/
var reportBlob;
/**
 * 查询
 */
$('#search').click(function () {
    if (!hasChecks()) {
        layer.msg('对比统计，请至少有一项多选', {
            icon: 2
        });
        return;
    }
    $('#selectId').empty();
    $('.myopiaScreening_foot').empty()
    var arrResult = [];
    $('.areaCheckbox label input:checkbox').each(function () {
        if ($(this).is(':checked') == true) {
            // 添加选中的值
            var ys = ''
            if ($(this).attr('dataArea') == '全市') {
                ys = '<span>' + '全市' + '</span>'
                $('#selectId').append(ys)
                return false
            } else {
                ys = '<span>' + $(this).attr('dataArea') + '</span>'
                $('#selectId').append(ys)
            }
        }
    })
    $('.qualityCheckbox label input:checkbox').each(function () {
        if ($(this).is(':checked') == true) {
            // 添加选中的值
            var ys = '<span>' + $(this).attr('dataQuality') + '</span>';
            $('#selectId').append(ys)
        }
    })
    $('.typeCheckboc label input:checkbox').each(function () {
        if ($(this).is(':checked') == true) {
            // 添加选中的值
            var ys = ''
            if ($(this).attr('dataSchool') == '全部') {
                ys = '<span>' + '全部类型' + '</span>'
                $('#selectId').append(ys)
                return false
            } else {
                ys = '<span>' + $(this).attr('dataSchool') + '<span>'
                $('#selectId').append(ys)
            }
        }
    })

    $('.yearCheckboc label input:checkbox').each(function () {
        if ($(this).is(':checked') == true) {
            var ys = '<span>' + $(this).val() + '年' + '</span>'
            $('#selectId').append(ys)
        }
    })

    var genderId = $('#genderId').val();
    if (genderId) {
        var ys = '<span>' + (genderId == 0 ? '女' : '男') + '</span>'
        $('#selectId').append(ys)
    }

    var screeningCount = $('#screeningCount').val();
    if (screeningCount) {
        var ys = '<span>' + ($('#screeningCount :selected').text()) + '</span>'
        $('#selectId').append(ys)
    }

    var statTypeId = $('#statTypeId').val();
    if (statTypeId) {
        var ys = '<span>' + ($('#statTypeId :selected').text()) + '</span>'
        $('#selectId').append(ys)
    }



    init();
});

$(() => {
    /* 年龄选项 */
    $('input[name="timeRange"]').click(() => {
        var checked = $('input[name="timeRange"]:checked').val();
        if (checked) {
            $('#timeRange').css("display", "inline-block");
            $('#ageFrom').removeAttr("disabled");
            $('#ageTo').removeAttr("disabled");
        } else {
            $('#timeRange').css("display", "none");
            $('#ageFrom').attr('disabled', "true");
            $('#ageTo').attr('disabled', "true");
        }
    })
    /*下载报告*/
    $('#downloadReport').click(() => {
        downloadReport();
    })
});

/**
 * 初始化
 */
function init() {
    var params = getParams();
    console.log("参数：", params)
    initDataGrid();
}

/**
 * 异步加载图形报表
 */
function initEcharts(data) {
    try {
        var echart = document.getElementById('yearId');
        if (data.data) {
            //TODO 初始化各种维度Echart报表
            initYearEchart(data)
            echart.style.display = '';
            $('#no_data').css('display', 'none')
        } else {
            echart.style.display = 'none';
            $('#no_data').css('display', 'block')
        }
    } catch (e) {
        console.error(e)
        echart.style.display = 'none';
        $.modal.msgError("加载失败，请联系管理员")
    }
}

/**
 * 初始化Table
 */
function initDataGrid() {
    var statType = $('#statTypeId option:selected').html() + '对比情况';
    var id = hasChecks('');
    var title = id == 'years' ? '年份' : id == 'regions' ? '区域' : id == 'schoolFlags' ? '学校类型' : '学校性质';
    $('#tableTitle').html(title + statType);
    var id = hasChecks('');
    // 动态字段名
    var statText = $('#statTypeId option:selected').html().replace("人数及率", "");
    // 动态拼接表格列
    if (id == 'years') {
        formatYearTable(statText);
    } else if (id == 'regions') {
        formatRegionTable(statText);
    } else if (id == 'schoolFlags') {
        formatSchoolFlagTable(statText);
    } else if (id == 'schoolNatures') {
        formatschoolNatureTable(statText);
    }
    $table.bootstrapTable('destroy');
    $table.bootstrapTable({
        url: '/admin/statData/compareReportStat',
        height: 'auto',
        pagination: false,
        toolbar: "#toolbar",
        columns: columnsArr,
        queryParams: () => {
            return getParams();
        },
        onLoadSuccess: (data) => {
            /* 动态合并指定列 */
            var fieldNames = ['gradeGroup0'];
            mergeCells(data, fieldNames, 1, $table);
            var rows = $table[0].rows;
            for (var i = 0; i < data.length; i++) {
                if (data[i].gradeName0.indexOf("小计") != -1) {
                    rows[i + 2].setAttribute("style", "color:#598efe;background-color: #f7fbff");
                }
            }
        },
        responseHandler: (result) => {
            console.log("结果：", result);
            initEcharts(result);
            if (result.data) {
                return result.data.resultList;
            }
            return [];
        },
        /*Excel相关配置*/
        showExport: true,  //是否显示导出按钮
        exportDataType: "all",              //basic', 'all', 'selected'.
        buttonsAlign: "right",  //按钮位置
        exportTypes: ['xlsx'],  //导出文件类型
        Icons: 'glyphicon-export',
        exportButton: $('#downloadReport'), //为按钮btn_export 绑定导出事件 自定义导出按钮(可以不用)
        exportOptions: {
//ignoreColumn: [0,0], //忽略某一列的索引
            fileName: '近视筛查检出情况', //文件名称设置
            worksheetName: '表格区', //表格工作区名称
            // tableName: '商品数据表',
            excelstyles: ['background-color', 'color', 'font-size', 'font-weight', 'text-align'],
//onMsoNumberFormat: DoOnMsoNumberFormat
        }

    });
    $('.export').hide();

}


/**
 * 合并单元格
 * @param data  原始数据（在服务端完成排序）
 * @param fieldNames 合并属性名称(支持多个)
 * @param colspan   合并列
 */
function mergeCells(data, fieldNames, colspan) {
    fieldNames.forEach((fieldName) => {
        //声明一个map计算相同属性值在data对象出现的次数和
        var sortMap = {};
        for (var i = 0; i < data.length; i++) {
            for (var prop in data[i]) {
                if (prop == fieldName) {
                    var key = data[i][prop]
                    if (sortMap.hasOwnProperty(key)) {
                        sortMap[key] = sortMap[key] * 1 + 1;
                    } else {
                        sortMap[key] = 1;
                    }
                    break;
                }
            }
        }
        var index = 0;
        for (var prop in sortMap) {
            var count = sortMap[prop] * 1;
            $table.bootstrapTable('mergeCells', {index: index, field: fieldName, colspan: colspan, rowspan: count});
            index += count;
        }
    })

}

/**
 * 获取查询参数
 */
function getParams() {
    var checked = $('input[name="timeRange"]:checked').val();

    var paramArr = {
        xType: 1,
        ageFrom: checked ? $('#ageFrom').val() : '',
        ageTo: checked ? $('#ageTo').val() : '',
        gender: $('#genderId').val(),
        screeningCount: $('#screeningCount').val(),
        statType: $('#statTypeId').val(),
        years: $("input[name='years']:checked").map(function () {
            return this.value;
        }).get().join(","),
        regions: $("input[name='regions']:checked").map(function () {
            return this.value;
        }).get().join(","),
        schoolFlags: $("input[name='schoolFlags']:checked").map(function () {
            return this.value;
        }).get().join(","),
        natures: $("input[name='natures']:checked").map(function () {
            return this.value;
        }).get().join(","),

    };
    return paramArr;
}


/**
 * 自定义下载图片
 * @param params
 */
function downloadReport() {
    $.modal.loading('正在导出报表...');
    // 获取图表实例，并配置生成图片的属性
    const dataSource = myChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',

    });
    /* 图片转成Buffer */
    var blob = dataURItoBlob(dataSource);
    // console.log('图：', blob)
    // console.log('表：', reportBlob)

    /* 创建表单 */
    var form = $("<form id=\"addForm\">" + "</form>");
    var param = new FormData(form[0]);

    param.append('source_from', 'webpage_upload');//在formdata加入需要的参数
    param.append('file', blob, "近视筛查检出情况" + new Date().getTime() + ".png");
    param.append('report', reportBlob, getFileName() + ".xlsx");
    /* 追加表单参数*/
    // appendFormParam(param);
    var url = "downCompareReportStat";
    var loadMsg = "正在生成报告，请稍后..."
    var warnMsg = "导出失败，请联系管理员";
    // 异步下载请求
    $.modal.ajaxUploadAndDownload("POST", url, param, loadMsg, warnMsg)
    // 三十秒自动关闭
    setTimeout(() => {
        $.modal.closeLoading()
    }, 30000)
}

/**
 * 图片转成Buffer
 * @param dataURI
 * @returns {Blob}
 */
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

/**
 * 下载文件名
 */
function getFileName() {
    var fileName = '';
    var id = hasChecks();
    var suffix = ' - 近视筛查检出情况' + new Date().getFullYear() + new Date().getMonth() + new Date().getDay();
    if (id == 'years') {
        fileName = '年份';
        return fileName + suffix;
    }
    if (id == 'regions') {
        fileName = '区域';
        return fileName + suffix;

    }
    if (id == 'schoolFlags') {
        fileName = '学校类型';
        return fileName + suffix;

    }
    if (id == 'schoolNatures') {
        fileName = '学校性质';
        return fileName + suffix;

    }
    return suffix
}