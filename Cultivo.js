// header

const toggleMenu = document.getElementById('toggleMenu');
const menu = document.getElementById('menu');

toggleMenu.addEventListener('click', () => {
  menu.classList.toggle('mostrar');
});


function mostrarFormulario() {
    document.getElementById('formularioEditar').style.display = 'block';
    document.body.classList.add('mostrar-modal');
}

function cerrarFormulario() {
    document.getElementById('formularioEditar').style.display = 'none';
    document.body.classList.remove('mostrar-modal');
}

function abrirFormularioVer() {
    document.getElementById("formularioVer").style.display = "block";
    document.body.classList.add('mostrar-modal');
}


function cerrarFormularioVer() {
    document.getElementById("formularioVer").style.display = "none";
    document.body.classList.remove('mostrar-modal');
}


function agregarFormulario() {
    document.getElementById("formularioAgregar").style.display = "block";
    document.body.classList.add('mostrar-modal');
}

function cerrarFormularioAgregar() {
    document.getElementById("formularioAgregar").style.display = "none";
    document.body.classList.remove('mostrar-modal');
}




