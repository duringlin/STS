/**
*现在的函数基本能够满足日、周、月的切换，但是反复切换之后会引起浏览器卡死
*问题还没找到
*等到换成ajax json 获取数据之后再解决
*
**/

/**格式化数字为一个定长的字符串，前面补０ 
*参数: 
* Source 待格式化的字符串 
* Length 需要得到的字符串的长度 
*/
function FormatNum(Source, Length) {
    var strTemp = "";
    for (var i = 1; i <= Length - Source.length; i++) {
        strTemp += "0";
    }
    return strTemp + Source;
}

function creatChart() {

    var chart = null;
    var x_arr = [];
    var y_arr = [];
    var orginPrice = 6.82;
    var ymax = orginPrice * (1 + 0.1);
    var ymin = orginPrice * (1 - 0.1);
    var ystep = orginPrice * (1 + 0.05);
    var total_point = 240;/**一共的点数**/
    var current_point = 0;/**当前的点数**/
    var TIMEOUT = 1000;/**间隔多久获取一次数据**/

    function loadTime() {
        window.setTimeout(getData, TIMEOUT);
    }

    function setXArr() {
        var hour = 9;
        var minutes = 30;
        var xArr = null;
        for (var i = hour; i < 15; i++) {
            if (i == 12) continue;
            while (minutes < 60) {
                if (i == 11 && minutes >= 30) {
                    break;
                }
                if (i == 13 && minutes == 0) {
                    x_arr.push('11:30/13:00');
                    minutes++;
                    continue;
                }
                xArr = FormatNum(i + "", 2) + ":" + FormatNum(minutes + "", 2);
                x_arr.push(xArr);
                minutes++;
                if (minutes == 60) {
                    break;
                }
            }
            minutes = 0;
        }
        x_arr.push('15:00');

    }

    /**根据昨天收盘价格计算今天的涨跌区间**/
    function setYArr() {
        var orginData = orginPrice;
        y_arr.push((orginData * (1 - 0.1)).toFixed(2));
        y_arr.push((orginData * (1 - 0.05)).toFixed(2));
        y_arr.push(orginData + '');
        y_arr.push((orginData * (1 + 0.05)).toFixed(2));
        y_arr.push((orginData * (1 + 0.1)).toFixed(2));
    }

    /**获取第一次数据**/
    function getFirstData() {
        var data = [];
        var y_mx = Math.random() * (orginPrice * (1 + 0.1) - orginPrice * (1 - 0.1)) + orginPrice * (1 - 0.1);
        var i;

        for (i = 0; i <= 0; i++) {
            data.push({
                x: current_point,
                y: y_mx
            });
            if (current_point <= total_point) {
                current_point++;
            }
        }
        return data;
    }

    /**更新数据**/
    function getData() {
        var current_x = x_arr[current_point];

        //获取最大值
        var series_mx = chart.series[0];
        var y_mx = Math.random() * (orginPrice * (1 + 0.1) - orginPrice * (1 - 0.1)) + orginPrice * (1 - 0.1);

        series_mx.addPoint([current_point, y_mx], true, false);

        current_point++;

        if (current_point <= total_point) {
            window.setTimeout(getData, TIMEOUT);
        }
    }

    /**绘制图表**/
    $(function() {
        $(document).ready(function() {
            setXArr();
            setYArr();

            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'trend',
                    /**目标区域**/
                    type: 'line',
                    marginTop: 30,
                    marginBottom: 30,
                    marginLeft: 60,
                    marginRight: 60,
                    events: {
                        load: loadTime
                    }
                },
                credits: {
                    enabled: false //不显示highCharts版权信息
                },
                title: {
                    text: '',
                    enabled: false
                },
                subtitle: {
                    enabled: false
                },
                xAxis: {
                    /*                 type:"datetime", */
                    categories: x_arr,
                    /**刻度集合**/
                    /* tickInterval:1000*60, */
                    /**数据刻度 1分钟  每60s请求一次数据**/
                    max: total_point,
                    /**以每分钟取一次记录算，股市交易时间一共241个点**/
                    min: 0,
                    /**显示的坐标**/
                    tickPositions: [0, 60, 120, 180, 240],
                },
                yAxis: [{
                    /*  categories:y_arr, */
                    tickmarkPlacement: 'on',
                    /**数值显示在刻度上还是中间**/
                    max: ymax,
                    min: ymin,
                    step: ystep,
                    showFirstLabel: true,
                    title: {
                        enabled: false
                    },
                    allowDecimals: true,
                    labels: {
                        formatter: function() {
                            if (this.value > orginPrice) {
                                return '<span style="fill: red;">' + Highcharts.numberFormat(this.value, 2, '.') + '</span>';
                            } else if (this.value < orginPrice) {
                                return '<span style="fill: green;">' + Highcharts.numberFormat(this.value, 2, '.') + '</span>';
                            } else if (this.value = orginPrice) {
                                return '<span style="fill: black;">' + Highcharts.numberFormat(this.value, 2, '.') + '</span>';
                            } else {
                                return this.value;
                            }
                        }
                    }
                },
                {
                    /*  categories:y_arr, */
                    tickmarkPlacement: 'on',
                    /**数值显示在刻度上还是中间**/
                    max: ymax.toFixed(2),
                    min: ymin.toFixed(2),
                    step: ystep,
                    showFirstLabel: true,
                    title: {
                        enabled: false
                    },
                    allowDecimals: true,
                    opposite: true,
                    /**该条y轴是反向的，即位于右边**/
                    labels: {
                        formatter: function() {
                            if (this.value > orginPrice) {
                                return '<span style="fill: red;">' + '+' + Highcharts.numberFormat((this.value / orginPrice - 1) * 100, 2, '.') + '%' + '</span>';
                            } else if (this.value < orginPrice) {
                                return '<span style="fill: green;">' + '-' + Highcharts.numberFormat((1 - this.value / orginPrice) * 100, 2, '.') + '%' + '</span>';
                            } else if (this.value = orginPrice) {
                                return '<span style="fill: black;">' + '+' + Highcharts.numberFormat((1 - this.value / orginPrice) * 100, 2, '.') + '%' + '</span>';
                            } else {
                                return this.value;
                            }
                        }
                    }

                }],
                tooltip: {
                    formatter: function() {
                        var drift;
                        if (this.y > orginPrice) {
                            drift = '<span style="fill: red;">' + '+' + Highcharts.numberFormat((this.y / orginPrice - 1) * 100, 2, '.') + '%' + '</span>';
                        } else if (this.y < orginPrice) {
                            drift = '<span style="fill: green;">' + '-' + Highcharts.numberFormat((1 - this.y / orginPrice) * 100, 2, '.') + '%' + '</span>';
                        } else if (this.y = orginPrice) {
                            drift = '<span style="fill: black;">' + '+' + Highcharts.numberFormat((1 - this.y / orginPrice) * 100, 2, '.') + '%' + '</span>';
                        } else {
                            drift = this.y;
                        }

                        return '<b>' + this.series.name + '  ' + this.x + '</b><br/>' + '   开盘：' + orginPrice + '  价格：' + Highcharts.numberFormat(this.y, 2, '.') + '  涨幅：' + drift;
                    }
                },
                legend: {
                    /**图例**/

                    enabled: false
                },
                plotOptions: {
                    /**填充颜色**/
                    line: {
                       
                        lineWidth: 1,
                        marker: {
                            radius: 1,
                            enabled: false
                        },
                        shadow: true,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
                exporting: {
                    /**是否允许输出**/
                    enabled: false
                },

                series: [
                {
                    name: Highcharts.dateFormat('%Y-%m-%d', new Date()),
                    type: 'line',
                    data: []
                }]
            });
        });
        $("#btn-today").addClass("active");
        $("#btn-week").removeClass("active");
        $("#btn-month").removeClass("active");
        $("#btn-week").click(function() {
            creatChartForWeek();
        });
        $("#btn-month").click(function() {
            creatChartForMonth();
        });
    });

}

/**图表-周视图**/
function creatChartForWeek() {

    var chart;
    var x_arr = [];
    var y_arr = [];
    var orginPrice = 6.82;
    var ymax = orginPrice * (1 + 0.1);
    var ymin = orginPrice * (1 - 0.1);
    var ystep = orginPrice * (1 + 0.05);
    var total_point = 240 * 5;
    /**每天240个点，一共5天，外加4个空数据点用来分割天**/
    /**一共的点数**/
    var current_point = 0;
    /**当前的点数**/
    var TIMEOUT = 1000;
    /**间隔多久获取一次数据**/

    function loadTime() {
        window.setTimeout(getData, TIMEOUT);
    }

    function setXArr() {
        var today = new Date(
        /* 2014, 2, 3 */
        ); //定义当天日期对象 
        var year = today.getFullYear(); //获取年份 
        var month = today.getMonth(); //获取月份 
        var date = today.getDate(); //获取日期值 
        var nextDay;
        var str;
        /**需要计算的天数**/
        var day = 5;
        /**需要计算的天数**/
        var hour = 9;
        var minutes = 59;
        var xArr;
        var change = 0;
        while (day != change) {
            try {
                nextDay = new Date(year, month, date - change);
                if (nextDay.getDay() >= 1 && nextDay.getDay() <= 5) {
                    str = nextDay.getFullYear() + "-" + FormatNum((nextDay.getMonth() + 1) + "", 2) + "-" + FormatNum(nextDay.getDate() + "", 2) + " ";
                } else if (nextDay.getDay() == 6 || nextDay.getDay() == 0) {
                    day++;
                    change++;
                    continue;
                }
            } catch(e) {
                var str = "";
                alert(e.message);
            }
            change++;
            x_arr.push("" + str + '15:00');
            for (var i = 14; i >= hour; i--) {
                if (i == 12) continue;
                while (minutes >= 0) {
                    if (i == 11 && minutes > 30) {
                        minutes--;
                        continue;
                    }
                    if (i == 9 && minutes < 30) {
                        break;
                    }
                    if (i == 13 && minutes == 0) {
                        x_arr.push("" + str + '13:00');
                        minutes--;
                        continue;
                    }
                    xArr = "" + str + FormatNum(i + "", 2) + ":" + FormatNum(minutes + "", 2);
                    x_arr.push(xArr);
                    minutes--;

                }
                minutes = 59;
            }

        }
        /**数组反转**/
        x_arr.reverse();

    }

    /**根据昨天收盘价格计算今天的涨跌区间**/
    function setYArr() {
        var orginData = orginPrice;
        y_arr.push((orginData * (1 - 0.1)).toFixed(2));
        y_arr.push((orginData * (1 - 0.05)).toFixed(2));
        y_arr.push(orginData + '');
        y_arr.push((orginData * (1 + 0.05)).toFixed(2));
        y_arr.push((orginData * (1 + 0.1)).toFixed(2));
    }

    /**获取第一次数据**/
    function getFirstData() {
        var data = [];
        var y_mx = Math.random() * (orginPrice * (1 + 0.1) - orginPrice * (1 - 0.1)) + orginPrice * (1 - 0.1);
        var i;

        for (i = 0; i <= 0; i++) {
            data.push({
                x: current_point,
                y: y_mx
            });
            if (current_point <= total_point) {
                current_point++;
            }
        }
        return data;
    }

    /**更新数据**/
    function getData() {
        var current_x = x_arr[current_point];

        //获取最大值
        var series_mx = chart.series[0];
        var y_mx = Math.random() * (orginPrice * (1 + 0.1) - orginPrice * (1 - 0.1)) + orginPrice * (1 - 0.1);

        series_mx.addPoint([current_point, y_mx], true, false);

        current_point++;

        if (current_point <= total_point) {
            window.setTimeout(getData, TIMEOUT);
        }
    }

    /**绘制图表**/
    $(function() {
        $(document).ready(function() {
            setXArr();
            setYArr();

            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'trend',
                    /**目标区域**/
                    type: 'line',
                    marginTop: 30,
                    marginBottom: 30,
                    marginLeft: 60,
                    marginRight: 60,
                    events: {
                        load: loadTime
                    }
                },
                credits: {
                    enabled: false //不显示highCharts版权信息
                },
                title: {
                    text: '',
                    enabled: false
                },
                subtitle: {
                    enabled: false
                },
                xAxis: {
                    /*                 type:"datetime", */
                    categories: x_arr,
                    /**刻度集合**/
                    /* tickInterval:1000*60, */
                    /**数据刻度 1分钟  每60s请求一次数据**/
                    max: total_point,
                    /**以每分钟取一次记录算，股市交易时间一共241个点**/
                    min: 0,
                    /**显示的坐标**/
                    tickPositions: [120, 360, 600, 840, 1080],
                    /**数值显示在刻度上还是中间**/
                    labels: {
                        formatter: function() {
                            return (this.value).substring(0, 10);
                        }
                    }

                },
                yAxis: [{
                    /*  categories:y_arr, */
                    tickmarkPlacement: 'on',
                    /**数值显示在刻度上还是中间**/
                    max: ymax,
                    min: ymin,
                    step: ystep,
                    showFirstLabel: true,
                    title: {
                        enabled: false
                    },
                    allowDecimals: true,
                    labels: {
                        formatter: function() {
                            if (this.value > orginPrice) {
                                return '<span style="fill: red;">' + Highcharts.numberFormat(this.value, 2, '.') + '</span>';
                            } else if (this.value < orginPrice) {
                                return '<span style="fill: green;">' + Highcharts.numberFormat(this.value, 2, '.') + '</span>';
                            } else if (this.value = orginPrice) {
                                return '<span style="fill: black;">' + Highcharts.numberFormat(this.value, 2, '.') + '</span>';
                            } else {
                                return this.value;
                            }
                        }
                    }
                },
                {
                    /*  categories:y_arr, */
                    tickmarkPlacement: 'on',
                    /**数值显示在刻度上还是中间**/
                    max: ymax.toFixed(2),
                    min: ymin.toFixed(2),
                    step: ystep,
                    showFirstLabel: true,
                    title: {
                        enabled: false
                    },
                    allowDecimals: true,
                    opposite: true,
                    /**该条y轴是反向的，即位于右边**/
                    labels: {
                        formatter: function() {
                            if (this.value > orginPrice) {
                                return '<span style="fill: red;">' + '+' + Highcharts.numberFormat((this.value / orginPrice - 1) * 100, 2, '.') + '%' + '</span>';
                            } else if (this.value < orginPrice) {
                                return '<span style="fill: green;">' + '-' + Highcharts.numberFormat((1 - this.value / orginPrice) * 100, 2, '.') + '%' + '</span>';
                            } else if (this.value = orginPrice) {
                                return '<span style="fill: black;">' + '+' + Highcharts.numberFormat((1 - this.value / orginPrice) * 100, 2, '.') + '%' + '</span>';
                            } else {
                                return this.value;
                            }
                        }
                    }

                }],
                tooltip: {
                    formatter: function() {
                        var drift;
                        if (this.y > orginPrice) {
                            drift = '<span style="fill: red;">' + '+' + Highcharts.numberFormat((this.y / orginPrice - 1) * 100, 2, '.') + '%' + '</span>';
                        } else if (this.y < orginPrice) {
                            drift = '<span style="fill: green;">' + '-' + Highcharts.numberFormat((1 - this.y / orginPrice) * 100, 2, '.') + '%' + '</span>';
                        } else if (this.y = orginPrice) {
                            drift = '<span style="fill: black;">' + '+' + Highcharts.numberFormat((1 - this.y / orginPrice) * 100, 2, '.') + '%' + '</span>';
                        } else {
                            drift = this.y;
                        }

                        return '<b>' + this.series.name + '  ' + this.x + '</b><br/>' + '   开盘：' + orginPrice + '  价格：' + Highcharts.numberFormat(this.y, 2, '.') + '  涨幅：' + drift;
                    }
                },
                legend: {
                    /**图例**/

                    enabled: false
                },
                plotOptions: {
                    /**填充颜色**/
                    line: {
                                               lineWidth: 0.5,
                        marker: {
                            radius: 1,
                            enabled: false
                        },
                        states: {
                            hover: {
                                lineWidth: 0.5
                            }
                        },
                        threshold: null
                    }
                },
                exporting: {
                    /**是否允许输出**/
                    enabled: false
                },

                series: [                {
                    name: "|",
                    type: 'line',
                    data: []
                }]
            });
        });
        $("#btn-today").removeClass("active");
        $("#btn-week").addClass("active");
        $("#btn-month").removeClass("active");
        $("#btn-today").click(function() {
            creatChart();
        });
        $("#btn-month").click(function() {
            creatChartForMonth();
        });
    });

}

/**图表-月视图**/
function creatChartForMonth() {

    var chart;
    var x_arr = [];
    var y_arr = [];
    var orginPrice = 6.82;
    var ymax = orginPrice * (1 + 0.1);
    var ymin = orginPrice * (1 - 0.1);
    var ystep = orginPrice * (1 + 0.05);
    var total_point = 30;
    /**一共30天，外加4个空数据点用来分割星期**/
    /**一共的点数**/
    var current_point = 0;
    /**当前的点数**/
    var TIMEOUT = 1000;
    /**间隔多久获取一次数据**/

    function loadTime() {
        window.setTimeout(getData, TIMEOUT);
    }

    function setXArr() {
        var today = new Date(
        /* 2014, 2, 3 */
        ); //定义当天日期对象 
        var year = today.getFullYear(); //获取年份 
        var month = today.getMonth(); //获取月份 
        var date = today.getDate(); //获取日期值 
        var nextDay;
        var str;
        /**需要计算的天数**/
        var day = 30;
        var change = 0;
        while (day != change) {
            try {
                nextDay = new Date(year, month, date - change);
                if (nextDay.getDay() >= 1 && nextDay.getDay() <= 5) {
                    str = nextDay.getFullYear() + "-" + FormatNum((nextDay.getMonth() + 1) + "", 2) + "-" + FormatNum(nextDay.getDate() + "", 2) + " ";
                } else if (nextDay.getDay() == 6 || nextDay.getDay() == 0) {
                    day++;
                    change++;
                    continue;
                }
            } catch(e) {
                var str = "";
                alert(e.message);
            }
            x_arr.push(str);
            change++;
        }
        /**数组反转**/
        x_arr.reverse();
    }

    /**根据昨天收盘价格计算今天的涨跌区间**/
    function setYArr() {
        var orginData = orginPrice;
        y_arr.push((orginData * (1 - 0.1)).toFixed(2));
        y_arr.push((orginData * (1 - 0.05)).toFixed(2));
        y_arr.push(orginData + '');
        y_arr.push((orginData * (1 + 0.05)).toFixed(2));
        y_arr.push((orginData * (1 + 0.1)).toFixed(2));
    }

    /**获取第一次数据**/
    function getFirstData() {
        var data = [];
        var y_mx = Math.random() * (orginPrice * (1 + 0.1) - orginPrice * (1 - 0.1)) + orginPrice * (1 - 0.1);
        var i;

        for (i = 0; i <= 0; i++) {
            data.push({
                x: current_point,
                y: y_mx
            });
            if (current_point <= total_point) {
                current_point++;
            }
        }
        return data;
    }

    /**更新数据**/
    function getData() {
        var current_x = x_arr[current_point];

        //获取最大值
        var series_mx = chart.series[0];
        var y_mx = Math.random() * (orginPrice * (1 + 0.1) - orginPrice * (1 - 0.1)) + orginPrice * (1 - 0.1);

        series_mx.addPoint([current_point, y_mx], true, false);

        current_point++;

        if (current_point <= total_point) {
            window.setTimeout(getData, TIMEOUT);
        }
    }

    /**绘制图标**/
    $(function() {
        $(document).ready(function() {
            setXArr();
            setYArr();

            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'trend',
                    /**目标区域**/
                    type: 'line',
                    marginTop: 30,
                    marginBottom: 30,
                    marginLeft: 60,
                    marginRight: 60,
                    events: {
                        load: loadTime
                    }
                },
                credits: {
                    enabled: false //不显示highCharts版权信息
                },
                title: {
                    text: '',
                    enabled: false
                },
                subtitle: {
                    enabled: false
                },
                xAxis: {
                    /*                 type:"datetime", */
                    /**刻度集合**/
                    categories: x_arr,
                    /**数据刻度 1分钟  每60s请求一次数据**/
                    /* tickInterval:1000*60, */
                    /**总共的点数**/
                    max: total_point,
                    min: 0,
                    /**显示的坐标**/
                    tickPositions: [3, 9, 15, 21, 27],

                },
                yAxis: [{
                    /*  categories:y_arr, */
                    tickmarkPlacement: 'on',
                    /**数值显示在刻度上还是中间**/
                    max: ymax,
                    min: ymin,
                    step: ystep,
                    showFirstLabel: true,
                    title: {
                        enabled: false
                    },
                    allowDecimals: true,
                    labels: {
                        formatter: function() {
                            if (this.value > orginPrice) {
                                return '<span style="fill: red;">' + Highcharts.numberFormat(this.value, 2, '.') + '</span>';
                            } else if (this.value < orginPrice) {
                                return '<span style="fill: green;">' + Highcharts.numberFormat(this.value, 2, '.') + '</span>';
                            } else if (this.value = orginPrice) {
                                return '<span style="fill: black;">' + Highcharts.numberFormat(this.value, 2, '.') + '</span>';
                            } else {
                                return this.value;
                            }
                        }
                    }
                },
                {
                    /*  categories:y_arr, */
                    tickmarkPlacement: 'on',
                    /**数值显示在刻度上还是中间**/
                    max: (orginPrice * (1 + 0.1)).toFixed(2),
                    min: (orginPrice * (1 - 0.1)).toFixed(2),
                    step: orginPrice * (1 + 0.05),
                    showFirstLabel: true,
                    title: {
                        enabled: false
                    },
                    allowDecimals: true,
                    opposite: true,
                    /**该条y轴是反向的，即位于右边**/
                    labels: {
                        formatter: function() {
                            if (this.value > orginPrice) {
                                return '<span style="fill: red;">' + '+' + Highcharts.numberFormat((this.value / orginPrice - 1) * 100, 2, '.') + '%' + '</span>';
                            } else if (this.value < orginPrice) {
                                return '<span style="fill: green;">' + '-' + Highcharts.numberFormat((1 - this.value / orginPrice) * 100, 2, '.') + '%' + '</span>';
                            } else if (this.value = orginPrice) {
                                return '<span style="fill: black;">' + '+' + Highcharts.numberFormat((1 - this.value / orginPrice) * 100, 2, '.') + '%' + '</span>';
                            } else {
                                return this.value;
                            }
                        }
                    }

                }],
                tooltip: {
                    formatter: function() {
                        var drift;
                        if (this.y > orginPrice) {
                            drift = '<span style="fill: red;">' + '+' + Highcharts.numberFormat((this.y / orginPrice - 1) * 100, 2, '.') + '%' + '</span>';
                        } else if (this.y < orginPrice) {
                            drift = '<span style="fill: green;">' + '-' + Highcharts.numberFormat((1 - this.y / orginPrice) * 100, 2, '.') + '%' + '</span>';
                        } else if (this.y = orginPrice) {
                            drift = '<span style="fill: black;">' + '+' + Highcharts.numberFormat((1 - this.y / orginPrice) * 100, 2, '.') + '%' + '</span>';
                        } else {
                            drift = this.y;
                        }

                        return '<b>' + this.series.name + '  ' + this.x + '</b><br/>' + '   开盘：' + orginPrice + '  价格：' + Highcharts.numberFormat(this.y, 2, '.') + '  涨幅：' + drift;
                    }
                },
                legend: {
                    /**图例**/

                    enabled: false
                },
                plotOptions: {
                    /**填充颜色**/
                    line: {
                                                lineWidth: 0.5,
                        marker: {
                            radius: 1,
                            enabled: false
                        },
                        states: {
                            hover: {
                                lineWidth: 0.5
                            }
                        },
                        threshold: null
                    }
                },
                exporting: {
                    /**是否允许输出**/
                    enabled: false
                },

                series: [                {
                    name: '|',
                    type: 'line',
                    data: []
                }]
            });
        });
        $("#btn-today").removeClass("active");
        $("#btn-week").removeClass("active");
        $("#btn-month").addClass("active");
        $("#btn-today").click(function() {
            creatChart();
        });
        $("#btn-week").click(function() {
            creatChartForWeek();
        });
    });

}