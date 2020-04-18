/**
 * 实时状况主页
 * @type {string}
 */
$url = getContextPath();
$(function () {
    // 人数数字翻转动画
    setInterval(getAllScreenPeopleNum, 5000);

    $('.select_school').on('change', function (e) {
        var id = $('.select_school').val();

        // 筛查进行情况
        getScreenPlanData(id)
        // 复查情况
        getSpotCheckData(id)
    })

});

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
    console.log(localhostPaht);
    return (localhostPaht + '/');
}

/**
 * 首页筛查总人数
 */
function getAllScreenPeopleNum() {
    var peopleNum = 0;
    $.ajax({
        url: $url + 'api/home/getAllScreenPeopleNum',
        type: "get",
        cache: false,
        success: function (res) {
            // console.log(res)
            if (res.status === 1) {
                peopleNum = res.result;
            }
            $("#dataNums").rollNumDaq({
                deVal: peopleNum
            });
        }
    })
}

/**
 * 学校列表
 */
function getSchoolCheck() {
    $.ajax({
        url: 'school/getSchoolByUser',
        type: "get",
        cache: false,
        data: {'isRealTime': true},
        success: function (res) {
            // console.log('getSchoolCheck', res)
            if (res.status === 1) {
                var arr = res.result;
                for (let i in arr) {
                    $('.select_school').append('<option value="' + arr[i].id + '">' + arr[i].schoolName + '</option>');
                }
                $('.searchable-select-holder').html(arr[0].schoolName);
                // 初始化模糊下拉查询
                initSelect();
                // 筛查进行情况
                getScreenPlanData(arr[0].id)
                // 复查情况
                getSpotCheckData(arr[0].id)
            }

        }
    })
}

/**
 * 筛查进行情况
 * @param id
 */
function getScreenPlanData(id) {
    // console.log('getScreenPlanData', id)
    $.ajax({
        url: $url + 'api/home/getScreenPlanData?schoolId=' + id,
        type: "get",
        cache: false,
        success: function (res) {
            // console.log('getScreenPlanData', res)
            var dom = document.getElementById("screening");
            var ScreenPlanDataChart = echarts.init(dom);
            var app = {};
            option = null;
            app.title = '嵌套环形图';
            if (res.status === 1) {
                option = {
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        textStyle: {
                            fontSize: '12',
                            fontWeight: 'bold'
                        },
                        formatter: "{b}: {c} ({d}%)",
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['已筛查人数', '未筛查人数'],
                        textStyle: {
                            color: "#ccc",
                            fontSize: 10,
                        },
                    },
                    color: ['#bcf335', '#3bddc0', '#07d2f8'],
                    series: [
                        {
                            name: '筛查进行情况',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center',
                                },
                                emphasis: {
                                    show: true,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '10',
                                        fontWeight: 'bold'
                                    },
                                    formatter: "{d}%"
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: res.result.seriesData[0], name: "已筛查人数"},
                                {value: res.result.seriesData[1], name: "未筛查人数"}
                            ]
                        }
                    ]
                };
                if (option && typeof option === "object") {
                    ScreenPlanDataChart.setOption(option);
                }
            } else {
                if (ScreenPlanDataChart) {
                    ScreenPlanDataChart.dispose();
                    ScreenPlanDataChart = null;
                    dom = null;
                }
                $('#screening').html(res.msg)
            }
        }
    })
}


/**
 * 复查情况
 * @param id
 */
function getSpotCheckData(id) {
    // console.log('getSpotCheckData', id)
    $.ajax({
        url: $url + 'api/home/getSpotCheckData?schoolId=' + id,
        type: "get",
        cache: false,
        success: function (res) {
            // console.log('getSpotCheckData', res)
            var dom = document.getElementById("review");
            var ScreenPlanDataChart = echarts.init(dom);
            var app = {};
            option = null;
            app.title = '嵌套环形图';
            if (res.status === 1) {
                option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['达标人数', '未达标人数'],
                        textStyle: {
                            color: "#ccc",
                            fontSize: 10,
                        },
                    },
                    color: ['#bcf335', '#3bddc0', '#07d2f8'],
                    series: [
                        {
                            name: '复查进行情况',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '10',
                                        fontWeight: 'bold'
                                    },
                                    formatter: "{d}%"
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: res.result.seriesData[0], name: '达标人数'},
                                {value: res.result.seriesData[1], name: '未达标人数'},
                            ]
                        }
                    ]
                };
                ;
                if (option && typeof option === "object") {
                    ScreenPlanDataChart.setOption(option);
                }
            } else {
                if (ScreenPlanDataChart) {
                    ScreenPlanDataChart.dispose();
                    ScreenPlanDataChart = null;
                    dom = null;
                }
                $('#review').html(res.msg)
            }
        }
    })
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
                // 筛查进行情况
                getScreenPlanData(schoolId)
                // 复查情况
                getSpotCheckData(schoolId)

                // 调整搜索框及选中
                $('.searchable-select-input').css("width", "240");
                $('.searchable-select-holder').css("width", "250");
                $('.searchable-select-holder').css("background-color", "#7b80ce2b");
                $('.searchable-select').css("color", "#fff");
                $('.searchable-select-dropdown').css("background-color", "#182040bf");
                $('.searchable-has-privious, .searchable-has-next').css("background-color", "#ffffff40");

                // $('.searchable-select-caret').css("border-color", "#e6e1e1");
                // $('.searchable-select-item.selected').css("background", "");
                // $('.searchable-select-item.selected').css("background", "#3d73c6");
            }
        }
    );


}

// 实时筛查人员
function getScreenTeamAndGeneral() {
    $.ajax({
        url: $url + 'api/home/getScreenTeam',
        type: 'get',
        cache: false,
        success: function (res) {
            console.log('getScreenTeamAndGeneral', res)
            var lengh = res.result ? res.result.length : 0;
            let result1 = '<lable style="float: left;color: #6be0c0">共：' + lengh + '个筛查团队</lable>';
            result1 += '<marquee id="peopleList" direction="up" scrolldelay="250" onMouseOver="this.stop()" onMouseOut="this.start()">'
            let result2 = '<lable style="float: left;color: #6be0c0">共：' + lengh + '所学校</lable>';
            result2 += '<marquee id="progressList" direction="up" scrolldelay="250" onMouseOver="this.stop()" onMouseOut="this.start()" >'
            for (var i in res.result) {
                let str = res.result[i].split(":")
                result1 += '<p class="item">' + '<span>' + str[0] + ':' + '</span>' + '<span style="display:inline-block;margin-left:10px;color:rgb(41, 245, 230);">' + str[1] + '</span>' + '</p>'
                result2 += '<p class="item">' + '<span>' + str[0] + ':' + '</span>' + '<span style="display:inline-block;margin-left:10px;color:rgb(41, 245, 230);">' + str[2] + '</span>' + '</p>'
            }
            result1 += '</marquee>';
            result2 += '</marquee>'
            $('#people').html(result1)
            $('#progress').html(result2)
        }
    })
}

// // 筛查总进程情况
// function getScreenGeneral() {
//     $.ajax({
//         url: $url + '/api/home/getScreenTeam',
//         type: 'get',
//         cache: false,
//         success: function (res) {
//             console.log('getScreenGeneral', res)
//             if (res.status === 1) {
//                 let result ='<marquee id="peopleList" direction="up" scrolldelay="250" onMouseOver="this.stop()" onMouseOut="this.start()">'
//                 for (var i in res.result) {
//                     let str=res.result[i].split(":")
//                     result +='<p class="item">' + '<span>' + str[0] + ':' + '</span>' + '<span style="display:inline-block;margin-left:10px;color:rgb(41, 245, 230);">' + str[2] + '</span>' + '</p>'
//                 }
//                 result +='</marquee>'
//                 $('#progress').html(result)
//             }
//         }
//     })
// }

// 地图数据加载
function getSchoolCoordinate() {
    $.ajax({
        url: $url + 'api/home/getSchoolCoordinate',
        type: 'get',
        cache: false,
        success: function (res) {
            console.log('getSchoolCoordinate', res)
            if (res.status === 1) {
                var myChart = echarts.init(document.getElementById('map'));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            // console.log(params)
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
                                    color: "#00a0c9"
                                }
                            }
                        },
                        itemStyle: {
                            show: false,
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
                    series: [
                        {
                            name: '已完成学校',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertData(res.result.completeJson),
                            symbolSize: function (val) {
                                return val[2] / 2;
                            },
                            showAllSymbol: true,
                            // symbolSize: 25,
                            symbol: "image://./../images/realtime/mapIcon3.png",
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'orange'
                                }
                            }
                        },
                        {
                            name: '拟完成学校',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertData(res.result.ToCompletedJson),
                            symbolSize: function (val) {
                                return val[2] / 2;
                            },
                            showAllSymbol: true,
                            // symbolSize: 25,
                            symbol: "image://./../images/realtime/mapIcon.png",
                            // symbolRotate: 35,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'white'
                                }
                            }
                        },
                        {
                            name: '进行中学校',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertData(res.result.progressJson),
                            symbolSize: function (val) {
                                return val[2] / 2;
                            },
                            showAllSymbol: true,
                            // symbolSize: 25,
                            symbol: "image://./../images/realtime/mapIcon2.png",
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ccc'
                                }
                            }
                        },
                        // 带花纹特效
                        {
                            name: '质控误差大于等于10%',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            showEffectOn: 'render',
                            data: convertData(res.result.redJson),
                            symbolSize: function (val) {
                                return val[2] / 1.5;
                            },
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true // 悬浮字体颜色
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'red'
                                }
                            }
                        },
                        {
                            name: '质控误差大于等于8%',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            showEffectOn: 'render',
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: convertData(res.result.yellowJson),
                            symbolSize: function (val) {
                                return val[2] / 1.5;
                            },
                            itemStyle: {
                                normal: {
                                    color: 'yellow'
                                }
                            }
                        },
                        {
                            name: '质控误差大于等于5%',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            showEffectOn: 'render',
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: convertData(res.result.greenJson),
                            symbolSize: function (val) {
                                return val[2] / 1.5;
                            },
                            itemStyle: {
                                normal: {
                                    color: 'green'
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option);
                //点击事件,根据点击某个省份计算出这个省份的数据
                myChart.on('click', function (params) {
                    console.log(params);
                    window.location.href = '/admin/realtime/wholeCityIndex'
                });
            }
        }
    })
}


var convertData = function (result) {
    var res = [];
    var data, geoCoordMap;
    // console.log(Object.keys(result)[0].length, Object.keys(result)[1].length)
    if (Object.keys(result)[1].length > Object.keys(result)[0].length) {
        data = result[Object.keys(result)[0]];
        geoCoordMap = result[Object.keys(result)[1]];
    } else {
        data = result[Object.keys(result)[1]];
        geoCoordMap = result[Object.keys(result)[0]];
    }

    // console.log(data, geoCoordMap)
    if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    leader: data[i].groupLeader + ':' + data[i].phone,
                    value: geoCoord.concat(parseInt(data[i].value))
                });
            }
        }
    }
    // console.log(res)
    return res;
};

//实时时间
function time() {
    var vWeek, vWeek_s, vDay;
    var date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    if (hours.toString().length < 2) {
        hours = '0' + hours
    }
    if (minutes.toString().length < 2) {
        minutes = '0' + minutes
    }
    if (seconds.toString().length < 2) {
        seconds = '0' + seconds
    }
    var reamks = '截至今日，未结束筛查人数&nbsp;&nbsp;&nbsp;';
    document.getElementById("datetime").innerHTML = reamks + year + "-" + month + "-" + day + "\t" + hours + ":" + minutes + ":" + seconds + "\t";
};

// 定时更新时间
setInterval(time, 1000);

/**
 * 动态获取ehcart滚动初始化条数
 * @param length
 * @returns {number}
 */
var dataZoom_start = function (length) {
    var dataZoom_start = length > 10 ? 100 - (9 / length) * 100 : 0;
    return dataZoom_start;
}





