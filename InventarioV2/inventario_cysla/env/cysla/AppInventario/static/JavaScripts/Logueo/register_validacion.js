function setValidState(inputId, isValid, errorMessage = "") {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`error${inputId}`);

    if (isValid) {
        input.classList.remove("border-red-500");
        input.classList.add("border-green-500");
        errorSpan.textContent = "";
    } else {
        input.classList.remove("border-green-500");
        input.classList.add("border-red-500");
        errorSpan.textContent = errorMessage;
    }
}

function validarUsername() {
    const val = document.getElementById("username").value.trim();
    if (val === "" || val.length < 6) {
        setValidState("username", false, "Debe tener al menos 6 caracteres.");
        return false;
    }
    setValidState("username", true);
    return true;
}

function validarNombres() {
    const val = document.getElementById("nombres").value.trim();
    if (val.length < 3) {
        setValidState("nombres", false, "Debe tener al menos 3 caracteres.");
        return false;
    }
    setValidState("nombres", true);
    return true;
}

function validarApellidos() {
    const val = document.getElementById("apellidos").value.trim();
    if (val.length < 6) {
        setValidState("apellidos", false, "Debe tener al menos 6 caracteres.");
        return false;
    }
    setValidState("apellidos", true);
    return true;
}

function validarCorreoRegistro() {
    const val = document.getElementById("correo").value.trim();
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(val)) {
        setValidState("correo", false, "Correo inválido.");
        return false;
    }
    setValidState("correo", true);
    return true;
}

function validarTipoDocumento() {
    const val = document.getElementById("tipoDocumento").value;
    if (!val) {
        setValidState("tipoDocumento", false, "Debe seleccionar un tipo de documento.");
        return false;
    }
    setValidState("tipoDocumento", true);
    return true;
}

function validarNumeroDocumento() {
    const val = document.getElementById("numeroDocumento").value.trim();
    if (!/^\d+$/.test(val)) {
        setValidState("numeroDocumento", false, "Solo se permiten números.");
        return false;
    } else if (val.length < 10) {
        setValidState("numeroDocumento", false, "Debe tener al menos 10 dígitos.");
        return false;
    }
    setValidState("numeroDocumento", true);
    return true;
}

function validarClaveRegistro() {
    const val = document.getElementById("clave1").value;
    if (val.length < 6 || !/[A-Z]/.test(val) || !/[a-z]/.test(val) || !/[0-9]/.test(val)) {
        setValidState("clave1", false, "Debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.");
        return false;
    }
    setValidState("clave1", true);
    return true;
}

function validarConfirmacionClave() {
    const pass1 = document.getElementById("clave1").value;
    const pass2 = document.getElementById("clave2").value;
    if (pass1 !== pass2 || pass2 === "") {
        setValidState("clave2", false, "Las contraseñas no coinciden.");
        return false;
    }
    setValidState("clave2", true);
    return true;
}

// Validación final al enviar
document.getElementById("registerForm").addEventListener("submit", function (e) {
    const valid =
        validarUsername() &&
        validarNombres() &&
        validarApellidos() &&
        validarCorreoRegistro() &&
        validarTipoDocumento() &&
        validarNumeroDocumento() &&
        validarClaveRegistro() &&
        validarConfirmacionClave();

    if (!valid) {
        e.preventDefault();
    }
});

// Validar Username
function validarUsername() {
    let username = document.getElementById("username").value.trim();
    let error = document.getElementById("errorusername");

    if (username.length < 4 || username.length > 20) {
        error.innerText = "Debe tener entre 4 y 20 caracteres.";
        return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        error.innerText = "Solo se permiten letras, números y guión bajo.";
        return false;
    }
    error.innerText = "";
    return true;
}

// Validar Correo
function validarCorreoRegistro() {
    let correo = document.getElementById("correo").value.trim();
    let error = document.getElementById("errorcorreo");

    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(correo)) {
        error.innerText = "Ingrese un correo válido.";
        return false;
    }
    error.innerText = "";
    return true;
}

// Validar Documento
function validarNumeroDocumento() {
    let doc = document.getElementById("numeroDocumento").value.trim();
    let error = document.getElementById("errornumeroDocumento");

    if (!/^\d+$/.test(doc)) {
        error.innerText = "Solo números permitidos.";
        return false;
    }
    if (doc.length < 6 || doc.length > 12) {
        error.innerText = "Debe tener entre 6 y 12 dígitos.";
        return false;
    }
    error.innerText = "";
    return true;
}

// Validar Contraseña
function validarClaveRegistro() {
    let clave = document.getElementById("clave1").value;
    let error = document.getElementById("errorclave1");

    if (clave.length < 8) {
        error.innerText = "Debe tener mínimo 8 caracteres.";
        return false;
    }
    if (!/[A-Z]/.test(clave)) {
        error.innerText = "Debe contener al menos una mayúscula.";
        return false;
    }
    if (!/[0-9]/.test(clave)) {
        error.innerText = "Debe contener al menos un número.";
        return false;
    }
    error.innerText = "";
    return true;
}

// Validar Confirmación
function validarConfirmacionClave() {
    let clave1 = document.getElementById("clave1").value;
    let clave2 = document.getElementById("clave2").value;
    let error = document.getElementById("errorclave2");

    if (clave1 !== clave2) {
        error.innerText = "Las contraseñas no coinciden.";
        return false;
    }
    error.innerText = "";
    return true;
}

// Validar Tipo de Documento
function validarTipoDocumento() {
    let tipo = document.getElementById("tipoDocumento").value;
    let error = document.getElementById("errortipoDocumento");

    if (tipo === "") {
        error.innerText = "Seleccione un tipo de documento.";
        return false;
    }
    error.innerText = "";
    return true;
}
