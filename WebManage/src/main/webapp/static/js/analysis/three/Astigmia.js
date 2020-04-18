// 散光情况

/**
 * 异步加载
 * @param val
 */
function getAstigmia(data) {
    console.log("加载筛查视力散光")
    $.ajax({
        url: '/admin/dioptricStatistics/getAstigmia',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            console.log(result)
            if (result.status == 1) {
                initAstigmiaEchart(result.result)
            }
            $.modal.closeLoading();
        },
        error: function () {
            $.modal.closeLoading();
            console.error("error", "加载散光情况失败");
            // layer.msg("加载筛查视力散光Echarts失败", {icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
}

/**
 * 初始化echart
 * @param man
 * @param woman
 */
function initAstigmiaEchart(ehcartData) {

    var dom = document.getElementById("astigmia");
    var myChart = echarts.init(dom);
    var start = dataZoom_start(ehcartData.schoolNames.length);
    var option = {
        title: {
            text: '',
        },
        tooltip: {},
        axisLabel: {    // 坐标轴标签
            show: true,  // 是否显示
            inside: true, // 是否朝内
            rotate: 0, // 旋转角度
            margin: 5, // 刻度标签与轴线之间的距离
            color: '#84a9bb',  // 默认取轴线的颜色
            mixInterval: 1,

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
                    name: "散光情况"
                }
            }
        },
        dataZoom: [//给x轴设置滚动条
            {
                start: start,//默认为0
                end: 100,
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                handleSize: 0,//滑动条的 左右2个滑动条的大小
                height: 8,//组件高度
                left: 50, //左边的距离
                right: 40,//右边的距离
                bottom: 26,//右边的距离
                // handleColor: '#ddd',//h滑动图标的颜色
                // handleStyle: {
                //     borderColor: "#cacaca",
                //     borderWidth: "1",
                //     shadowBlur: 2,
                //     background: "#ddd",
                //     shadowColor: "#ddd",
                // },
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
                end: 100,
            },
        ],
        legend: {
            data: ['散光情况'],
            x: '30px',
            textStyle: {
                color: '#FFF',
                fontSize: 12,
            },
        },
        grid: {
            left: '30px',
            containLabel: true
        },
        xAxis: {
            mixInterval: 1,

            data: ehcartData.schoolNames,
        },
        axisTick: {      // 坐标轴的刻度
            show: false,    // 是否显示
            inside: false,  // 是否朝内
            length: 1,      // 长度
            lineStyle: {
                color: 'rgba(0, 0, 0, 0)',  // 默认取轴线的颜色
                width: 1,
                type: 'solid'
            }
        },
        //   ------   y轴  ----------
        yAxis: {
            name: '人数',
            show: true,  // 是否显示
            position: 'left', // y轴位置
            offset: 0, // y轴相对于默认位置的偏移

            type: 'value',  // 轴类型，默认为 ‘category’
            mixInterval: 1,
            splitNumber: 3,
            nameLocation: 'end', // 轴名称相对位置value
            nameTextStyle: {    // 坐标轴名称样式
                color: '#fff',
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
        series: [{
            name: '散光情况',
            type: 'bar',
            itemStyle: {
                normal: {
                    //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                    color: 'rgb(21,151,172)',
                    //以下为是否显示，显示位置和显示格式的设置了
                    label: {
                        show: false,
                        position: 'top',
//                             formatter: '{c}'
                        formatter: '{b}\n{c}'
                    }
                }
            },
            barWidth: 'auto',
            data: ehcartData.datas
        }]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}