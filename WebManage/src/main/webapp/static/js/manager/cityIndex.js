$table = $("#dataGrid");

/**
 * 初始化方法
 */
function init() {
    $.modal.loading("正在加载数据...")
    // 异步加载数据
    var years = $("#years").val();
    var screeningCount = $("#screeningCount").val();
    console.log(screeningCount)
    var close = 0;
    $.post("screenData", {years: years,screeningCount:screeningCount}, (response) => {
        console.log("screenData",response)
        // 筛查数据
        var screenResult = response.result.screenResult;
        $('#screenDataGrid').nextAll().remove();
        $('#screenDataGrid').after(joinData(screenResult, 1));
        close ++;
    })
    $.post("spotData", {years: years,screeningCount:screeningCount}, (response) => {
        console.log("spotData",response)
        // 复查数据
        var spotCheckResult = response.result.spotCheckResult;
        $('#spotDataGrid').nextAll().remove();
        $('#spotDataGrid').after(joinData(spotCheckResult, 2));
        close ++;
    })
    var listen = setInterval(()=>{
        if (close == 2){
            $.modal.closeLoading();
            clearInterval(listen)
        }
    }, 200);
}

/**
 * 拼接table html
 * @param data
 * @param type 1:筛查 2：复查
 */
function joinData(data, type) {
    // 表格数据
    var tableHtml = "";
    // Echart数据
    var echartData = [];
    // 数据集合
    var screenOrSpot = type == 1 ? "筛" : "复查";
    var echartsName = type == 1 ? "筛查" : "复查";
    for (var key in data) {
        var title = key == 1 ? "实" + screenOrSpot + "人数" : key == 2 ? "未" + screenOrSpot + "人数" : "应" + screenOrSpot + "人数";
        var name = key == 1 ? "实" + echartsName + "人数" : key == 2 ? "未" + echartsName + "人数" : "应" + echartsName + "人数";
        // 各种类型集合（总，已晒，未筛）
        var dataMap = data[key];
        // 填充 title 数据
        joinTitleData(key, dataMap, type);

        if (key != 0) {
            var sel = key == 1 ? false : true;
            echartData.push({name: name, value: dataMap[1], selected: sel})
        }
        var regionHtml = "<tr><th class=\"text-center\">" + title + "</th>";
        for (var region in dataMap) {
            regionHtml += "<td class=\"text-center\">" + dataMap[region] + "</td>\n";
        }
        regionHtml += "<tr/>";
        tableHtml += regionHtml;
    }
    // 初始化Echart
    if(type == 1){
        initScreenEcharts(echartData);
    }else{
        initSpotEcharts(echartData)
    }

    return tableHtml;
}

/**
 * 填充 title 数据
 * @param key
 * @param data
 * @param type 1：筛查 2：复查
 */
function joinTitleData(key, data, type) {
    var count = data[1] + '人';
    if (type == 1) {
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
    } else {
        switch (key) {
            case '0':   // 全部
                $("#allSpotCount").html(count)
                break;
            case '1':   //已筛查
                $("#spotCount").html(count)
                break;
            case '2':   //未筛查
                $("#unSpotCount").html(count)
                break;
            default:
        }
    }

}

/**
 * 初始化筛查Ecahrts
 * @param data
 */
function initScreenEcharts(data) {

    var option = {
        title: {
            subtext: '',
            left: 'left',
            top: '10%'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                var name = params.name;
                var value = params.value; // 值
                var percentName = name.indexOf("实筛查") != -1 ? "实筛率" : "未筛率";
                var percent = params.percent + "%"; //率

                return name + ' ：' + value + '<br>' + percentName + ' ：' + percent;
            }
        },
        legend: {
            orient: 'vertical',
            left: '90%',
            top: '10%',
            show: false,
            data: ['实筛查人数', '未筛查筛查']
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '45%',
                selectedMode: 'single',
                center: ['40%', '56%'],
                data: data,
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
    echart = echarts.init(document.getElementById("screenEcharts"));
    echart.setOption(option, window.onresize = echart.resize);
}

/**
 * 初始化复查Ecahrts
 * @param data
 */
function initSpotEcharts(data) {

    var option = {
        title: {
            subtext: '',
            left: 'left',
            top: '10%'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                var name = params.name;
                var value = params.value; // 值
                var percentName = name.indexOf("实复查") != -1 ? "实复查率" : "未复查率";
                var percent = params.percent + "%"; //率

                return name + ' ：' + value + '<br>' + percentName + ' ：' + percent;
            }
        },
        legend: {
            orient: 'vertical',
            left: '90%',
            top: '10%',
            show: false,
            data: ['已复查人数', '未复查人数']
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '45%',
                center: ['40%', '56%'],
                selectedMode: 'single',
                data: data,
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
    echart = echarts.init(document.getElementById("spotEcharts"));
    echart.setOption(option, window.onresize = echart.resize);
}
