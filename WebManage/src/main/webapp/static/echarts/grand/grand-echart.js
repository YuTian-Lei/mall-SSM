/* 全局字段 */
$table = $("#dataGrid");
var echart;

/**
 * 初始化完成
 */
$(() => {
    initDataGrid();
    /* 年龄选项 */
    $('input[name="timeRange"]').click(() => {
        var checked = $('input[name="timeRange"]:checked').val();
        if (checked) {
            $('#timeRange').css("display", "block");
            $('#ageFrom').removeAttr("disabled");
            $('#ageTo').removeAttr("disabled");
        } else {
            $('#timeRange').css("display", "none");
            $('#ageFrom').attr('disabled', "true");
            $('#ageTo').attr('disabled', "true");
        }
    })
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
    /* 重置 */
    $('#reset').click(() => {
        $('#content >span').each((index, item) => {
            if (index == $('#content >span').length - 1) {
                return;
            }
            item.style.display = "none"
        })
        $('#statType-content').html("初筛近视人数及率")
        $('#timeRange').css("display", "none");
        $('#schoolId').val("");
        $('#schoolType').val("");
        initSchools('');
    })
    /* 统计维度 变化下拉选项调整*/
    $('input[name="xType"]').change((item)=>{
        var value = item.currentTarget.value;
        if(value == 3 || value == 4){
            $('#statTypes').css('display','none');
        }else{
            $('#statTypes').css('display','block');
        }
    });
});

/**
 * 根据查询条件获取请求地址
 */
function getQueryUrl() {
    var result = "";
    var type = $('input[name="xType"]:checked').val();
    switch (type) {
        // 年龄/年级
        case '1':
        case '2': {
            result = '/admin/statData/reportStat';
            break;
        }
        // 度数
        case '3': {
            result = '/admin/degreeStat/degreeReportStat';
            break;
        }
        // 近视程度
        case '4': {
            result = '/admin/statData/seMyopiaLevelStat';
            break;
        }
        default:
            break;
    }
    return result;
}

/**
 * 动态表头
 * @returns {string}
 */
function getTableTitle() {
    var checkType = $('input[name="xType"]:checked').val();
    var statType = $('#statType option:selected').html() + '情况';
    var isSchool = $('#schoolId').val();

    //表格title文字
    statType = checkType==3?'度数检出人数及率情况':checkType == 4 ?'近视程度检出人数及率情况':statType;
    var regionName = isSchool ? $('#schoolSel').val() : $('#regions').val() ? $('#regions option:checked').text() : '深圳市';
    return regionName + statType;
}
/**
 * 初始化Table
 */
function initDataGrid() {
    var checkType = $('input[name="xType"]:checked').val();
    var isGrade = $('input[name="xType"]:checked').val() == 1;
    var isSchool = $('#schoolId').val();

    $('#tableTitle').html(getTableTitle());

    $table.bootstrapTable('destroy');
    $table.bootstrapTable({
        url: getQueryUrl(),
        height: 'auto',
        pagination: false,
        toolbar: "#toolbar",
        columns: getColumns($('input[name="xType"]:checked').val()),
        queryParams: () => {
            return getParams();
        },
        onLoadSuccess: (data) => {
            /* 动态合并指定列 */
            var fieldNames = isSchool ? ['gradeGroup', 'schoolName'] : ['gradeGroup', 'regionName'];
            mergeCells(data, fieldNames, 1, $table);
            // 字体颜色
            if (isGrade) {
                var rows = $table[0].rows;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].gradeName.indexOf("小计") != -1) {
                        rows[i + 2].setAttribute("style", "color:#598efe;background-color: #f7fbff");
                    }
                }
            }
        },
        responseHandler: (result) => {
            console.log("result", result);
            /* 异步加载Echart */
            initEcharts(result, isGrade);
            if (result.data && result.data.gridResult) {
                /*  年龄维度不需要合并 */
                if (isGrade || checkType == 3 || checkType == 4) {
                    var regionName = $('#regions').val() ? $('#regions option:checked').text() : '深圳市';
                    result.data.gridResult.forEach((data) => {
                        // 选中学校
                        data['schoolName'] = $('#schoolSel').val();
                        data.regionName = regionName;
                    })
                }
                return result.data.gridResult;
            }
            return [];
        }
    });
    // 年级维度
    if (isGrade) {
        $table.bootstrapTable('hideColumn', "className");
        // 选中学校
        if (isSchool) {
            $table.bootstrapTable('hideColumn', "regionName");
        } else {
            $table.bootstrapTable('hideColumn', "schoolName");
        }
    }
    // 度数和屈光程度
    if(checkType == 3 || checkType == 4){
        // 选中学校
        if (isSchool) {
            $table.bootstrapTable('hideColumn', "regionName");
        } else {
            $table.bootstrapTable('hideColumn', "schoolName");
        }
    }
}

/**
 * 动态获取字段
 */
function getColumns(type) {

    // 统计角度
    var statText = $('#statType option:selected').html().replace("人数及率", "");
    var statColumns1 = {title: statText + "检出人数（人）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'}
    var statColumns2 = {title: statText + "检出率（%）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'}

    var result;

    // 根据条件获取字段并 截取数据
    switch (type) {
        case '1':
            result = columns.GRADE_COLUMNS;
            result[0].splice(5, 6);
            result[0].push(statColumns1);
            result[0].push(statColumns2);
            break;
        case '2':
            result = columns.AGE_COLUMNS;
            result[0].splice(2, 3);
            result[0].push(statColumns1);
            result[0].push(statColumns2);
            break;
        case '3':
            result = columns.DEGREE_COLUMNS;
            break;
        case '4':
            result = columns.MYOPIA_COLUMNS;
            break;
        default :
            break;
    }

    return result;
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
 * 查询
 */
$('#search').click(function () {
    initDataGrid();
});

/**
 * 获取查询参数
 */
function getParams() {
    return $('#query-form').serialize();
}

/**
 * initEcharts 初始化Echarts
 * @param result 数据源
 * @param isGrade 报表维度 年级/年龄
 */
function initEcharts(result, isGrade) {
    try {
        var echart = document.getElementById('$school');
        if (result.data && result.data.gridResult) {
            initSchoolEcharts(result.data, isGrade);
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
 * 截取数据
 * @param data
 * @param isGrade
 */
function subData(data, isGrade) {
    if (isGrade == 1) {
        // 选中年级学校类型
        var natures = $('#schoolNatures').val();
        var start, end = 0;
        switch (natures) {
            case "6": { //小学
                start = 0, end = 7;
                break;
            }
            case "7": { //初中
                start = 7, end = 11;
                break;
            }
            case "8": { //普通高中
                start = 11, end = 15;
                break;
            }
            case "9": { //职业高中
                start = 15, end = 19;
                break;
            }
            case "12": { //九年一贯制
                start = 0, end = 11;
                break;
            }
            case "13": { //十二年一贯制
                start = 0, end = 15;
                break;
            }
            case "14": { //完全中学
                start = 7, end = 15;
                break;
            }
            default:
                start = 0, end = data.length;
        }
        var schoolType = $('#schoolType').val();
        if (schoolType) {
            switch (schoolType) {
                case "1": { //小学
                    start = 0, end = 7;
                    break;
                }
                case "2": { //初中
                    start = 7, end = 11;
                    break;
                }
                case "3": { //普通高中
                    start = 11, end = 15;
                    break;
                }
                case "4": { //职业高中
                    start = 15, end = 19;
                    break;
                }
                case "7": { //九年一贯制
                    start = 0, end = 11;
                    break;
                }
                case "8": { //十二年一贯制
                    start = 0, end = 15;
                    break;
                }
                case "9": { //完全中学
                    start = 7, end = 15;
                    break;
                }
                default:
                    start = 0, end = data.length;
            }
        }
        // 截取数据
        return data.slice(start, end);
    } else {
        return data;
    }
}

/**
 * 生成图形报表
 * @param data 数据源
 * @param isGrade 报表维度 年级/年龄

 */
function initSchoolEcharts(data, isGrade) {

    var xAxis = subData(data.xAxis, isGrade);
    var boyList = subData(data.boyList, isGrade);
    var girlList = subData(data.girlList, isGrade);
    var rate = subData(data.gridResult, isGrade);
    var checkType = $('input[name="xType"]:checked').val();
    // 图表类型
    var type = (isGrade || checkType == 3 || checkType == 4) ? 'bar' : 'line';
    var xAxisName = isGrade ? '年级/班级' : checkType == 3 ?'度数':checkType == 4?'近视程度':'年龄';

    /* 图形配置 */
    var option = {
        title: {
            text: getTableTitle(),
            bottom: 10,
            x: 'center'
        },
        grid: {
            bottom: 100
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var tipHtml = '';
                var name = params[0].name;
                for (var i = 0; i < params.length; i++) {
                    var name = params[i].name; // 横轴值
                    var text = params[i].seriesName; // 选项卡（下载量，更新量）
                    var value = params[i].value; // 值
                    var marker = params[i].marker; // 图标
                    var index = params[i].dataIndex; // 下标

                    tipHtml = tipHtml + ' ' + marker + ' ' + text + ' : ' + value + '（' + formatterNum(rate, index, i) + '%）' + '<br>';
                }
                return name + '<br>' + tipHtml;
            }
        },
        legend: {
            data: ['男', '女'],
            bottom: 10,
            left: '70%',
            icon: "circle",
        },
        toolbox: {
            right: 33,
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {
                    show: true,
                }
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: xAxis,
                name: xAxisName
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '人数',
            }
        ],
        series: [
            {
                name: '男',
                smooth: true,
                type: type,
                data: boyList,
                barWidth: '15%',
                color: ['#598ffc']
            },
            {
                name: '女',
                smooth: true,
                type: type,
                data: girlList,
                barWidth: '15%',
                color: ['#f8c85d']
            }
        ]
    };
    /* 初始化 */
    echart = echarts.init(document.getElementById("$school"));
    echart.setOption(option, window.onresize = echart.resize);
}

/**
 * 格式化小数保留两位
 * @param val
 * @returns {number}
 */
function formatterNum(rate, index, i) {
    if (i == 0) {
        return rate[index].commonBoyRate;
    } else {
        return rate[index].commonGirlRate;
    }
}

/**
 * 报表导出
 * @param params
 */
function downloadReport() {
    $.modal.loading('正在导出报表...');
    // 获取图表实例，并配置生成图片的属性
    const dataSource = echart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',

    });
    /* 图片转成Buffer */
    var blob = dataURItoBlob(dataSource);
    /* 创建表单 */
    var form = $("<form id=\"addForm\">" + "</form>");
    var param = new FormData(form[0]);

    param.append('source_from', 'webpage_upload');//在formdata加入需要的参数
    param.append('file', blob, "筛查检出情况" + new Date().getTime() + ".png");
    /* 追加表单参数*/
    appendFormParam(param);
    var url = "downReportStat";
    var loadMsg = "正在生成报告，请稍后..."
    var warnMsg = "导出失败，请联系管理员";
    // 异步下载请求
    $.modal.ajaxUploadAndDownload("POST", url, param, loadMsg, warnMsg)
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
 * 追加表单参数
 * @param param
 */
function appendFormParam(param) {
    var queryParams = $('#query-form').serializeArray();
    queryParams.forEach((item) => {
        param.append(item.name, item.value);
    })
}

/**
 * 动态替换值
 * @param check
 */
function formatGradeGroup(value, row, index) {
    var $checkGrade = $('#grade').val();
    var result = $checkGrade ? row.gradeName : value;
    var text = result ? result : '-';
    return '<span style="color:#598efe">' + text + '</span>';
}

/**
 * 动态替换值
 * @param check
 */
function formatGradeName(value, row, index) {
    var $checkGrade = $('#grade').val();
    return $checkGrade ? row.className : value;
}

/**
 * 动态表格
 * @type {{AGE_COLUMNS: *[][], MYOPIA_COLUMNS: *[][], GRADE_COLUMNS: *[][], DEGREE_COLUMNS: *[][]}}
 */
columns = {
    // 年级
    GRADE_COLUMNS: [[
        {title: "班级", align: "center", field: 'className', colspan: 1, rowspan: 2, valign: 'middle'},
        // 虚拟字段 学校选中时显示
        {title: "学校", align: "center", field: 'schoolName', colspan: 1, rowspan: 2, valign: 'middle'},
        {title: "区域", align: "center", field: 'regionName', colspan: 1, rowspan: 2, valign: 'middle'},
        {title: "学校及年级", align: "center", colspan: 2, rowspan: 1, valign: 'middle'},
        {title: "受检人数（人）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'},
        {title: "检出人数（人）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'},
        {title: "检出率（%）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'}
    ], [
        /*  选择年级后动态添加班级  */
        {title: "", align: "center", field: 'gradeGroup', valign: 'middle', formatter: formatGradeGroup},
        {title: "", align: "center", field: 'gradeName', valign: 'middle', formatter: formatGradeName},
        {title: "总人数", align: "center", field: 'checkSum', valign: 'middle'},
        {title: "男", align: "center", field: 'checkBoySum', valign: 'middle'},
        {title: "女", align: "center", field: 'checkGirlSum', valign: 'middle'},
        {title: "总人数", align: "center", field: 'commonSum', valign: 'middle'},
        {title: "男", align: "center", field: 'commonBoySum', valign: 'middle'},
        {title: "女", align: "center", field: 'commonGirlSum', valign: 'middle'},
        {title: "总", align: "center", field: 'commonRate', valign: 'middle'},
        {title: "男", align: "center", field: 'commonBoyRate', valign: 'middle'},
        {title: "女", align: "center", field: 'commonGirlRate', valign: 'middle'}
    ]],
    //年龄
    AGE_COLUMNS: [[
        {title: "年龄段", align: "center", field: 'ageStr', colspan: 1, rowspan: 2, valign: 'middle'},
        {title: "受检人数（人）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'},
        {title: "检出人数（人）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'},
        {title: "检出率（%）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'}
    ], [
        {title: "总人数", align: "center", field: 'checkSum', valign: 'middle'},
        {title: "男", align: "center", field: 'checkBoySum', valign: 'middle'},
        {title: "女", align: "center", field: 'checkGirlSum', valign: 'middle'},
        {title: "总人数", align: "center", field: 'commonSum', valign: 'middle'},
        {title: "男", align: "center", field: 'commonBoySum', valign: 'middle'},
        {title: "女", align: "center", field: 'commonGirlSum', valign: 'middle'},
        {title: "总", align: "center", field: 'commonRate', valign: 'middle'},
        {title: "男", align: "center", field: 'commonBoyRate', valign: 'middle'},
        {title: "女", align: "center", field: 'commonGirlRate', valign: 'middle'}
    ]],
    // 近视程度
    MYOPIA_COLUMNS: [[
        // 虚拟字段 学校选中时显示
        {title: "学校", align: "center", field: 'schoolName', colspan: 1, rowspan: 2, valign: 'middle'},
        {title: "区域", align: "center", field: 'regionName', colspan: 1, rowspan: 2, valign: 'middle'},
        {title: "近视程度", align: "center", field: 'seMyopiaLevel', colspan: 1, rowspan: 2, valign: 'middle'},
        {title: "检出人数（人）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'},
        {title: "检出率（%）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'}
    ], [
        {title: "总人数", align: "center", field: 'commonSum', valign: 'middle'},
        {title: "男", align: "center", field: 'commonBoySum', valign: 'middle'},
        {title: "女", align: "center", field: 'commonGirlSum', valign: 'middle'},
        {title: "总", align: "center", field: 'commonRate', valign: 'middle'},
        {title: "男", align: "center", field: 'commonBoyRate', valign: 'middle'},
        {title: "女", align: "center", field: 'commonGirlRate', valign: 'middle'}
    ]],
    // 度数
    DEGREE_COLUMNS: [[
        // 虚拟字段 学校选中时显示
        {title: "学校", align: "center", field: 'schoolName', colspan: 1, rowspan: 2, valign: 'middle'},
        {title: "区域", align: "center", field: 'regionName', colspan: 1, rowspan: 2, valign: 'middle'},
        {title: "检出度数", align: "center", field: 'degreeTypeStr', colspan: 1, rowspan: 2, valign: 'middle'},
        {title: "检出人数（人）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'},
        {title: "检出率（%）", align: "center", colspan: 3, rowspan: 1, valign: 'middle'}
    ], [
        {title: "总人数", align: "center", field: 'commonSum', valign: 'middle'},
        {title: "男", align: "center", field: 'commonBoySum', valign: 'middle'},
        {title: "女", align: "center", field: 'commonGirlSum', valign: 'middle'},
        {title: "总", align: "center", field: 'commonRate', valign: 'middle'},
        {title: "男", align: "center", field: 'commonBoyRate', valign: 'middle'},
        {title: "女", align: "center", field: 'commonGirlRate', valign: 'middle'}
    ]],
}