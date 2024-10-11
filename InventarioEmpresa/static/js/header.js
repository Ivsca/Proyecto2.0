async function Race(ancho = '50%', alto = '98vh') {
    const { value: formValues } = await Swal.fire({
        html: document.getElementById('box_race').innerHTML,
        width: ancho,  // ncho del modal personalizado
        heightAuto: false,  // Desactivar ajuste automático de altura
        padding: '2em',  // Margen interno
        showCloseButton: false,  // Mostrar botón de cerrar
        showConfirmButton: false,  // Eliminar botón "OK"
        customClass: {
            popup: 'custom-popup',  // Clase personalizada
        },
        backdrop: `rgba(0, 0, 0, 0.4)`  // Fondo oscuro
    });

}

async function cosecha(ancho = '50%', alto = '95vh') {
    const { value: formValues } = await Swal.fire({
        html: document.getElementById('box_cosecha').innerHTML,
        width: ancho,  // ncho del modal personalizado
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