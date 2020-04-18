$table = $("#dataGrid");
$(function () {
    initDataGrid();

});
/**
 *  全局参数
 */
var id = $("#id").val()
var planName = $("#planName").val();
var planCode = $("#planCode").val();
var studentNum = $("#studentNum").val();

function groupMembers() {
    var show = $("#show").html();
    console.log('groupMembers', show);

    var len = $("#showTable").find("tr").length;
    if (len == 1) {
        layer.msg("无组员信息！", {icon: 5, timeout: 1000})
        return;
    }
    layer.open({
        title: '组员', content: show
    });
}

function initDataGrid() {
    $table.bootstrapTable({
        height: tableModel.getHeight(),
        idField: "id",
        columns: [{
            title: "序号",
            field: 'no',
            align: "center",
            width: 50,
            formatter: function (value, row, index) {
                var options = $table.bootstrapTable('getOptions');
                return options.pageSize * (options.pageNumber - 1) + index + 1;
            }
        }, {
            checkbox: true
        }, {title: "姓名", align: "center", field: 'studentName'}, {
            title: "所在学校",
            align: "center",
            field: "schoolName"
        }, {title: "所在年级", align: "center", field: "gradeName"}, {
            title: "所在班级",
            align: "center",
            field: "className"
        }, {title: "性别", align: "center", field: "sex", formatter: tableModel.sexFormat}, {
            title: "生日",
            align: "center",
            field: "birthday",
            formatter: BirthDayFormatter
        }, {title: "年龄", align: "center", field: "age"}

        ],
        url: '/admin/screeningPlan/list',
        queryParams: function (params) {
            var param = {
                page: params.offset,
                rows: params.limit,
                screeningStatus: 0,
                studentName: $("#studentName").val(),
                schoolName: $("#schoolName").val(),
                className: $("#className").val()

            };
            console.log(param);
            return param;
        },
        responseHandler: function (res) {
            return {
                rows: res.result.pageInfo.list, total: res.result.pageInfo.total
            }
        },
        sortOrder: 'desc',
        pagination: true,
        sidePagination: 'server',
        pageSize: 15,
        pageNumber: 1,
        pageList: [15, 25, 50, 100],
        toolbar: "#toolbar",
        showRefresh: false,
        showToggle: false,
        queryParamsType: 'limit'
    });
    $table.bootstrapTable('hideColumn', 'id');
}

/**
 *  接受任务
 */
function downPlan() {
    $.ajax({
        type: 'post',
        url: '/admin/screeningPlan/judgePlan',
        dataType: 'json',
        data: {'planCode': planCode, 'id': id},
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function (jsonResult) {
            if (jsonResult.resultCode == 0) {
                layer.msg(jsonResult.message, {icon: 5, timeout: 2000})
            } else {
                layer.open({
                    type: 2,
                    title: '接收任务',
                    shadeClose: false,
                    shade: [0.01],
                    maxmin: false,
                    area: ['400px', "250px"],
                    content: '/admin/screeningPlan/savePlan',
                    cancel: function () {
                        isload = $('#isload').val();
                        if (isload == 'true') {
                            layer.msg("正在接受任务,请稍后...", {icon: 4})
                            return false;
                        } else {
                            return true;
                        }
                    }
                });
            }
        }
    });
}

/**
 *  结束任务
 */
function finishPlan() {

    if (isEmpty(planCode) ) {
        layer.msg("&nbsp;&nbsp;暂无数据", {
            icon: 5
        });
        return;
    }

    $.modal.confirm("你确认要结束任务吗?结束后将不可更改。", function () {
        $.ajax({
            type: 'post',
            url: '/admin/screeningPlan/finishPlan',
            dataType: 'json',
            data: {'planCode': planCode, 'id': id},
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            success: function (jsonResult) {
                if (jsonResult.resultCode == 0) {
                    layer.msg(jsonResult.message, {icon: 5, timeout: 2000})
                } else if (jsonResult.resultCode == 2) {
                    if(confirm("你确认要强制结束吗?结束后将不可更改!")){
                        $.ajax({
                            type: "POST",
                            url: '/admin/screeningPlan/finishPlanForce',
                            data: {'planCode': planCode, 'id': id},
                            async: false,//必须存在
                            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                            success: function (data) {
                                if (data.resultCode == 1) {
                                    layer.msg("成功结束", {icon: 1, timeout: 2000})
                                    setTimeout(function () {
                                        operaModel.reloadPage(window);
                                    }, 1000)

                                }
                            }
                        });
                    }
                    /* $.modal.forceConfirm("你确认要强制结束吗?结束后将不可更改。", function () {
                         $.ajax({
                             type: "POST",
                             url: '/admin/screeningPlan/finishPlanForce',
                             data: {'planCode': planCode, 'id': id},
                             async: false,//必须存在
                             contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                             success: function (data) {
                                 if (data.resultCode == 1) {
                                     layer.msg("成功结束", {icon: 1, timeout: 2000})
                                     setTimeout(function () {
                                         operaModel.reloadPage(window);
                                     }, 1000)

                                 }
                             }
                         });
                     })*/

                } else if (jsonResult.resultCode == 1) {
                    layer.msg("成功结束", {icon: 1, timeout: 2000})
                    setTimeout(function () {
                        operaModel.reloadPage(window);
                    }, 1000)
                }
            }
        })
    })
}

/**
 *  导出数据
 */
function exportExcel() {
    var queryParam = getParams();

    if (isEmpty(planCode) || studentNum == 0) {
        layer.msg("&nbsp;&nbsp;暂无数据", {
            icon: 5
        });
        return;
    }
    var btn = $('#export');
    openShade(btn, "正在导出Excel,请稍后...");
    window.location.href = "/admin/screeningPlan/exportExcel?" + queryParam;
    hideShade(btn);
}

/**
 *  打印二维码
 */

function printQrcode() {



    if (isEmpty(planCode) || studentNum == 0) {
        layer.msg("&nbsp;&nbsp;暂无数据", {
            icon: 5
        });
        $("#qrcode").attr('onclick','printQrcode()');
        return;
    }

    var ids = '';
    var values = $table.bootstrapTable('getSelections');
    for (var i = 0; i < values.length; i++) {
        ids += values[i].id + ',';
    }

    var btn = $("#qrcode");

    if (ids.length > 0) {
        openShade(btn, "正在处理中，请稍后...");
        var queryParam = "ids=" + ids + "&planName=" + planName + "&planCode=" + planCode + "&screeningStatus=" + 0;
        window.location.href = "/admin/screeningPlan/printnQrcode?" + queryParam;
        hideShade(btn);
    } else {
        $.ajax({
            url: '/admin/screeningPlan/printnQrcode',
            type: 'post',
            dataType: 'json',
            data: {'ids': ids, 'planName': planName, 'planCode': planCode, 'screeningStatus': 0},
            success: function (data) {
                hideShade(btn);
                if (data.resultCode == "1") {
                    $.message({
                        message: '下载任务生成成功', type: 'success'
                    });
                } else {
                    $.message({
                        message: data.errormsg, type: 'error', time: '3000'
                    });
                }
            },
            error: function (data) {
                hideShade(btn);
                $.message({
                    message: '请求异常', type: 'error', time: '3000'
                });
            }
        });
    }

}

/**
 * 开启遮罩
 * @param obj
 */
function openShade(obj, msg) {
    $.modal.loading(msg);
    obj.data("loading", true);
    obj.prop('disabled', true).html(obj.html() + "中...").addClass('disabled');
}

/**
 * 关闭遮罩
 * @param obj
 */
function hideShade(obj) {
    var icount = window.setInterval(function () {
        var cookie = getCookie("state");
        if (cookie == "success") {
            obj.removeClass('disabled').prop('disabled', false).html(obj.html().replace("中...", '')).parent().find('span').remove();
            $.modal.closeLoading();
            delCookie("state");
            window.clearInterval(icount);
        }
    }, 300);
    //超过1分钟自动关闭
    setTimeout(function () {
        $.modal.closeLoading();
    }, 120000)
}

/**
 * 获取cookie
 * @param cookieName
 * @returns {string}
 */
function getCookie(cookieName) {
    //获取所有的cookie "user=test; name=admin"
    var totalCookie = document.cookie;
    //获取参数所在的位置
    var cookieStartAt = totalCookie.indexOf(cookieName + "=");
    //判断参数是否存在 不存在直接返回
    if (cookieStartAt == -1) {
        return;
    }
    //获取参数值的开始位置
    var valueStartAt = totalCookie.indexOf("=", cookieStartAt) + 1;
    //以;来获取参数值的结束位置
    var valueEndAt = totalCookie.indexOf(";", cookieStartAt);
    //如果没有;则是最后一位
    if (valueEndAt == -1) {
        valueEndAt = totalCookie.length;
    }
    //截取参数值的字符串
    var cookieValue = unescape(totalCookie.substring(valueStartAt, valueEndAt));
    return cookieValue;
}

/**
 * 删除cookie
 * @param name
 */
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
    }
}

/**
 * 查询
 */
$('#search').click(function () {
    $table.bootstrapTable('refresh');
});

/**
 * 获取/导出下载参数
 * @returns {string}
 */
function getParams() {
    var ids = '';
    var values = $table.bootstrapTable('getSelections');
    for (var i = 0; i < values.length; i++) {
        ids += values[i].id + ',';
    }
    var queryParam = "ids=" + ids + "&planName=" + planName + "&planCode=" + planCode + "&screeningStatus=" + 0;
    console.log(queryParam)
    return queryParam;
}

/**
 * 格式化生日
 * @param value
 * @param row
 * @param index
 * @returns {*}
 * @constructor
 */
function BirthDayFormatter(value, row, index) {
    if (value == null || value == '') {
        return "-";
    }
    return moment(value).format('YYYY-MM-DD');
}