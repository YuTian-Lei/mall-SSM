// 各年份近视率

/**
 * 异步加载
 * @param val
 */
function getYearMyopia(data) {
    console.log("加载各年份近视率")
    $.ajax({
        url: '/admin/dioptricStatistics/getYearMyopia',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            // console.log(result)
            if (result && result.status == 1) {
                initYearMyopia(result.result);
            }
            $.modal.closeLoading();
        },
        error: function () {
            $.modal.closeLoading();
            console.error("error", "加载各年份近视率失败");
            // layer.msg("加载Echarts失败", {icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
}

/**
 * 初始化echart
 * @param echartData
 */
function initYearMyopia(echartData) {
    // 高危人群情况
    var dom = document.getElementById("YearMyopia");
    var myChart = echarts.init(dom);

    option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis',
            position: function (pos, params, dom, rect, size) {
                // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                var obj = {top: 60};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
            }
        },
        legend: {
            data: echartData.legendData,
            type: 'scroll',
            orient: 'vertical',
            top: 50,
            bottom: 5,
           // right:-50,
            x: '600px',
            y: '20',
            width: '20px',
            color: '#fff',
            height:150,
            textStyle: {
                color: '#FFF',
                fontSize: 12
            },
        },
        grid: {
            left: '3%',
            right: '30%',
            bottom: '15%',
            containLabel: true
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
                    name:"各年份近视率"
                }
            }
        },
        xAxis: {
            // name:'年份',
            type: 'category',
            boundaryGap: false,
            data: echartData.xAxisData,
            axisLine: {
                lineStyle: {
                    // 设置x轴颜色
                    color: '#82a7b9'
                }
            },
        },
        yAxis: {
            name:'人数',
            show: true,  // 是否显示
            position: 'left', // y轴位置
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
                    color: 'rgb(35, 85, 142)',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {      // 坐标轴的标签
                show: true,    // 是否显示
                inside: false,  // 是否朝内
                rotate: 0,     // 旋转角度
                margin: 8,     // 刻度标签与轴线之间的距离
                color: '#84a9bb',  // 默认轴线的颜色
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
        series: echartData.series
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}