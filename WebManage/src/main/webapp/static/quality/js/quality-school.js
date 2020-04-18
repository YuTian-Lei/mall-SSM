$(function () {

    first = 0;
    initSelect();
    // 初始化完成默认选中第一个地区
    $("#region option:first").prop("selected", 'selected');

    //初始化方法
    init();

    // 标题块展示
    $('.container .left .big').html(getSchoolName())
    $('.container .right .title-box .big').html('深圳市' + getRegionName() + getSchoolName())

})


/**
 * 获取选中学校名称
 */
function getSchoolName() {
    return $('#schoolName').val();
}


/**
 * 初始化表格数据
 * @param data
 */
function initTableData(data) {


    // 表格传值
    let item_1 = '', item_2 = '', item_3 = '', item_4 = '', item_5 = '';

    data.forEach((item) => {
        var teamName = item.teamName;
        var schoolName = item.schoolName;

        item_1 = '      <li><span class="">' + getRegionName() + '<br />' + schoolName + '</span></li>\n' +
            '            <li>筛查队：<br /><span class="">' + teamName + '</span></li>'

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

    $('.container .right .content ul.item').attr('style', 'min-height:' + $('.container .right .content').height() + 'px');

    $('.container .right .content .tbody').mCustomScrollbar({
        autoHideScrollbar: false,
        scrollbarPosition: "outside",
        axis: "y",
        autoExpandScrollbar: false,
        advanced: {autoExpandHorizontalScroll: false}
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
    var lenArray = []
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
            //下面这个属性是里面拖到
            // {
            //     type: 'inside',
            //     show: true,
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
    var data = result.result.data;
    var echartData = result.result.echartData;

    // 初始化Echart
    initQualityEchart(echartData);
    // 地区
    initTableData(data)

}
/**
 *  初始化模糊搜索框
 */
function initSelect() {
        // 初始化学校下拉模糊查询框
    $('#schoolSel').searchableSelect({
            // 选中事件
            afterSelectItem: function () {
                var schoolId = this.holder.data("value");
                if (schoolId) {
                    var schoolName = this.holder[0].innerText;
                    $('#schoolId').val(schoolId);
                    $('#schoolName').val(schoolName);
                    // 解决搜索框重复初始化
                    if (++first > 1) {
                        init();
                    }
                }
                // 标题块展示
                $('.container .left .big').html(getSchoolName())
                $('.container .right .title-box .big').html('深圳市' + getRegionName() + getSchoolName())
            }
        }
    );
    // 调整搜索框及选中
    $('.searchable-select-input').css("width", "240");
    $('.searchable-select-holder').css("width", "250");

}

/**
 * 初始化加载方法
 */
function init() {
    var params = getParams();
    params.schoolId = $('#schoolId').val();
    if (!params.year || !params.regionId || !params.schoolId) {
        return;
    }

    // 异步加载各学校数据
    $.post($url + '/visual/quality/schoolScreeningQualityStat', params, (response) => {
        console.log("结果：", response)
        main(response);
    })


}

/**
 * 异步加载学校
 */
function getSchool() {
    cleanSchool()
    $('#schoolbox').html('');
    var params = getParams();
    if (!params.regionId) {
        return;
    }
    // 异步加载
    $.post($url + '/admin/school/getSchoolByUser', {region: params.regionId}, (response) => {
        if (response.result) {
            console.log("学校",response)
            var schools ='';
            response.result.forEach((item) => {
                schools += '<option value="' +item.id + '">' +item.schoolName + '</option>';
            })
            $('#schoolbox').html(' <select name="" id="schoolSel" class=""  autocomplete="off" >'+schools+'</select><img class="icon" src="/static/realtime/imags/more.png" alt="">');

            params.schoolId = response.result[0].id;
            initSelect();
        }
    })
}

/**
 * 重置学校
 */
function cleanSchool() {
    $('#schoolId').val("");
    $('#schoolName').val("");
}
