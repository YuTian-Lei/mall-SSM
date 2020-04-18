/**
 * 全局变量:项目路径
 */
$url = getContextPath();

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
 * 查询参数
 * @returns {{year: jQuery, screeningNum: (v.fn.init|b.fn.init|p.fn.init|jQuery|HTMLElement)}}
 */
function getParams() {
    var year = $('#year').val();
    var screenNum = $('#screen-num').val();
    var regionId = $('#region').val();
    return {cityId: 234, year: year, regionId: regionId, screeningNum: screenNum};
}

/**
 * 获取选中区域
 * @returns {jQuery}
 */
function getRegionName() {
    return $('#region option:selected').html()
}

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
 * @param {*} pageName 页面名称
 * @param {*} paramName 参数名称
 * @param {*} paramValue 参数值
 */
function jumpPage(pageName, paramName, paramValue) {
    let hrefArr = window.location.href.split("/");
    let hrefStr = window.location.href;
    var url = hrefStr.replace(hrefArr[hrefArr.length - 1], '') + pageName
    return window.open(url + '?' + paramName + '=' + paramValue)
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
 * 获取url参数，不指定name返回所有参数
 * @param {*} name 指定name直接返回该参数值
 */
function getUrlParams(name) {
    var url = window.location.search;
    if (url.indexOf('?') == 1) {
        return false;
    }
    url = url.substr(1);
    url = url.split('&');
    var name = name || '';
    var nameres;
    // 获取全部参数及其值
    for (var i = 0; i < url.length; i++) {
        var info = url[i].split('=');
        var obj = {};
        obj[info[0]] = decodeURI(info[1]);
        url[i] = obj;
    }
    // 如果传入一个参数名称，就匹配其值
    if (name) {
        for (var i = 0; i < url.length; i++) {
            for (const key in url[i]) {
                if (key == name) {
                    nameres = url[i][key];
                }
            }
        }
    } else {
        nameres = url;
    }
    // 返回结果
    return nameres;
}

/**
 * 更换url参数
 * @param {*} destiny 目标字符串
 * @param {*} par 参数名
 * @param {*} par_value 参数值
 */
function changeURLArg(url, arg, arg_val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
}

/**
 * 根据值获取颜色
 * @param value
 */
function getColorByValue(value) {

    var fontColor = value > 10 ? 'rgb(162,67,67)' : (value > 5 && value < 10) ? 'rgb(240,196,132)' : 'rgb(139, 201, 215)';
    return fontColor;

}

/**
 * 根据选中的颜色进行高亮
 * @param color
 */
function getColorBySel(color) {

    if (color == 'rgb(162, 67, 67)') {
        return 'rgb(214,0,6)';

    } else if (color == 'rgb(240, 196, 132)') {
        return 'rgb(240,152,7)';

    } else if (color == 'rgb(139, 201, 215)') {
        return '#00f9fb';
    }
}

/**
 * 根据数据最大值 获取Ecchart左边距
 * @param arr
 */
function getMaxLen(arr) {
    if (arr) {
        return maxLen = Math.max.apply(null, arr) * 10 + 50;
    } else {
        return 50;
    }
}

/** 消息状态码 */
web_status = {
    SUCCESS: 1,
    FAIL: 0,
    WARNING: 2
};
