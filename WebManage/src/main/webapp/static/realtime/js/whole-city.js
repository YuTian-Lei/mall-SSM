$(function () {

    $('.header .right').mCustomScrollbar({
        autoHideScrollbar:true,
        scrollbarPosition:"outside",
        axis: "x",
        autoExpandScrollbar: true,
        advanced: { autoExpandHorizontalScroll: true }
    })
    $('.header .left').mCustomScrollbar({
        autoHideScrollbar:true,
        scrollbarPosition:"outside",
        axis: "x",
        autoExpandScrollbar: true,
        advanced: { autoExpandHorizontalScroll: true }
    })
    // 异步初始化所有数据
    init();

    // 点击数字跳转页面
    $('.num-box .complete').on('click', function () {
        // 跳转页面名称、参数名、参数值
        jumpPage('screenedCityIndex');
    })

    // 地图数据加载
    echarts.registerMap('shenzhen', geoJson, {});
    getSchoolCoordinate();

    // 地图数据加载
    function getSchoolCoordinate() {
        var myChart = echarts.init(document.getElementById('map'));

        // 注册地图点击事件
        myChart.on('click', function (params) {
            console.log('mapclick', params);
            // 跳转页面名称、参数名、参数值
            jumpPage('schoolRegionIndex', 'regionName', params.name)
        });

        // 地图初始化配置项
        var option = {
            geo: {
                map: 'shenzhen',
                roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                aspectScale: 0.75,
                zoom: .9,
                label: {
                    normal: {
                        show: false,
                    },
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: 'rgb(4,56,82)',
                        borderWidth: 1.5,
                        borderColor: 'rgb(28,174,213)',
                        shadowOffsetY: 5,
                        shadowBlur: 4,
                        shadowColor: 'rgb(8,81,106)'

                    },
                    emphasis: {
                        borderWidth: 1.5,
                        borderColor: 'rgb(28,174,213)',
                        areaColor: "rgb(4,56,82)",
                    }
                }
            },
            series: [

                {
                    name: 'Prices and Earnings 2012',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: [{
                        name: '宝安区', value: [
                            113.84857177734375,
                            22.64569990201865
                        ]
                    },
                        {
                            name: '光明区', value: [
                                113.92547607421875,
                                22.77364906658098
                            ]
                        },
                        {
                            name: '龙华区', value: [
                                114.01885986328125,
                                22.695120184965695
                            ]
                        },
                        {
                            name: '南山区', value: [
                                113.91860961914062,
                                22.516362822421307
                            ]
                        },
                        {
                            name: '福田区', value: [
                                114.0435791015625,
                                22.545537663981865
                            ]
                        },
                        {
                            name: '龙岗区', value: [
                                114.25369262695312,
                                22.760986169250472
                            ]
                        },
                        {
                            name: '罗湖区', value: [
                                114.158935546875,
                                22.582314544433036
                            ]
                        },
                        {
                            name: '盐田区', value: [
                                114.27703857421875,
                                22.607672192309476
                            ]
                        },
                        {
                            name: '坪山区', value: [
                                114.35806274414062,
                                22.68371708489949
                            ]
                        },
                        {
                            name: '大鹏新区', value: [
                                114.50225830078125,
                                22.625419765965866
                            ]
                        },
                    ],
                    activeOpacity: 1,
                    label: {
                        position: 'top',
                        formatter: '{b}',
                        show: true,
                        color: '#fff',
                        width: 100,
                        height: 20,
                        padding: [8, 10, 12, 10],
                        backgroundColor: {
                            image: '../../realtime/imags/earth-label-bg.png',

                        }
                    },
                    symbol: "image://./../../static/realtime/imags/earth-circle.png",
                    symbolSize: 15,
                    itemStyle: {
                        borderColor: '#fff',
                        color: '#577ceb',
                    },
                },

            ]
        };
        myChart.setOption(option);
    }
});

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

    // 已完成筛查工作
    var completeArray = [];
    // 进行筛查工作
    var onGoingArray = [];
    // 未开始筛查工作
    var notBeginArray = [];
    // 受检范围总人数
    var screenSum = 0;
    // 已完成检范围总人数
    var finishCount = 0;
    // 各种状态区的个数
    var completeCount = 0, onGoingCount = 0, notBeginCount = 0;

    data.forEach((item, index) => {
        var regionName = item.regionName;
        var schoolFinishCount = item.schoolFinishCount;
        var schoolNotFinishCount = item.schoolNotFinishCount;
        var screeningCount = item.screeningCount;
        var planScreeningCount = item.planScreeningCount;
        var notScreeningCount = item.notScreeningCount;
        var regionStatus = item.regionStatus;

        // 通用数组
        var baseArray = {
            regionName: regionName,
            complete: schoolFinishCount,
            inComplete: schoolNotFinishCount,
            screened: screeningCount,
            sreening: notScreeningCount,
            regionStatus : regionStatus
        };

        // 已完成
        if (regionStatus == plan_status.FINISH) {
            completeCount++;
            completeArray.push(baseArray);
            // 进行中
        } else if (regionStatus == plan_status.ONGOING) {
            onGoingCount++;
            onGoingArray.push(baseArray);
            // 未开始
        } else {
            notBeginCount++;
            notBeginArray.push(baseArray);
        }

        screenSum += planScreeningCount;
        finishCount += screeningCount;
    })

    // 各种状态完成个数
    $('.right .complete').html(completeCount);
    $('.right .ongoing').html(onGoingCount);
    $('.right .notbegin').html(notBeginCount);

    // 受检范围总人数
    $('.num-box .total').html(screenSum);
    // 已完成受检人数
    $('.num-box .complete').html(finishCount);


    // 填充表格数据
    loadTbody($('.tbody.complete'), completeArray);
    loadTbody($('.tbody.on-going'), onGoingArray);
    loadTbody($('.tbody.not-begin'), notBeginArray);
    // 右侧加隐藏滚动条，避免数据过多页面占满，
    // loadTbody()数据渲染成功之后调用此方法
    $('.container .right').niceScroll();

}

/**
 * 加载表格数据
 * @param {*} $el
 * @param {*} dataArray
 */
function loadTbody($el, dataArray) {
    var result = '';

    for (var i = 0; i < dataArray.length; i++) {
        result += '<ul><li>' + dataArray[i].regionName + '</li><li>' + dataArray[i].complete + '</li><li>' + dataArray[i].inComplete + '</li><li>' + dataArray[i].screened + '</li><li>' + dataArray[i].sreening + '</li><li>' + formatterStatus(dataArray[i].regionStatus) + '</li></ul>'
    }

    $($el).html(result)
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
    if (!params.year){
        return;
    }
    // 异步加载
    $.post($url + 'visual/city/cityScreenStat', params, (response) => {
        console.log("结果：", response)
        main(response);
    })
}
