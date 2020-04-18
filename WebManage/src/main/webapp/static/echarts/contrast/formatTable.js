/**
 * 年份动态拼接字段
 * @param statText 动态字段名
 */
function formatYearTable(statText) {
    columnsArr = []; // 每次需清空
    /*固定列*/
    var baseColumns = columns.BASE_COLUMNS;
    baseColumns.length = 1;
    var childColumns = [];
    childColumns.push(
        {title: "", align: "center", field: 'gradeGroup0', valign: 'middle', formatter: formatGradeGroup},
        {title: "", align: "center", field: 'gradeName0', valign: 'middle'},
    )
    childColumns.length = 2;
    var $check = $('input[name="years"]:checked');
    // 动态拼接列
    $check.each((index, item) => {
        var value = item.value ? item.value : "其他";
        baseColumns.push(
            {title: value + "年筛查人数", align: "center", colspan: 3, rowspan: 1, valign: 'middle'},
        )
        childColumns.push(
            {title: "总", align: "center", field: 'checkSum' + index, valign: 'middle'},
            {title: "男", align: "center", field: 'checkBoySum' + index, valign: 'middle'},
            {title: "女", align: "center", field: 'checkGirlSum' + index, valign: 'middle'},
        )
    })
    baseColumns.push(
        {title: "男生" + statText + "检出率（%）", align: "center", colspan: $check.length, rowspan: 1, valign: 'middle'},
        {title: "女生" + statText + "检出率（%）", align: "center", colspan: $check.length, rowspan: 1, valign: 'middle'}
    )
    $check.each((index, item) => {
        var value = item.value ? item.value : "其他";
        childColumns.push(
            {title: value + "年", align: "center", field: 'commonBoyRate' + index, valign: 'middle'},
        )
    })
    $check.each((index, item) => {
        var value = item.value ? item.value : "其他";
        childColumns.push(
            {title: value + "年", align: "center", field: 'commonGirlRate' + index, valign: 'middle'},
        )
    })
    columnsArr.push(baseColumns, childColumns);
    // console.log(columnsArr)
}

/**
 * 区域表格动态拼接
 * @param statText 动态字段名
 */
function formatRegionTable(statText) {
    var regions = getParams().regions.split(',');
    columnsArr = []; // 每次需清空
    var paramArr = [];
    $('input[name="regions"]:checked').each((index, item) => {
        var value = item.nextSibling.data;
        paramArr.push({index: value})
    });
    /*固定列*/
    var baseColumns = columns.BASE_COLUMNS;
    baseColumns.length = 1;
    var childColumns = [];
    childColumns.push(
        {title: "", align: "center", field: 'gradeGroup0', valign: 'middle',formatter: formatGradeGroup},
        {title: "", align: "center", field: 'gradeName0', valign: 'middle'},
    )
    childColumns.length = 2;
    regions.forEach((item, index) => {
        var title = paramArr[index].index;
        baseColumns.push({title: title, align: "center", colspan: 3, rowspan: 1, valign: 'middle'},)
    })
    regions.forEach((item, index) => {
        childColumns.push(
            {title: '总', align: "center", field: 'checkSum' + index, valign: 'middle'},
            {title: '男', align: "center", field: 'checkBoySum' + index, valign: 'middle'},
            {title: '女', align: "center", field: 'checkGirlSum' + index, valign: 'middle'},
        )
    })
    columnsArr.push(baseColumns, childColumns);
    // console.log(columnsArr)
}

/**
 * 学校类型表格动态生成
 * @param statText 动态字段名
 */
function formatSchoolFlagTable(statText) {
    var flags = getParams().schoolFlags.split(",");
    columnsArr = []; // 每次需清空
    /*固定列*/
    var paramArr = [];
    $('input[name="schoolFlags"]:checked').each((index, item) => {
        var value = item.nextSibling.data;
        paramArr.push({index: value})
    });
    var baseColumns = columns.BASE_COLUMNS;
    baseColumns.length = 1;
    var childColumns = [];
    childColumns.push(
        {title: "", align: "center", field: 'gradeGroup0', valign: 'middle',formatter: formatGradeGroup},
        {title: "", align: "center", field: 'gradeName0', valign: 'middle'},
    )
    childColumns.length = 2;
    flags.forEach((item, index) => {
        var title = paramArr[index].index
        baseColumns.push({title: title, align: "center", colspan: 3, rowspan: 1, valign: 'middle'},)
    })
    flags.forEach((item, index) => {
        childColumns.push(
            {title: '总', align: "center", field: 'checkSum' + index, valign: 'middle'},
            {title: '男', align: "center", field: 'checkBoySum' + index, valign: 'middle'},
            {title: '女', align: "center", field: 'checkGirlSum' + index, valign: 'middle'},
        )
    })
    baseColumns.push(
        {title: "男生" + statText + "检出率（%）", align: "center", colspan: flags.length, rowspan: 1, valign: 'middle'},
        {title: "女生" + statText + "检出率（%）", align: "center", colspan: flags.length, rowspan: 1, valign: 'middle'}
    )
    flags.forEach((item, index) => {
        var title = paramArr[index].index
        childColumns.push(
            {title: title, align: "center", field: 'commonBoyRate' + index, valign: 'middle'},
        )
    })
    flags.forEach((item, index) => {
        var title = paramArr[index].index
        childColumns.push(
            {title: title, align: "center", field: 'commonGirlRate' + index, valign: 'middle'},
        )
    })
    columnsArr.push(baseColumns, childColumns);
}

/**
 * 拼接性质表格
 * @param statText 动态字段名
 */
function formatschoolNatureTable(statText) {
    var all = getParams().natures.split(",");
    columnsArr = []; // 每次需清空
    var paramArr = [];
    $('input[name="natures"]:checked').each((index, item) => {
        var value = item.nextSibling.data;
        paramArr.push({index: value})
    });
    /*固定列*/
    var baseColumns = columns.BASE_COLUMNS;
    baseColumns.length = 1;
    var childColumns = [];
    childColumns.push(
        {title: "", align: "center", field: 'gradeGroup0', valign: 'middle',formatter: formatGradeGroup},
        {title: "", align: "center", field: 'gradeName0', valign: 'middle'},
    )
    childColumns.length = 2;
    all.forEach((item, index) => {
        var title = paramArr[index].index
        baseColumns.push({title: title, align: "center", colspan: 3, rowspan: 1, valign: 'middle'},)
    })
    all.forEach((item, index) => {
        childColumns.push(
            {title: '总', align: "center", field: 'checkSum' + index, valign: 'middle'},
            {title: '男', align: "center", field: 'checkBoySum' + index, valign: 'middle'},
            {title: '女', align: "center", field: 'checkGirlSum' + index, valign: 'middle'},
        )
    })
    baseColumns.push(
        {title: "男生" + statText + "检出率（%）", align: "center", colspan: all.length, rowspan: 1, valign: 'middle'},
        {title: "女生" + statText + "检出率（%）", align: "center", colspan: all.length, rowspan: 1, valign: 'middle'}
    )
    all.forEach((item, index) => {
        var title = paramArr[index].index
        childColumns.push(
            {title: title, align: "center", field: 'commonBoyRate' + index, valign: 'middle'},
        )
    })
    all.forEach((item, index) => {
        var title = paramArr[index].index
        childColumns.push(
            {title: title, align: "center", field: 'commonGirlRate' + index, valign: 'middle'},
        )
    })
    columnsArr.push(baseColumns, childColumns);
}

/**
 * 动态替换值
 * @param check
 */
function formatGradeGroup(value, row, index) {
    var text = value ? value : '-';
    return '<span style="color:#598efe">' + text + '</span>';
}

/**
 * 动态表格
 * @type {{REGION_COLUMNS: *[][], NATURE_COLUMNS: *[][], YEARS_COLUMNS: *[][]}}
 */
columns = {
    /*通用字段*/
    BASE_COLUMNS: [
        {title: "学校及年级", align: "center", colspan: 2, rowspan: 1, valign: 'middle'},
    ]
}
