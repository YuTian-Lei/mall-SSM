$table = $("#dataGrid");
$(function () {
  initDataGrid();
});

/**
 * 上传
 */
function uploadFile() {
  $('#fileFrom').submit();
}

/**
 * 导入
 */
$('#excelImport').click(function () {
  $("#uploadFile").val("");
  $('#uploadFile').click();
});

$("#uploadFile").change(function () {
  uploadFile();
})

$("#fileFrom").validate({
  debug: true, //是否在获取焦点时验证
  //onfocusout : false,
  //当鼠标掉级时验证
  //onclick : false,
  //给未通过验证的元素加效果,闪烁等
  //highlight : false,
  onkeyup: function (element, event) {
    return;
  }, showErrors: function (errorMap, errorArr) {
    if (parseInt(errorArr.length) > 0) {
      $(errorArr[0].element).focus();
      layer.msg(errorArr[0].message, {icon: 2});
    }
  }, submitHandler: function (form) {
    $form = $(form)
    $form.ajaxSubmit({
      url: $form.attr('action'), dataType: 'json', beforeSubmit: function (arr, $form, options) {
        $btn.data("loading", true);
        var text = $btn.text();
        $btn.text(text + '中...').prop('disabled', true).addClass('disabled');
      }, success: function (data, statusText, xhr, $form) {
        var text = $btn.text();
        $btn.removeClass('disabled').prop('disabled', false).text(text.replace('中...', '')).parent().find('span').remove();
        if (data.state === 'success') {
          // layer.msg(data.msg, {icon: 1}, function (e) {
          //     window.setTimeout(800);
          //     parent.layer.closeAll();
          // });
          $.modal.msgReload(data.msg, modal_status.SUCCESS);

        } else if (data.state === 'error') {
          $.modal.msgError(data.msg, modal_status.SUCCESS);
        }
      }, error: function (xhr, e, statusText) {
        console.log(statusText);
        operaModel.reloadPage(window);//刷新当前页
      }, complete: function () {
        $btn.data("loading", false);
      }
    });
  }
})

/**
 * 查询
 */
$('#search').click(function () {
  $table.bootstrapTable('refresh');
});
function initDataGrid() {
  $('#dataGrid').bootstrapTable({
    height: $(window).height() - $('.content-header').outerHeight(true) - 130,
    idField: "id",
    columns: [
      {title: "编号", field: "id"},
      {title: "姓名", field: "name"},
      {title: "区域", field: "regionName", /*formatter: getRole*/},
      {title: "单位", field: "unitName"},
      {title: "职称", field: "title"},
      {title: "职位", field: "position", formatter:positionFormat},
      {title: "学历", field: "education"},
      {title: "培训日期", field: "trainDate", formatter:dateFormat,sortable: true},
      {title: "培训内容", field: "trainContent", formatter:trainContentFormat},
      {title: "讲课老师姓名", field: "teacherName"},
      {title: "导入日期", field: "createDate", formatter:dateFormat, sortable: true },
      {
      title: "操作",
      field: "operate",
      align: 'center',
      events: operateEvents,
      formatter: operateFormatter
    }],
    url: '/admin/trainManagement/list',
    responseHandler: function (result) {
      initEcharts(result);
        return result;
    },
    /*responseHandler: (result) => {
        initEcharts(result);
        return result;
    },*/

    queryParams : function(params) {
      var param = {
        page : (params.offset/params.limit) +1,
        pageSize : params.limit,
        name : $("#name").val(),
        position : $("#position").val(),
        regionId : $("#regionId").val(),
        unitName : $("#unitName").val(),
        trainContent : $("#trainContent").val(),
      };
      return param;
    },

    /*queryParams: function (params) {
      return params;
    },*/

    sortName: 'createdAt',
    sortOrder: 'asc',
    pagination: true,
    sidePagination: 'server',
    pageNumber : 1,
    pageSize: 15,
    pageList: [20, 40, 50, 100],
    showHeader : true,
    queryParamsType : 'limit',
    toolbar: "#toolbar",
    showRefresh: false,
    showToggle: false

    // 添加下列参数即可进行固定列,列数量过少不可使用
    // fixedColumns: true,
    // fixedNumber: 2
  });
}

function getRole(value, row, index) {
  if (row.system == 1) {
    return "超级管理（不受角色限制）"
  } else {
    return $.map(value, function (v) {
      return v.roleName;
    }).join(",");
  }

}

function operateFormatter(value, row, index) {
  return [
    '<a class="detail btn btn-warning btn-xs" href="javascript:void(0);" >',
    '<i class="fa fa-search"></i>详情',
    '</a>  '
  ].join('');
}

window.operateEvents = {
  'click .detail': function (e, value, row, index) {
    window.location.href= '/admin/trainManagement/detail?id=' + row.id;
  }
};

function dateFormat(value, row, index) {
  if (value != null && value != "") {
    return moment(value).format('YYYY-MM-DD');
  } else {
    return null;
  }
}

function positionFormat(value, row, index) {
  // 1.讲师 2.筛查员 3.校医 4.家长代表 5.社康医生 6.联盟医院眼科医生 7.其他
  if (value == 1) {
    return '讲师';
  } else if (value == 2) {
    return '筛查员';
  } else if (value == 3) {
    return '校医';
  } else if (value == 4) {
    return '家长代表';
  } else if (value == 5) {
    return '社康医生';
  } else if (value == 6) {
    return '联盟医院眼科医生';
  } else {
    return '其他';
  }
}

function trainContentFormat(value, row, index) {
  // 1.理论培训 2.实操培训 3.临床带教 4.其他
  if (value == 1) {
    return '理论培训';
  } else if (value == 2) {
    return '实操培训';
  } else if (value == 3) {
    return '临床带教';
  } else if (value == 4) {
    return '现场带教';
  } else {
    return '其他';
  }
}

/**
 * initEcharts 初始化Echarts
 * @param result 数据源
 * @param isGrade 报表维度 年级/年龄
 */
function initEcharts(result) {
  console.log(result)
  try {
    var echart = document.getElementById('$tubiao');
    if (!result.bool) {
      initSchoolEcharts(result);
      echart.style.display = '';
      $('#no_data').css('display', 'none')

    } else {
      echart.style.display = 'none';
      $('#no_data').css('display', 'block')
    }
  } catch (e) {
    console.error(e)
    echart.style.display = 'none';
    $.modal.msgError("加载失败，请联系管理员")
  }
}

/**
 * 生成图形报表
 * @param data 数据源
 * @param isGrade 报表维度 年级/年龄

 */
function initSchoolEcharts(data) {
  var xAxis = data.regionNameList;
  var boyList = data.regionCountList;
  console.log(data)
  /*var girlList = data.girlList;
  var rate = data.gridResult;*/

  // 图表类型
  /*var type = isGrade ? 'bar' : 'line';*/
  var type = 'bar';
  var xAxisName = '区/';
  /* 图形配置 */
  var option = {
    title: {
      // text: regionName + statType + '情况',
      text: '各区情况',
      top: 0,
      x: 'center'
    },
    grid: {
      bottom: 30
    },
    tooltip: {
      trigger: 'axis',
      /*formatter: function (params) {
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
      }*/
    },
    /*legend: {
      data: ['人数'],
      bottom: 10,
      left: '70%'
    },*/
    toolbox: {
      right: 33,
      show: true,
      feature: {
        dataView: {show: true, readOnly: false},
        magicType: {show: true, type: ['line', 'bar']},
        restore: {show: true},
        saveAsImage: {
          show: true,
        }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: xAxis,
        name: xAxisName
      }
    ],
    yAxis: [
      {
        type: 'value',
        minInterval: 1,
        name: '人数/',
      }
    ],
    series: [
      {
        name: '人数',
        smooth: true,
        type: type,
        data: boyList,
        color: ['#598ffc']
      },
      /*{
        name: '女',
        smooth: true,
        type: type,
        data: girlList,
        color: ['#f8c85d']
      }*/
    ]
  };
  /* 初始化 */
  echart = echarts.init(document.getElementById("$tubiao"));
  echart.setOption(option, window.onresize = echart.resize);
}