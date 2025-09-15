// =======================
// Datos de ejemplo (CULTIVOS)
// =======================
const sampleData = {
    "Nombre": "Tomate Cherry",
    "Tipo": "Fruta",
    "Fecha de Siembra": "2025-01-10",
    "Fecha de Cosecha": "2025-03-20",
    "Cantidad": 250,
    "Fertilizante": "NPK 20-20-20"
};

// =======================
// Selección de columnas
// =======================
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const selectedList = document.getElementById('selected-columns');
const previewHead = document.getElementById('preview-head');
const previewData = document.getElementById('preview-data');

checkboxes.forEach(chk => {
    chk.addEventListener('change', () => {
        if (chk.checked) addColumnItem(chk.value);
        else removeColumnItem(chk.value);
        updatePreview();
    });
});

function addColumnItem(name) {
    const div = document.createElement('div');
    div.className = 'column-item';
    div.dataset.column = name;
    div.innerHTML = `${name} <i class="trash icon"></i>`;
    div.querySelector('i').addEventListener('click', () => {
        removeColumnItem(name);
        document.querySelector(`input[value="${name}"]`).checked = false;
        updatePreview();
    });
    selectedList.appendChild(div);
}

function removeColumnItem(name) {
    selectedList.querySelectorAll('.column-item').forEach(item => {
        if (item.dataset.column === name) item.remove();
    });
}

function updatePreview() {
    previewHead.innerHTML = '';
    previewData.innerHTML = '';
    selectedList.querySelectorAll('.column-item').forEach(item => {
        let colName = item.dataset.column;
        previewHead.innerHTML += `<th>${colName}</th>`;
        let val = sampleData[colName] || '';
        if (colName === "Cantidad") {
            let color = val < 100 ? 'red' : 'green';
            previewData.innerHTML += `<td style="color:${color}">${val}</td>`;
        } else {
            previewData.innerHTML += `<td>${val}</td>`;
        }
    });
}

// Hacer columnas arrastrables
new Sortable(selectedList, { animation: 150, onEnd: updatePreview });
