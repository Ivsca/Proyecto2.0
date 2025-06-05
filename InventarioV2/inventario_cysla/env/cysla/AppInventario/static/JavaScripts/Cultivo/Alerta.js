

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
            const form = document.getElementById('formCultivo');
            const formData = new FormData(form);

            const imagen = form.querySelector('#cattleImage').files[0];

            if (!imagen) {
                Swal.showValidationMessage('Debes subir una imagen del cultivo.');
                return false;
            }

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
            .then(() => location.reload());
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
                    const form = document.getElementById('formCultivoEditar');
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
                        .then(() => location.reload());
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
                    location.reload(); // recargar la página
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

//Tipo Cultivos


