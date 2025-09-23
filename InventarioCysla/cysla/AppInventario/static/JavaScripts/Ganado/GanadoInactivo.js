// static/JavaScripts/Ganado/inactivas.js

// Función para activar vacuno
function ActivarVacuno(id) {
    Swal.fire({
        title: '¿Activar vacuno?',
        text: 'El vacuno volverá al inventario principal.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, activar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/Ganado/Tabla/Activar/vacuno/${id}`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCSRFToken()
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: '¡Activado!',
                        text: 'El vacuno ha sido restaurado al inventario principal.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire('Error', 'No se pudo activar el vacuno.', 'error');
                }
            })
            .catch(() => {
                Swal.fire('Error', 'Error de conexión.', 'error');
            });
        }
    });
}

// Función para obtener el token CSRF
function getCSRFToken() {
    return document.querySelector('[name=csrf-token]')?.content ||
           document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
}