

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

//Fertilizante

function abrirFertilizacion(cultivoId) {
  fetch(`/Cultivo/fertilizaciones/${cultivoId}/`)
    .then(response => response.json())
    .then(data => {
      const historial = data.fertilizaciones;
      const yaTieneFertilizaciones = historial.length > 0;

      const fechaSiembra = new Date(data.fecha_siembra);
      const fechaCosecha = new Date(data.fecha_cosecha);

      // Historial HTML
      let historialHtml = '';
      if (yaTieneFertilizaciones) {
        historialHtml = `
          <hr><h5 class="mt-3">Historial de fertilización</h5>
          ${historial.map(f => `
            <div class="border rounded p-2 mb-2 bg-light">
              <p class="mb-1"><strong>Fecha:</strong> ${f.fecha}</p>
              <p class="mb-1"><strong>Fertilizante:</strong> ${f.fertilizante}</p>
              <p class="mb-0"><strong>Observaciones:</strong> ${f.observaciones || 'Ninguna'}</p>
            </div>
          `).join('')}
          <div class="text-center">
            <button id="mostrarFormularioBtn" class="btn btn-success btn-sm mt-3">Agregar nueva fertilización</button>
          </div>
        `;
      }

      // Formulario oculto
      const formHtml = `
        <form id="fertilizacionForm" class="text-start" style="display: ${yaTieneFertilizaciones ? 'none' : 'block'};">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="fecha" class="form-label">Fecha:</label>
              <input type="date" name="fecha" id="fecha" class="form-control" required>
            </div>
            <div class="col-md-6 mb-3">
              <label for="fertilizante" class="form-label">Fertilizante:</label>
              <input type="text" name="fertilizante" id="fertilizante" class="form-control" required>
            </div>
          </div>
          <div class="mb-3">
            <label for="observaciones" class="form-label">Observaciones: (opcional)</label>
            <textarea name="observaciones" id="observaciones" class="form-control" rows="2"></textarea>
          </div>
        </form>
      `;

      Swal.fire({
        title: 'Fertilización del cultivo',
        html: formHtml + historialHtml,
        width: '60%',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        focusConfirm: false,
        didOpen: () => {
          // Mostrar formulario al hacer clic
          const btn = document.getElementById('mostrarFormularioBtn');
          if (btn) {
            btn.addEventListener('click', () => {
              document.getElementById('fertilizacionForm').style.display = 'block';
              btn.style.display = 'none';
            });
          }
        },
        preConfirm: () => {
          const form = document.getElementById('fertilizacionForm');
          if (!form || form.style.display === 'none') {
            Swal.showValidationMessage('Haz clic en "Agregar nueva fertilización" para continuar.');
            return false;
          }

          const fechaFert = new Date(form.querySelector('input[name="fecha"]').value);
          const fertilizante = form.querySelector('input[name="fertilizante"]').value;

          if (!fertilizante.trim()) {
            Swal.showValidationMessage('El fertilizante no puede estar vacío.');
            return false;
          }

          if (fechaFert < fechaSiembra) {
            Swal.showValidationMessage('La fecha de fertilización no puede ser anterior a la siembra.');
            return false;
          }

          if (fechaFert > fechaCosecha) {
            Swal.showValidationMessage('La fecha de fertilización no puede ser posterior a la cosecha.');
            return false;
          }

          const formData = new FormData(form);
          return fetch(`/Cultivo/fertilizar/${cultivoId}/`, {
            method: 'POST',
            headers: {
              'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
            },
            body: formData
          })
          .then(response => {
            if (!response.ok) throw new Error('Error al guardar fertilización');
            return response.json();
          })
          .catch(error => {
            Swal.showValidationMessage(error.message);
          });
        }
      }).then(result => {
        if (result.isConfirmed) {
          Swal.fire('¡Guardado!', 'Información de fertilización registrada ✅', 'success')
            .then(() => window.location.reload());
        }
      });
    });
}
