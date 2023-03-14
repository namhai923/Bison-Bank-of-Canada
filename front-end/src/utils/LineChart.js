import months from 'assets/data/months';

let LineChart = (type, data) => {
    let current = new Date();

    let name = '';
    if (type === 'month') {
        name = months[current.getMonth()];
    } else {
        name = current.getFullYear();
    }

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
                min: 0,
                max: 100
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
                    title: 'Total Order'
                },
                marker: {
                    show: false
                }
            }
        },
        series: [
            {
                name: name,
                data: data
            }
        ]
    };
};

export default LineChart;
