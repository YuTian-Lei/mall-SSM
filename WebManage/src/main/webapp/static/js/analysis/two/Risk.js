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
            console.log(result)
            if (result.status == 1) {
                highRiskList = result.result.highRiskList;
                recheckList = result.result.recheckList;
                initHighRiskEchart(highRiskList, recheckList);
                $.modal.closeLoading();
            }
        },
        error: function () {
            $.modal.closeLoading();
            layer.msg("加载高危视力Echarts失败", {icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
}

/**
 * 初始化echart
 * @param man
 * @param woman
 */
function initHighRiskEchart(highRiskList, recheckList) {
    // 高危人群情况
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
            x: '9%',
            y: '90%',
            textStyle: {
                color: '#eceeef',
                fontSize:12
            }
        },
            {
                text: '高危人群复诊占比',
                x: '39%',
                y: '90%',
                textStyle: {
                    color: '#eceeef',
                    fontSize:12
                }
            },
            {
                text: '高危人群未复诊占比',
                x: '69%',
                y: '90%',
                textStyle: {
                    color: '#eceeef',
                    fontSize:12
                }
            }],
        color: ['#ef6b48','#2696ee','#fd9503','#1bb2d8','#259af8','#229bfa'],
        series: [
            {
                name: '高危人群占比',
                type: 'pie',
                center: ['20%', '50%'],
                radius: [40, 50],
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
                data:highRiskList
            },
            {
                name: '高危人群复诊占比',
                type: 'pie',
                center: ['50%', '50%'],
                radius: [40, 50],
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
                data:[recheckList[0]]
            },
            {
                name: '高危人群未复诊占比',
                type: 'pie',
                center: ['80%', '50%'],
                radius: [40, 50],
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
                data: [recheckList[1]]
            }
        ]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}