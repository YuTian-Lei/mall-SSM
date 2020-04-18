// 高危人群情况

/**
 * 异步加载
 * @param val
 */
function getHighRisk(data) {
    console.log("加载高危视力分布")
    $.ajax({
        url: '/admin/riskStatistics/getHighRisk',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            // console.log(result)
            if (result.status == 1) {
                highRiskList = result.result.highRiskList;
                recheckList = result.result.recheckList;
                initHighRiskEchart(highRiskList, recheckList);
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
 * @param man
 * @param woman
 */
function initHighRiskEchart(highRiskList, recheckList) {
    var dom = document.getElementById("risk");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    app.title = '环形图';

    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        title: [{
            text: '高危人群占比',
            x: '13%',
            y: '90%',
            textStyle: {
                color: '#0a9d98',
                fontSize: 12
            }
        },
            {
                text: '高危人群复诊',
                x: '63%',
                y: '90%',
                textStyle: {
                    color: '#0a9d98',
                    fontSize: 12
                }

            }
        ],
        series: [
            {
                name: '',
                type: 'pie',
                center: ['25%', '47%'],
                radius: [50, 60],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '14',
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: highRiskList
            },
            {
                name: '',
                type: 'pie',
                center: ['75%', '47%'],
                radius: [50, 60],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '14',
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: recheckList
            }]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}