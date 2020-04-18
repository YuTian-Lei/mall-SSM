// 视力筛查综合情况

/**
 * 异步加载
 * @param val
 */
function getScreenCompre(data) {
    console.log("加载筛查视力综合数据")
    $.ajax({
        url: '/admin/riskStatistics/selectLevelCount',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            // console.log(result)
            if (result.status == 1) {
                initCompreEchart(result.result)
                $.modal.closeLoading();
            }
        },
        error: function () {
            $.modal.closeLoading();
            layer.msg("加载Echarts失败", {icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });
}

/**
 * 初始化echart
 * @param man
 * @param woman
 */
function initCompreEchart(ehcartData) {
    var dom = document.getElementById("synthetical");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            bottom: 0,
            // x : 'center',
            textStyle: {
                color: "#fff"
            },
            data: ['一级预警', '二级预警', '三级预警', '视力正常']
        },
        calculable: true,
        series: [
            {
                name: '',
                type: 'pie',
                radius: [30, 70],
                roseType: 'area',
                data: [
                    {value: ehcartData[0], name: '一级预警'},
                    {value: ehcartData[1], name: '二级预警'},
                    {value: ehcartData[2], name: '三级预警'},
                    {value: ehcartData[3], name: '视力正常'},
                ]
            }
        ]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}