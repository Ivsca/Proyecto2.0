function VerInformacionGanado(id_ganado, ancho = '90%', alto = '97vh') {
    // Obtiene el contenido oculto del HTML de la página
    let contenidoGanado = document.getElementById(`ganado-detalle-${id_ganado}`).innerHTML;

    // Muestra el contenido en la alerta de SweetAlert sin el botón de confirmación "OK"
    Swal.fire({
        title: 'Detalles del Ganado',
        html: contenidoGanado,  // Aquí inyectamos el HTML de la vista detallada
        width: ancho,  // El ancho es dinámico, puedes pasarlo como parámetro
        padding: '3em',
        showCloseButton: true,  // Solo mostramos el botón de cerrar
        focusConfirm: false,
        showCancelButton: false,
        showConfirmButton: false,  // Elimina el botón "OK"
        heightAuto: false,  // Desactiva el ajuste automático de altura
        customClass: {
            popup: 'custom-popup',  // Aplica una clase personalizada para ajustar el alto
        },
    });
}

function mas_grande(button) {
    // Obtiene el contenedor más cercano con la clase .caja_mas_detaller_vacuno
    let contenedor = button.nextElementSibling;
    if (contenedor.classList.contains('expandido')) {
        contenedor.classList.remove('expandido'); // Contrae el div
    } else {
        contenedor.classList.add('expandido'); // Expande el div
    }
}


function borrar_vacuno(id) {
    Swal.fire({
        title: "Eliminar",
        text: "¿Deseas eliminar este vacuno?",
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
                location.href = '/ganado/borrar/' + id;
            }, 1200);
        }
    });
}



async function agregar_vacuno(ancho = '90%', alto = '95vh') {
    const { value: formValues } = await Swal.fire({
        html: document.getElementById('swal-form-ganado').innerHTML,
        width: ancho,  // Hacer el ancho del modal del 100% de la pantalla
        heightAuto: false,  // Desactiva el ajuste automático de altura
        padding: '2em',  // Margen interno más reducido
        showCloseButton: true,  // Muestra el botón de cerrar
        showConfirmButton: false,  // Elimina el botón "OK"
        customClass: {
            popup: 'custom-popup',  // Clase personalizada
        },
        backdrop: `
            rgba(0, 0, 0, 0.4)  // Fonde de la alerta un poco más oscuro
        `
    });
}

async function Actualizar_vacuno(id_vacuno, ancho = '90%', alto = '95vh') {
    const { value: formValues } = await Swal.fire({
        html: document.getElementById(`swal-form-ganado_actualizar-${id_vacuno}`).innerHTML,
        width: ancho,  // Ancho del modal personalizado
        heightAuto: false,  // Desactivar ajuste automático de altura
        padding: '2em',  // Margen interno
        showCloseButton: true,  // Mostrar botón de cerrar
        showConfirmButton: false,  // Eliminar botón "OK"
        customClass: {
            popup: 'custom-popup',  // Clase personalizada
        },
        backdrop: `rgba(0, 0, 0, 0.4)`  // Fondo oscuro
    });

}

// function ValoresFormActualizar(id_vacuno){
//     // por aca tengo que validar los campos del form
//     let popup = Swal.getPopup();
//     let codigo = popup.querySelector('#codigo1').value;
//     let crias = popup.querySelector('#crias1').value;
//     let CodigoPapa = popup.querySelector('#CodigoPapa1').value;
//     let CodigoMama = popup.querySelector('#CodigoMama1').value;
//     let raza = popup.querySelector('#raza1').value;
//     let edad = popup.querySelector('#edad1').value;
//     let proposito = popup.querySelector('#proposito1').value;
//     let estado = popup.querySelector('#estado1').value;
//     let vacunas = popup.querySelector('#vacunas1').value;
//     let Dia_vacunada = popup.querySelector('#Dia_vacunada1').value;
//     let Dia_caduca_vacunada = popup.querySelector('#Dia_caduca_vacunada1').value;
//     let parcela = popup.querySelector('#parcela1').value;
//     let alimentacion = popup.querySelector('#alimentacion1').value;
//     let enfermedades = popup.querySelector('#enfermedades1').value;
//     let origen = popup.querySelector('#origen1').value;

//     let agregarUrl = `/ganado/actualizar/${id_vacuno}/${encodeURIComponent(codigo)}/${encodeURIComponent(crias)}/${encodeURIComponent(CodigoPapa)}/${encodeURIComponent(CodigoMama)}/${encodeURIComponent(raza)}/${encodeURIComponent(edad)}/${encodeURIComponent(proposito)}/${encodeURIComponent(estado)}/${encodeURIComponent(vacunas)}/${encodeURIComponent(Dia_vacunada)}/${encodeURIComponent(Dia_caduca_vacunada)}/${encodeURIComponent(parcela)}/${encodeURIComponent(alimentacion)}/${encodeURIComponent(enfermedades)}/${encodeURIComponent(origen)}/`;

//     Swal.fire({
//         title: "¡Enviado!",
//         text: "La información ha sido enviada correctamente.",
//         icon: "success",
//         showConfirmButton: false,
//         timer: 1500
//     });

//     setTimeout(() => {
//         location.href = agregarUrl;
//     }, 1200);
// }