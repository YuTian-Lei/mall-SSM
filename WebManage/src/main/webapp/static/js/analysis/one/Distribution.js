// 视力数值分布

/**
 * 异步加载
 * @param val
 */
function getDistribution(data) {
    console.log("加载视力分布情况")
    $.ajax({
        url: '/admin/riskStatistics/vistionStatistics',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            console.log(result)
            initDistribution(result.result);
            $.modal.closeLoading();
        },
        error: function () {
            $.modal.closeLoading();
            layer.msg("加载Echarts失败", {icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
}

/**
 * 初始化echart
 * @param echartData
 */
function initDistribution(echartData) {
    var dom = document.getElementById("distribution");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        legend: {
            bottom: 0,
            textStyle: {
                color: "#fff"
            }
        },
        tooltip: {},
        dataset: {
            source: echartData
        },
        grid: {
            left: '5%',
            right: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                color: '#fff'
            }
        },
        yAxis: {
            type: 'value',
            name: '人数',
            nameTextStyle: {
                color: '#fff'
            },
            axisLabel: {
                color: '#fff',
                formatter: function (value, index) {
                    var result;
                    result = value.toString();
                    var len = result.length;
                    if (len == 4) {
                        result = result.substring(0, 1) + " k";
                    } else if (len > 4) {
                        result = result.substring(0, len - 4) + " w";
                    }
                    return result;
                }
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false
            }
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
            {type: 'bar'},
            {type: 'bar'},
        ]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}