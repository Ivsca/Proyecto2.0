

//Trabajo Ivanna
// Función para el menú hamburguesa
document.getElementById('hamburgerBtn').addEventListener('click', function() {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('active');
    
    // Cambiar ícono
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Cerrar menú al hacer clic en un enlace (para móviles)
document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 764) {
            document.getElementById('mainNav').classList.remove('active');
            const btn = document.getElementById('hamburgerBtn');
            btn.querySelector('i').classList.add('fa-bars');
            btn.querySelector('i').classList.remove('fa-times');
        }
    });
});

// Manejar dropdowns en móviles
document.querySelectorAll('.dropbtn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (window.innerWidth <= 764) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('show');
            
            // Rotar ícono
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-rotate-180');
        }
    });
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', function(event) {
    const nav = document.getElementById('mainNav');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    
    // Si el clic no fue en el menú ni en el botón hamburguesa
    if (!nav.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        if (window.innerWidth <= 764) {
            nav.classList.remove('active');
            hamburgerBtn.querySelector('i').classList.add('fa-bars');
            hamburgerBtn.querySelector('i').classList.remove('fa-times');
            
            // Cerrar también los dropdowns abiertos
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
            
            // Restaurar íconos de flecha
            document.querySelectorAll('.dropbtn i').forEach(icon => {
                icon.classList.remove('fa-rotate-180');
            });
        }
    }
});

// Evitar que el clic dentro del menú se propague y cierre el menú
document.getElementById('mainNav').addEventListener('click', function(event) {
    event.stopPropagation();
});

//Sección cultivos

function getCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    return params.get('page') || 1;
}

function mostrarFormularioCultivo() {
    const formOriginal = document.getElementById('formularioCultivoOriginal');
    const formClonado = formOriginal.cloneNode(true);
    formClonado.id = 'formCultivo';
    formClonado.style.display = 'block';

    // Mostrar el formulario en SweetAlert
    Swal.fire({
        title: 'Agregar Cultivo',
        html: formClonado,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        focusConfirm: false,
        width: '70%',
        didOpen: () => {
            // Agregar el formulario clonado al Swal (ya se hace con html)
            Swal.getPopup().appendChild(formClonado);

            const popup = Swal.getPopup();
            const actions = popup.querySelector('.swal2-actions');
            if (actions) {
                formClonado.appendChild(actions);
                actions.style.justifyContent = 'center'; // Opcional: centrar botones
                actions.style.marginTop = '20px';        // Espacio entre inputs y botones
            }

            // Listener para mostrar vista previa de imagen
            const inputImagen = Swal.getPopup().querySelector('#cattleImage');
            const preview = Swal.getPopup().querySelector('#imagePreview');

            inputImagen.addEventListener('change', function () {
                const file = this.files[0];
                preview.innerHTML = ''; // Limpiar vista previa

                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        preview.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            });         
                         
 
        },
        preConfirm: () => {
            const popup = Swal.getPopup(); 
            const form = popup.querySelector('#formCultivo');
            // 1. Validación de parcela
            const parcelaSelect = form.querySelector('#parcela_id');
            if (!parcelaSelect.value) {
                Swal.showValidationMessage('Debes seleccionar una parcela');
                return false;
            } else {
                const selectedOption = parcelaSelect.options[parcelaSelect.selectedIndex];
                if (selectedOption.disabled) {
                    Swal.showValidationMessage('No puedes seleccionar una parcela inactiva');
                    return false;
                }
            }

            const fechaSiembra = form.querySelector('#fecha_siembra').value;
            const fechaCosecha = form.querySelector('#fecha_cosecha').value;
            const cantidad = form.querySelector('#cantidad').value;
            const imagen = form.querySelector('#cattleImage').files[0];

            if (!imagen) {
                Swal.showValidationMessage('Debes subir una imagen del cultivo.');
                return false;
            } 

            // Validar lógica de fechas
                    const siembraDate = new Date(fechaSiembra);
                    const cosechaDate = new Date(fechaCosecha);

                    if (!fechaSiembra || !fechaCosecha) {
                        Swal.showValidationMessage('Debes ingresar ambas fechas.');
                        return false;
                    }

                    if (siembraDate > cosechaDate) {
                        Swal.showValidationMessage('La fecha de siembra no puede ser posterior a la fecha de cosecha.');
                        return false;
                    }


            if (!cantidad || parseInt(cantidad) < 1) {
                Swal.showValidationMessage('La cantidad debe ser mínimo 1.');
                return false;
            }

            const formData = new FormData(form);
            return fetch('/Cultivo/Tabla/', {

                method: 'POST',
                headers: {
                    'X-CSRFToken': '{{ csrf_token }}'
                },
                body: formData
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Error al agregar el cultivo, todos los campos deben estar llenos');
                }
                return response.json();
            }).catch(error => {
                Swal.showValidationMessage(error.message);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('¡Éxito!', 'Cultivo agregado correctamente', 'success')
            .then(() => {
                window.location.href = '?page=' + getCurrentPage();
            });
        }
    });

}


//Botones Editar

function editar_cultivo(id) {
    if (userRole !== "Admin") {
    Swal.fire('Error', 'No tienes permisos para esta acción', 'error');
    return;
  }
    fetch(`/Cultivo/obtener/${id}/`)
        .then(response => response.json())
        .then(data => {
            const formOriginal = document.getElementById('formularioEditarOriginal');
            const formClonado = formOriginal.cloneNode(true);
            formClonado.id = 'formCultivoEditar';
            formClonado.style.display = 'block';

            formClonado.querySelector('#editar_id').value = data.id;
            formClonado.querySelector('#editar_nombre').value = data.nombre;
            formClonado.querySelector('#editar_tipo_id').value = data.tipo_id; 
            formClonado.querySelector('#editar_fecha_siembra').value = data.fecha_siembra;
            formClonado.querySelector('#editar_fecha_cosecha').value = data.fecha_cosecha;

            formClonado.querySelector('#editar_cantidad').value = data.cantidad;

            const preview = formClonado.querySelector('#editarImagePreview');
            const parcelaSelect = formClonado.querySelector('#editar_parcela_id');
            if (parcelaSelect) {
                parcelaSelect.value = data.parcela_id || '';
            }
            preview.innerHTML = data.foto ? `<img src="${data.foto}" class="img-fluid rounded" style="max-height: 200px;">` : '';

            Swal.fire({
                title: 'Editar Cultivo',
                html: formClonado,
                showCancelButton: true,
                confirmButtonText: 'Guardar cambios',
                focusConfirm: false,
                width: '70%',
                didOpen: () => {
                    Swal.getPopup().appendChild(formClonado);
                    const actions = Swal.getPopup().querySelector('.swal2-actions');
                    if (actions) {
                        formClonado.appendChild(actions);
                        actions.style.justifyContent = 'center';
                        actions.style.marginTop = '20px';
                    }

                    // Actualizar imagen
                    const inputImagen = formClonado.querySelector('#editarCattleImage');
                    inputImagen.addEventListener('change', function () {
                        const file = this.files[0];
                        preview.innerHTML = '';

                        if (file) {
                            const reader = new FileReader();
                            reader.onload = function (e) {
                                const img = document.createElement('img');
                                img.src = e.target.result;
                                preview.appendChild(img);
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                },
                preConfirm: () => {
                    const popup = Swal.getPopup(); // Contenedor del SweetAlert
                    const form = popup.querySelector('#formCultivoEditar');
                    const fechaSiembra = form.querySelector('#editar_fecha_siembra').value;
                    const fechaCosecha = form.querySelector('#editar_fecha_cosecha').value;
                    const cantidad = form.querySelector('#editar_cantidad').value;

                    // Validar fechas vacías
                    if (!fechaSiembra || !fechaCosecha) {
                        Swal.showValidationMessage('Debes ingresar ambas fechas.');
                        return false;
                    }

                    // Validar lógica de fechas
                    const siembraDate = new Date(fechaSiembra);
                    const cosechaDate = new Date(fechaCosecha);

                    if (siembraDate > cosechaDate) {
                        Swal.showValidationMessage('La fecha de siembra no puede ser posterior a la fecha de cosecha.');
                        return false;
                    }

                    // Validar cantidad mínima
                    if (!cantidad || parseInt(cantidad) < 1) {
                        Swal.showValidationMessage('La cantidad debe ser mínimo 1.');
                        return false;
                    }

                    const parcelaSelect = Swal.getPopup().querySelector('#editar_parcela_id');
                    if (parcelaSelect && parcelaSelect.value) {
                        const selectedOption = parcelaSelect.options[parcelaSelect.selectedIndex];
                        if (selectedOption.disabled) {
                            Swal.showValidationMessage('No puedes asignar una parcela inactiva');
                            return false;
                        }
                    }

                    const formData = new FormData(form);

                    
                    // No necesitas append('id') porque ya está en el formulario oculto
                    return fetch('/Cultivo/editar/', {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': '{{ csrf_token }}'
                        },
                        body: formData
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error('Error al editar el cultivo');
                        }
                        return response.json();
                    }).catch(error => {
                        Swal.showValidationMessage(error.message);
                    });
                }
            }).then(result => {
                if (result.isConfirmed) {
                    Swal.fire('¡Actualizado!', 'Cultivo editado correctamente', 'success')
                        .then(() => {
                            window.location.href = '?page=' + getCurrentPage();
                        });
                }
            });
        })
        .catch(error => {
            Swal.fire('Error', 'No se pudo cargar el cultivo', 'error');
            console.error('Error detallado:', error);
        });
}
//Eliminar CUltivo

function eliminarCultivo(id) {
     if (userRole !== "Admin") {
    Swal.fire('Error', 'No tienes permisos para esta acción', 'error');
    return;
  }
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/Cultivo/eliminar/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${id}`
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el cultivo');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire('¡Eliminado!', data.message, 'success').then(() => {
                    window.location.href = '?page=' + getCurrentPage();
                });
            })
            .catch(error => {
                Swal.fire('Error', error.message, 'error');
            });
        }
    });
}

// Buscador para los cultivos
function filtrarCultivos() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('TipoBusqueda').value;
    const cultivos = document.querySelectorAll('.cultivo-item');
    
    cultivos.forEach(cultivo => {
        const nombre = cultivo.getAttribute('data-nombre');
        const tipo = cultivo.getAttribute('data-tipo');
        let matchesSearch = true;
        let matchesType = true;
        
        // Filtrar por texto de búsqueda
        if (searchText) {
            matchesSearch = nombre.includes(searchText);
        }
        
        // Filtrar por tipo
        if (filterType) {
            matchesType = tipo === filterType;
        }
        
        // Mostrar u ocultar según coincidan ambos filtros
        if (matchesSearch && matchesType) {
            cultivo.style.display = '';
        } else {
            cultivo.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(this.timer);
            this.timer = setTimeout(filtrarCultivos, 300);
        });
    }
});

// =============================================
// FUNCIÓN PRINCIPAL - REGISTRO NUTRICIONAL
// =============================================
function abrirRegistroNutricional(cultivoId) {
  fetch(`/Cultivo/fertilizaciones/${cultivoId}/`)
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar datos');
      return response.json();
    })
    .then(data => {
      const historial = data.fertilizaciones || [];
      const tieneRegistros = historial.length > 0;
      const fechaSiembra = new Date(data.fecha_siembra);
      const fechaCosecha = new Date(data.fecha_cosecha);

      // ======================
      // 1. CONSTRUIR HISTORIAL
      // ======================
      let historialHtml = '';
      if (tieneRegistros) {
        historialHtml = `
          <hr>
          <h5 class="mt-3 mb-3 text-center">
            <i class="fas fa-history me-2"></i>Historial de aplicaciones
          </h5>
          <div class="historial-container" style="max-height: 300px; overflow-y: auto;">
            ${historial.map(registro => `
              <div class="border rounded p-3 mb-3 
                  ${registro.tipo === 'ORGANICO' ? 'bg-light-success' : 'bg-light'}">
                <div class="d-flex justify-content-between">
                  <span class="badge ${getBadgeClass(registro.tipo)}">
                    ${getTipoDisplay(registro.tipo)}
                  </span>
                  <small class="text-muted">${registro.fecha}</small>
                </div>
                <p class="my-2"><strong>${registro.fertilizante}</strong></p>
                ${registro.dosis ? `<p class="mb-1"><i class="fas fa-weight me-1"></i> ${registro.dosis}</p>` : ''}
                ${registro.observaciones ? `
                  <p class="mt-2 mb-0"><i class="fas fa-comment me-1"></i> 
                    <em>${registro.observaciones}</em>
                  </p>
                ` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }

      // =====================
      // 2. CONSTRUIR FORMULARIO
      // =====================
      const formHtml = `
        <form id="nutricionForm" class="text-start" 
              style="display: ${tieneRegistros ? 'none' : 'block'};">
              
          <!-- Fila 1: Datos básicos -->
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label for="fecha" class="form-label">
                <i class="fas fa-calendar me-1"></i>Fecha*
              </label>
              <input type="date" name="fecha" class="form-control" required
                     min="${data.fecha_siembra}" max="${data.fecha_cosecha}">
            </div>
            
            <div class="col-md-4">
              <label for="tipo" class="form-label">
                <i class="fas fa-tag me-1"></i>Tipo*
              </label>
              <select name="tipo" class="form-select" required>
                <option value="QUIMICO">Fertilizante químico</option>
                <option value="ORGANICO">Abono orgánico</option>
                <option value="OTRO">Otro insumo</option>
              </select>
            </div>
            
            <div class="col-md-4">
              <label for="dosis" class="form-label">
                <i class="fas fa-weight-hanging me-1"></i>Dosis
              </label>
              <input type="text" name="dosis" class="form-control" 
                     placeholder="Ej: 100 kg/ha, 5 L/m²">
            </div>
          </div>
          
          <!-- Fila 2: Producto -->
          <div class="mb-3">
            <label for="fertilizante" class="form-label">
              <i class="fas fa-pump-soap me-1"></i>Producto*
            </label>
            <input type="text" name="fertilizante" class="form-control" required
                   placeholder="Nombre del fertilizante o abono">
          </div>
          
          <!-- Fila 3: Observaciones -->
          <div class="mb-3">
            <label for="observaciones" class="form-label">
              <i class="fas fa-notes-medical me-1"></i>Observaciones
            </label>
            <textarea name="observaciones" class="form-control" rows="2"
                      placeholder="Método de aplicación, condiciones climáticas..."></textarea>
          </div>
        </form>
      `;

      // =====================
      // 3. MOSTRAR MODAL
      // =====================
      Swal.fire({
        title: `<i class="fas fa-seedling me-2"></i>Gestión Nutricional`,
        html: formHtml + historialHtml,
        width: '800px',
        backdrop: 'rgba(0,0,0,0.4)',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save me-1"></i> Guardar',
        cancelButtonText: '<i class="fas fa-times me-1"></i> Cancelar',
        focusConfirm: false,
        didOpen: () => {
          // Mostrar formulario al hacer clic en "Nuevo registro"
          const btn = document.getElementById('mostrarFormularioBtn');
          if (btn) {
            btn.addEventListener('click', () => {
              document.getElementById('nutricionForm').style.display = 'block';
              btn.style.display = 'none';
              // Desplazar al formulario
              document.querySelector('.swal2-html-container').scrollTop = 0;
            });
          }
        },
        preConfirm: () => {
          const form = document.getElementById('nutricionForm');
          if (!form || form.style.display === 'none') {
            Swal.showValidationMessage('Completa el formulario para continuar');
            return false;
          }

          const formData = new FormData(form);
          const errors = validateFormData(formData, fechaSiembra, fechaCosecha);
          if (errors) {
            Swal.showValidationMessage(errors);
            return false;
          }

          return submitFormData(cultivoId, formData);
        }
      }).then(result => {
        if (result.isConfirmed) {
          showSuccessAlert();
        }
      });
    })
    .catch(error => {
      Swal.fire('Error', `No se pudo cargar la información: ${error.message}`, 'error');
    });
}

// =============================================
// FUNCIONES AUXILIARES
// =============================================

function getBadgeClass(tipo) {
  const classes = {
    'QUIMICO': 'bg-secondary',
    'ORGANICO': 'bg-success',
    'OTRO': 'bg-warning text-dark'
  };
  return classes[tipo] || 'bg-primary';
}

function getTipoDisplay(tipo) {
  const tipos = {
    'QUIMICO': 'Fertilizante',
    'ORGANICO': 'Abono Orgánico',
    'OTRO': 'Otro Insumo'
  };
  return tipos[tipo] || tipo;
}

function validateFormData(formData, fechaSiembra, fechaCosecha) {
  const fecha = new Date(formData.get('fecha'));
  const producto = formData.get('fertilizante').trim();

  if (!producto) return 'El nombre del producto es obligatorio';
  if (fecha < fechaSiembra) return 'La fecha no puede ser anterior a la siembra';
  if (fecha > fechaCosecha) return 'La fecha no puede ser posterior a la cosecha';
  return null;
}

function submitFormData(cultivoId, formData) {
  return fetch(`/Cultivo/fertilizar/${cultivoId}/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
    },
    body: formData
  }).then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  });
}

function showSuccessAlert() {
  return Swal.fire({
    title: '<i class="fas fa-check-circle text-success me-2"></i>¡Registro exitoso!',
    html: 'Los datos nutricionales se guardaron correctamente',
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false
  }).then(() => window.location.reload());
}

// =============================================
// RENDERIZADO DE TARJETAS (OPCIONAL)
// =============================================
function renderCultivoCard(cultivo) {
  const card = document.createElement('div');
  card.className = 'col-lg-4 col-md-6 mb-4 cultivo-item';
  card.setAttribute('data-nombre', cultivo.nombre.toLowerCase());
  card.setAttribute('data-tipo', cultivo.tipo?.nombre_tipo.toLowerCase() || '');

  card.innerHTML = `
    <div class="card h-100">
      <img src="${cultivo.foto || '/static/img/default-crop.jpg'}" 
           class="card-img-top crop-image" alt="${cultivo.nombre}">
      <div class="card-body">
        <h5 class="card-title">${cultivo.nombre}</h5>
        <p class="card-text">
          <i class="fas fa-tag"></i> ${cultivo.tipo?.nombre_tipo || 'Sin tipo'}<br>
          <i class="fas fa-calendar-day"></i> Siembra: ${formatDate(cultivo.fecha_siembra)}<br>
          <i class="fas fa-calendar-check"></i> Cosecha: ${formatDate(cultivo.fecha_cosecha)}
        </p>
      </div>
      <div class="card-footer bg-transparent">
        <button onclick="abrirRegistroNutricional(${cultivo.id})" 
                class="btn btn-sm btn-success w-100">
          <i class="fas fa-seedling me-1"></i>Gestión Nutricional
        </button>
      </div>
    </div>
  `;
  return card;
}

function formatDate(dateString) {
  if (!dateString) return 'No definida';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

// ===============================
// Sistema de Notificaciones - CULTIVO
// ===============================

// Evento para abrir/cerrar el panel de notificaciones
document.getElementById('campanaNotificacionesCultivo').addEventListener('click', function (event) {
    event.stopPropagation(); // Evita que el click se propague y cierre el panel inmediatamente

    const panel = document.getElementById('panelNotificacionesCultivo');
    panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';

    // Llamada a la API específica de Cultivo
    fetch('/cultivos/notificaciones/')
        .then(res => res.json())
        .then(data => {
            const lista = document.getElementById('listaNotificacionesCultivo');
            lista.innerHTML = '';

            if (data.notificaciones.length === 0) {
                lista.innerHTML = '<li>No hay notificaciones.</li>';
                return;
            }

            data.notificaciones.forEach(n => {
                const li = document.createElement('li');
                li.innerHTML = `<b>[${n.tipo}]</b> ${n.mensaje} <br><small>${n.fecha}</small>`;
                lista.appendChild(li);
            });
        })
        .catch(err => {
            console.error('Error al cargar notificaciones de cultivos:', err);
        });
});

// Mostrar/Ocultar historial de notificaciones
function toggleHistorialNotificacionesCultivo() {
    const dropdown = document.getElementById('historial-notificaciones-cultivo');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

// Cerrar paneles si se hace clic fuera
document.addEventListener('click', function (event) {
    const panel = document.getElementById('panelNotificacionesCultivo');
    const bell = document.getElementById('campanaNotificacionesCultivo');

    if (!panel.contains(event.target) && !bell.contains(event.target)) {
        panel.style.display = 'none';
    }

    const historial = document.getElementById('historial-notificaciones-cultivo');
    if (!historial.contains(event.target) && event.target.id !== 'toggleHistorialCultivo') {
        historial.style.display = 'none';
    }
});

