
$(function () {

    // 地图数据加载
    echarts.registerMap('shenzhen', geoJson, {});
    getSchoolCoordinate();

    // 学校信息加载
    getSchoolCheck();

    // 总人数查询
    getAllScreenPeopleNum();

    // 学校筛查人数排行
    getScreeningPlanRank();

    // 视力异常人数占比
    getScreeningVision();

    // 实时筛查人员
    getScreenTeam();

    // 筛查总进程情况
    getScreenGeneral();

    // 实时筛查人员
    function getScreenTeam() {
        $.ajax({
            url: $url + '/api/home/getScreenTeam',
            type: 'get',
            cache: false,
            success: function (res) {
                // console.log('getScreenTeam', res)
                if (res.status === 1) {
                    let result = '';
                    for (var i in res.result) {
                        result += '<p class="item">' + res.result[i] + '</p>'
                    }
                    $('#peopleList').html(result)
                }
            }
        })
    }

    // 筛查总进程情况
    function getScreenGeneral() {
        $.ajax({
            url: $url + '/api/home/getScreenGeneral',
            type: 'get',
            cache: false,
            success: function (res) {
                // console.log('getScreenTeam', res)
                if (res.status === 1) {
                    let result = '';
                    for (var i in res.result) {
                        result += '<p class="item">' + res.result[i] + '</p>'
                    }
                    $('#progressList').html(result)
                }
            }
        })
    }

    // 地图数据加载
    function getSchoolCoordinate() {
        $.ajax({
            url: $url + '/api/home/getSchoolCoordinate',
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
                                        color: "#00a0c9"
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
                        series: [
                            {
                                name: '已完成学校',
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                data: convertData(res.result.completeJson),
                                symbolSize: function (val) {
                                    return val[2] / 2;
                                },
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
                                        color: 'purple'
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
                                        color: 'blue'
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
                                        show: true
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

        document.getElementById("datetime").innerHTML = year + "-" + month + "-" + day + "\t" + hours + ":" + minutes + ":" + seconds + "\t";
    };

    // 定时更新时间
    setInterval(time, 1000);
    // 定时更新总人数
    setInterval(getAllScreenPeopleNum, 60000)

    function getAllScreenPeopleNum() {
        $.ajax({
            url: $url + '/api/home/getAllScreenPeopleNum',
            type: "get",
            cache: false,
            success: function (res) {
                // console.log('getAllScreenPeopleNum', res)
                if (res.status === 1) {
                    $('#peopleNum').html(res.result)
                } else {
                    // $('#peopleNum').html(0)
                }
            }
        })
    }

    // 学校
    function getSchoolCheck() {
        $.ajax({
            url: $url + '/api/home/getSchoolCheck',
            type: "get",
            cache: false,
            success: function (res) {
                // console.log('getSchoolCheck', res)
                if (res.status === 1) {
                    var arr = res.result;
                    for (let i in arr) {
                        $('.select_school').append('<option value="' + arr[i].id + '">' + arr[i].name + '</option>');
                    }

                    // 筛查进行情况
                    getScreenPlanData(arr[0].id)
                    // 复查情况
                    getSpotCheckData(arr[0].id)
                }

            }
        })

        $('.select_school').on('change', function (e) {
            var id = $('.select_school').val();

            // 筛查进行情况
            getScreenPlanData(id)
            // 复查情况
            getSpotCheckData(id)
        })
    }


});