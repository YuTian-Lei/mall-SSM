function getScreeningVision() {
    $.ajax({
        url: $url + '/api/home/getScreeningVision',
        type: 'get',
        cache: true,
        success: function (res) {
            // console.log('getScreeningVision', res)

            if (res.status === 1) {
                var dom = document.getElementById("vision");
                var myChart = echarts.init(dom);
                var app = {};
                option = null;
                app.title = '坐标轴刻度与标签对齐';

                option = {
                    color: ['#3398DB', '#fff'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['高危学生', '近视人数'],
                        y: 15,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: res.result.xAxisData,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                color: '#fff',
                                show: false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                color: '#fff'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '高危学生',
                            type: 'bar',
                            barWidth: '60%',
                            data: res.result.seriesHighRiskData
                        },
                        {
                            name: '近视人数',
                            type: 'bar',
                            barWidth: '60%',
                            data: res.result.seriesMyopiaData
                        }
                    ]
                };
                ;
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            } else {
                $('#vision').html(res.msg)
            }
        }
    })
}

