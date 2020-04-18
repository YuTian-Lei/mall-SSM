// 复查情况
function getSpotCheckData(id) {
    // console.log('getSpotCheckData', id)
    $.ajax({
        url: $url + '/api/home/getSpotCheckData?schoolId=' + id,
        type: "get",
        cache: false,
        success: function (res) {
            // console.log('getSpotCheckData', res)
            var dom = document.getElementById("review");
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
                    series: [
                        {
                            name: '复查情况',
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
                $('#review').html(res.msg)
            }
        }
    })
}