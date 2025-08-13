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
