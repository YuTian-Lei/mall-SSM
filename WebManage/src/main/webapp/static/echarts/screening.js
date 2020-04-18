// 筛查进行情况
function getScreenPlanData(id) {
    // console.log('getScreenPlanData', id)
    $.ajax({
        url: $url + '/api/home/getScreenPlanData?schoolId=' + id,
        type: "get",
        cache: false,
        success: function (res) {
            // console.log('getScreenPlanData', res)
            var dom = document.getElementById("screening");
            var ScreenPlanDataChart = echarts.init(dom);
            var app = {};
            option = null;
            app.title = '嵌套环形图';
            if (res.status === 1) {
                option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c}",
                        position: 'right'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 0,
                            length2: 0
                        }
                    },
                    series: [
                        {
                            name: '筛查进行情况',
                            type: 'pie',
                            radius: ['30%', '50%'],
                            data: [
                                {value: res.result.seriesData[0], name: res.result.legendData[0]},
                                {value: res.result.seriesData[1], name: res.result.legendData[1]},

                            ]
                        }
                    ]
                };
                ;
                if (option && typeof option === "object") {
                    ScreenPlanDataChart.setOption(option);
                }
            } else {
                if (ScreenPlanDataChart) {
                    ScreenPlanDataChart.dispose();
                    ScreenPlanDataChart = null;
                    dom = null;
                }
                $('#screening').html(res.msg)
            }
        }
    })
}

