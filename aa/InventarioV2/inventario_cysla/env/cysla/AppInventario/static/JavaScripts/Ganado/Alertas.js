// Función para eliminar con Vacuno
function EliminarVacuno(id) {
    Swal.fire({
        title: 'Confirmar eliminación',
        text: "¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "¡Eliminacion exitosa!",
                text: "¡Que tengas un feliz día!",
                icon: "success"
            });

            setTimeout(() => {
                location.href = 'Ganado/Tabla/Eliminar/vacuno/' + id;
            }, 1200);
        }
    });
}
