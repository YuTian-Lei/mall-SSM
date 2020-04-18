// 视力情况对比

/**
 * 异步加载
 * @param val
 */
function getMyopia(data) {
    console.log("加载视力情况对比分布")
    $.ajax({
        url: '/admin/riskStatistics/getMyopia',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            // console.log(result)
            if (result.status == 1) {
                initMyopiaEchart(result.result);
                $.modal.closeLoading();
            }
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
function initMyopiaEchart(echartData) {

    var dom = document.getElementById("situation");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        tooltip: {},

        calculable: true,

        legend: {
            bottom: 0,
            textStyle: {
                color: "#fff"
            },
            data: ['近视', '高度近视', '视力<=4.7', '视力正常'],
            itemGap: 5,
        },
        grid: {
            top: '22%',
            left: '5%',
            right: '5%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: echartData.schoolNames,
                axisLabel: {
                    color: '#fff'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '人数',
                nameTextStyle: {
                    color: '#fff'
                },
                axisLabel: {
                    color: '#fff'
                },
                "axisTick": {
                    "show": false
                },
                "splitLine": {
                    "show": false
                }
            }
        ],
        dataZoom: [
            {
                show: true,
                start: 60,
                end: 100,
                width: 'auto',
                height: 15,
                bottom: 30,
                left: 30
            },
            {
                type: 'inside',
                start: 94,
                end: 100
            },
            {
                show: false,
                yAxisIndex: 0,
                filterMode: 'empty',
                width: 30,
                height: '80%',
                showDataShadow: false,
                left: '93%'
            }
        ],
        series: [
            {
                name: '近视',
                type: 'bar',
                data: echartData.myopias
            },
            {
                name: '高度近视',
                type: 'bar',
                data: echartData.highMyopias
            },
            {
                name: '视力<=4.7',
                type: 'bar',
                data: echartData.fiveSeven
            },
            {
                name: '视力正常',
                type: 'bar',
                data: echartData.normals
            }
        ]
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}