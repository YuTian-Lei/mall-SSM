// 近视情况

/**
 * 异步加载
 * @param val
 */
function getMyopia(data) {
    console.log("加载近视情况")
    $.ajax({
        url: '/admin/dioptricStatistics/getMyopia',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            if (result.status == 1) {
                initMyopiaEchart(result.result);
            }
            $.modal.closeLoading();
        },
        error: function () {
            $.modal.closeLoading();
            console.error("error", "加载近视情况失败");
            // layer.msg("加载Echarts失败", {icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
}

/**
 * 初始化echart
 * @param man
 * @param woman
 */
function initMyopiaEchart(echartData) {
    // 视力数值分布
    var dom = document.getElementById("myopia");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        title: {
            // text: '南丁格尔玫瑰图',
            // subtext: '纯属虚构',
            // x:'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
            show: true,
            // orient: 'vertical',
            right: '5%',
            top: 'top',
            feature: {
                saveAsImage: {
                    show: true,
                    pixelRatio: 2,
                    name: "近视情况"
                }
            }
        },
        calculable: true,
        series: [

            {
                name: '',
                type: 'pie',
                radius: [30, 110],
                center: ['50%', '50%'],
                roseType: 'area',
                data: echartData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    normal: {
                        color: function (params) {
                            //自定义颜色
                            var colorList = [
                                '#228ffe', '#00d98a', '#f55f23', '#0ce3f7',
                            ];
                            return colorList[params.dataIndex]
                        }
                    }
                }
            }
        ],

    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}