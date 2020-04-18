// 对比统计-按年份
/**
 * 初始化年份Echart
 */
function initYearEchart(data) {
    getOption(data)
}

var dom = document.getElementById("yearId");
var myChart = '';
var app = '';
var option = {}

function getOption(obj) {
    myChart = echarts.init(dom);
    var rate = obj.data.resultList;

    let dataNum = [];
    var legend = [];
    var statType = $('#statTypeId option:selected').html() + '对比情况';
    var id = hasChecks('');
    var title = id == 'years' ? '年份' : id == 'regions' ? '区域' : id == 'schoolFlags' ? '学校类型' : '学校性质';

    /* 格式化*/
    formatEchartData(obj, dataNum, legend);
    option = {
        title: {
            text: title + statType,
            bottom: 10,
            x: '10%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            },
            formatter: function (params) {
                var tipHtml = '';
                var name = params[0].name;
                for (var i = 0; i < params.length; i++) {
                    var name = params[i].name; // 横轴值
                    var text = params[i].seriesName; // 选项卡（下载量，更新量）
                    var value = params[i].value; // 值
                    var marker = params[i].marker; // 图标
                    var index = params[i].dataIndex; // 下标

                    tipHtml = tipHtml + ' ' + marker + ' ' + text + ' : ' + value + '（' + formatterNum(rate, index, i) + '%）' + '<br>';
                }
                return name + '<br>' + tipHtml;
            }

        },
        toolbox: {
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            },
        },
        legend: {
            data: legend,
            bottom: 5,
            left: '40%',
            icon: "circle",
        },
        xAxis: [
            {
                type: 'category',
                data: obj.data.xAxis,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
            }
        ],
        grid: {
            x: 70,
            y: 50,
            x2: 5,
            y2: 70,
            borderWidth: 1,
            bottom: 125,
        },
        series: dataNum,
    };

    if (option && typeof option === "object") {
        myChart.setOption(option,window.onresize = myChart.resize);
    }

}

/**
 * 格式化小数保留两位
 * @param val
 * @returns {number}
 */
function formatterNum(rate, index, i) {
    // 跳过合计
    if (index >= 6) {
        index++;
        if (index >= 10) {
            index++;
            if (index >= 14) {
                index++;
            }
        }
    }
    // 0
    if (i == 0) {
        return rate[index].commonBoyRate0;
    } else if (i == 1) {
        return rate[index].commonGirlRate0;
        // 1
    } else if (i == 2) {
        return rate[index].commonBoyRate1;
    } else if (i == 3) {
        return rate[index].commonGirlRate1;
        // 2
    } else if (i == 4) {
        return rate[index].commonBoyRate2;
    } else if (i == 5) {
        return rate[index].commonGirlRate2;
        // 3
    } else if (i == 6) {
        return rate[index].commonBoyRate3;
    } else if (i == 7) {
        return rate[index].commonGirlRate3;
        // 4
    } else if (i == 8) {
        return rate[index].commonBoyRate4;
    } else if (i == 9) {
        return rate[index].commonGirlRate4;
        // 5 
    } else if (i == 10) {
        return rate[index].commonBoyRate5;
    } else if (i == 11) {
        return rate[index].commonGirlRate5;
        // 6
    } else if (i == 12) {
        return rate[index].commonBoyRate6;
    } else if (i == 13) {
        return rate[index].commonGirlRate6;
        // 7
    } else if (i == 14) {
        return rate[index].commonBoyRate7;
    } else if (i == 15) {
        return rate[index].commonGirlRate7;
        // 8
    } else if (i == 16) {
        return rate[index].commonBoyRate8;
    } else if (i == 17) {
        return rate[index].commonGirlRate8;
        // 9
    } else if (i == 18) {
        return rate[index].commonBoyRate9;
    } else if (i == 19) {
        return rate[index].commonGirlRate9;
        // 10
    } else if (i == 20) {
        return rate[index].commonBoyRate10;
    } else if (i == 21) {
        return rate[index].commonGirlRate10;
        // 11
    } else if (i == 22) {
        return rate[index].commonBoyRate11;
    } else if (i == 23) {
        return rate[index].commonGirlRate11;
    } else if (i == 24) {
        return rate[index].commonBoyRate12;
    } else if (i == 25) {
        return rate[index].commonGirlRate12;
    }
}

/**
 * 市区数据排序
 * @param obj
 */
function sortData(obj) {
    var xAxis = obj.xAxis;
    var boys = obj.yAxis.boy;
    var girls = obj.yAxis.girl;
    var len = xAxis.length - 1;
    // 需要替换元素的下标
    var firstIndex;
    var nextIndex;
    xAxis.forEach((item, index) => {
        if (item == '市属') {
            firstIndex = index;
        }
        if (item == '其他') {
            nextIndex = index;
        }
    });
    if (firstIndex) {
        xAxis[firstIndex] = xAxis.splice(len - 1, 1, xAxis[firstIndex])[0];
        boys[firstIndex] = boys.splice(len - 1, 1, boys[firstIndex])[0];
        girls[firstIndex] = girls.splice(len - 1, 1, girls[firstIndex])[0];
    }
    if (nextIndex) {
        xAxis[nextIndex] = xAxis.splice(len, 1, xAxis[nextIndex])[0];
        boys[nextIndex] = boys.splice(len, 1, boys[nextIndex])[0];
        girls[nextIndex] = girls.splice(len, 1, girls[nextIndex])[0];
    }

    console.log("排序后：", obj);
}

/**
 * 格式化ehcarts
 */
function formatEchartData(obj, dataNum, legend) {
    var colorList = [
        '#5991ff', '#fc8e7e', '#feb85e'
        , '#8ec2fc', '#90fbe8', '#bc6b63', '#2cd6b4', '#3366ff', '#3c8dbc', '#8ec2fc', '#90fbe8', '#b7a9fd', '#5991ff', '#40e5fc',
        '#fc95b0', '#8ec2fc', '#90fbe8', '#b7a9fd',
        'rgba(37,214,204,0.85)', '#5fd645', '#c7fce4', '#d0d4fd'];
    var sele = hasChecks();
    if (sele == 'years') {
        /* 格式化legend */
        obj.data.legend.forEach((item, index) => {
            var value = item;
            legend.push(value.replace('girl', '女').replace('boy', '男'))
        })
        let all = getParams().years//选中的年
        all.split(",").forEach((item, index) => {
            dataNum.push(
                {
                    name: item + '男',
                    type: 'bar',
                    data: obj.data.yAxis[item + "boy"],
                    color: colorList[index]
                },
                {
                    name: item + '女',
                    type: 'bar',
                    data: obj.data.yAxis[item + "girl"],
                    color: colorList[index + all.split(",").length]
                },)
        })
    } else if (sele == 'regions') {
        // 数据排序
        sortData(obj.data);
        dataNum.push(
            {
                name: '男',
                type: 'bar',
                data: obj.data.yAxis["boy"],
                color: colorList[0]
            },
            {
                name: '女',
                type: 'bar',
                data: obj.data.yAxis["girl"],
                color: colorList[1]
            },)
    } else if (sele == 'schoolFlags') {
        /* 格式化legend */
        obj.data.legend.forEach((item, index) => {
            var value = item;
            legend.push(value.search("男") != -1 ? getFlagNameByName(item.replace('男', '')) + '男' : getFlagNameByName(item.replace('女', '')) + '女');
        })
        var all = getParams().schoolFlags.split(',');
        all.forEach((item, index) => {
            var yAxisName = getFlagNameByItem(item);
            dataNum.push(
                {
                    name: getFlagNameByValue(item) + '男',
                    type: 'bar',
                    data: obj.data.yAxis[yAxisName + "男"],
                    color: colorList[index]

                },
                {
                    name: getFlagNameByValue(item) + '女',
                    type: 'bar',
                    data: obj.data.yAxis[yAxisName + "女"],
                    color: colorList[index + all.length + 1]

                },
            )
        })
        /* 学校性质*/
    } else if (sele == 'schoolNatures') {
        obj.data.legend.forEach((item, index) => {
            var value = item;
            legend.push(value)
        })
        var all = getParams().natures.split(',');
        all.forEach((item, index) => {
            var yAxisName = formatNatures(item)
            dataNum.push(
                {
                    name: yAxisName + '男',
                    type: 'bar',
                    data: obj.data.yAxis[yAxisName + "男"],
                    color: colorList[index]

                },
                {
                    name: yAxisName + '女',
                    type: 'bar',
                    data: obj.data.yAxis[yAxisName + "女"],
                    color: colorList[index + all.length + 1]

                },)
        })
    }

    /**
     * 学校性质  1：公办 2：民办 3：市内 4：市外  5、幼儿园 6、小学 7、初中 8、高中 9、职高 10、中专 11、大学 12、九年一贯制 13、十二年一贯制 14、完全中学
     */
    function formatNatures(item) {
        var yAxisName;
        switch (item) {
            case '1':
                // 国家抽样
                yAxisName = '公办';
                break;
            case '2':
                // 市抽样
                yAxisName = '民办';
                break;
            case '3':
                // 近视示范
                yAxisName = '市内';
                break;
            case '4':
                // 市重点
                yAxisName = '市外';
                break;
            case '5':
                // 区重点
                yAxisName = '幼儿园';
                break;
            case '6':
                // 其他
                yAxisName = '小学';
                break;
            case '7':
                // 其他
                yAxisName = '初中';
                break;
            case '8':
                // 其他
                yAxisName = '高中';
                break;
            case '9':
                // 其他
                yAxisName = '职高';
                break;
            case '10':
                // 其他
                yAxisName = '中专';
                break;
            case '11':
                // 其他
                yAxisName = '大学';
                break;
            case '12':
                // 其他
                yAxisName = '九年一贯制';
                break;
            case '13':
                // 其他
                yAxisName = '十二年一贯制';
                break;
            case '14':
                // 其他
                yAxisName = '完全中学';
                break;
            default:
                yAxisName = ''
        }
        return yAxisName;
    }

    /**
     * 类型
     * @param item
     */
    function getFlagNameByValue(item) {
        var yAxisName;
        switch (item) {
            case '1':
                // 国家抽样
                yAxisName = '国家抽样';
                break;
            case '2':
                // 市抽样
                yAxisName = '市抽样';
                break;
            case '3':
                // 近视示范
                yAxisName = '近视示范';
                break;
            case '4':
                // 市重点
                yAxisName = '市重点';
                break;
            case '5':
                // 区重点
                yAxisName = '区重点';
                break;
            case '6':
                // 其他
                yAxisName = '其他';
                break;
            default:
                yAxisName = ''
        }
        return yAxisName;
    }

    /**
     *类型
     * @param item
     */
    function getFlagNameByName(item) {
        var yAxisName;
        switch (item) {
            case 'countryExmFlag':
                // 国家抽样
                yAxisName = '国家抽样';
                break;
            case 'cityExmFlag':
                // 市抽样
                yAxisName = '市抽样';
                break;
            case 'demonstration':
                // 近视示范
                yAxisName = '近视示范';
                break;
            case 'cityMajorFlag':
                // 市重点
                yAxisName = '市重点';
                break;
            case 'regionMajorFlag':
                // 区重点
                yAxisName = '区重点';
                break;
            case 'schoolFlagOther':
                // 其他
                yAxisName = '其他';
                break;
            default:
                yAxisName = '无'
        }
        return yAxisName;
    }

    /**
     *类型
     * @param item
     * @returns {string}
     */
    function getFlagNameByItem(item) {
        var yAxisName;
        switch (item) {
            case '1':
                // 国家抽样
                yAxisName = 'countryExmFlag';
                break;
            case '2':
                // 市抽样
                yAxisName = 'cityExmFlag';
                break;
            case '3':
                // 近视示范
                yAxisName = 'demonstration';
                break;
            case '4':
                // 市重点
                yAxisName = 'cityMajorFlag';
                break;
            case '5':
                // 区重点
                yAxisName = 'regionMajorFlag';
                break;
            case '6':
                // 其他
                yAxisName = 'schoolFlagOther';
                break;
            default:
                yAxisName = '无'
        }
        return yAxisName;
    }
}
