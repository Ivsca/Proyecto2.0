// =============================================
// DATOS DE EJEMPLO Y CONFIGURACIÓN INICIAL
// =============================================
const sampleData = { "nombre": "Tomate Cherry", "tipo": "Fruta", "fecha_siembra": "2025-01-10", "fecha_cosecha": "2025-03-20", "cantidad": 250, "fertilizante": "NPK 20-20-20", "fecha_fertilizacion": "2025-01-25", "dosis_fertilizacion": "2kg" };

// =============================================
// VARIABLES GLOBALES
// =============================================
let selectedColumns = [];
let totalRegistros = 0;
let offset = 0;
let limit = 10;
let sortableInstance = null;
let allColumns = [];
let currentFilters = {};

// =============================================
// INICIALIZACIÓN PRINCIPAL
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Cache DOM elements
    cacheElements();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Initialize sortable
    setupSortable();
    
    // Load initial data
    loadInitialData();
    
    // Setup search functionality
    setupColumnSearch();
    
    // Show loading animation
    showInitialLoading();
}

// =============================================
// CACHE DOM ELEMENTS
// =============================================
let elements = {};

function cacheElements() {
    elements = {
        selectedList: document.getElementById('selected-columns'),
        checkboxes: document.querySelectorAll('input[type="checkbox"]'),
        previewHead: document.getElementById('preview-head'),
        previewBody: document.getElementById('preview-body'),
        loadingOverlay: document.getElementById('loading-overlay'),
        errorMessage: document.getElementById('error-message'),
        tableInfo: document.getElementById('table-info'),
        pagination: document.getElementById('pagination'),
        rowsPerPage: document.getElementById('rows-per-page'),
        resetFilters: document.getElementById('reset-filters'),
        btnExcel: document.getElementById('generate-all'),
        fabGenerate: document.getElementById('fab-generate'),
        columnSearch: document.getElementById('column-search'),
        availableColumnsList: document.querySelector('.available-columns-list'),
        columnsOrderList: document.querySelector('.columns-order-list'),
        excelFilename: document.getElementById('excel-filename')
    };
    
    // Store all column options for filtering
    allColumns = Array.from(elements.availableColumnsList.children);
}

// =============================================
// EVENT LISTENERS SETUP
// =============================================
function setupEventListeners() {
    // Column selection checkboxes
    elements.checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleColumnToggle);
    });
    
    // Rows per page change
    elements.rowsPerPage.addEventListener('change', handleRowsPerPageChange);
    
    // Reset filters button
    elements.resetFilters.addEventListener('click', handleResetFilters);
    
    // Excel generation buttons
    elements.btnExcel.addEventListener('click', handleExcelGeneration);
    elements.fabGenerate.addEventListener('click', handleExcelGeneration);
    
    // Search functionality
    elements.columnSearch.addEventListener('input', handleColumnSearch);
    
    // Filename validation
    elements.excelFilename.addEventListener('input', validateFilename);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// =============================================
// COLUMN MANAGEMENT
// =============================================
function handleColumnToggle(event) {
    const checkbox = event.target;
    const value = checkbox.value;
    const label = getColumnLabel(checkbox);
    
    if (checkbox.checked) {
        addColumn(value, label);
    } else {
        removeColumn(value);
    }
    
    updateColumnOption(checkbox, checkbox.checked);
    resetPagination();
    renderTableHeaders();
    fetchTableData();
}

function addColumn(name, label) {
    if (!selectedColumns.includes(name)) {
        selectedColumns.push(name);
        addColumnItem(name, label);
        hideEmptyState();
        showSuccessToast(`Columna "${label}" agregada`);
    }
}

function removeColumn(name) {
    selectedColumns = selectedColumns.filter(col => col !== name);
    removeColumnItem(name);
    
    if (selectedColumns.length === 0) {
        showEmptyState();
    }
    
    const label = getColumnLabelByName(name);
    showInfoToast(`Columna "${label}" removida`);
}

function addColumnItem(name, label) {
    if (elements.selectedList.querySelector(`[data-column="${name}"]`)) return;
    
    const div = document.createElement('div');
    div.className = 'column-item';
    div.dataset.column = name;
    div.innerHTML = `
        <span class="column-name">${label}</span>
        <button class="remove-column" title="Quitar columna" aria-label="Quitar columna ${label}">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add remove event listener
    const removeBtn = div.querySelector('.remove-column');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleColumnRemove(name);
    });
    
    elements.selectedList.appendChild(div);
    
    // Trigger animation
    setTimeout(() => {
        div.classList.add('added');
    }, 10);
}

function removeColumnItem(name) {
    const item = elements.selectedList.querySelector(`[data-column="${name}"]`);
    if (item) {
        item.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
            }
        }, 300);
    }
}

function handleColumnRemove(name) {
    const checkbox = document.querySelector(`input[value="${name}"]`);
    if (checkbox) {
        checkbox.checked = false;
        updateColumnOption(checkbox, false);
    }
    
    removeColumn(name);
    resetPagination();
    renderTableHeaders();
    fetchTableData();
}

// =============================================
// SORTABLE FUNCTIONALITY
// =============================================
function setupSortable() {
    if (elements.selectedList) {
        sortableInstance = new Sortable(elements.selectedList, {
            animation: 200,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            onStart: function(evt) {
                elements.columnsOrderList.classList.add('drag-over');
            },
            onEnd: function(evt) {
                elements.columnsOrderList.classList.remove('drag-over');
                updateColumnOrder();
                renderTableHeaders();
                fetchTableData();
                showInfoToast('Orden de columnas actualizado');
            }
        });
    }
}

function updateColumnOrder() {
    const items = elements.selectedList.querySelectorAll('.column-item');
    selectedColumns = Array.from(items).map(item => item.dataset.column);
}

// =============================================
// SEARCH FUNCTIONALITY
// =============================================
function setupColumnSearch() {
    // Initial setup is done in setupEventListeners
}

function handleColumnSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    allColumns.forEach(columnOption => {
        const columnName = columnOption.querySelector('.column-name');
        const columnText = columnName ? columnName.textContent.toLowerCase() : '';
        
        if (columnText.includes(searchTerm)) {
            columnOption.style.display = 'flex';
            columnOption.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            columnOption.style.display = 'none';
        }
    });
    
    // Show "no results" message if needed
    const visibleColumns = allColumns.filter(col => col.style.display !== 'none');
    if (visibleColumns.length === 0 && searchTerm) {
        showSearchNoResults();
    } else {
        hideSearchNoResults();
    }
}

function showSearchNoResults() {
    let noResultsMsg = elements.availableColumnsList.querySelector('.no-search-results');
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-search-results text-center text-muted py-4';
        noResultsMsg.innerHTML = `
            <i class="fas fa-search mb-2" style="font-size: 2rem; opacity: 0.3;"></i>
            <p class="mb-0">No se encontraron columnas</p>
        `;
        elements.availableColumnsList.appendChild(noResultsMsg);
    }
    noResultsMsg.style.display = 'block';
}

function hideSearchNoResults() {
    const noResultsMsg = elements.availableColumnsList.querySelector('.no-search-results');
    if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// =============================================
// TABLE MANAGEMENT
// =============================================
function renderTableHeaders() {
    if (selectedColumns.length === 0) {
        elements.previewHead.innerHTML = '';
        elements.previewBody.innerHTML = '';
        return;
    }
    
    let headerHtml = '<tr>';
    selectedColumns.forEach(col => {
        const currentValue = currentFilters[col] || '';
        headerHtml += `<th>
            <div class="header-content">
                <span class="header-title">${col}</span>
                <select class="table-filter form-select form-select-sm mt-1" data-field="${col}" ${col === 'razas' ? 'data-filter="raza"' : ''}>
                    ${getFilterOptions(col, currentValue)}
                </select>
            </div>
        </th>`;
    });
    headerHtml += '</tr>';
    
    elements.previewHead.innerHTML = headerHtml;
    
    // Re-attach filter event listeners
    elements.previewHead.querySelectorAll('.table-filter').forEach(select => {
        select.addEventListener('change', handleFilterChange);
    });
}

function getFilterOptions(column, currentValue = '') {
    if (column === 'tipo') {
        let options = '<option value="">Todos los tipos</option>';
        if (window.tiposArray) {
            window.tiposArray.forEach(tipo => {
                const nombre = tipo.nombre_tipo;  
                options += `<option value="${nombre}" ${nombre === currentValue ? 'selected' : ''}>${nombre}</option>`;
            });
        }
        return options;
    } else {
        return `
            <option value="" ${currentValue === '' ? 'selected' : ''}>Sin ordenar</option>
            <option value="asc" ${currentValue === 'asc' ? 'selected' : ''}>Ascendente</option>
            <option value="desc" ${currentValue === 'desc' ? 'selected' : ''}>Descendente</option>
        `;
    }
}




function handleFilterChange(event) {
    const select = event.target;
    const field = select.dataset.field;
    const value = select.value;

    currentFilters[field] = value; // ← antes estaba guardando un [object Object]

    resetPagination();
    fetchTableData();
    showInfoToast('Filtros aplicados');
}


function fetchTableData() {
    if (selectedColumns.length === 0) {
        clearTable();
        return;
    }
    
    showLoading();
    clearError();
    
    const params = buildQueryParams();
    const queryString = new URLSearchParams(params).toString();
    
    fetch(`/consultar-cultivos/?${queryString}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            handleTableDataSuccess(data);
        })
        .catch(error => {
            handleTableDataError(error);
        })
        .finally(() => {
            hideLoading();
        });
}

function buildQueryParams() {
    const params = {
        fields: selectedColumns.join(','),
        limit: limit,
        offset: offset
    };
    
    // Add filters and sorting from currentFilters
    Object.keys(currentFilters).forEach(field => {
        if (selectedColumns.includes(field)) {
            const value = currentFilters[field];
            if (!value) return;

            if (field === 'tipo') {
                params['filter_tipo'] = value;
            } else {
                params[`sort_${field}`] = value;
            }

        }
    });
    
    return params;
}

function handleTableDataSuccess(data) {
    if (!data.success) {
        showError(data.error || 'Error al consultar datos');
        clearTable();
        return;
    }
    
    totalRegistros = data.total;
    renderTableData(data.cultivos);
    updatePagination();
    updateTableInfo();
    
    if (data.cultivos && data.cultivos.length > 0) {
        showSuccessToast(`${data.cultivos.length} registros cargados`);
    }
}

function handleTableDataError(error) {
    console.error('Error fetching data:', error);
    showError('Error de conexión o servidor. Por favor, intenta nuevamente.');
    clearTable();
}

function renderTableData(rows) {
    if (!rows || rows.length === 0) {
        elements.previewBody.innerHTML = `
            <tr>
                <td colspan="${selectedColumns.length}" class="text-center py-4">
                    <div class="empty-table-state">
                        <i class="fas fa-inbox mb-2" style="font-size: 2rem; opacity: 0.3;"></i>
                        <p class="mb-0 text-muted">No hay datos disponibles</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    const tableHtml = rows.map((row, index) => {
        const cells = selectedColumns.map(col => {
            const value = row[col] !== undefined && row[col] !== null ? row[col] : '';
            return `<td class="table-cell" title="${value}">${value}</td>`;
        }).join('');
        
        return `<tr class="table-row" style="animation-delay: ${index * 0.05}s">${cells}</tr>`;
    }).join('');
    
    elements.previewBody.innerHTML = tableHtml;
}

// =============================================
// PAGINATION
// =============================================
function updatePagination() {
    if (totalRegistros <= limit) {
        elements.pagination.innerHTML = '';
        return;
    }
    
    const totalPages = Math.ceil(totalRegistros / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    
    let paginationHtml = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" id="prev-page" aria-label="Página anterior">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
        <li class="page-item disabled">
            <span class="page-link">
                <strong>${currentPage}</strong> de <strong>${totalPages}</strong>
            </span>
        </li>
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" id="next-page" aria-label="Página siguiente">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    elements.pagination.innerHTML = paginationHtml;
    
    // Add event listeners
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    prevBtn?.addEventListener('click', handlePreviousPage);
    nextBtn?.addEventListener('click', handleNextPage);
}

function handlePreviousPage(event) {
    event.preventDefault();
    if (offset >= limit) {
        offset -= limit;
        fetchTableData();
        scrollToTable();
    }
}

function handleNextPage(event) {
    event.preventDefault();
    if (offset + limit < totalRegistros) {
        offset += limit;
        fetchTableData();
        scrollToTable();
    }
}

function updateTableInfo() {
    const start = totalRegistros === 0 ? 0 : offset + 1;
    const end = Math.min(offset + limit, totalRegistros);
    elements.tableInfo.textContent = `Mostrando ${start} a ${end} de ${totalRegistros} registros`;
}

function resetPagination() {
    offset = 0;
}

// =============================================
// EXCEL GENERATION
// =============================================
function handleExcelGeneration() {
    if (selectedColumns.length === 0) {
        showError('Selecciona al menos una columna para exportar a Excel');
        return;
    }
    
    // Validar nombre de archivo
    const filename = elements.excelFilename.value.trim();
    if (!filename) {
        showError('Por favor, ingresa un nombre para el archivo Excel');
        elements.excelFilename.focus();
        return;
    }
    
    if (!isValidFilename(filename)) {
        showError('El nombre del archivo contiene caracteres no válidos');
        elements.excelFilename.focus();
        return;
    }
    
    showLoadingToast('Generando archivo Excel...');
    
    const params = buildQueryParams();
    // Agregar el nombre del archivo
    params.filename = filename;
    // Remove pagination for full export
    delete params.limit;
    delete params.offset;
    
    const queryString = new URLSearchParams(params).toString();
    
    // Create download link
    const downloadUrl = `/exportar-excel- cultivos/?${queryString}`;
    
    // Trigger download
    window.location.href = downloadUrl;
    
    setTimeout(() => {
        showSuccessToast('¡Archivo Excel generado exitosamente!');
    }, 1000);
}

function validateFilename() {
    const filename = elements.excelFilename.value;
    if (!isValidFilename(filename)) {
        elements.excelFilename.classList.add('is-invalid');
    } else {
        elements.excelFilename.classList.remove('is-invalid');
    }
}

function isValidFilename(name) {
    // No permitir caracteres que no son válidos en nombres de archivo
    const invalidChars = /[<>:"/\\|?*]/;
    return !invalidChars.test(name);
}

// =============================================
// UI STATE MANAGEMENT
// =============================================
function showLoading() {
    elements.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.style.display = 'block';
    elements.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearError() {
    elements.errorMessage.style.display = 'none';
    elements.errorMessage.textContent = '';
}

function clearTable() {
    elements.previewBody.innerHTML = '';
    elements.tableInfo.textContent = 'Mostrando 0 de 0 registros';
    elements.pagination.innerHTML = '';
}

function showEmptyState() {
    elements.selectedList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-plus-circle"></i>
            <p>Selecciona columnas para comenzar</p>
        </div>
    `;
}

function hideEmptyState() {
    const emptyState = elements.selectedList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
}

function updateColumnOption(checkbox, isSelected) {
    const columnOption = checkbox.closest('.column-option');
    if (columnOption) {
        columnOption.classList.toggle('selected', isSelected);
    }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================
function getColumnLabel(checkbox) {
    return checkbox.parentElement.nextElementSibling.querySelector('.column-name').textContent;
}

function getColumnLabelByName(name) {
    const checkbox = document.querySelector(`input[value="${name}"]`);
    return checkbox ? getColumnLabel(checkbox) : name;
}

function scrollToTable() {
    elements.previewHead.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleRowsPerPageChange() {
    limit = parseInt(elements.rowsPerPage.value, 10);
    resetPagination();
    fetchTableData();
}

function handleResetFilters() {
    // Uncheck all checkboxes
    elements.checkboxes.forEach(chk => {
        chk.checked = false;
        updateColumnOption(chk, false);
    });
    
    // Clear selected columns
    selectedColumns = [];
    elements.selectedList.innerHTML = '';
    showEmptyState();
    
    // Clear table
    elements.previewHead.innerHTML = '';
    clearTable();
    
    // Clear search
    elements.columnSearch.value = '';
    handleColumnSearch({ target: { value: '' } });
    
    // Clear error
    clearError();
    
    // Reset current filters
    currentFilters = {};
    
    // Reset pagination
    resetPagination();
    
    // Reset filename
    elements.excelFilename.value = '';
    elements.excelFilename.classList.remove('is-invalid');
    
    showInfoToast('Filtros reiniciados');
}

// =============================================
// KEYBOARD SHORTCUTS
// =============================================
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + G for generate Excel
    if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
        event.preventDefault();
        handleExcelGeneration();
    }
    
    // Ctrl/Cmd + R for reset (prevent default browser refresh)
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        handleResetFilters();
    }
    
    // Escape to clear search
    if (event.key === 'Escape' && document.activeElement === elements.columnSearch) {
        elements.columnSearch.value = '';
        handleColumnSearch({ target: { value: '' } });
    }
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="toast-icon fas ${getToastIcon(type)}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Cerrar">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Add close functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }
}

function removeToast(toast) {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function showSuccessToast(message) {
    showToast(message, 'success');
}

function showErrorToast(message) {
    showToast(message, 'error');
}

function showWarningToast(message) {
    showToast(message, 'warning');
}

function showInfoToast(message) {
    showToast(message, 'info');
}

function showLoadingToast(message) {
    showToast(message, 'info', 0); // 0 duration means it won't auto-hide
}

// =============================================
// INITIAL DATA LOADING
// =============================================
function loadInitialData() {
    // Load razas for dynamic select
    fetch('/api/tipos-cultivo/')
    .then(res => res.json())
    .then(data => {
        if (data.tipos) {
            window.tiposArray = data.tipos;
        }
    });

    
    // Initial render
    renderTableHeaders();
    fetchTableData();
}

function showInitialLoading() {
    // Show a brief loading state on app initialization
    showLoading();
    setTimeout(() => {
        hideLoading();
    }, 500);
}