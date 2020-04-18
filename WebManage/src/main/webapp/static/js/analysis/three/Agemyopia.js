// 各年龄近视率

/**
 * 异步加载
 * @param val
 */
function getAgeMyopia(data) {
    console.log("加载各年龄近视率")
    $.ajax({
        url: '/admin/dioptricStatistics/getAgeMyopia',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            // console.log(result)
                initAgeMyopiaEchart(result.result);
            $.modal.closeLoading();
        },
        error: function () {
            $.modal.closeLoading();
            console.error("error", "加载各年龄近视率失败");
            // layer.msg("加载Echarts失败", {icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
}

/**
 * 初始化echart
 * @param echartData
 */
function initAgeMyopiaEchart(echartData) {
    // 视力情况对比
    var dom = document.getElementById("AgeMyopia");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        tooltip: {
            trigger: 'axis',
            formatter:'{b}岁 : {c}人'
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
                    name:"各年龄近视率"
                }
            }
        },
        xAxis: {
            name:'年龄',
            type: 'category',
            boundaryGap: false,
            data: echartData.ageData,
            axisLine: {
                lineStyle: {
                    // 设置x轴颜色
                    color: '#82a7b9'
                }
            },
        },
        //   ------   y轴  ----------
        yAxis: {
            name:'人数',
            show: true,  // 是否显示
            offset: 0, // y轴相对于默认位置的偏移
            type: 'value',  // 轴类型，默认为 ‘category’
            nameLocation: 'end', // 轴名称相对位置value
            nameTextStyle: {    // 坐标轴名称样式
                color: '#fff',
                padding: [5, 0, 0, 5]  // 坐标轴名称相对位置
            },
            nameGap: 15, // 坐标轴名称与轴线之间的距离
            // nameRotate: 270,  // 坐标轴名字旋转

            axisLine: {    // 坐标轴 轴线
                show: true,  // 是否显示
                //  -----   箭头 -----
                symbol: ['none', 'arrow'],  // 是否显示轴线箭头
                symbolSize: [0, 0],  // 箭头大小
                symbolOffset: [0, 7], // 箭头位置

                // ----- 线 -------
                lineStyle: {
                    color: 'rgba(18, 164, 237, 0.16)',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {      // 坐标轴的标签
                show: true,    // 是否显示
                inside: false,  // 是否朝内
                rotate: 0,     // 旋转角度
                margin: 8,     // 刻度标签与轴线之间的距离
                color: '#82a7b9',  // 默认轴线的颜色
            },
            splitLine: {    // gird 区域中的分割线
                show: true,   // 是否显示
                lineStyle: {
                    color: 'rgba(18, 164, 237, 0.16)',
                    width: 1,
                    type: 'solid'
                }
            },
            splitArea: {     // 网格区域
                show: false   // 是否显示，默认为false
            }
        },
        series: [
            {
                name: '预期',
                data: echartData.numData,
                type: 'line',
                // 设置小圆点消失
                // 注意：设置symbol: 'none'以后，拐点不存在了，设置拐点上显示数值无效
                // 设置折线弧度，取值：0-1之间
                smooth: 0.5,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#58b1c6'
                        }, {
                            offset: 1,
                            color: 'rgba(203,203,172,0.17)'
                        }])
                    }
                },
            },
        ],
        color: ['#87CEFA']
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

}