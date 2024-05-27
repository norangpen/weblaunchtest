document.addEventListener('DOMContentLoaded', function () {
    let coordinateHistory = {
        x: [],
        y: [],
        z: []
    };

    function fetchRobotPosition() {
        // �� ���������� ���� �����͸� �������� ��� ������ �����͸� �����մϴ�.
        // ���� �����ʹ� �������� �����;� �մϴ�.
        const position = {
            x: (Math.random() * 100).toFixed(2),
            y: (Math.random() * 100).toFixed(2),
            z: (Math.random() * 100).toFixed(2)
        };
        updateCoordinateHistory(position);
    }

    function updateCoordinateHistory(position) {
        coordinateHistory.x.push(position.x);
        coordinateHistory.y.push(position.y);
        coordinateHistory.z.push(position.z);
        updateChart();
    }

    function updateChart() {
        chart.data.labels.push(coordinateHistory.x.length);
        chart.data.datasets[0].data = coordinateHistory.x;
        chart.data.datasets[1].data = coordinateHistory.y;
        chart.data.datasets[2].data = coordinateHistory.z;
        chart.update();
    }

    // 3�ʸ��� �κ� ��ġ�� ������Ʈ
    setInterval(fetchRobotPosition, 3000);

    // Chart.js �ʱ�ȭ
    const ctx = document.getElementById('coordinateHistoryChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'X Coordinate',
                    data: [],
                    borderColor: 'red',
                    fill: false
                },
                {
                    label: 'Y Coordinate',
                    data: [],
                    borderColor: 'green',
                    fill: false
                },
                {
                    label: 'Z Coordinate',
                    data: [],
                    borderColor: 'blue',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Coordinate Value'
                    }
                }
            }
        }
    });
});