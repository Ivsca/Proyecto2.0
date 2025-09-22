// =========================[ REGION: Variables globales ]========================
// Variables para el formulario multipaso de ganado
let currentStep = 1;
const totalSteps = 3;
let diseases = [];
let vaccines = [];
let selectedOffspring = []; // Lista de códigos de crías seleccionadas

// =========================[ REGION: Inicialización principal ]========================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnOpenForm').addEventListener('click', openForm);
});

// =========================[ REGION: Modal de registro de ganado ]========================
/**
 * Abre el formulario de registro de ganado en un modal SweetAlert2.
 */
async function openForm() {
    const formContent = document.getElementById('formModal').cloneNode(true);
    formContent.style.display = 'block';

    await Swal.fire({
        title: 'Registro de Vacuno',
        html: formContent,
        width: '80%',
        heightAuto: false,
        padding: '2em',
        showConfirmButton: false,
        showCloseButton: true,
        allowOutsideClick: false,
        backdrop: 'rgba(16,185,129,0.15)',
        customClass: {
            popup: 'registro-vacuno-popup'
        },
        didOpen: () => {
            initForm(Swal.getHtmlContainer());
        }
    });
}

// =========================[ REGION: Formulario multipaso - Inicialización ]========================
/**
 * Inicializa el formulario multipaso, listeners y lógica de campos dinámicos.
 * @param {HTMLElement} container - Contenedor del formulario dentro del modal.
 */
function initForm(container) {
    currentStep = 1;
    diseases = [];
    vaccines = [];
    selectedOffspring = [];
    updateProgressBar(container);

    // --- VISTA PREVIA DE IMAGEN ---
    const inputImg = container.querySelector('#cattleImage');
    const preview = container.querySelector('#imagePreview');
    const btnSelectImage = container.querySelector('#btnSelectImage');
    if (btnSelectImage && inputImg) {
        btnSelectImage.addEventListener('click', function() {
            inputImg.click();
        });
    }
    if (inputImg && preview) {
        inputImg.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                // Solo permitir imágenes
                if (!file.type.startsWith('image/')) {
                    Swal.fire('Archivo inválido', 'Solo se permiten imágenes (jpg, png, jpeg, gif, etc).', 'error');
                    event.target.value = '';
                    preview.innerHTML = `
                        <div class="placeholder">
                            <i class="fas fa-camera"></i>
                            <p>Seleccione una imagen</p>
                        </div>
                    `;
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Previsualización" style="width:100%;height:100%;object-fit:cover;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                    `;
                }
                reader.readAsDataURL(file);
            } else {
                preview.innerHTML = `
                    <div class="placeholder">
                        <i class="fas fa-camera"></i>
                        <p>Seleccione una imagen</p>
                    </div>
                `;
            }
        });
    }

    container.querySelector('#cattleForm').addEventListener('submit', submitForm);

    container.querySelectorAll('[onclick="nextStep()"]').forEach(btn => {
        btn.onclick = nextStep;
    });
    container.querySelectorAll('[onclick="prevStep()"]').forEach(btn => {
        btn.onclick = prevStep;
    });

    container.querySelector('#btnNoDiseases').onclick = () => disableDiseaseInputs(container);
    container.querySelector('#btnHasDiseases').onclick = () => enableDiseaseInputs(container);
    container.querySelector('#btnAddDisease').onclick = () => addDisease(container);
    container.querySelector('#btnAddVaccine').onclick = () => addVaccine(container);

    // Mostrar/ocultar inputs de vacunas
    container.querySelector('#btnNoVaccines').onclick = () => {
        container.querySelector('#vaccineSection').style.display = 'none';
        vaccines = [];
        updateVaccinesList(container);
    };
    container.querySelector('#btnHasVaccines').onclick = () => {
        container.querySelector('#vaccineSection').style.display = 'block';
    };

    // Actualizar resumen antes de mostrar el paso 3
    container.querySelector('#step3').addEventListener('click', function() {
        updateSummary(container);
    });

    // --- Buscador y lista dinámica de crías ---
    const inputOffspring = container.querySelector('#offspringSearch');
    const selectOffspring = container.querySelector('#select-offspring');
    const btnAddOffspring = container.querySelector('#btnAddOffspring');
    const offspringList = container.querySelector('#offspringList');
    const offspringCodes = container.querySelector('#offspringCodes');
    const offspringCount = container.querySelector('#offspringCount');

    if (inputOffspring && selectOffspring && btnAddOffspring && offspringList && offspringCodes && offspringCount) {
        inputOffspring.addEventListener('input', function () {
            const query = this.value.trim();
            if (query.length > 0) {
                fetch(`/Ganado/BuscarCodigo/?q=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        selectOffspring.innerHTML = '';
                        if (data.length > 0) {
                            data.forEach(item => {
                                // No permitir agregar duplicados
                                if (!selectedOffspring.includes(item.codigo)) {
                                    const option = document.createElement('option');
                                    option.value = item.codigo;
                                    option.textContent = item.codigo;
                                    selectOffspring.appendChild(option);
                                }
                            });
                        } else {
                            const option = document.createElement('option');
                            option.disabled = true;
                            option.textContent = `🔍 No existe: "${query}"`;
                            selectOffspring.appendChild(option);
                        }
                        selectOffspring.style.display = 'block';
                    });
            } else {
                selectOffspring.style.display = 'none';
                selectOffspring.innerHTML = '';
            }
        });

        selectOffspring.addEventListener('change', function () {
            const selectedText = this.options[this.selectedIndex].textContent;
            if (!this.options[this.selectedIndex].disabled) {
                inputOffspring.value = selectedText;
            }
            selectOffspring.style.display = 'none';
        });

        btnAddOffspring.addEventListener('click', function () {
            const code = inputOffspring.value.trim();
            if (code && !selectedOffspring.includes(code)) {
                selectedOffspring.push(code);
                updateOffspringList(container);
                inputOffspring.value = '';
                saveCattleFormState(container);
            }
        });
    }
}

// =========================[ REGION: Navegación multipaso ]========================
function nextStep() {
    if (currentStep < totalSteps) {
        const container = Swal.getHtmlContainer();
        container.querySelector(`#step${currentStep}`).classList.remove('active');
        currentStep++;
        container.querySelector(`#step${currentStep}`).classList.add('active');
        updateProgressBar(container);
        saveCattleFormState(container); // <--- aquí

        if (currentStep === 3) {
            updateSummary(container);
        }
    }
}
function prevStep() {
    if (currentStep > 1) {
        const container = Swal.getHtmlContainer();
        container.querySelector(`#step${currentStep}`).classList.remove('active');
        currentStep--;
        container.querySelector(`#step${currentStep}`).classList.add('active');
        updateProgressBar(container);
    }
}
function updateProgressBar(container) {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    container.querySelector('#progressBar').style.width = `${progressPercentage}%`;

    container.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });
}

// =========================[ REGION: Imagen ]========================
function previewImage(event) {
    const input = event.target;
    const container = Swal.getHtmlContainer();
    const preview = container.querySelector('#imagePreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Previsualización" style="width:100%;height:100%;object-fit:cover;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            `;
        }
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-camera"></i>
                <p>Seleccione una imagen</p>
            </div>
        `;
    }
}

// =========================[ REGION: Enfermedades ]========================
function disableDiseaseInputs(container) {
    container.querySelector('#diseaseSection').style.display = 'none';
    diseases = [];
    updateDiseasesList(container);
}
function enableDiseaseInputs(container) {
    container.querySelector('#diseaseSection').style.display = 'block';
}
function addDisease(container) {
    const disease = container.querySelector('#disease').value;
    const date = container.querySelector('#diseaseDate').value;

    if (!disease || !date) {
        Swal.fire('Error', 'Por favor complete todos los campos de la enfermedad', 'error');
        return;
    }

    diseases.push({ disease, date });
    updateDiseasesList(container);

    container.querySelector('#diseaseDate').value = '';
}
function updateDiseasesList(container) {
    const listContainer = container.querySelector('#diseasesList');
    listContainer.innerHTML = '';

    diseases.forEach((item, index) => {
        const diseaseItem = document.createElement('div');
        diseaseItem.className = 'list-item';
        diseaseItem.innerHTML = `
            <div>
                <strong>${item.disease}</strong> - ${item.date}
            </div>
            <button type="button" onclick="removeDisease(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        listContainer.appendChild(diseaseItem);
    });

    container.querySelector('#diseasesInput').value = JSON.stringify(diseases);
}
window.removeDisease = function(index) {
    const container = Swal.getHtmlContainer();
    diseases.splice(index, 1);
    updateDiseasesList(container);
}

// =========================[ REGION: Vacunas ]========================
function addVaccine(container) {
    const vaccine = container.querySelector('#vaccine').value;
    const amount = container.querySelector('#vaccineAmount').value;
    const date = container.querySelector('#vaccineDate').value;
    const type = container.querySelector('#vaccineType').value;

    if (!vaccine || !amount || !date) {
        Swal.fire('Error', 'Por favor complete todos los campos de la vacuna', 'error');
        return;
    }

    vaccines.push({ vaccine, amount, date, type });
    updateVaccinesList(container);

    container.querySelector('#vaccineAmount').value = '';
    container.querySelector('#vaccineDate').value = '';
}
function updateVaccinesList(container) {
    const listContainer = container.querySelector('#vaccinesList');
    listContainer.innerHTML = '';

    vaccines.forEach((item, index) => {
        const vaccineItem = document.createElement('div');
        vaccineItem.className = 'list-item';
        vaccineItem.innerHTML = `
            <div>
                <strong>${item.vaccine}</strong> - ${item.amount} dosis (${item.type}) - ${item.date}
            </div>
            <button type="button" onclick="removeVaccine(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        listContainer.appendChild(vaccineItem);
    });

    container.querySelector('#vaccinesInput').value = JSON.stringify(vaccines);
}
window.removeVaccine = function(index) {
    const container = Swal.getHtmlContainer();
    vaccines.splice(index, 1);
    updateVaccinesList(container);
}

// =========================[ REGION: Crías (offspring) ]========================
function updateOffspringList(container) {
    const offspringList = container.querySelector('#offspringList');
    const offspringCodes = container.querySelector('#offspringCodes');
    const offspringCount = container.querySelector('#offspringCount');
    offspringList.innerHTML = '';
    selectedOffspring.forEach((code, idx) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div>${code}</div>
            <button type="button" class="btn btn-danger btn-sm" data-idx="${idx}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        offspringList.appendChild(item);
    });
    offspringCodes.value = JSON.stringify(selectedOffspring);
    offspringCount.value = selectedOffspring.length;
    offspringList.querySelectorAll('button[data-idx]').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            selectedOffspring.splice(idx, 1);
            updateOffspringList(container);
            saveCattleFormState(container);
        });
    });
}

// =========================[ REGION: Resumen ]========================
function updateSummary(container) {
    const summaryContainer = container.querySelector('#summary');
    const formData = new FormData(container.querySelector('#cattleForm'));

    let summaryHTML = '<ul style="list-style-type: none; padding: 0;">';

    summaryHTML += '<li><strong>Código:</strong> ' + formData.get('CodigoCria') + '</li>';
    summaryHTML += '<li><strong>Edad:</strong> ' + formData.get('Edad') + ' meses</li>';
    summaryHTML += '<li><strong>Estado:</strong> ' + formData.get('Estado') + '</li>';
    summaryHTML += '<li><strong>Parcela ID:</strong> ' + formData.get('IdParcela') + '</li>';
    summaryHTML += '<li><strong>Madre:</strong> ' + formData.get('CodigoMama') + '</li>';
    summaryHTML += '<li><strong>Padre:</strong> ' + formData.get('CodigoPapa') + '</li>';

    const breed1 = container.querySelector('#breed1').value;
    const breed2 = container.querySelector('#breed2').value;
    let breedComposition = breed1;
    if (breed2) breedComposition += ' con ' + breed2;
    summaryHTML += '<li><strong>Raza:</strong> ' + breedComposition + '</li>';

    if (diseases.length > 0) {
        summaryHTML += '<li><strong>Enfermedades:</strong><ul>';
        diseases.forEach(item => {
            summaryHTML += '<li>' + item.disease + ' (' + item.date + ')</li>';
        });
        summaryHTML += '</ul></li>';
    }
    if (vaccines.length > 0) {
        summaryHTML += '<li><strong>Vacunas:</strong><ul>';
        vaccines.forEach(item => {
            summaryHTML += '<li>' + item.vaccine + ' - ' + item.amount + ' dosis (' + item.type + ') - ' + item.date + '</li>';
        });
        summaryHTML += '</ul></li>';
    }
    summaryHTML += '<li><strong>Cantidad de crías:</strong> ' + (container.querySelector('#offspringCount').value || 0) + '</li>';
    summaryHTML += '<li><strong>Códigos de crías:</strong> ' + (container.querySelector('#offspringCodes').value || '') + '</li>';

    summaryHTML += '</ul>';

    summaryContainer.innerHTML = summaryHTML;
}

// =========================[ REGION: Envío del formulario ]========================
function submitForm(event) {
    event.preventDefault();
    const container = Swal.getHtmlContainer();

    // Actualizar los campos ocultos con JSON
    container.querySelector('#diseasesInput').value = JSON.stringify(diseases);
    container.querySelector('#vaccinesInput').value = JSON.stringify(vaccines);
    container.querySelector('#offspringCodes').value = JSON.stringify(selectedOffspring);
    container.querySelector('#offspringCount').value = selectedOffspring.length;

    // Actualizar composición racial
    const breed1 = container.querySelector('#breed1').value;
    const breed2 = container.querySelector('#breed2').value;
    let breedComposition = breed1;
    if (breed2) breedComposition += ' con ' + breed2;
    container.querySelector('#breedComposition').value = breedComposition;

    Swal.fire({
        title: '¿Confirmar registro?',
        text: '¿Está seguro que desea registrar este vacuno?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Enviar el formulario por AJAX usando FormData
            const form = container.querySelector('#cattleForm');
            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // 1. Construye la tarjeta HTML del nuevo vacuno
                    const formDataObj = Object.fromEntries(formData.entries());
                    const cardHtml = `
                    <div class="col-lg-4 col-md-6 mb-4 ganado-item"
                        data-codigo="${(formDataObj.CodigoCria || '').toLowerCase()}"
                        data-raza="${(formDataObj.Razas || '').toLowerCase()}">
                        <div class="card ganado-card h-100 position-relative">
                            ${formData.get('Foto') && formData.get('Foto').name ? `
                                <img src="${URL.createObjectURL(formData.get('Foto'))}" class="card-img-top" alt="${formDataObj.CodigoCria || ''}">
                            ` : `
                                <img src="/static/Image/img/fondo_vaca.jpg" class="card-img-top" alt="${formDataObj.CodigoCria || ''}">
                            `}
                            <span class="ganado-code">${formDataObj.CodigoCria || 'G-001'}</span>
                            <div class="ganado-overlay">
                                <div class="ganado-info">
                                    <h5 class="card-title">${formDataObj.CodigoCria || 'G-001'}</h5>
                                    <p><strong>Raza:</strong> ${formDataObj.Razas || 'Angus'}</p>
                                    <p><strong>Edad:</strong> ${formDataObj.Edad || '3'} años</p>
                                    <p><strong>Estado:</strong> ${formDataObj.Estado || 'Saludable'}</p>
                                    <p><strong>Padre:</strong> ${formDataObj.CodigoPapa || 'N/A'}</p>
                                    <p><strong>Madre:</strong> ${formDataObj.CodigoMama || 'N/A'}</p>
                                    <p><strong>Crias:</strong> ${formDataObj.Crias || '0'}</p>
                                </div>
                                <div class="ganado-buttons">
                                    <button class="btn btn-primary" onclick="abrirFormularioVer('${formDataObj.CodigoCria}')">
                                        <i class="fas fa-eye"></i> Ver
                                    </button>
                                    <button class="btn btn-warning" onclick="mostrarFormularioEditar('${formDataObj.CodigoCria}')">
                                        <i class="fas fa-edit"></i> Editar
                                    </button>
                                    <button class="btn btn-danger" onclick="EliminarVacuno('${data.id}')">
                                        <i class="fas fa-trash-alt"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                    // 2. Inserta la tarjeta al final de la lista
                    const row = document.querySelector('.row.justify-content-center');
                    if (row) {
                        row.insertAdjacentHTML('beforeend', cardHtml);
                    }

                    // 3. Limpia el formulario y muestra el mensaje de éxito
                    Swal.fire(
                        '¡Registro exitoso!',
                        'El vacuno ha sido registrado correctamente.',
                        'success'
                    ).then(() => {
                        form.reset();
                        container.querySelector('#imagePreview').innerHTML = `
                            <div class="placeholder">
                                <i class="fas fa-camera"></i>
                                <p>Seleccione una imagen</p>
                            </div>`;
                        diseases = [];
                        vaccines = [];
                        selectedOffspring = [];
                        updateDiseasesList(container);
                        updateVaccinesList(container);
                        updateOffspringList(container);
                        currentStep = 1;
                        updateProgressBar(container);
                    });
                } else {
                    Swal.fire('Error', data.error || 'No se pudo registrar el vacuno.', 'error');
                }
            })
            .catch(() => {
                Swal.fire('Error', 'Ocurrió un error al registrar el vacuno.', 'error');
            });
        }
    });
}

// =========================[ REGION: Buscador madre/padre ]========================
/**
 * Autocompletado para los campos de madre y padre.
 */
function setupBuscadorGanado(container) {
    // Madre
    const inputMadre = container.querySelector('#motherCode');
    const selectMadre = container.querySelector('#select-madre');
    if (inputMadre && selectMadre) {
        inputMadre.addEventListener('input', function () {
            const query = this.value.trim();
            if (query.length > 0) {
                fetch(`/Ganado/BuscarCodigo/?q=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        selectMadre.innerHTML = '';
                        if (data.length > 0) {
                            data.forEach(item => {
                                const option = document.createElement('option');
                                option.value = item.codigo;
                                option.textContent = item.codigo;
                                selectMadre.appendChild(option);
                            });
                        } else {
                            const option = document.createElement('option');
                            option.disabled = true;
                            option.textContent = `🔍 No existe: "${query}"`;
                            selectMadre.appendChild(option);
                        }
                        selectMadre.style.display = 'block';
                    });
            } else {
                selectMadre.style.display = 'none';
                selectMadre.innerHTML = '';
            }
        });
        selectMadre.addEventListener('change', function () {
            const selectedText = this.options[this.selectedIndex].textContent;
            if (!this.options[this.selectedIndex].disabled) {
                inputMadre.value = selectedText;
            }
            selectMadre.style.display = 'none';
        });
        inputMadre.addEventListener('blur', function () {
            setTimeout(() => { selectMadre.style.display = 'none'; }, 200);
        });
        selectMadre.addEventListener('blur', function () {
            selectMadre.style.display = 'none';
        });
    }

    // Padre
    const inputPadre = container.querySelector('#fatherCode');
    const selectPadre = container.querySelector('#select-padre');
    if (inputPadre && selectPadre) {
        inputPadre.addEventListener('input', function () {
            const query = this.value.trim();
            if (query.length > 0) {
                fetch(`/Ganado/BuscarCodigo/?q=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        selectPadre.innerHTML = '';
                        if (data.length > 0) {
                            data.forEach(item => {
                                const option = document.createElement('option');
                                option.value = item.codigo;
                                option.textContent = item.codigo;
                                selectPadre.appendChild(option);
                            });
                        } else {
                            const option = document.createElement('option');
                            option.disabled = true;
                            option.textContent = `🔍 No existe: "${query}"`;
                            selectPadre.appendChild(option);
                        }
                        selectPadre.style.display = 'block';
                    });
            } else {
                selectPadre.style.display = 'none';
                selectPadre.innerHTML = '';
            }
        });
        selectPadre.addEventListener('change', function () {
            const selectedText = this.options[this.selectedIndex].textContent;
            if (!this.options[this.selectedIndex].disabled) {
                inputPadre.value = selectedText;
            }
            selectPadre.style.display = 'none';
        });
        inputPadre.addEventListener('blur', function () {
            setTimeout(() => { selectPadre.style.display = 'none'; }, 200);
        });
        selectPadre.addEventListener('blur', function () {
            selectPadre.style.display = 'none';
        });
    }
}

// =========================[ REGION: Guardar/cargar estado multipaso ]========================
function saveCattleFormState(container) {
    const form = container.querySelector('#cattleForm');
    const data = {};
    new FormData(form).forEach((value, key) => data[key] = value);

    // Guardar steps dinámicos
    data['diseases'] = diseases;
    data['vaccines'] = vaccines;
    data['selectedOffspring'] = container.selectedOffspring || [];

    localStorage.setItem('cattleFormState', JSON.stringify(data));
}
function loadCattleFormState(container) {
    const state = localStorage.getItem('cattleFormState');
    if (!state) return;
    const data = JSON.parse(state);
    const form = container.querySelector('#cattleForm');
    Object.keys(data).forEach(key => {
        if (form.elements[key]) {
            form.elements[key].value = data[key];
        }
    });
    // Restaurar steps dinámicos
    diseases = data['diseases'] || [];
    vaccines = data['vaccines'] || [];
    container.selectedOffspring = data['selectedOffspring'] || [];
}

// =========================[ REGION: Multipaso - integración y eventos ]========================
const originalInitForm = window.initForm;
window.initForm = function(container) {
    if (originalInitForm) originalInitForm(container);
    setupBuscadorGanado(container);
    loadCattleFormState(container);
    updateDiseasesList(container);
    updateVaccinesList(container);
    if (container.selectedOffspring) {
        updateOffspringList(container);
    }
    container.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('change', () => saveCattleFormState(container));
    });
};
localStorage.removeItem('cattleFormState');

// =========================[ REGION: Edición de vacuno (abrir y actualizar) ]========================

/**
 * Abre el formulario de edición para el vacuno con el código dado.
 * Carga los datos y permite actualizar por AJAX.
 */
window.mostrarFormularioEditar = function(codigoCria) {
    // Buscar el ID del vacuno por código
    fetch(`/Ganado/BuscarCodigo/?q=${encodeURIComponent(codigoCria)}`)
        .then(response => response.json())
        .then(data => {
            if (!data.length) {
                Swal.fire('Error', 'No se encontró el vacuno.', 'error');
                return;
            }
            const vacunoId = data[0].id;
            // Obtener datos completos del vacuno
            fetch(`/Ganado/api/obtener/${vacunoId}/`)
                .then(r => r.json())
                .then(vacuno => {
                    // Clona el formulario y lo muestra en el modal
                    const formContent = document.getElementById('formModal').cloneNode(true);
                    formContent.style.display = 'block';

                    Swal.fire({
                        title: 'Editar Vacuno',
                        html: formContent,
                        width: '80%',
                        heightAuto: false,
                        padding: '2em',
                        showConfirmButton: false,
                        showCloseButton: true,
                        allowOutsideClick: false,
                        backdrop: 'rgba(16,185,129,0.15)',
                        customClass: {
                            popup: 'registro-vacuno-popup'
                        },
                        didOpen: () => {
                            const container = Swal.getHtmlContainer();
                            initForm(container);

                            // Rellenar campos
                            container.querySelector('#cattleForm').setAttribute('action', `/actualizar_ganado/${vacuno.id}/`);
                            container.querySelector('#cattleCode').value = vacuno.codigocria || '';
                            container.querySelector('#cattleAge').value = vacuno.edad || '';
                            container.querySelector('#cattleState').value = vacuno.estado || '';
                            container.querySelector('#parcelId').value = vacuno.idparcela || '';
                            container.querySelector('#motherCode').value = vacuno.codigomama || '';
                            container.querySelector('#fatherCode').value = vacuno.codigopapa || '';
                            // Rellenar razas
                            if (vacuno.razas) {
                                const [breed1, breed2] = vacuno.razas.split(' con ');
                                if (breed1) container.querySelector('#breed1').value = breed1;
                                if (breed2) container.querySelector('#breed2').value = breed2;
                                container.querySelector('#breedComposition').value = vacuno.razas;
                            }
                            // Enfermedades, vacunas y crías
                            diseases = JSON.parse(vacuno.enfermedades || '[]');
                            vaccines = JSON.parse(vacuno.infovacunas || '[]');
                            selectedOffspring = JSON.parse(vacuno.codigoscrias || '[]');
                            updateDiseasesList(container);
                            updateVaccinesList(container);
                            updateOffspringList(container);

                            // Imagen previa: muestra la imagen anterior y el input para cambiarla debajo
                            const imagePreview = container.querySelector('#imagePreview');
                            const inputImg = container.querySelector('#cattleImage');
                            const btnSelectImage = container.querySelector('#btnSelectImage');

                            if (vacuno.foto) {
                                imagePreview.innerHTML = `
                                    <img src="${vacuno.foto}" alt="Imagen actual" style="width:100%;height:100%;object-fit:cover;border-radius:12px;margin-bottom:8px;">
                                    <div style="font-size:13px;color:#888;">Imagen actual</div>
                                `;
                            } else {
                                imagePreview.innerHTML = `
                                    <div class="placeholder">
                                        <i class="fas fa-camera"></i>
                                        <p>Seleccione una imagen</p>
                                    </div>
                                `;
                            }

                            // Asegúrate de que el input y el botón estén visibles y funcionales
                            inputImg.classList.remove('d-none');
                            btnSelectImage.onclick = function() {
                                inputImg.click();
                            };
                            inputImg.onchange = function(event) {
                                const file = event.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = function(e) {
                                        imagePreview.innerHTML = `
                                            <img src="${e.target.result}" alt="Previsualización" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">
                                        `;
                                    };
                                    reader.readAsDataURL(file);
                                }
                            };

                            // Cambia el submit para actualizar
                            container.querySelector('#cattleForm').onsubmit = function(e) {
                                e.preventDefault();
                                actualizarVacuno(vacuno.id, container);
                            };
                        }
                    });
                });
        });
};

/**
 * Envía el formulario de actualización de vacuno por AJAX.
 */
function actualizarVacuno(id, container) {
    // Actualiza los campos ocultos
    container.querySelector('#diseasesInput').value = JSON.stringify(diseases);
    container.querySelector('#vaccinesInput').value = JSON.stringify(vaccines);
    container.querySelector('#offspringCodes').value = JSON.stringify(selectedOffspring);
    container.querySelector('#offspringCount').value = selectedOffspring.length;

    // Composición racial
    const breed1 = container.querySelector('#breed1').value;
    const breed2 = container.querySelector('#breed2').value;
    let breedComposition = breed1;
    if (breed2) breedComposition += ' con ' + breed2;
    container.querySelector('#breedComposition').value = breedComposition;

    const form = container.querySelector('#cattleForm');
    const formData = new FormData(form);

    fetch(`/actualizar_ganado/${id}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            Swal.fire('¡Actualizado!', 'El vacuno ha sido actualizado correctamente.', 'success')
                .then(() => window.location.reload());
        } else {
            Swal.fire('Error', data.error || 'No se pudo actualizar el vacuno.', 'error');
        }
    })
    .catch(() => {
        Swal.fire('Error', 'Ocurrió un error al actualizar el vacuno.', 'error');
    });
}

// =========================[ REGION: Ver detalles de vacuno ]========================

/**
 * Muestra un modal con los detalles completos del vacuno.
 */
window.abrirFormularioVer = function(codigoCria) {
    fetch(`/Ganado/BuscarCodigo/?q=${encodeURIComponent(codigoCria)}`)
        .then(response => response.json())
        .then(data => {
            if (!data.length) {
                Swal.fire('Error', 'No se encontró el vacuno.', 'error');
                return;
            }
            const vacunoId = data[0].id;
            fetch(`/Ganado/api/obtener/${vacunoId}/`)
                .then(r => r.json())
                .then(vacuno => {
                    let enfermedades = [];
                    let vacunas = [];
                    let crias = [];
                    try {
                        enfermedades = JSON.parse(vacuno.enfermedades || '[]');
                        vacunas = JSON.parse(vacuno.infovacunas || '[]');
                        crias = JSON.parse(vacuno.codigoscrias || '[]');
                    } catch {}

                    // Tabla de enfermedades
                    let enfermedadesTable = `
                        <table style="width:100%;border-collapse:collapse;margin-bottom:12px;font-size:1.05rem;">
                            <thead>
                                <tr style="background:#f3f4f6;">
                                    <th style="padding:8px 6px;border-bottom:2px solid #ef4444;text-align:left;">Enfermedad</th>
                                    <th style="padding:8px 6px;border-bottom:2px solid #ef4444;text-align:left;">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${
                                    enfermedades.length
                                    ? enfermedades.map(e => `
                                        <tr>
                                            <td style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">${e.disease}</td>
                                            <td style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">${e.date}</td>
                                        </tr>
                                    `).join('')
                                    : `<tr><td colspan="2" style="color:#059669;padding:8px;text-align:center;">No hay enfermedades registradas</td></tr>`
                                }
                            </tbody>
                        </table>
                    `;

                    // Tabla de vacunas
                    let vacunasTable = vacunas.length ? `
                        <table style="width:100%;border-collapse:collapse;font-size:1.05rem;">
                            <thead>
                                <tr style="background:#f3f4f6;">
                                    <th style="padding:8px 6px;border-bottom:2px solid #3b82f6;text-align:left;">Vacuna</th>
                                    <th style="padding:8px 6px;border-bottom:2px solid #3b82f6;text-align:left;">Dosis (ml)</th>
                                    <th style="padding:8px 6px;border-bottom:2px solid #3b82f6;text-align:left;">Tipo</th>
                                    <th style="padding:8px 6px;border-bottom:2px solid #3b82f6;text-align:left;">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${
                                    vacunas.map(v => `
                                        <tr>
                                            <td style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">${v.vaccine}</td>
                                            <td style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">${v.amount}</td>
                                            <td style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">${v.type}</td>
                                            <td style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">${v.date}</td>
                                        </tr>
                                    `).join('')
                                }
                            </tbody>
                        </table>
                    ` : `<div style="color:#059669;font-size:1.08rem;text-align:center;margin:10px 0 18px 0;">No hay vacunas aplicadas</div>`;

                    // Tabla de crías
                    let criasTable = `
                        <table style="width:100%;border-collapse:collapse;font-size:1.05rem;">
                            <thead>
                                <tr style="background:#f3f4f6;">
                                    <th style="padding:8px 6px;border-bottom:2px solid #10b981;text-align:left;">Códigos de crías</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${
                                    crias.length
                                    ? crias.map(c => `
                    <tr>
                        <td style="padding:6px 6px;border-bottom:1px solid #e5e7eb;">${c}</td>
                    </tr>
                `).join('')
                : `<tr><td style="color:#059669;padding:8px;text-align:center;">No hay crías registradas</td></tr>`
            }
        </tbody>
    </table>
`;

let html = `
<div style="display: flex; flex-wrap: wrap; gap: 40px; align-items: flex-start; min-width: 340px; max-width: 1200px;">
    <div style="flex: 1 1 400px; max-width: 440px; min-width: 260px; display: flex; flex-direction: column; align-items: center;">
        ${vacuno.foto ? `
            <img src="${vacuno.foto}" alt="Imagen" style="width:100%;max-width:400px;height:420px;object-fit:cover;border-radius:22px;box-shadow:0 2px 16px rgba(16,185,129,0.13);border:4px solid #10b981;">
        ` : `
            <div class="placeholder" style="width:400px;height:420px;display:flex;align-items:center;justify-content:center;background:#f8f9fa;border-radius:22px;">
                <i class="fas fa-camera" style="font-size:80px;color:#bbb;"></i>
            </div>
        `}
        <div style="margin-top:16px;font-size:18px;color:#10b981;font-weight:700;letter-spacing:1px;">
            ${vacuno.codigocria || 'Sin código'}
        </div>
    </div>
    <div style="flex: 2 1 600px; min-width: 260px;">
        <h1 style="color:#10b981;font-weight:900;font-size:2.3rem;margin-bottom:18px;letter-spacing:1px;text-align:center;">
            Detalles del Vacuno
        </h1>
        <div style="display: flex; flex-wrap: wrap; gap: 24px; margin-bottom: 22px;">
            <!-- Columna izquierda: info -->
            <div style="flex:1 1 260px; min-width:220px;">
                <div style="margin-bottom:10px;">
                    <span style="font-size:1.13rem;"><b>Madre:</b> <span style="color:#f59e42;">${vacuno.codigomama || 'N/A'}</span></span>
                </div>
                <div style="margin-bottom:10px;">
                    <span style="font-size:1.13rem;"><b>Padre:</b> <span style="color:#f59e42;">${vacuno.codigopapa || 'N/A'}</span></span>
                </div>
                <div style="margin-bottom:10px;">
                    <span style="font-size:1.13rem;"><b>Parcela:</b> <span style="color:#6366f1;">${vacuno.idparcela || 'N/A'}</span></span>
                </div>
                <div style="margin-bottom:10px;">
                    <span style="font-size:1.13rem;"><b>Raza:</b> <span style="color:#4b5563;">${vacuno.razas || 'N/A'}</span></span>
                </div>
                <div style="margin-bottom:10px;">
                    <span style="font-size:1.13rem;"><b>Edad:</b> <span style="color:#4b5563;">${vacuno.edad || 'N/A'} meses</span></span>
                </div>
                <div style="margin-bottom:10px;">
                    <span style="font-size:1.13rem;"><b>Estado:</b> <span style="color:#059669;">${vacuno.estado || 'N/A'}</span></span>
                </div>
            </div>
            <!-- Columna derecha: tabla de crías -->
            <div style="flex:1 1 260px; min-width:220px;">
                <div style="font-size:1.15rem;font-weight:700;color:#10b981; margin-bottom:8px; text-align:center;">Crías</div>
                ${criasTable}
            </div>
        </div>
        <hr style="margin:22px 0;">
        <div style="margin-bottom:18px;">
            <span style="font-size:1.15rem;font-weight:700;color:#ef4444;display:block;margin-bottom:6px;">Enfermedades</span>
            ${enfermedadesTable}
        </div>
        <div>
            <span style="font-size:1.15rem;font-weight:700;color:#3b82f6;display:block;margin-bottom:6px;">Vacunas</span>
            ${vacunasTable}
        </div>
    </div>
</div>
`;

                    Swal.fire({
                        title: `Detalles de ${vacuno.codigocria}`,
                        html: html,
                        width: '90%',
                        heightAuto: true,
                        padding: '1.5em',
                        showCloseButton: true,
                        backdrop: 'rgba(16,185,129,0.15)',
                        customClass: {
                            popup: 'detalle-vacuno-popup'
                        }
                    });
                });
        });
};

/**
 * Elimina un vacuno y su registro asociado.
 */
window.EliminarVacuno = function(id) {
    Swal.fire({
        title: '¿Eliminar vacuno?',
        text: 'Esta acción no se puede deshacer. ¿Está seguro de que desea eliminar este vacuno y su registro asociado?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#4CAF50',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/Ganado/Tabla/Eliminar/vacuno/${id}`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCSRFToken() // Necesario para POST en Django
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('¡Eliminado!', 'El vacuno ha sido eliminado correctamente.', 'success')
                        .then(() => window.location.reload());
                } else {
                    Swal.fire('Error', data.error || 'No se pudo eliminar el vacuno.', 'error');
                }
            })
            .catch(() => {
                Swal.fire('Error', 'Ocurrió un error al eliminar el vacuno.', 'error');
            });
        }
    });
}

// =========================[ REGION: Buscador de ganado en vivo ]========================

function filtrarGanado() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('TipoBusqueda').value;
    const ganadoItems = document.querySelectorAll('.ganado-item');

    ganadoItems.forEach(item => {
        let matches = false;
        if (!filterType || filterType === "") {
            // Buscar en todo
            matches =
                item.getAttribute('data-codigo').includes(searchText) ||
                item.getAttribute('data-raza').includes(searchText) ||
                item.getAttribute('data-estado').includes(searchText) ||
                (item.getAttribute('data-edad') || '').toString().includes(searchText);
        } else {
            // Buscar solo en el campo seleccionado
            let attr = '';
            if (filterType === 'codigo') attr = 'data-codigo';
            if (filterType === 'raza') attr = 'data-raza';
            if (filterType === 'estado') attr = 'data-estado';
            if (filterType === 'edad') attr = 'data-edad';
            matches = (item.getAttribute(attr) || '').toLowerCase().includes(searchText);
        }
        item.style.display = matches ? '' : 'none';
    });
}

// Filtrado en vivo al escribir
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(this.timer);
            this.timer = setTimeout(filtrarGanado, 200);
        });
    }
    const tipoBusqueda = document.getElementById('TipoBusqueda');
    if (tipoBusqueda) {
        tipoBusqueda.addEventListener('change', filtrarGanado);
    }
});

function getCSRFToken() {
    return document.querySelector('[name=csrf-token]')?.content ||
           document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
}
// =========================[ REGION: Registro de vacuno multipaso ]========================