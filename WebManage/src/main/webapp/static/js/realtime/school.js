// 学校筛查人数排行
function getScreeningPlanRank() {
    $.ajax({
        url: $url + "api/home/getScreeningPlanRank",
        type: 'get',
        cache: false,
        success: function (res) {
            // console.log('getScreeningPlanRank', res)
            if (res.status === 1) {
                var dom = document.getElementById("school");
                var myChart = echarts.init(dom);
                window.addEventListener("resize",function(){
                    myChart.resize();

                });
                var app = {};
                option = null;
                app.title = '坐标轴刻度与标签对齐';
                schoolslen = res.result.xAxisData.length;
                var start = dataZoom_start(schoolslen);
                // console.log('start', start)

                option = {
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
                    },
                    legend: {
                        data: ['筛查人数'],
                        x: '20px',
                        textStyle: {
                            color: '#FFF',
                            fontSize: 12,
                        },
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
                            left: '10%', //左边的距离
                            right: '1%',//右边的距离
                            bottom: 10,//右边的距离
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
                    xAxis: {
                        data: res.result.xAxisData,
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
                                color: 'transparent',
                                width: 1,
                                type: 'solid'
                            }
                        },
                        splitArea: {     // 网格区域
                            show: false   // 是否显示，默认为false
                        }
                    },
                    axisTick: {      // 坐标轴的刻度
                        show: false,    // 是否显示
                        inside: false,  // 是否朝内
                        length: 1,      // 长度
                        lineStyle: {
                            color: 'rgb(35, 85, 142)',  // 默认取轴线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    },
                    //   ------   y轴  ----------
                    yAxis: {
                        show: true,  // 是否显示
                        position: 'left', // y轴位置
                        offset: 0, // y轴相对于默认位置的偏移
                        minInterval:1,
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
                    grid: {
                        left: '1%',
                        right: '2%',
                        bottom: '10%',
                        containLabel: true
                    },
                    series: [{
                        name: '筛查人数',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#24d3e8'
                                }, {
                                    offset: 1,
                                    color: '#048df0'
                                }]),
                            }
                        },
                        barWidth: 'auto',
                        data: res.result.seriesData
                    }]
                };
                ;
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            } else {
                $('#school').html(res.msg)
            }
        }
    })
}

