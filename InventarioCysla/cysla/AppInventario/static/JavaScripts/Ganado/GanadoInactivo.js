// =========================[ REGION: Funciones principales ]========================

/**
 * Reactiva una vaca inactiva y la devuelve al inventario activo
 */
function reactivarVaca(id, codigoCria) {
    Swal.fire({
        title: '¿Reactivar vaca?',
        text: `La vaca ${codigoCria} volverá al inventario activo.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, reactivar',
        cancelButtonText: 'Cancelar',
        backdrop: 'rgba(40, 167, 69, 0.15)'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/Ganado/Tabla/Reactivar/vaca/${id}`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCSRFToken()
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Actualizar estadísticas
                    actualizarEstadisticas();
                    
                    // Eliminar la tarjeta de la vista
                    const card = document.querySelector(`.vaca-item[data-codigo="${codigoCria.toLowerCase()}"]`);
                    if (card) {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.remove();
                            verificarListaVacia();
                        }, 300);
                    }
                    
                    Swal.fire({
                        title: '¡Vaca Reactivada!',
                        text: `${codigoCria} ha sido devuelta al inventario activo.`,
                        icon: 'success',
                        confirmButtonColor: '#28a745',
                        backdrop: 'rgba(40, 167, 69, 0.15)'
                    });
                } else {
                    Swal.fire('Error', 'No se pudo reactivar la vaca.', 'error');
                }
            })
            .catch(() => {
                Swal.fire('Error', 'Error de conexión al reactivar la vaca.', 'error');
            });
        }
    });
}

/**
 * Muestra la información detallada de una vaca inactiva
 */
function verInformacion(id) {
    fetch(`/Ganado/api/obtener/${id}/`)
        .then(response => response.json())
        .then(vaca => {
            let enfermedades = [];
            let vacunas = [];
            let crias = [];
            
            try {
                enfermedades = JSON.parse(vaca.enfermedades || '[]');
                vacunas = JSON.parse(vaca.infovacunas || '[]');
                crias = JSON.parse(vaca.codigoscrias || '[]');
            } catch (e) {
                console.error('Error parsing JSON data:', e);
            }

            const html = generarHTMLInformacion(vaca, enfermedades, vacunas, crias);
            
            Swal.fire({
                title: `Información de ${vaca.codigocria}`,
                html: html,
                width: '95%',
                heightAuto: true,
                padding: '1.5em',
                showCloseButton: true,
                showConfirmButton: false,
                backdrop: 'rgba(220, 53, 69, 0.15)',
                customClass: {
                    popup: 'info-vaca-inactiva-popup'
                }
            });
            
            // Asignar evento al botón de reactivar dentro del modal
            document.getElementById('btnReactivarModal').addEventListener('click', () => {
                Swal.close();
                reactivarVaca(vaca.id, vaca.codigocria);
            });
        })
        .catch(error => {
            Swal.fire('Error', 'No se pudieron cargar los datos de la vaca.', 'error');
            console.error('Error:', error);
        });
}

/**
 * Genera el HTML para la información detallada
 */
function generarHTMLInformacion(vaca, enfermedades, vacunas, crias) {
    return `
    <div class="vaca-info-detallada">
        <div class="vaca-imagen-section">
            ${vaca.foto ? 
                `<img src="${vaca.foto}" alt="Imagen de ${vaca.codigocria}" class="vaca-imagen-detalle">` : 
                `<div class="vaca-imagen-placeholder">
                    <i class="fas fa-cow"></i>
                    <span>Sin imagen</span>
                </div>`
            }
            <div class="vaca-codigo-detalle">${vaca.codigocria}</div>
        </div>
        
        <div class="vaca-datos-section">
            <div class="datos-grid">
                <div class="dato-item">
                    <span class="dato-label">Madre:</span>
                    <span class="dato-valor">${vaca.codigomama || 'N/A'}</span>
                </div>
                <div class="dato-item">
                    <span class="dato-label">Padre:</span>
                    <span class="dato-valor">${vaca.codigopapa || 'N/A'}</span>
                </div>
                <div class="dato-item">
                    <span class="dato-label">Parcela:</span>
                    <span class="dato-valor">${vaca.idparcela || 'N/A'}</span>
                </div>
                <div class="dato-item">
                    <span class="dato-label">Raza:</span>
                    <span class="dato-valor">${vaca.razas || 'N/A'}</span>
                </div>
                <div class="dato-item">
                    <span class="dato-label">Edad:</span>
                    <span class="dato-valor">${vaca.edad || 'N/A'} meses</span>
                </div>
                <div class="dato-item">
                    <span class="dato-label">Estado:</span>
                    <span class="dato-valor estado-inactivo">Inactiva</span>
                </div>
            </div>
            
            <div class="seccion-adicional">
                <h4><i class="fas fa-heartbeat"></i> Enfermedades</h4>
                ${enfermedades.length > 0 ? 
                    `<div class="lista-enfermedades">${generarListaEnfermedades(enfermedades)}</div>` : 
                    '<p class="sin-datos">No hay enfermedades registradas</p>'
                }
            </div>
            
            <div class="seccion-adicional">
                <h4><i class="fas fa-syringe"></i> Vacunas</h4>
                ${vacunas.length > 0 ? 
                    `<div class="lista-vacunas">${generarListaVacunas(vacunas)}</div>` : 
                    '<p class="sin-datos">No hay vacunas registradas</p>'
                }
            </div>
            
            <div class="seccion-adicional">
                <h4><i class="fas fa-baby"></i> Crías</h4>
                ${crias.length > 0 ? 
                    `<div class="lista-crias">${generarListaCrias(crias)}</div>` : 
                    '<p class="sin-datos">No hay crías registradas</p>'
                }
            </div>
            
            <div class="acciones-modal">
                <button class="btn btn-success btn-lg" id="btnReactivarModal">
                    <i class="fas fa-heart"></i> Reactivar Vaca
                </button>
            </div>
        </div>
    </div>
    `;
}

// Funciones auxiliares para generar listas
function generarListaEnfermedades(enfermedades) {
    return enfermedades.map(e => `
        <div class="item-lista">
            <span class="item-nombre">${e.disease}</span>
            <span class="item-fecha">${e.date}</span>
        </div>
    `).join('');
}

function generarListaVacunas(vacunas) {
    return vacunas.map(v => `
        <div class="item-lista">
            <span class="item-nombre">${v.vaccine}</span>
            <span class="item-detalle">${v.amount} dosis - ${v.type}</span>
            <span class="item-fecha">${v.date}</span>
        </div>
    `).join('');
}

function generarListaCrias(crias) {
    return crias.map(c => `
        <div class="item-lista">
            <span class="item-nombre">${c}</span>
        </div>
    `).join('');
}

/**
 * Filtra las vacas inactivas según el criterio de búsqueda
 */
function filtrarVacas() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('TipoBusqueda').value;
    const vacaItems = document.querySelectorAll('.vaca-item');

    let visibleCount = 0;
    
    vacaItems.forEach(item => {
        let matches = false;
        
        if (!filterType || filterType === "") {
            // Búsqueda en todos los campos
            matches =
                item.getAttribute('data-codigo').includes(searchText) ||
                item.getAttribute('data-raza').includes(searchText) ||
                item.getAttribute('data-edad').includes(searchText);
        } else {
            // Búsqueda en campo específico
            let attr = '';
            if (filterType === 'codigo') attr = 'data-codigo';
            if (filterType === 'raza') attr = 'data-raza';
            if (filterType === 'edad') attr = 'data-edad';
            
            matches = (item.getAttribute(attr) || '').toLowerCase().includes(searchText);
        }
        
        if (matches) {
            item.style.display = '';
            visibleCount++;
            // Animación de aparición
            item.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Mostrar mensaje si no hay resultados
    const noResults = document.getElementById('noResults');
    if (visibleCount === 0 && searchText) {
        if (!noResults) {
            const row = document.querySelector('.row.justify-content-center');
            const message = document.createElement('div');
            message.id = 'noResults';
            message.className = 'col-12 text-center no-results-message';
            message.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-search fa-2x mb-3"></i>
                    <h4>No se encontraron resultados</h4>
                    <p>No hay vacas inactivas que coincidan con "${searchText}"</p>
                </div>
            `;
            row.appendChild(message);
        }
    } else if (noResults) {
        noResults.remove();
    }
}

/**
 * Actualiza las estadísticas en tiempo real
 */
function actualizarEstadisticas() {
    const totalElement = document.querySelector('.stat-card:first-child h3');
    if (totalElement) {
        const currentTotal = parseInt(totalElement.textContent);
        totalElement.textContent = currentTotal - 1;
    }
    
    const restauradasElement = document.getElementById('totalRestauradas');
    if (restauradasElement) {
        const currentRestored = parseInt(restauradasElement.textContent);
        restauradasElement.textContent = currentRestored + 1;
    }
}

/**
 * Verifica si la lista está vacía y muestra un mensaje
 */
function verificarListaVacia() {
    const vacaItems = document.querySelectorAll('.vaca-item');
    const emptyState = document.querySelector('.empty-state');
    const row = document.querySelector('.row.justify-content-center');
    
    if (vacaItems.length === 0 && !emptyState) {
        const emptyHtml = `
            <div class="col-12 text-center">
                <div class="alert alert-success empty-state">
                    <i class="fas fa-smile-beam fa-3x mb-3"></i>
                    <h4>¡Excelente!</h4>
                    <p>No hay vacas inactivas en este momento. Todas tus vacas están en el inventario activo.</p>
                    <a href="{% url 'TablaGanado' %}" class="btn btn-success mt-2">
                        <i class="fas fa-arrow-left"></i> Ir al Inventario Activo
                    </a>
                </div>
            </div>
        `;
        row.innerHTML = emptyHtml;
    }
}

/**
 * Obtiene el token CSRF
 */
function getCSRFToken() {
    return document.querySelector('[name=csrf-token]')?.content ||
           document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
}

// =========================[ REGION: Inicialización ]========================
document.addEventListener('DOMContentLoaded', function() {
    // Filtrado en tiempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(this.timer);
            this.timer = setTimeout(filtrarVacas, 300);
        });
    }
    
    const tipoBusqueda = document.getElementById('TipoBusqueda');
    if (tipoBusqueda) {
        tipoBusqueda.addEventListener('change', filtrarVacas);
    }
    
    // Efectos hover mejorados para las tarjetas
    const cards = document.querySelectorAll('.vaca-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Inicializar estadísticas
    const totalInactivas = document.querySelectorAll('.vaca-item').length;
    document.getElementById('totalRestauradas').textContent = '0';
});