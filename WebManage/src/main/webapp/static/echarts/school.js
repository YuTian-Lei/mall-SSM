// 学校筛查人数排行
function getScreeningPlanRank() {
    $.ajax({
        url: $url + "/api/home/getScreeningPlanRank",
        type: 'get',
        cache: false,
        success: function (res) {
            // console.log('getScreeningPlanRank', res)
            if (res.status === 1) {
                var dom = document.getElementById("school");
                var myChart = echarts.init(dom);
                var app = {};
                option = null;
                app.title = '坐标轴刻度与标签对齐';

                option = {
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                            name: '已筛查人数',
                            type: 'bar',
                            barWidth: '60%',
                            data: res.result.seriesData
                        }
                    ]
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

