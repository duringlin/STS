function creatChart() {

    var chart;
    var x_arr = [];
    var y_arr = [];
    var orginPrice =6.82;
    /**绘制图标**/
    $(function() {
        $(document).ready(function() {
            setXArr();
            setYArr();

            /**压缩x轴显示的标签数量**/
            var xLen = x_arr.length,
            maxLabelNum = 6,
            //x轴上最多显示的label个数，过多就会挤在一起
            step = Math.round(xLen / maxLabelNum) < 1 ? 1 : Math.round(xLen / maxLabelNum);

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
                    max: 240,
                    /**以每分钟取一次记录算，股市交易时间一共241个点**/
                    min: 0,
                    tickPixelInterval: 200,
                    /**坐标密度**/
                    tickInterval: step,
                    tickmarkPlacement: 'on'
                    /**数值显示在刻度上还是中间**/
                },
                yAxis: [{
                    /*  categories:y_arr, */
                    tickmarkPlacement: 'on',
                    /**数值显示在刻度上还是中间**/
                    max: orginPrice * (1 + 0.1),
                    min: orginPrice * (1 - 0.1),
                    step: orginPrice * (1 + 0.05),
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
                                drift= '<span style="fill: red;">' + '+' + Highcharts.numberFormat((this.y / orginPrice - 1) * 100, 2, '.') + '%' + '</span>';
                            } else if (this.y < orginPrice) {
                                drift= '<span style="fill: green;">' + '-' + Highcharts.numberFormat((1 - this.y / orginPrice) * 100, 2, '.') + '%' + '</span>';
                            } else if (this.y = orginPrice) {
                                drift= '<span style="fill: black;">' + '+' + Highcharts.numberFormat((1 - this.y / orginPrice) * 100, 2, '.') + '%' + '</span>';
                            } else {
                                drift= this.y;
                            }

                        return '<b>' + this.series.name + '  ' + this.x + '</b><br/>' +'   开盘：'+orginPrice+ '  价格：' + Highcharts.numberFormat(this.y, 2, '.') + '  涨幅：'+drift;
                    }
                },
                legend: {
                    /**图例**/

                    enabled: false
                },
                plotOptions: {
                    /**填充颜色**/
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0
                            },
                            stops: [

                            [0, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]]
                        },
                        lineWidth: 1,
                        marker: {
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

                series: [{
                    /**数据列选项**/
                    name: Highcharts.dateFormat('%Y-%m-%d', new Date()),
                    type: 'area',
                    data: [],
                    yAxis: 1
                },
                {
                    name: Highcharts.dateFormat('%Y-%m-%d', new Date()),
                    type: 'area',
                    data: []
                }]
            });
        });

    });

    var total_point = 240;
    /**一共的点数**/
    var current_point = 0;
    /**当前的点数**/
    var TIMEOUT = 1000;
    /**间隔多久获取一次数据**/

    function loadTime() {
        window.setTimeout(getData, TIMEOUT);
    }

    function setXArr() {
        var hour = 9;
        var minutes = 30;
        var xArr;
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
                if (minutes < 10) {
                    xArr = i + ":0" + minutes;
                } else {
                    xArr = i + ":" + minutes;
                }
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

}