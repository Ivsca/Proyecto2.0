// =======================
// Datos de ejemplo
// =======================
const sampleData = {
    "ID": "001",
    "Código": "VAC123",
    "Raza": "Holstein",
    "Litros de Leche": 20,
    "Crias": "2",
    "Fecha de Parto": "2025-08-15"
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
        if (colName === "Litros de Leche") {
            let color = val < 15 ? 'red' : 'green';
            previewData.innerHTML += `<td style="color:${color}">${val}L</td>`;
        } else {
            previewData.innerHTML += `<td>${val}</td>`;
        }
    });
}

// Hacer columnas arrastrables
new Sortable(selectedList, { animation: 150, onEnd: updatePreview });