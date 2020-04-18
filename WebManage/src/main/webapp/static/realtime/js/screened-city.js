$(function () {
    // 初始化加载方法
    init();
})

/**
 * 全市受检学生近视占比
 * @param data
 */
function pieLeftEchart(data) {
    // 加载左上方饼图
    var pieLeftOptions = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['rgb(44,249,251)', 'rgb(26,152,251)'],
        series: [
            {
                name: '全市受检学生近视占比',
                type: 'pie',
                radius: ['50%', '70%'],
                selectedMode: 'single',
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    loadCharts('pie-left', pieLeftOptions)
}

/**
 * 各区近视新发病率
 * @param data
 */
function lineRightEchart(data) {

    var lineRightOptions = {
        grid: {
            top: 30,
        },
        xAxis: {
            triggerEvent: true,
            type: 'category',
            boundaryGap: false,
            data: data.regionNameArray,
            axisLine: {
                lineStyle: {
                    color: 'rgb(23,61,135)'
                },
            },
            axisLabel: {
                color: 'rgb(70,92,100)'
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: 'rgb(70,92,100)'
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: 'rgb(23,61,135)',
                    width: 0.5
                }
            },
            axisLine: {
                show: false
            },
            offset: 10,
        },
        color: ['rgb(44,249,251)'],
        series: [{
            data: data.myopiaArray,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            label: {
                formatter: '{c} %',
                show: true,
                color: 'rgb(44,249,251)',
                fontSize: 10,
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(44,249,251)'
                }, {
                    offset: 1,
                    color: 'rgba(44,249,251,0)'
                }])
            }
        }]
    };
    var lineRightCharts = loadCharts('line-right', lineRightOptions)
    // 点击坐标轴跳转各区所有学校具体情况
    lineRightCharts.on('click', function (e) {
        jumpPage('schoolRegionIndex', 'regionName', e.value)
    })
}


/**
 * 各区受检学生近视人数排行
 * @param data
 */
function barLeftEchart(data) {

    // 根据value 排序
    data.sort(compare('value'))

    var maxNum = data[0].value;
    // 给柱状图添加样式
    for (var i = 0; i < data.length; i++) {
        // 取数组最大值
        maxNum > data[i].value ? null : maxNum = data[i].value;
        // 自定义样式
        if (i % 2 !== 0) {
            data[i]['itemStyle'] = {
                color: 'rgb(26,152,251)'
            }
        } else {
            data[i]['itemStyle'] = {
                color: 'rgb(44,249,251)'
            }
        }
    }

    // 取数据最大值绘制柱状图边框
    maxNum = maxNum + (maxNum * 0.07);
    var maxArray = []
    for (var i = 0; i < data.length; i++) {
        maxArray.push(maxNum)
    }

    // 左下方柱状图配置 各区受检学生近视人数排行
    var barLeftOptions = {
        grid: {
            top: '5%',
            bottom: '10%',
            right: '8%',
        },
        xAxis: {
            type: 'value',
            max: maxNum,
            splitLine: {
                show: false
            },
            show: false
        },
        yAxis: {
            triggerEvent: true,
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: function (val, index) {
                    return (index % 2 !== 0) ? 'rgb(26,152,251)' : 'rgb(44,249,251)'
                }
            },
            data: data.map(function (item) {
                return item.name
            })
        },
        dataZoom: [
            {
                start: 0,//默认为0
                end: 100 - 1500 / 31,//默认为100
                type: 'slider',
                maxValueSpan: 14,//窗口的大小，显示数据的条数的
                show: true,
                yAxisIndex: [0],
                handleSize: 0,//滑动条的 左右2个滑动条的大小
                width: 10,
                height: '80%',//组件高度
                right: 20,//右边的距离
                top: '8%',//右边的距离
                bottom: 0,
                borderColor: "rgba(43,48,67,.8)",
                fillerColor: '#33384b',
                backgroundColor: 'rgba(43,48,67,.8)',//两边未选中的滑动条区域的颜色
                showDataShadow: false,//是否显示数据阴影 默认auto
                showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
                realtime: true, //是否实时更新
                filterMode: 'filter',
                yAxisIndex: [0],//控制的 y轴
            },
            //下面这个属性是里面拖到
            {
                type: 'inside',
                show: true,
                yAxisIndex: [0],
                start: 0,//默认为1
                end: 100 - 1500 / 31,//默认为100
            },

        ],
        series: [
            {
                name: '近视人数',
                type: 'bar',
                z: 10,
                barCategoryGap: '30%',
                label: {
                    position: 'right',
                    show: true,
                    formatter: '{c}人',
                    verticalAlign: 'middle',
                },
                data: data
            },
            {
                type: 'bar',
                silent: true,
                itemStyle: {
                    borderColor: "rgb(23,61,135)",
                    borderWidth: 1,
                    color: 'transparent'
                },
                label: {
                    show: false
                },
                barGap: '-100%',
                data: maxArray
            },
        ]
    };
    var barLeftCharts = loadCharts('bar-left', barLeftOptions)
    // 点击坐标轴跳转各区所有学校具体情况
    barLeftCharts.on('click', function (e) {
        jumpPage('schoolRegionIndex', 'regionName', e.value)
    })

}

/**
 * 全市近视学生预警信息
 * @param data
 * @param screenSum 总人数
 */
function pieRightEchart(data,screenSum) {

    var pieRightOptions = {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                var tips = '';
                var value = params.value;
                tips += params.seriesName + ' ' + '<br>';
                tips += params.marker + params.name + '：' + value + '（' + formatRate(value / screenSum) + ' %）' + '<br>';

                return tips;
            }
        },
        color: ['rgb(248,235,109)', 'rgb(249,158,120)', 'rgb(248,62,47)'],
        series: [
            {
                name: '全市近视学生预警信息',
                type: 'pie',
                radius: ['50%', '70%'],
                data: data
            }
        ]
    };
    loadCharts('pie-right', pieRightOptions)
}


/**
 * 填充返回结果(主方法)
 * @param result 数据集合
 */
function main(result) {

    if (!result || result.code != web_status.SUCCESS) {
        $.modal.msgError("返回结果异常");
        return;
    }
    var data = result.data;

    // 受检总人数
    var screenSum = 0;
    // 近视总人数
    var myopiaSum = 0;
    // 所有区
    var regionNameArray = [];
    // 各区近视人数
    var myopiaArray = [];
    // 各区以及近视人数
    var regionAndMyopiaData = [];
    // 预警人数
    var firstLevelWarningSum = 0, secondLevelWarningSum = 0, thirdLevelWarningSum = 0;


    data.forEach((item, index) => {
        var regionName = item.regionName;
        var firstLevelWarningCount = item.firstLevelWarningCount;
        var secondLevelWarningCount = item.secondLevelWarningCount;
        var thirdLevelWarningCount = item.thirdLevelWarningCount;
        var myopiaRate = item.myopiaRate ? item.myopiaRate : '00.00';
        var screenCount = item.screenCount;
        var myopiaCount = item.myopiaCount;


        // 填充所需数据
        firstLevelWarningSum += firstLevelWarningCount;
        secondLevelWarningSum += secondLevelWarningCount;
        thirdLevelWarningSum += thirdLevelWarningCount;
        screenSum += screenCount;
        myopiaSum += myopiaCount;

        regionNameArray.push(regionName)
        myopiaArray.push(myopiaRate);

        regionAndMyopiaData.push({
            name: regionName,
            value: myopiaCount
        })

    });

    // 全市受检学生近视占比
    var pieLeftDataArray = [
        {value: myopiaSum, name: '近视'},
        {value: screenSum - myopiaSum, name: '正常', selected: false},
    ]
    pieLeftEchart(pieLeftDataArray);

    // 各区近视新发病率
    var lineRightData = {
        regionNameArray: regionNameArray,
        myopiaArray: myopiaArray
    }
    lineRightEchart(lineRightData);

    // 各区受检学生近视人数排行
    barLeftEchart(regionAndMyopiaData);

    // 全市近视学生预警信息
    var pieRightDataArray = [
        {value: firstLevelWarningSum, name: '一级预警'},
        {value: secondLevelWarningSum, name: '二级预警'},
        {value: thirdLevelWarningSum, name: '三级预警', selected: false},
    ]
    pieRightEchart(pieRightDataArray,screenSum);
}

/**
 * 查询参数
 * @returns {{year: jQuery, screenNum: (v.fn.init|b.fn.init|p.fn.init|jQuery|HTMLElement)}}
 */
function getParams() {
    var year = $('#year').val();
    var screenNum = $('#screen-num').val();
    return {cityId: 234, year: year, screenNum: screenNum};
}

/**
 * 初始化加载方法
 */
function init() {
    var params = getParams();
    if (!params.year) {
        return;
    }
    // 异步加载
    $.post($url + 'visual/city/cityMyopiaStat', getParams(), (response) => {
        console.log("结果：", response)
        main(response);
    })
}
