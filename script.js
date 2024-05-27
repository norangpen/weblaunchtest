document.addEventListener('DOMContentLoaded', function () {
    function fetchRobotPosition() {
        fetch('http://localhost:3000/robot-position')
            .then(response => response.json())
            .then(data => {
                const positionElement = document.getElementById('coordinates');
                positionElement.textContent = `x: ${data.x}, y: ${data.y}, z: ${data.z}`;
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // 3�ʸ��� �κ��� ��ġ�� ������Ʈ
    setInterval(fetchRobotPosition, 3000);
    // �������� �ε�Ǹ� ��� �� �� ��ġ�� ������
    fetchRobotPosition();
});