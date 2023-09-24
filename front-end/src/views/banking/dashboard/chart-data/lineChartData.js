let lineChartData = (chartData) => {
    return {
        type: 'line',
        height: 90,
        options: {
            chart: {
                sparkline: {
                    enabled: true
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#fff'],
            fill: {
                type: 'solid',
                opacity: 1
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            yaxis: {
                forceNiceScale: true
            },
            tooltip: {
                theme: 'dark',
                fixed: {
                    enabled: false
                },
                x: {
                    show: false
                },
                y: {
                    title: 'Total Spending'
                },
                marker: {
                    show: false
                }
            }
        },
        series: [
            {
                name: chartData.name,
                data: chartData.data
            }
        ]
    };
};

export default lineChartData;
