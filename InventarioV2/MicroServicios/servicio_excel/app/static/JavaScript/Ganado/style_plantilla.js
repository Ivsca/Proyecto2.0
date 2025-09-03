// =======================
// Datos de ejemplo para todos los campos
// =======================
const sampleData = {
    "CodigoCria": "001",
    "Foto": "foto.jpg",
    "Crias": "2",
    "LitrosLeche": 20,
    "CodigosCrias": "[002,003]",
    "CodigoPapa": "PAPA01",
    "CodigoMama": "MAMA01",
    "Edad": "3",
    "InfoVacunas": "Vacuna A, Vacuna B",
    "Enfermedades": "Ninguna",
    "Estado": "Activo",
    "IdParcela": "1",
    "Razas": "Holstein"
};

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const selectedList = document.getElementById('selected-columns');
const previewHead = document.getElementById('preview-head');
const previewData = document.getElementById('preview-data');

// Añadir/quitar columnas seleccionadas
checkboxes.forEach(chk => {
    chk.addEventListener('change', () => {
        const label = chk.parentElement.nextElementSibling.textContent;
        if (chk.checked) addColumnItem(chk.value, label);
        else removeColumnItem(chk.value);
        updatePreview();
    });
});

function addColumnItem(name, label) {
    // Evitar duplicados
    if (selectedList.querySelector(`[data-column="${name}"]`)) return;
    const div = document.createElement('div');
    div.className = 'column-item ui segment added';
    div.dataset.column = name;
    div.innerHTML = `
        <span>${label}</span>
        <i class="trash alternate outline icon remove-column" title="Quitar"></i>
    `;
    // Eliminar columna al hacer click en el bote de basura
    div.querySelector('.remove-column').addEventListener('click', () => {
        div.classList.add('removed');
        setTimeout(() => {
            removeColumnItem(name);
            document.querySelector(`input[value="${name}"]`).checked = false;
            updatePreview();
        }, 200);
    });
    selectedList.appendChild(div);
    setTimeout(() => div.classList.remove('added'), 300);
    updatePreview();
}

function removeColumnItem(name) {
    selectedList.querySelectorAll('.column-item').forEach(item => {
        if (item.dataset.column === name) item.remove();
    });
    updatePreview();
}

function updatePreview() {
    previewHead.innerHTML = '';
    previewData.innerHTML = '';
    selectedList.querySelectorAll('.column-item').forEach(item => {
        let colName = item.dataset.column;
        let label = item.querySelector('span').textContent;
        previewHead.innerHTML += `<th>${label}</th>`;
        let val = sampleData[colName] || '';
        if (colName === "LitrosLeche") {
            let color = val < 15 ? 'red' : 'green';
            previewData.innerHTML += `<td style="color:${color}">${val}L</td>`;
        } else if (colName === "Foto") {
            previewData.innerHTML += `<td><img src="/media/${val}" alt="Foto" style="height:40px;border-radius:4px;"></td>`;
        } else {
            previewData.innerHTML += `<td>${val}</td>`;
        }
    });
}

// Drag & drop con SortableJS (sin handle, arrastra todo el contenedor)
new Sortable(selectedList, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    onEnd: updatePreview
});