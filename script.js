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

    // 3초마다 로봇의 위치를 업데이트
    setInterval(fetchRobotPosition, 3000);
    // 페이지가 로드되면 즉시 한 번 위치를 가져옴
    fetchRobotPosition();
});