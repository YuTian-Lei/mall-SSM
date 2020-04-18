
/**
 * 学校类型切换
 */
function changeSchool(type) {
    $('#status').prop("checked", false);
    getSchools(type);
}

/**
 * 异步学校复选框列表
 */
function getSchools(type) {
    $('#schools').empty();
    $.post('/admin/school/getSchoolByUser', {'demonstration': type}, function (data) {
        if (data.status == "1") {
            var schools = data.result;
            var allSchool = schools.length;
            $('#no_data').css("display", 'none');
            schools.forEach(item => {
                $('#schools').append(`<label class="check-box">&nbsp;<input name="schoolId" type="checkbox"  value="` + item.id + `"/>` + item.schoolName + `</label>`);
            })
            // 绑定选中事件
            clickSchool(allSchool);
        } else {
            $('#no_data').css("display", 'block');
        }
    })
}

/**
 * 全选事件(选中取消)
 */
function checkAll() {
    $('#status').change(function () {
        var isCheck = $(this).is(":checked");
        var schools = $('input[name="schoolId"]');
        if (isCheck) {
            schools.each(function (index) {
                var isCheck = schools[index].checked;
                if (!isCheck) {
                    var value = schools[index].value;
                    var text = schools[index].nextSibling.data;
                    $('#checkedSchools').append('<li class="select2-selection__choice">' +
                        '<input type="hidden" name="schoolIds" value="' + value + '">' +
                        '<span class="select2-selection__choice__remove" onclick="removeCheck(this)">×</span>' +
                        '<span>' + text + '</span>' +
                        '</li>')
                }
            })
            schools.prop("checked", true);
        } else {
            $('input[name="schoolIds"]').each(function () {
                var schoolIds = $(this)[0].nextSibling;
                schoolIds.parentNode.parentNode.removeChild(schoolIds.parentNode);
            })
            schools.prop("checked", false);
        }
    })
}

/**
 * 学校单选（选中取消）
 * @param len
 */
function clickSchool(len) {
    $('input[name="schoolId"]').click(function () {
        var isCheck = $(this).is(":checked")
        var value = $(this)[0].value;
        var text = $(this).parent()[0].innerText;
        // 选中
        if (isCheck) {
            if (len == $('input[name="schoolId"]:checkbox:checked').length) {
                $('#status').prop("checked", true);
            }
            $('#checkedSchools').append('<li class="select2-selection__choice">' +
                '<input type="hidden" name="schoolIds" value="' + value + '">' +
                '<span class="select2-selection__choice__remove" onclick="removeCheck(this)">×</span>' +
                '<span>' + text + '</span>' +
                '</li>')
        } else {
            // 取消选中
            $('#status').prop("checked", false);
            $('input[name="schoolIds"]').each(function () {
                var schoolId = $(this).val();
                if (value == schoolId) {
                    removeCheck($(this)[0].nextSibling);
                }
            })
        }
    })
}

/**
 * 移除选中(双向移除)
 */
function removeCheck(obj) {
    $('#status').prop("checked", false);
    var value = obj.previousSibling.value;
    $('input[name="schoolId"]').each(function () {
        var schoolId = $(this).val();
        if (value == schoolId) {
            $(this).prop("checked", false);
        }
    })
    obj.parentNode.parentNode.removeChild(obj.parentNode);
}

/**
 * 预览 调查问卷
 * @param a
 */
function preView(a) {
    var filePath = a.previousElementSibling.children[1].value;
    var fileName = a.previousElementSibling.children[2].innerHTML;
    createMenuItem(filePath,fileName)
    // $('#filePath').prop('src', filePath);
    // $('#pdfview').prop('data', filePath);
    // $('#download').prop('href', filePath);
    // $('#viewName').html();
    // $('#preview').modal('show');
}