$table = $("#dataGrid");

/**
 * 初始化方法
 */
function init() {
    $.modal.loading("正在加载数据...")
    // 填充查询条件
    var years = $("#years").val();
    var region = $("#region").val();
    var screeningCount = $("#screeningCount").val();
    var regionName = $("#region option:selected").html();
    $('#yearSel').html(years);
    $('#regionSel').html(regionName);

    // 异步加载初始化Ecahrt
    $.post('screenData',{years:years,region:region,screeningCount:screeningCount},(response)=>{
        $.modal.closeLoading()
        var data = response.result.screenResult;
        console.log("Echart结果：",data)
        joinData(data,region);
    })
    // 初始化表格
    initDataGrid();
}

/**
 * 拼接table html
 * @param data
 * @param region
 */
function joinData(data,region) {
    // Echart数据
    var echartData = [];
    // 数据集合
    var echartsName = "筛查";
    for (var key in data) {
        var name = key == 1 ? "实" + echartsName + "人数" : key == 2 ? "未" + echartsName + "人数" : "应" + echartsName + "人数";
        // 各种类型集合（总，已筛，未筛）
        var dataMap = data[key];
        // 填充 title 数据
        joinTitleData(key, dataMap[region]);

        if (key != 0) {
            echartData.push({name: name, y: dataMap[region]})
        }
    }
    // 初始化Echart
    initScreenEcharts(echartData);
}

/**
 * 填充 title 数据
 * @param key
 * @param data
 */
function joinTitleData(key, count) {
    count = count +'人';
    switch (key) {
        case '0':   // 全部
            $("#allScreenCount").html(count)
            break;
        case '1':   //已筛查
            $("#screenCount").html(count)
            break;
        case '2':   //未筛查
            $("#unScreenCount").html(count)
            break;
        default:
    }
}

/**
 * 初始化Table
 */
function initDataGrid() {
    $table.bootstrapTable('destroy');
    $table.bootstrapTable({
        height: tableModel.getHeight(),
        idField: "id",
        url: 'regionScreenList',
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
            {title: "学校名称", align: "center", field: 'schoolName'},
            {title: "应筛人数", align: "center", field: 'allCount'},
            {title: "实筛人数", align: "center", field: 'count'},
            {title: "未筛人数", align: "center", field: 'unCount'},
        ],
        queryParams: function (params) {
            var param = $('#region-form').serialize();
            param += '&page=' + params.offset + '&rows=' + params.limit;
            console.log("参数：", param);
            return param;
        },
        responseHandler: function (res) {
            $.modal.closeLoading()
            console.log("结果：", res.result);
            // 填充
            if (res.result.pageInfo.total > 0){
                res.result.pageInfo.list.unshift(
                    {schoolName:$("#region option:selected").html(),
                        allCount:$("#allScreenCount").html().replace("人",""),
                        count: $("#screenCount").html().replace("人",""),
                        unCount:$("#unScreenCount").html().replace("人","")
                    }
                );
            }
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
 * 初始化筛查Ecahrts
 * @param data
 */
function initScreenEcharts(data) {
    var option = {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,//倾斜程度
                beta: 0 //偏移
            },
            marginRight: 350, //右边距
        },
        colors: ['#4270c1', '#e97c32'], //自定义颜色列表
        credits: {
            enabled: false//不显示LOGO
        },
        title: {
            text: ''
        },
        accessibility: {
            point: {
                valueSuffix: ' %',
                valueDecimals: 2//保留几位小数
            }
        },
        tooltip: {
            formatter: function () {
                var s = this.point.name + ' : ' + this.point.y + '<br/>';
                var percentage = ((s.indexOf("未") != -1) ? "未筛率：" : "实筛率：") + this.point.percentage.toFixed(2) + ' %';
                return s + percentage;
            },
            shared: true
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 55,// 饼图厚度
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },
        series: [{
            type: 'pie',
            name: '',
            data: data
        }]
    };
    // 初始化
    chart = Highcharts.chart('regionScreenEcharts', option);
}
