function getScreeningVision() {
    $.ajax({
        url: $url+'api/home/getScreeningVision',
        type: 'get',
        cache: true,
        success: function (res) {
            // console.log('getScreeningVision', res)

            if (res.status === 1) {
                var dom = document.getElementById("vision");
                var myChart = echarts.init(dom);
				window.addEventListener("resize",function(){
					myChart.resize();

				});
                var app = {};
                option = null;
                app.title = '坐标轴刻度与标签对齐';
				schoolslen = res.result.xAxisData.length;

				var start = dataZoom_start(schoolslen);

                option = {
					title : {
					    text: '',
					    subtext: ''
					},
					tooltip : {
					    trigger: 'axis'
					},
					legend: {
						type : 'scroll',
					    data:['高危人数','近视人数'],
						x:'0',
						y:'10',
						top:'0',
						icon:'',//图例的形状，选择类型有："circle"（圆形）、"rectangle"（长方形）、"triangle"（三角形）、"diamond"（菱形）、"emptyCircle"（空心圆）、"emptyRectangle"（空心长方形）、"emptyTriangle"（空心三角形）、"emptyDiamon"（空心菱形），还可以放自定义图片，格式为"image://path",path为图片路径
						selectedMode: false,　　　　//选中哪个图例 false后图例不可点击
						textStyle: {
						    color: "#fff",
						    fontSize:10,
						},
					},
					dataZoom: [//给x轴设置滚动条
						{
							start: start,//默认为0
							end: 100,
							type: 'slider',
							show: true,
							xAxisIndex: [0],
							handleSize: 0,//滑动条的 左右2个滑动条的大小
							height: 8,//组件高度
							left: '10%', //左边的距离
							right: '1%',//右边的距离
							bottom: 10,//右边的距离
							fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
								//给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
								//给第一个设置0，第四个设置1，就是垂直渐变
								offset: 0,
								color: '#064c97'
							}, {
								offset: 1,
								color: '#064c97'
							}]),
							backgroundColor: 'rgb(12, 32, 64)',//两边未选中的滑动条区域的颜色
							showDataShadow: false,//是否显示数据阴影 默认auto
							showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
							handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
							filterMode: 'filter'
						},
						//下面这个属性是里面拖到
						{
							type: 'inside',
							show: true,
							xAxisIndex: [0],
							start: 0,//默认为1
							end: 100,
						},
					],
					toolbox: {
					    show : false,
					    feature : {
					        dataView : {show: true, readOnly: false},
					        magicType : {show: true, type: ['line', 'bar']},
					        restore : {show: true},
					        saveAsImage : {show: true}
					    }
					},
					calculable : false,
					xAxis : [
					    {
					        type : 'category',
					        data:res.result.xAxisData,
							axisLabel: {
							    color: 'rgb(129, 166, 184)'
							},
							axisLine: {
									lineStyle: {
									  // 设置x轴颜色
									  color: 'rgb(35, 85, 142)'
									}
							}
					    }
					],
					yAxis : [
					    {
							axisLabel: {
							    color: 'rgb(129, 166, 184)'
							},
							axisLine: {
									lineStyle: {
									  // 设置x轴颜色
									  color: 'rgb(35, 85, 142)'
									}
							},
							splitLine: {    // gird 区域中的分割线
							  show: true,   // 是否显示
							  lineStyle: {
								color: 'rgba(18, 164, 237, 0.16)',
								width: 1,
								type: 'solid'
							  }
							},
							type: 'value',
							splitArea: {
								show: false,
							}
					    }
						
					],
					grid: {  //设置图标距离
					  top: "40",
					  left: "40",
					  right: "20",
					  bottom: "40"
					},
					toolbox: {
					    show : false,//关闭右侧下载等按钮
					    feature : {
					        mark : {show: true},
					        dataView : {show: true, readOnly: false},
					        magicType : {
					            show: false,
					            type: ['pie', 'funnel']
					        },
					        restore : {show: true},
					        saveAsImage : {show: true}
					    }
					},
					series : [
					    {
					        name:'高危人数',
					        type:'bar',
					        data:res.result.seriesHighRiskData,
							barWidth:'auto',
							itemStyle: {
			                    normal: {
			                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
			                            offset: 0,
			                            color: '#ffbc1d'
			                        }, {
			                            offset: 1,
			                            color: '#fe5f1e'
			                        }]),
			                    }
			                }
					    },
					    {
					        name:'近视人数',
					        type:'bar',
					        data:res.result.seriesMyopiaData,
							barWidth:'auto',
							itemStyle: {
			                    normal: {
			                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
			                            offset: 0,
			                            color: '#24d3e8'
			                        }, {
			                            offset: 1,
			                            color: '#048df0'
			                        }]),
			                    }
			                }
					    }
					]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            } else {
                $('#vision').html(res.msg)
            }
        }
    })
}

