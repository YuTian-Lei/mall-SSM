$(function () {
    // 初始化方法
    init();

})

/**
 * 各区受检学生近视率排行
 * @param result
 */
function screenRegionEchart(result) {

    if (!result || result.code != web_status.SUCCESS) {
        $.modal.msgError("各区受检学生近视率排行：返回结果异常");
        return;
    }
    var data = result.data;

    var primaryData = [];
    var middleData = [];
    var seniorData = [];
    var vocationalData = [];
    var nineYearData = [];
    var highData = [];

    data.forEach((item, index) => {
        var schoolType = item.schoolType;
        var schoolTypeName = item.schoolTypeName;
        var myopiaCount = item.myopiaCount;
        var normalCount = item.normalCount;
        var screenCount = item.screenCount;

        // 饼图数据
        var pieDataArray = [
            {value: normalCount, name: '正常'},
            {value: myopiaCount, name: '近视', selected: false},
        ];

        switch (schoolType) {
            // 小学
            case  1: {
                primaryData = pieDataArray;
                break;
            }
            // 初中
            case 2: {
                middleData = pieDataArray;
                break;
            }
            // 高中
            case 3: {
                seniorData = pieDataArray;
                break;
            }
            // 职高
            case 4: {
                vocationalData = pieDataArray;
                break;
            }
            // 九年一贯
            case 7: {
                nineYearData = pieDataArray;
                break;
            }
            // 完全中学
            case 9: {
                highData = pieDataArray;
                break;
            }
            default:
                break;
        }
    });
    // 小学饼图 primary-school
    loadCharts('primary-school', getPieOptions("小学", echartData(primaryData)))
    // 中学饼图 middle-school
    loadCharts('middle-school', getPieOptions("初中", echartData(middleData)))
    // 高中饼图 senior-high-school
    loadCharts('senior-high-school', getPieOptions("高中", echartData(seniorData)))
    // 职高饼图 vocational-high-school
    loadCharts('vocational-high-school', getPieOptions("职高", echartData(vocationalData)))
    // 九年一贯 nine-year-school
    loadCharts('nine-year-school', getPieOptions("九年一贯", echartData(nineYearData)))
    // 完全中学 high-school
    loadCharts('high-school', getPieOptions("完全中学", echartData(highData)))

    /**
     * 填充Echart为空的数据
     * @param data
     * @returns {*[]}
     */
    function echartData(data) {
        if (data.length == 0) {
            // 饼图数据
            var pieDataArray = [
                {value: 0, name: '正常'},
                {value: 0, name: '近视', selected: false},
            ];
            return pieDataArray;
        }
        return data;
    }

    /**
     * 获取echarts pie 通用配置
     * @param {*} title 图标题
     * @param {*} data 图数据
     */
    function getPieOptions(title, data) {
        return {
            title: {
                text: title,
                left: '46.75%',
                top: '80%',
                textAlign: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {show: false},
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
                position: 'inside',
            },
            legend: {
                show: false
            },
            color: ['rgb(44,249,251)', 'rgb(26,152,251)'],
            series: [
                {
                    name: '各区受检学生近视率排行',
                    type: 'pie',
                    radius: ['35%', '50%'],
                    data: data,
                    selectedMode: 'single',
                    top: 0,
                    center: ['50%', '45%'],
                    label: {
                        show: true,
                        // position: 'inner'
                    },
                    labelLine: {
                        show: true,
                        // length: '10%',
                        // length2: '20%'
                    },
                }
            ]
        }
    }
}

/**
 * 各年级近视情况
 * @param result 数据集合
 */
function gradeEchart(result) {

    if (!result || result.code != web_status.SUCCESS) {
        $.modal.msgError("年龄近视情况：返回结果异常");
        return;
    }
    var data = result.data;

    // 横轴年龄
    var xAxisData = [];
    // 全部数据
    var seriesDataAll = [];
    // 男生数据
    var seriesDataBoy = [];
    // 女生数据
    var seriesDataGirl = [];
    // 各种率
    var rates = [];

    data.forEach((item, index) => {
        var gradeName = item.gradeName;
        var myopiaCount = item.myopiaCount;
        var boyMyopiaCount = item.boyMyopiaCount;
        var girlMyopiaCount = item.girlMyopiaCount;
        var girlMyopiaRate = item.girlMyopiaRate;
        var boyMyopiaRate = item.boyMyopiaRate;
        var myopiaRate = item.myopiaRate;

        // 填充所需数据
        xAxisData.push(gradeName);
        seriesDataBoy.push(boyMyopiaCount);
        seriesDataGirl.push(girlMyopiaCount)
        seriesDataAll.push(myopiaCount);

        // 拼接率
        rates.push({
            boyMyopiaRate: boyMyopiaRate,
            girlMyopiaRate: girlMyopiaRate,
            myopiaRate: myopiaRate
        });

    });

    // echarts配置项
    var barRightoption = {
        grid: {
            top: '15%',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter:
                function (params) {
                    console.log(params)
                    var tips = '';
                    var title = params[0].axisValue;
                    // 此组数据在echart中下标
                    var dataIndex = params[0].dataIndex;
                    tips += title + '<br>';
                    params.forEach((item, index) => {
                        // 该元素在此数组中下标 （0：男 1：女 2：总）
                        var seriesIndex = item.seriesIndex;
                        tips += item.marker + item.seriesName + '：' + item.value + '（' + getRate(rates, dataIndex, seriesIndex) + '）' + '<br>';
                    })
                    return tips;
                }
            ,
        },
        legend: {
            data: [
                {
                    name: '男生',
                    textStyle: {
                        color: 'rgb(36,210,250)',
                    }
                },
                {
                    name: '女生',
                    textStyle: {
                        color: 'rgb(250,190,110)'
                    }
                },
                {
                    name: '总人数',
                    textStyle: {
                        color: 'rgb(66,153,251)'
                    }
                }
            ],
            itemWidth: 10,
            itemHeight: 10,
            icon: "circle",
            right: '10%'
        },
        color: ['rgb(36,210,250)', 'rgb(250,190,110)', 'rgb(66,153,251)'],
        xAxis: {
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: 'rgb(23,61,135)'
                },
            },
            offset: 0,
            axisLabel: {
                color: 'rgb(70,92,100)'
            },
            data: xAxisData
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: 'rgb(70,92,100)',
            },
            axisTick: {
                show: false
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
            offset: 5,
        },
        series: [
            {
                name: '男生',
                type: 'bar',
                barWidth: '12%',
                itemStyle: {
                    barBorderRadius: 5,
                },
                data: seriesDataBoy
            },
            {
                name: '女生',
                type: 'bar',
                barWidth: '12%',
                itemStyle: {
                    barBorderRadius: 5
                },
                data: seriesDataGirl
            },
            {
                name: '总人数',
                type: 'bar',
                barWidth: '12%',
                itemStyle: {
                    barBorderRadius: 5
                },
                data: seriesDataAll
            }
        ]
    };
    loadCharts('bar-right', barRightoption)
}

/**
 * 各年龄近视情况
 * @param result 数据集合
 */
function ageEchart(result) {

    if (!result || result.code != web_status.SUCCESS) {
        $.modal.msgError("年龄近视情况：返回结果异常");
        return;
    }
    var data = result.data;

    // 横轴年龄
    var xAxisData = [];
    // 全部数据
    var seriesDataAll = [];
    // 男生数据
    var seriesDataBoy = [];
    // 女生数据
    var seriesDataGirl = [];
    // 各种率
    var rates = [];

    data.forEach((item, index) => {
        console.log(item)
        var age = item.age;
        var boyMyopiaCount = item.boyMyopiaCount;
        var girlMyopiaCount = item.girlMyopiaCount;

        var girlMyopiaRate = item.girlMyopiaRate;
        var boyMyopiaRate = item.boyMyopiaRate;
        var myopiaRate = item.myopiaRate;


        // 填充所需数据
        xAxisData.push(age);
        seriesDataBoy.push(boyMyopiaCount);
        seriesDataGirl.push(girlMyopiaCount)
        seriesDataAll.push(boyMyopiaCount + girlMyopiaCount);

        // 拼接率
        rates.push({
            boyMyopiaRate: boyMyopiaRate,
            girlMyopiaRate: girlMyopiaRate,
            myopiaRate: myopiaRate
        });

    });
    // echarts配置项
    var lineLeftoption = {
        grid: {
            top: '12%',
            left: '15%',
        },
        tooltip: {
            trigger: 'axis',
            formatter:
                function (params) {
                    var tips = '';
                    var age = params[0].axisValue;
                    // 此组数据下标
                    var dataIndex = params[0].dataIndex;
                    tips += age + ' 岁' + '<br>';
                    params.forEach((item, index) => {
                        tips += item.marker + item.seriesName + '：' + item.value + '（' + getRate(data,dataIndex,item.seriesIndex) + ' ）' + '<br>';
                    })
                    return tips;
                }
            ,
            position: function (pos, params, dom, rect, size) {
                // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                var obj = {top: 40};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
            }
        },
        color: ['rgb(250,190,110)', 'rgb(66,153,251)', 'rgb(36,210,250)', 'rgb(252,251,55)'],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
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
                color: 'rgb(70,92,100)',
            },
            axisTick: {
                show: false
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
            offset: 5,
        },
        series: [
            {
                name: '男生',
                type: 'line',
                stack: '度数',
                data: seriesDataBoy
            },
            {
                name: '女生',
                type: 'line',
                stack: '度数',
                data: seriesDataGirl
            },
            {
                name: '全部',
                type: 'line',
                stack: '度数',
                data: seriesDataAll
            }
        ]
    };
    loadCharts('line-left', lineLeftoption)
}

/**
 * 获取率
 * @param data
 * @param dataIndex
 * @param seriesIndex
 */
function getRate(data, dataIndex, seriesIndex) {
    var rate = "0.00";
    switch (seriesIndex) {
        case 0 :
            rate = data[dataIndex].boyMyopiaRate;
            break;
        case 1 :
            rate = data[dataIndex].girlMyopiaRate;
            break;
        case 2 :
            rate = data[dataIndex].myopiaRate;
            break;
        default:
            break;
    }
    return rate + ' %';
}

/**
 * 查询参数
 * @returns {{year: jQuery, screenNum: (v.fn.init|b.fn.init|p.fn.init|jQuery|HTMLElement)}}
 */
function getParams() {
    var year = $('#year').val();
    var screenNum = $('#screen-num').val();
    var regionId = $('#region').val();
    return {cityId: 234, year: year, regionId: regionId, screenNum: screenNum};
}

/**
 * 初始化加载方法
 */
function init() {
    var params = getParams();
    if (!params.year ) {
        return;
    }
    // 异步加载年龄统计
    $.post($url + 'visual/region/regionAgeStat', getParams(), (response) => {
        console.log("Age结果：", response)
        ageEchart(response);
    })
    // 异步加载年级统计
    $.post($url + 'visual/region/regionGradeStat', getParams(), (response) => {
        console.log("Grade结果：", response)
        gradeEchart(response);
    })
    // 各区受检学生近视率排行
    $.post($url + 'visual/region/regionSchoolTypeStat', getParams(), (response) => {
        console.log("Screen结果：", response)
        screenRegionEchart(response);
    })

}