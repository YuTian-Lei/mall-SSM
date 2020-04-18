// 视力筛查综合情况

/**
 * 异步加载
 * @param val
 */
function getScreenCompre(data) {
    console.log("加载筛查视力综合数据")
    $.ajax({
        url: '/admin/riskStatistics/selectLevelCount',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            // console.log(result)
            if (result.status == 1) {
                initCompreEchart(result.result)
                $.modal.closeLoading();
            }
        },
        error: function () {
            $.modal.closeLoading();
            layer.msg("加载筛查视力综合Echarts失败", {icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
}

/**
 * 初始化echart
 * @param man
 * @param woman
 */
function initCompreEchart(ehcartData) {
    // 视力筛查综合情况

    var dom = document.getElementById("synthetical");
    var myChart = echarts.init(dom);
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
                    pixelRatio:2,
                    name:"视力预警综合情况"
                }
            }
        },
        legend: {
            type: 'scroll',
            data: ['一级预警', '二级预警', '三级预警'],
            color: '#fff',
            bottom: 0,
            textStyle: {
                color: '#d2d8de',
                fontSize: 12
            }
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: [30, 80],
                center: ['50%', '45%'],
                roseType: 'area',
                data: [
                    {value: ehcartData[0], name: '一级预警'},
                    {value: ehcartData[1], name: '二级预警'},
                    {value: ehcartData[2], name: '三级预警'}
                ],
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
                                '#1b9dff', '#a2e6b9', '#fedb5a', '#ff9f7f', '#fb7393', '#e8bdf2', '#8477ea'
                            ];
                            return colorList[params.dataIndex]
                        }
                    }
                }
            }
        ]

    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}