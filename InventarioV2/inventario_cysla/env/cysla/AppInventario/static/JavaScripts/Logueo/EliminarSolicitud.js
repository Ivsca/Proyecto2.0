function EliminarSolicitud(id) {
    id = parseInt(id);

    Swal.fire({
        title: "¿Quieres eliminar esta solicitud?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarla"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `/Logueo/TablaSolicitudesUser/Eliminar/${id}`;
        }
    });
}
