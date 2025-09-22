
// animacion del form
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

// Validacion de los campos del form de login
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

function validarNombre() {
    const user_name = document.getElementById("UserName").value.trim();
    if (user_name === "") {
        setValidState("UserName", false, "El nombre de usuario es obligatorio.");
        return false;
    } else if (user_name.length < 3) {
        setValidState("UserName", false, "Debe tener al menos 3 caracteres.");
        return false;
    }
    setValidState("UserName", true);
    return true;
}

function validarCorreo() {
    const correo = document.getElementById("Correo").value.trim();
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo === "") {
        setValidState("Correo", false, "El correo es obligatorio.");
        return false;
    } else if (!regexCorreo.test(correo)) {
        setValidState("Correo", false, "El formato del correo es inválido.");
        return false;
    }
    setValidState("Correo", true);
    return true;
}

function validarClave() {
    const clave = document.getElementById("Clave").value;
    if (clave === "") {
        setValidState("Clave", false, "La contraseña es obligatoria.");
        return false;
    } else if (clave.length < 6) {
        setValidState("Clave", false, "Debe tener al menos 6 caracteres.");
        return false;
    } else if (!/[A-Z]/.test(clave)) {
        setValidState("Clave", false, "Debe contener al menos una letra mayúscula.");
        return false;
    } else if (!/[a-z]/.test(clave)) {
        setValidState("Clave", false, "Debe contener al menos una letra minúscula.");
        return false;
    } else if (!/[0-9]/.test(clave)) {
        setValidState("Clave", false, "Debe contener al menos un número.");
        return false;
    }
    setValidState("Clave", true);
    return true;
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
    const validNombre = validarNombre();
    const validCorreo = validarCorreo();
    const validClave = validarClave();

    if (!(validNombre && validCorreo && validClave)) {
        e.preventDefault(); // Evita el envío si hay errores
    }
});


