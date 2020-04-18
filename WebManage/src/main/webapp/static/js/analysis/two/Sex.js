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
        },
        error: function () {
            layer.msg("加载预警性别分布Echarts失败",{icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
    $.modal.closeLoading();
}

/**
 * 初始化echart
 * @param man
 * @param woman
 */
function initEchart(manData, womanData) {
    // 视力预警性别分布
    var dom = document.getElementById("sex");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    app.title = '堆叠条形图';

    option = {
        toolbox: {
            show: true,
            // orient: 'vertical',
            right: '5%',
            top: '5%',
            feature: {
                saveAsImage: {
                    show: true,
                    pixelRatio:2,
                    name:"视力预警性别分布情况"
                }
            }
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color: ['#d0716a','#7b999f','#dc9f8a','#98bfab','#dd845c'],
        legend: {
            type : 'scroll',
            bottom:0,
            textStyle: {
                color: "#fff",
                fontSize:10
            },
            data: ['高危人群', '一级预警','二级预警','三级预警','视力正常']
        },
        height:100,
        xAxis:  [{
            axisLabel: {
                color: '#fff'
            },
            axisLine: {    // 坐标轴 轴线
                show: true,  // 是否显示
                //  -----   箭头 -----
                symbol: ['none', 'arrow'],  // 是否显示轴线箭头
                symbolSize: [0, 0],  // 箭头大小
                symbolOffset: [0, 7], // 箭头位置
                // ----- 线 -------
                lineStyle: {
                    color: '#373f54',
                    width: 1,
                    type: 'solid'
                }
            },
            splitLine: {    // gird 区域中的分割线
                show: true,   // 是否显示
                lineStyle: {
                    color: '#1c2443',
                    width: 1,
                    type: 'dashed'
                }
            },
        }],
        yAxis: {
            type: 'category',
            data: ['男','女'],
            axisLabel: {
                color: '#fff'
            },
            axisLine: {
                lineStyle: {
                    // 设置x轴颜色
                    color: '#373f54'
                }
            },
            splitLine: {    // gird 区域中的分割线
                show: true,   // 是否显示
                lineStyle: {
                    color: '#1c2443',
                    width: 1,
                    type: 'dashed'
                }
            },
            offset:10
        },
        series: [
            {
                name: '高危人群',
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
                data: [manData[4], womanData[4]]
            },
        ]
    };;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

