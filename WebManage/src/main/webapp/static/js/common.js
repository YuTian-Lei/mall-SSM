var tableModel = (function () {
    return {
        getHeight: function () {
            return $(window).height() - $('.content-header').outerHeight(true) - 130;
        },
        getState: function (value, item, index) {
            if (item.enable == 1) {
                return '<span class="label label-success">启用</span>';
            } else {
                return '<span class="label label-warning">关闭</span>';
            }
        },
        dateFormat: function (value, row, index) {
            return value ? moment(value).format('YYYY-MM-DD HH:mm') : row.createDate ? moment(row.createDate).format('YYYY-MM-DD HH:mm') : '-';
        },
        birthdayFormat: function (value, row, index) {
            return moment(value).format('YYYY-MM-DD');
        },
        sexFormat: function (value, row, index) {
            return value == 0 ? '女' : value == 1 ? '男' : '未知';
        },
        glassFormat: function (value, row, index) {
            if (row.glasses == '0') {
                return "不戴镜";
            } else if (row.glasses == '1') {
                return "戴框架镜";
            } else if (row.glasses == '2') {
                return "塑形镜";
            } else if (row.glasses == '3') {
                return "矫正";
            } else if (row.glasses == '4') {
                return "隐形眼镜";
            }

        }
    }
})();

/**
 * 表格自适应缩放
 */
$(window).resize(function () {
    $('#dataGrid').bootstrapTable('resetView');
});
/** 关闭选项卡 */
var closeItem = function () {
    var topWindow = $(window.parent.document);
    var panelUrl = window.frameElement.getAttribute('data-panel');
    $('.page-tabs-content .active i', topWindow).click();
    if ($.common.isNotEmpty(panelUrl)) {
        $('.menuTab[data-id="' + panelUrl + '"]', topWindow).addClass('active').siblings('.menuTab').removeClass('active');
        $('.mainContent .RuoYi_iframe', topWindow).each(function () {
            if ($(this).data('id') == panelUrl) {
                $(this).show().siblings('.RuoYi_iframe').hide();
                return false;
            }
        });
    }
}

/** 创建选项卡 */
function createMenuItem(dataUrl, menuName) {
    var panelUrl = window.frameElement.getAttribute('data-id');
    dataIndex = $.common.random(1, 100),
        flag = true;
    if (dataUrl == undefined || $.trim(dataUrl).length == 0) return false;
    var topWindow = $(window.parent.document);
    // 选项卡菜单已存在
    $('.menuTab', topWindow).each(function () {
        if ($(this).data('id') == dataUrl) {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings('.menuTab').removeClass('active');
                $('.page-tabs-content').animate({marginLeft: ""}, "fast");
                // 显示tab对应的内容区
                $('.mainContent .RuoYi_iframe', topWindow).each(function () {
                    if ($(this).data('id') == dataUrl) {
                        $(this).show().siblings('.RuoYi_iframe').hide();
                        return false;
                    }
                });
            }
            flag = false;
            return false;
        }
    });
    // 选项卡菜单不存在
    if (flag) {
        var str = '<a href="javascript:;" class="active menuTab" data-id="' + dataUrl + '" data-panel="' + panelUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
        $('.menuTab', topWindow).removeClass('active');

        // 添加选项卡对应的iframe
        var str1 = '<iframe class="RuoYi_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" data-panel="' + panelUrl + '" seamless></iframe>';
        $('.mainContent', topWindow).find('iframe.RuoYi_iframe').hide().parents('.mainContent').append(str1);

        // window.parent.$.modal.loading("加载中，请稍后...");
        $('.mainContent iframe:visible', topWindow).load(function () {
            // window.parent.$.modal.closeLoading();
        });

        // 添加选项卡
        $('.menuTabs .page-tabs-content', topWindow).append(str);
    }
    return false;
}

var layerModel = (function () {
    return {
        closeParent: function () {
            var current = parent.layer.getFrameIndex(window.name); //获取窗口索引
            parent.layer.close(current);
        }
    }
})();

var operaModel = (function () {
    return {
        delRow: function (rowid, url, field) {
            this.confirm("确定删除该条信息吗？", function () {
                $.getJSON(url, {id: rowid}, function (ret) {
                    if (ret.status) {
                        layer.msg(ret.msg, {icon: 1});
                        $table.bootstrapTable('remove', {
                            field: field,
                            values: [rowid]
                        });
                    } else {
                        layer.msg(ret.msg, {icon: 2});
                    }
                });
            })
        },
        delRowMsg: function (rowid, url, field,content) {
            this.confirm(content, function () {
                $.getJSON(url, {id: rowid}, function (ret) {
                    if (ret.status) {
                        layer.msg(ret.msg, {icon: 1});
                        $table.bootstrapTable('remove', {
                            field: field,
                            values: [rowid]
                        });
                    } else {
                        layer.msg(ret.msg, {icon: 2});
                    }
                });
            })
        },
        // 确认窗体
        confirm: function (content, callBack) {
            layer.confirm(content, {
                icon: 3,
                title: "系统提示",
                btn: ['确认', '取消']
            }, function (index) {
                layer.close(index);
                callBack(true);
            });
        },
        //重新刷新页面，使用location.reload()有可能导致重新提交
        reloadPage: function (win) {
            var location = win.location;
            location.href = location.pathname + location.search;
        },
        /**
         * 页面跳转
         * @param url
         */
        redirect: function (url) {
            location.href = url;
        },
        /**
         * 初始化开始结束日期
         * @param url Date
         */
        initDate: function () {
            var date = (new Date().getFullYear()) + "-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate());
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            if (month.length == 1) {
                month = "0" + month;
            }
            var day = arr[2]; //获取当前日期的日

            document.getElementById("endDate").value = year + "-" + (month.length < 2 ? '0' + month : month) + "-" +
                (day.length < 2 ? '0' + day : day);

            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中月的天数
            var year2 = year;
            var month2 = parseInt(month) - 1;
            if (month2 == 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }
            document.getElementById("startDate").value = year2 + "-" + (month2.length < 2 ? '0' + month2 : month2) + "-" +
                (day2.length < 2 ? '0' + day2 : day2);
        },
        /**
         * 初始化开始结束日期
         * @param url
         */
        initTime: function () {
            var date = (new Date().getFullYear()) + "-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate());
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            if (month.length == 1) {
                month = "0" + month;
            }
            var day = arr[2]; //获取当前日期的日

            document.getElementById("endTime").value = year + "-" + (month.length < 2 ? '0' + month : month) + "-" +
                (day.length < 2 ? '0' + day : day);

            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中月的天数
            var year2 = year;
            var month2 = parseInt(month) - 3;
            if (month2 <= 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }
            var starttime = year2 + "-" + (month2.length < 2 ? '0' + month2 : month2) + "-" + (day2.length < 2 ? '0' + day2 : day2);
            document.getElementById("startTime").value = starttime;
        }
    }
})();

var isEmpty = (function (value) {
    if (value == null || value.length == 0 || $.trim(value).length == 0) {
        return true;
    }
    return false;
})

/**
 * 日期格式化
 * @param fmt yyyy-MM-dd
 * @returns {string}
 */
Date.prototype.format = function (fmt) {
    if (!fmt) {
        fmt = 'yyyy-MM-dd HH:mm:ss'
    }
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
var uploadModel = (function () {
    return {
        /**
         * 打开文件上传对话框
         * @param dialog_title 对话框标题
         * @param callback 回调方法，参数有（当前dialog对象，选择的文件数组，你设置的extra_params）
         * @param extra_params 额外参数，object
         * @param multi 是否可以多选
         * @param filetype 文件类型，image,video,audio,file
         */
        open_upload_dialog: function (title, callback, extra_params, multi, filetype) {
            multi = multi ? 1 : 0;
            filetype = filetype ? filetype : 'image';
            var params = 'multi=' + multi + '&fileType=' + filetype;
            layer.open({
                type: 2,
                title: title,
                closeBtn: false,
                shadeClose: true,
                shade: false,
                maxmin: false,
                area: ['500px', '600px'],
                content: '/admin/upload/index/?' + params,
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    if (typeof callback == 'function') {
                        var iframewindow = $(layero).find('iframe')[0].contentWindow;
                        var files = iframewindow.get_selected_files();
                        if (files) {
                            callback.apply(layero, [layero, files]);
                        } else {
                            return false;
                        }
                        layer.close(index);
                    }
                },
                btn2: function (index) {
                    layer.close(index);
                }
            });
        },

        upload_one: function (title, input_selector, filetype, extra_params) {
            this.open_upload_dialog(title, function (layero, files) {
                $('#' + input_selector).val(files[0].filepath);
            }, extra_params, 0, filetype);
        },

        upload_one_image: function (title, input_selector, extra_params) {
            this.open_upload_dialog(title, function (layero, files) {
                $('#' + input_selector).val(files[0].preview_url);
                $('#' + input_selector + '-preview').attr('src', files[0].preview_url);
            }, extra_params, 0, 'image');
        },
        /**
         * 多图上传
         * @param dialog_title 上传对话框标题
         * @param container_selector 图片容器
         * @param item_tpl_wrapper_id 单个图片html模板容器id
         */
        upload_multi_image: function (title, container_selector, item_tpl_wrapper_id, extra_params) {
            this.open_upload_dialog(title, function (layero, files) {
                var tpl = $('#' + item_tpl_wrapper_id).html();
                var html = '';
                $.each(files, function (i, item) {
                    var itemtpl = tpl;
                    itemtpl = itemtpl.replace(/\{id\}/g, item.id);
                    itemtpl = itemtpl.replace(/\{url\}/g, item.url);
                    itemtpl = itemtpl.replace(/\{preview_url\}/g, item.preview_url);
                    itemtpl = itemtpl.replace(/\{filepath\}/g, item.filepath);
                    itemtpl = itemtpl.replace(/\{name\}/g, item.name);
                    html += itemtpl;
                });
                $('#' + container_selector).append(html);

            }, extra_params, 1, 'image');
        }
    }
})();
/**
 * 通用校验调用
 * @type {{showErrors: validate.showErrors, submitHandler: validate.submitHandler}}
 */
var validate = (function () {
    return {
        showErrors: function (errorMap, errorArr) {
            if (parseInt(errorArr.length) > 0) {
                $(errorArr[0].element).focus();
                id = errorArr[0].element.id;
                if (id == 'schoolId') {
                    id = 'schoolDiv';
                }
                if (id == 'startDate') {
                    id = 'checkDate';
                    $('#' + id).click();
                }
                var i = ["<i class=\'fa fa-warning\' ></i>"].join('')
                layer.tips(i + ' ' + errorArr[0].message, '#' + id, {tips: [2, '#9b9b9b'], timeout: 1000});
                return;
            }
        },
        submitHandler: function ($form, $btn) {
            $form.ajaxSubmit({
                url: $btn.data('action') ? $btn.data('action') : $form.attr('action'),
                dataType: 'json',
                beforeSubmit: function (arr, $form, options) {
                    $btn.data("loading", true);
                    var text = $btn.text();
                    $btn.text(text + '中...').prop('disabled', true).addClass('disabled');
                },
                success: function (data, statusText, xhr, $form) {
                    var text = $btn.text();
                    $btn.removeClass('disabled').prop('disabled', false).text(text.replace('中...', '')).parent().find('span').remove();
                    if (data.state === 'success') {
                        layer.msg(data.msg, {icon: 1}, function () {
                            if (data.referer) {
                                operaModel.redirect(data.referer);//返回带跳转地址
                            } else {
                                if (data.state === 'success') {
                                    operaModel.reloadPage(window);//刷新当前页
                                }
                            }
                        });
                    } else if (data.state === 'error') {
                        layer.msg(data.msg, {icon: 2});
                    }
                },
                error: function (xhr, e, statusText) {
                    console.log(statusText);
                    operaModel.reloadPage(window);//刷新当前页
                },
                complete: function () {
                    $btn.data("loading", false);
                }
            });
        }
    }
})();

(function () {
    //全局ajax处理
    $.ajaxSetup({
        complete: function (jqXHR) {
        },
        data: {},
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });

    if ($.browser && $.browser.msie) {
        //ie 都不缓存
        $.ajaxSetup({
            cache: false
        });
    }

    //不支持placeholder浏览器下对placeholder进行处理
    if (document.createElement('input').placeholder !== '') {
        $('[placeholder]').focus(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur().parents('form').submit(function () {
            $(this).find('[placeholder]').each(function () {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            });
        });
    }

    var ajaxForm_list = $('form.js-ajax-form');
    if (ajaxForm_list.length) {
        var $btn,$modal;
        $('button.js-ajax-submit').on('click', function (e) {
            var btn = $(this);
            var modal = $('.modal');
            var form = btn.parents('form.js-ajax-form');
            $btn = btn;
            $modal = modal;


            if (btn.data("loading")) {
                return;
            }

            //ie处理placeholder提交问题
            if ($.browser && $.browser.msie) {
                form.find('[placeholder]').each(function () {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });
            }
        });

        ajaxForm_list.each(function () {
            $(this).validate({
                debug: true,
                //是否在获取焦点时验证
                //onfocusout : false,
                //当鼠标掉级时验证
                //onclick : false,
                //给未通过验证的元素加效果,闪烁等
                //highlight : false,
                onkeyup: function (element, event) {
                    return;
                },
                showErrors: function (errorMap, errorArr) {
                    if (parseInt(errorArr.length) > 0) {
                        $(errorArr[0].element).focus();
                        layer.msg(errorArr[0].message, {icon: 2});
                    }
                },
                submitHandler: function (form) {
                    var $form = $(form);
                    $form.ajaxSubmit({
                        url: $btn.data('action') ? $btn.data('action') : $form.attr('action'),
                        dataType: 'json',
                        beforeSubmit: function (arr, $form, options) {
                            $btn.data("loading", true);
                            var text = $btn.text();
                            $btn.text(text + '中...').prop('disabled', true).addClass('disabled');
                        },
                        success: function (data, statusText, xhr, $form) {
                            var text = $btn.text();
                            $btn.removeClass('disabled').prop('disabled', false).text(text.replace('中...', '')).parent().find('span').remove();
                            if (data.state === 'success') {
                                $modal.modal('hide');
                                layer.msg(data.msg, {icon: 1}, function () {
                                    //返回带跳转地址
                                    if (data.referer) {
                                        // 直接刷新表单
                                        if(data.referer=='refresh'){
                                            $table.bootstrapTable('refresh');
                                        } else{
                                            // 跳转到指定地址
                                            operaModel.redirect(data.referer);
                                        }
                                    } else {
                                        if (data.state === 'success') {
                                            operaModel.reloadPage(window);//刷新当前页
                                        }
                                    }
                                },600);
                            } else if (data.state === 'error') {
                                if (data.referer) {
                                    layer.msg(data.msg, {icon: 2}, function () {
                                        window.setTimeout(1100);
                                        operaModel.redirect(data.referer);//返回带跳转地址
                                    })
                                } else {
                                    layer.msg(data.msg, {icon: 2});
                                }
                            }
                        },
                        error: function (xhr, e, statusText) {
                            console.log(statusText);
                            operaModel.reloadPage(window);//刷新当前页
                        },
                        complete: function () {
                            $btn.data("loading", false);
                        }
                    });
                }
            });
        });
    }

    // laydate 时间控件绑定
    if ($(".select-time").length > 0) {
        layui.use('laydate', function () {
            var laydate = layui.laydate;
            var startDate = laydate.render({
                elem: '#startDate',
                max: $('#endDate').val(),
                theme: 'molv',
                trigger: 'click',
                done: function (value, date) {
                    // 结束时间大于开始时间
                    if (value !== '') {
                        endDate.config.min.year = date.year;
                        endDate.config.min.month = date.month - 1;
                        endDate.config.min.date = date.date;
                    } else {
                        endDate.config.min.year = '';
                        endDate.config.min.month = '';
                        endDate.config.min.date = '';
                    }
                }
            });
            var endDate = laydate.render({
                elem: '#endDate',
                min: $('#startDate').val(),
                theme: 'molv',
                trigger: 'click',
                done: function (value, date) {
                    // 开始时间小于结束时间
                    if (value !== '') {
                        startDate.config.max.year = date.year;
                        startDate.config.max.month = date.month - 1;
                        startDate.config.max.date = date.date;
                    } else {
                        startDate.config.max.year = '';
                        startDate.config.max.month = '';
                        startDate.config.max.date = '';
                    }
                }
            });
        });
    }
    // laydate time-input 时间控件绑定
    if ($(".time-input").length > 0) {
        layui.use('laydate', function () {
            var com = layui.laydate;
            $(".time-input").each(function (index, item) {
                var time = $(item);
                // 控制控件外观
                var type = time.attr("data-type") || 'date';
                // 控制回显格式
                var format = time.attr("data-format") || 'yyyy-MM-dd';
                // 控制日期控件按钮
                var buttons = time.attr("data-btn") || 'clear|now|confirm', newBtnArr = [];
                // 日期控件选择完成后回调处理
                var callback = time.attr("data-callback") || {};
                if (buttons) {
                    if (buttons.indexOf("|") > 0) {
                        var btnArr = buttons.split("|"), btnLen = btnArr.length;
                        for (var j = 0; j < btnLen; j++) {
                            if ("clear" === btnArr[j] || "now" === btnArr[j] || "confirm" === btnArr[j]) {
                                newBtnArr.push(btnArr[j]);
                            }
                        }
                    } else {
                        if ("clear" === buttons || "now" === buttons || "confirm" === buttons) {
                            newBtnArr.push(buttons);
                        }
                    }
                } else {
                    newBtnArr = ['clear', 'now', 'confirm'];
                }
                com.render({
                    elem: item,
                    theme: 'molv',
                    trigger: 'click',
                    type: type,
                    format: format,
                    btns: newBtnArr,
                    done: function (value, data) {
                        if (typeof window[callback] != 'undefined'
                            && window[callback] instanceof Function) {
                            window[callback](value, data);
                        }
                    }
                });
            });
        });
    }

    $.extend({
        table: {
            _option: {},
            init: function (options) {
                $.table._option = options;
            }
        }
    });

})();
