function VerInformacionCultivo(id_cultivo) {
    // Obtiene el contenido oculto del HTML de la página
    let contenidoCultivo = document.getElementById(`cultivo-detalle-${id_cultivo}`).innerHTML;

    // Muestra el contenido en la alerta de SweetAlert
    Swal.fire({
        title: 'Detalles del Cultivo',
        html: contenidoCultivo,  // Aquí inyectamos el HTML de la vista detallada
        width: '80%',  // Ancho al 80% de la pantalla (puedes ajustar este valor)
        padding: '3em',
        showCloseButton: true,
        focusConfirm: false,
        showCancelButton: false,
        confirmButtonText: 'Cerrar',
        heightAuto: false,  // Desactiva el ajuste automático de altura
    });
}


function borrar_info(id) {
    Swal.fire({
        title: "Eliminar",
        text: "¿Deseas eliminar este cultivo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "!Eliminar¡"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "¡Eliminacion exitosa!",
                text: "¡Que tengas un feliz día!",
                icon: "success"
            });

            setTimeout(() => {
                location.href = '/cultivos/borrar/' + id;
            }, 1200);
        }
    });
}


async function EditarCultivo() {
    const { value: formValues } = await Swal.fire({
        title: 'Agregar Cultivo',
        html: document.getElementById('swal-form').innerHTML,
        showConfirmButton: false,
        focusConfirm: false,
    });
}

function Agregar_valores() {
    let popup = Swal.getPopup();
    let CategoriaCultivo = popup.querySelector('#CategoriaCultivo').value;
    let TipoCultivo = popup.querySelector('#Tipo_Cultivo').value;
    let Descripcion = popup.querySelector('#Descripcion').value;
    let cantidad = popup.querySelector('#cantidad').value;
    let fechaCosechado = popup.querySelector('#fecha_cosechado').value;

    let agregarUrl = `/cultivos/agregar/${encodeURIComponent(CategoriaCultivo)}/${encodeURIComponent(TipoCultivo)}/${encodeURIComponent(Descripcion)}/${encodeURIComponent(cantidad)}/${encodeURIComponent(fechaCosechado)}/`;

    Swal.fire({
        title: "¡Enviado!",
        text: "La información ha sido enviada correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
    });

    setTimeout(() => {
        location.href = agregarUrl;
    }, 1200);
}

async function agregar_cultivo() {
    const { value: formValues } = await Swal.fire({
        title: 'Agregar Cultivo',
        html: document.getElementById('swal-form').innerHTML,
        showConfirmButton: false,
        focusConfirm: false,
    });
}