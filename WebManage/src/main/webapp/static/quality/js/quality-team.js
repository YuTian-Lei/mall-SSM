$(function () {

    //初始化方法
    init();

    // 标题块展示
    var leftTitle = $('.container .left .big');
    var rightTitle = $('.header .right .big');

    leftTitle.html('深圳市' + getRegionName())
    rightTitle.html('深圳市' + getRegionName())
    $('#region').change(() => {
        leftTitle.html('深圳市' + getRegionName())
        rightTitle.html('深圳市' + getRegionName())
    })
})


/**
 * 初始化表格数据
 * @param teamId
 */
function initTableData(teamId) {

    // 参数
    var params = getParams();
    params.teamId = teamId;

    // 表格传值
    let item_1 = '', item_2 = '', item_3 = '', item_4 = '', item_5 = '';

    // 异步加载
    $.post($url + '/visual/quality/screeningTeamQualityStat', params, (response) => {
        console.log("表格结果：", response)

        if (!response || response.status != web_status.SUCCESS) {
            $.modal.msgError("返回结果异常");
            return;
        }

        if (null != response.result.data) {
            response.result.data.forEach((item) => {
                var groupLeader = item.groupLeader;
                var phone = item.phone;
                var schools = item.schools;

                item_1 = '       <li>队长：<span class="">' + groupLeader + '</span></li>\n' +
                    '            <li>联系方式：<br /><span class="">' + phone + '</span></li>\n' +
                    '            <li>筛查学校：<br /><span class="">' + schools + '</span></li>'

                item_2 += '<li>' + item.gradeName + '</li>'
                item_3 += '<li>' + item.spotCheckNum + '</li>'
                item_4 += '<li>' + item.visionRate + '</li>'
                item_5 += '<li>' + item.seRate + '</li>'

            })

            $('.container .right .content  ul.item-1').html(item_1)
            $('.container .right .content  ul.item-2').html(item_2)
            $('.container .right .content  ul.item-3').html(item_3)
            $('.container .right .content  ul.item-4').html(item_4)
            $('.container .right .content  ul.item-5').html(item_5)
        }
    })

    $('.container .right .content .tbody').mCustomScrollbar({
        autoHideScrollbar: false,
        scrollbarPosition: "outside",
        axis: "y",
        autoExpandScrollbar: false,
        advanced: {autoExpandHorizontalScroll: false}
    })
}

/**
 * 筛查团队
 * @param datas
 */
function initScreenTeam(datas) {

    var team_list_str = '';

    var first = 0;
    var selColor = '#00f9fb';

    datas.forEach((item, index) => {
        var name = item.name;
        var value = item.value;

        var fontColor = getColorByValue(value);

        // 默认选中
        if (index == 0) {
            first = item.teamId;
            team_list_str += '<li class="active" value="' + item.teamId + '" style="color: ' + selColor + '" titles="' + value + '">' + name + '</li>';
        } else {
            team_list_str += '<li value="' + item.teamId + '" style="color: ' + fontColor + '"  titles="' + value + '">' + name + '</li>';
        }
    })
    // 填充筛查队
    $('.container .right .team-box ul').html(team_list_str)

    // 根据筛查队ID加载表格数据
    initTableData(first);

    // 切换队伍样式修改
    $('.container .right .team-box ul li').on('click', function () {
        $('.container .right .team-box ul li').removeClass('active')
        $(this).addClass('active')
        var teamId = $(this).val();

        // 初始化默认颜色
        $('.container .right .team-box ul li').each((index, item) => {
            var value = item.attributes.titles.value;
            var defaultCol = getColorByValue(value);
            item.style = "color:" + defaultCol;
        })
        // 切换颜色
        var selColor = $(this).css('color');
        $(this).css("color", getColorBySel(selColor));

        initTableData(teamId);
    })


    $('.container .right .content ul.item').attr('style', 'min-height:' + $('.container .right .content').height() + 'px');

    // 队伍滚动条
    $('.container .right .team-box ul').mCustomScrollbar({
        autoHideScrollbar: false,
        scrollbarPosition: "outside",
        axis: "x",
        autoExpandScrollbar: true,
        advanced: {autoExpandHorizontalScroll: true}
    })

}

/**
 * 初始化各区质控Echarts
 * @param data
 */
function initQualityEchart(echartDatas) {

    var maxNum = 20;

    // 给柱状图添加样式
    for (var i = 0; i < echartDatas.length; i++) {
        // 取数组最大值
        maxNum > echartDatas[i].value ? null : maxNum = echartDatas[i].value;
        // 自定义样式
        if (i % 2 !== 0) {
            echartDatas[i]['itemStyle'] = {
                color: 'rgb(26,152,251)'
            }
        } else {
            echartDatas[i]['itemStyle'] = {
                color: 'rgb(44,249,251)'
            }
        }
    }

    // 取数据最大值绘制柱状图边框
    maxNum = maxNum;
    var maxArray = []
    var lenArray = [];
    echartDatas.forEach((item) => {
        lenArray.push(item.name.length);
        maxArray.push(maxNum)
    })


    // 左下方柱状图配置 各区受检学生近视人数排行
    var barLeftOptions = {
        grid: {
            top: '0%',
            bottom: '10%',
            right: '8%',
            left: getMaxLen(lenArray),
        },
        xAxis: {
            type: 'value',
            max: maxNum,
            splitLine: {
                show: false
            },
            show: true,
            axisLine: {
                lineStyle: {
                    color: 'rgb(23,61,135)'
                },
            },
            axisLabel: {
                color: 'rgb(139, 201, 215)',
                formatter: '{value}%'
            },

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
            data: echartDatas.map(function (item) {
                return item.name
            })
        },
        dataZoom: [
            {
                start: 100 - Math.floor((10 / echartDatas.length) * 100),//默认为0
                end: 100,//默认为100
                type: 'slider',
                maxValueSpan: 100,//窗口的大小，显示数据的条数的
                show: true,
                yAxisIndex: [0],
                handleSize: 0,//滑动条的 左右2个滑动条的大小
                width: 5,
                height: '80%',//组件高度
                right: 20,//右边的距离
                top: '8%',//右边的距离
                bottom: 0,
                borderColor: "rgba(43,48,67,.8)",
                borderRadius: 5,
                fillerColor: 'rgb(44,249,251)',
                backgroundColor: 'rgba(43,48,67,.8)',//两边未选中的滑动条区域的颜色
                showDataShadow: false,//是否显示数据阴影 默认auto
                showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
                realtime: true, //是否实时更新
                filterMode: 'filter',
                yAxisIndex: [0],//控制的 y轴
            },
            // //下面这个属性是里面拖到
            // {
            //     type: 'inside',
            //     show: false,
            //     yAxisIndex: [0],
            //     start: 0,//默认为1
            //     end: 100,//默认为100
            // },

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
                    formatter: '{c}%',
                    verticalAlign: 'middle',
                },
                data: echartDatas
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
                data: maxArray,
                markLine: {
                    symbol: 'none',
                    data: [

                        {
                            xAxis: 5, symbol: 'none', lineStyle: {
                                normal: {
                                    type: 'dashed',
                                    color: 'rgb(240,150,37)',
                                },
                            }
                        },
                        {
                            xAxis: 10, symbol: 'none', lineStyle: {
                                normal: {
                                    type: 'dashed',
                                    color: 'rgb(162,5,13)',
                                },
                            }
                        },

                    ],

                },

            },
        ]
    };
    loadCharts('bar-left', barLeftOptions)
}

/**
 * 填充返回结果(主方法)
 * @param result 数据集合
 */
function main(result) {

    if (!result || result.status != web_status.SUCCESS) {
        $.modal.msgError("返回结果异常");
        return;
    }
    var data = result.result.teamData;

    // 滚动条每次重新加载需销毁
    $('.container .right .team-box ul').mCustomScrollbar('destroy')

    // 初始化Echart
    initQualityEchart(data);
    // 筛查团队
    initScreenTeam(data)

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
    $.post($url + '/visual/quality/screeningTeamQualityEchartData', getParams(), (response) => {
        console.log("结果：", response)
        main(response);
    })
}