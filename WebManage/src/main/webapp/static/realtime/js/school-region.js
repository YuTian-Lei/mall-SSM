$(function () {

    //初始化方法
    init();
    // 地图数据加载
    getSchoolCoordinate()

    // 点击数字跳转各区筛查数据展示 screenedRegionIndex
    $('.num-box .complete').on('click', function () {
        // 跳转页面名称、参数名、参数值
        jumpPage('/admin/realtime/screenedRegionIndex', 'regionName', getRegionName())
    })
})

/**
 * 填充返回结果(主方法)
 * @param result 数据集合
 */
function main(result) {

    // 每次初始化重新加载地图
    getSchoolCoordinate();

    if (!result || result.code != web_status.SUCCESS) {
        $.modal.msgError("返回结果异常");
        return;
    }
    var data = result.data;

    // 填充title数据
    paddingTitleData(data);

    // 表格数据
    loadTbody($('.tbody'), data.regionSchoolStat)

}

/**
 * 填充title数据
 * @param data
 */
function paddingTitleData(data) {

    $('.num-box .label').eq(0).html(getRegionName() + '受检范围总人数：')
    // 受检总人数
    $('.num-box .total').html(data.planCount);
    // 已完成受检人数
    $('.num-box .complete').html(data.screenCount);

    // 表格上方标题展示
    $('.title-box .complete').html(data.schoolFinishCount);
    $('.title-box .ongoing').html(data.schoolStartCount);
    $('.title-box .notbegin').html(data.schoolNotStartCount);
}

/**
 * 加载地图
 */
function getSchoolCoordinate() {

    // 获取该页面regionName
    var geoObject = {
        type: "FeatureCollection",
        features: []
    }

    // 初始化地图空对象，根据regionName对应上海市地图数据中区的features[i]
    geoJson.features.map(function (item) {
        if (item.properties.name === getRegionName()) {
            geoObject.features = [];
            geoObject.features.push(item)
        }
    })
    if ("市直属" === getRegionName()) {
        geoObject.features = geoJson.features
    }
    echarts.registerMap('shenzhen', geoObject, {});
    var myChart = echarts.init(document.getElementById('map'));

    // 地图初始化配置项
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                console.log(params)
                return params.seriesName + '</br>' + params.data.name + '</br>' + params.data.leader;
            }
        },
        geo: {
            map: 'shenzhen',
            roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            aspectScale: 0.75,
            zoom: 1,
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: '#00a0c9'
                    }
                },
                emphasis: { // 对应的鼠标悬浮效果
                    show: false,
                    textStyle: {
                        color: "#fff"
                    }
                }
            },
            itemStyle: {
                normal: {
                    areaColor: 'rgb(4,39,69)',
                    borderColor: 'rgb(45,109,149)'
                },
                emphasis: {
                    borderWidth: 0,
                    borderColor: '#0066ba',
                    areaColor: "#0494e1",
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },
    };
    myChart.setOption(option);
}


/**
 * 获取选中区域
 * @returns {jQuery}
 */
function getRegionName() {
    return $('#region option:selected').html()
}

/**
 * 加载表格数据
 * @param {*} $el
 * @param {*} dataArray
 */
function loadTbody($el, dataArray) {
    // 分页插件
    $('#pagination-container').pagination({
        dataSource: dataArray,
        pageSize: 16,
        prevText: '上一页',
        nextText: '下一页',
        callback: function (data) {
            var result = '';
            for (var i = 0; i < data.length; i++) {
                result += '<ul><li>' + data[i].schoolName + '</li><li>' + data[i].schoolTypeName + '</li><li>' + data[i].planScreeningCount + '</li><li>' + data[i].screeningCount + '</li><li>' + data[i].spotCount + '</li><li>' + data[i].myopiaCount + '</li><li>' + formatterStatus(data[i].planStatus) + '</li></ul>'
            }
            $el.html(result)
            $el.niceScroll();
        }
    })
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
    if (!params.year){
        return;
    }
    // 异步加载
    $.post($url + 'visual/region/regionScreenStat', getParams(), (response) => {
        console.log("结果：", response)
        main(response);
    })
}
