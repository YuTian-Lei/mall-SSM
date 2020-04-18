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
            layer.msg("加载视力分布情况Echarts失败", {icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
}

/**
 * 初始化echart
 * @param echartData
 */
function initDistribution(echartData) {
    // 视力预警性别分布
    var dom = document.getElementById("distribution");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        title : {
            text: '',
            subtext: ''
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            type : 'scroll',
            data:['左眼','右眼'],
            x:'240',
            y:'10',
            top:'0',
            icon:'',//图例的形状，选择类型有："circle"（圆形）、"rectangle"（长方形）、"triangle"（三角形）、"diamond"（菱形）、"emptyCircle"（空心圆）、"emptyRectangle"（空心长方形）、"emptyTriangle"（空心三角形）、"emptyDiamon"（空心菱形），还可以放自定义图片，格式为"image://path",path为图片路径
            selectedMode: false,　　　　//选中哪个图例 false后图例不可点击
            textStyle: {
                color: "#fff",
                fontSize:10,
            },
        },
        calculable : false,
        xAxis : [
            {
                type : 'category',
                data : ['4.3','4.4','4.5','4.6','4.7','4.8','4.9','5.0'],
                axisLine: {
                    lineStyle: {
                        // 设置x轴颜色
                        color: '#5d75b1'
                    }
                }
            }
        ],
        yAxis : [
            {
                axisLabel: {
                    color: '#5d75b1',
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
                axisLine: {
                    lineStyle: {
                        // 设置x轴颜色
                        color: '#5d75b1'
                    }
                },
                splitLine: {    // gird 区域中的分割线
                    show: true,   // 是否显示
                    lineStyle: {
                        color: '#1c2443',
                        width: 1,
                        type: 'solid'
                    }
                },
                type: 'value',
                splitArea: {
                    show: false,
                }
            }

        ],
        grid: {  //设置图标距离
            top: "40",
            left: "40",
            right: "40",
            bottom: "40"
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
                    name:"视力分布情况"
                }
            }
        },
        series : [
            {
                name:'左眼',
                type:'bar',
                data:echartData.leftData,
                barWidth:'8',
                itemStyle: {
                    normal: {
                        color: "#269bfa" //柱状图的背景颜色
                    }
                },
            },
            {
                name:'右眼',
                type:'bar',
                data:echartData.rightData,
                barWidth:'8',
                itemStyle: {
                    normal: {
                        color: "#fdb629" //柱状图的背景颜色
                    }
                },
            }
        ]
    };


    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}