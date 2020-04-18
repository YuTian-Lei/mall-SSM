/**
 * 全局变量:项目路径
 */
$url = getContextPath();

$(()=>{


})
/**
 * 选中select文字样式修改
 * @param {*} $el dom实例
 * @param {*} val 判断是否有值为选中状态
 */
function selectActive($el, val) {
    if (val) {
        $el.css({
            color: 'rgb(44, 252, 253)'
        })
    } else {
        $el.css({
            color: '#fff'
        })
    }
}

/**
 * 点击标签跳转页面并携带参数
 * @param {*} url 页面路径
 * @param {*} paramName 参数名称
 * @param {*} paramValue 参数值
 */
function jumpPage(url, paramName, paramValue) {
    var herf = url;
    if (paramName) {
        herf += '?' + paramName + '=';
        if (paramValue) {
            herf += paramValue;
        }
    }
    console.log('跳转：',herf)
    window.location.href = herf;
}

/**
 * 加载echarts通用方法
 * @param {*} id 节点id
 * @param {*} options echarts配置项
 */
function loadCharts(id, options) {
    var myChart = echarts.init(document.getElementById(id));
    myChart.setOption(options, window.onresize = myChart.resize)
    return myChart;
}

/**
 * 获取项目跟路径
 * @returns
 */
function getContextPath() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目次，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf("/") + 1);
    // console.log(localhostPaht);
    return (localhostPaht + '/');
}

/**
 * 根据指定字段对比排序
 * @param property
 * @returns {function(*, *): number}
 */
function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

/**
 * 格式化状态
 * @param status 状态码
 */
function formatterStatus(status) {
    var statusStr = '';
    switch (status) {
        case plan_status.FINISH : statusStr = '已完成';break
        case plan_status.ONGOING : statusStr = '进行中';break
        case plan_status.NOTSTARTED : statusStr = '未开始';break
        default:statusStr = '其他'; break;
    }
    return statusStr;
}
/**
 * 格式化小数点2位数
 */
function formatRate(obj) {
    if (obj){
        return (obj * 100).toFixed(2);
    }
    return '0.00'

}

/** 消息状态码 */
web_status = {
    SUCCESS: 200,
    FAIL: 500,
    WARNING: 301
};
/** 计划状态 */
plan_status = {
    FINISH: 2,
    ONGOING: 1,
    NOTSTARTED: 0
};