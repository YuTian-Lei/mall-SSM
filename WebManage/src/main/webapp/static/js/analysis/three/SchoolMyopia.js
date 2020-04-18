// 视力学校分布近视情况
/**
 * 异步加载
 * @param val
 */
function getSchoolMyopia(data) {
    console.log("加载学校类型近视情况")
    $.ajax({
        url: '/admin/dioptricStatistics/getSchoolMyopia',
        type: 'get',
        dataType: 'json',
        data: data,
        success: function (result) {
            // console.log(result)
            if (result.status == 1) {
                initEchart(result.result)
            }
            $.modal.closeLoading();
        },
        error: function () {
            $.modal.closeLoading();
            console.error("error", "学校分布近视情况");
            // layer.msg("加载Echarts失败",{icon: 5, shade: 0.3, offset: '40%', time: 2000});
        }
    });

}

/**
 * 初始化echart
 * @param man
 * @param woman
 */
function initEchart(echartData) {
    // 视力预警性别分布
    var dom = document.getElementById("schoolMyopia");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;

    option = {
        title : {
            // text: '南丁格尔玫瑰图',
            // subtext: '纯属虚构',
            // x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
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
                    name: "学校类型近视情况"
                }
            }
        },
        calculable : true,
        series : [

            {
                name:'',
                type:'pie',
                radius : [30, 110],
                center : ['50%', '50%'],
                roseType : 'area',
                data:echartData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    normal:{
                        color:function(params) {
                            //自定义颜色
                            var colorList = [
                                '#0ce3f7', '#f55f23', '#00d98a', '#228ffe',
                            ];
                            return colorList[params.dataIndex]
                        }
                    }
                }
            }
        ],

    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

