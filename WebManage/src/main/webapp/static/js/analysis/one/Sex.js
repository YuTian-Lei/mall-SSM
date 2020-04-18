// 视力预警性别分布
/**
 * 异步加载
 * @param val
 */
function getEarlyWarning(data) {
    console.log("加载预警性别分布")
    $.ajax({
        url: '/admin/screenPlanAnalysis/earlyWarning',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            // console.log(result)
            if (result.status == 1) {
                manData = result.result.manData;
                womanData = result.result.womanData;
                initEchart(manData, womanData)
            }else{
                var manData = '';
                var womanData = '';
                initEchart(manData, womanData)
            }
            $.modal.closeLoading();
        },
        error: function () {
            $.modal.closeLoading();

            layer.msg("加载Echarts失败",{icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });

}

/**
 * 初始化echart
 * @param man
 * @param woman
 */
function initEchart(manData, womanData) {
    var dom = document.getElementById("sex");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;

    app.title = '堆叠条形图';

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            bottom: 0,
            textStyle: {
                color: "#fff",
                fontSize: 10
            },
            data: ['一级预警', '二级预警', '三级预警', '视力正常']
        },
        height: 100,
        xAxis: {
            type: 'value',
            axisLabel: {
                color: '#fff'
            }
        },
        yAxis: {
            type: 'category',
            data: ['男', '女'],
            axisLabel: {
                color: '#fff'
            },
            offset: 10
        },
        series: [
            {
                name: '一级预警',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                data: [manData[0], womanData[0]]
            },
            {
                name: '二级预警',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                data: [manData[1], womanData[1]]
            },
            {
                name: '三级预警',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                data: [manData[2], womanData[2]]
            },
            {
                name: '视力正常',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                data: [manData[3], womanData[3]]
            },
        ]
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

