document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/inventory')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#inventory-table tbody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.partCode}</td>
                    <td>${item.itemName}</td>
                    <td>${item.quantity}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}); 