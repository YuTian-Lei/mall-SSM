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
            layer.msg("加载视力情况对比Echarts失败", {icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
}

/**
 * 初始化echart
 * @param echartData
 */
function initMyopiaEchart(echartData) {

    // 视力情况对比

    var dom = document.getElementById("situation");
    var myChart = echarts.init(dom);
    var option;
    var app = {};
    var posList = [
        'left', 'right', 'top', 'bottom',
        'inside',
        'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
        'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
    ];
    var xAxislen = echartData.schoolNames.length;
    var start = dataZoom_start(xAxislen);
    app.configParameters = {
        rotate: {
            min: -90,
            max: 90
        },
        align: {
            options: {
                left: 'left',
                center: 'center',
                right: 'right'
            }
        },
        verticalAlign: {
            options: {
                top: 'top',
                middle: 'middle',
                bottom: 'bottom'
            }
        },
        position: {
            options: echarts.util.reduce(posList, function (map, pos) {
                map[pos] = pos;
                return map;
            }, {})
        },
        distance: {
            min: 0,
            max: 100
        }
    };

    app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function () {
            var labelOption = {
                normal: {
                    rotate: app.config.rotate,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    position: app.config.position,
                    distance: app.config.distance
                }
            };
            myChart.setOption({
                series: [{
                    label: labelOption
                }, {
                    label: labelOption
                }, {
                    label: labelOption
                }, {
                    label: labelOption
                }]
            });
        }
    };


    var labelOption = {
        normal: {
            show: false,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {
                name: {
                    textBorderColor: '#fff'
                }
            }
        }
    };

    option = {
        color: ['#269cf5', '#fbb62b', '#66dfe5', '#da694a'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                color:'#fff'
            }
        },
        legend: {
            type : 'scroll',
            data: ['近视', '高度近视', '视力<=4.7', '正常'],
            color:'#fff',
            // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
            x: '70px',
            // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
            y: '0px',
            textStyle : {
                color : '#d2d8de',
                fontSize : 12
            },
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
                    name:"视力情况对比"
                }
            }
        },
        dataZoom: [//给x轴设置滚动条
            {
                start:start,//默认为0
                end: 100,
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                handleSize: 0,//滑动条的 左右2个滑动条的大小
                height: 8,//组件高度
                left: 50, //左边的距离
                right: 40,//右边的距离
                bottom: 26,//右边的距离
                handleColor: '#ddd',//h滑动图标的颜色
                handleStyle: {
                    borderColor: "#cacaca",
                    borderWidth: "1",
                    shadowBlur: 2,
                    background: "#ddd",
                    shadowColor: "#ddd",
                },
                fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                    //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                    //给第一个设置0，第四个设置1，就是垂直渐变
                    offset: 0,
                    color: '#064c97'
                }, {
                    offset: 1,
                    color: '#064c97'
                }]),
                backgroundColor: 'rgb(12, 32, 64)',//两边未选中的滑动条区域的颜色
                showDataShadow: false,//是否显示数据阴影 默认auto
                showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
                handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                filterMode: 'filter'
            },
            //下面这个属性是里面拖到
            {
                type: 'inside',
                show: true,
                xAxisIndex: [0],
                start: 0,//默认为1
                end: 50
            },
        ],
        calculable: true,
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                data: echartData.schoolNames,
                axisLine: {
                    lineStyle: {
                        // 设置x轴颜色
                        color: '#5d75b1'
                    }
                }
            }
        ],
        yAxis: {
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
            nameRotate: 270,  // 坐标轴名字旋转

            axisLine: {    // 坐标轴 轴线
                show: true,  // 是否显示
                //  -----   箭头 -----
                symbol: ['none', 'arrow'],  // 是否显示轴线箭头
                symbolSize: [0, 0],  // 箭头大小
                symbolOffset: [0, 7], // 箭头位置

                // ----- 线 -------
                lineStyle: {
                    color: '#5d75b1',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {      // 坐标轴的标签
                show: true,    // 是否显示
                inside: false,  // 是否朝内
                rotate: 0,     // 旋转角度
                margin:8,     // 刻度标签与轴线之间的距离
                color: '#5d75b1',  // 默认轴线的颜色
            },
            splitLine: {    // gird 区域中的分割线
                show: false,   // 是否显示
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
                name: '近视',
                type: 'bar',
                barGap: 0,
                label: labelOption,
                data: echartData.myopias
            },
            {
                name: '高度近视',
                type: 'bar',
                label: labelOption,
                data:echartData.highMyopias
            },
            {
                name: '视力<=4.7',
                type: 'bar',
                label: labelOption,
                data: echartData.fiveSeven
            },
            {
                name: '正常',
                type: 'bar',
                label: labelOption,
                data: echartData.normals
            }
        ],
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

}