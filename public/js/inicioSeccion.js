document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const alias = document.querySelector('#alias-input').value;
        const password = document.querySelector('#password-input').value;
        
        try {
            const url = 'http://localhost:5001/api/usuarios/todos';
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (response.ok && result && result.length > 0) {
                const usuarioEncontrado = result.find(u => u.alias === alias && u.cc.toString() === password);
                if (usuarioEncontrado) {
                    // Guardar la información completa del usuario en localStorage
                    localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
                    console.log('Usuario guardado:', usuarioEncontrado); // Para depuración
                    window.location.href = './views/movieHome.html';
                } else {
                    mostrarError('Usuario o contraseña incorrectos');
                }
            } else {
                mostrarError('No se pudo obtener la lista de usuarios');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Ocurrió un error al intentar iniciar sesión');
        }
    });

    function mostrarError(mensaje) {
        const errorMessage = document.querySelector('#error-message');
        errorMessage.textContent = mensaje;
    }
});


if (window.location.pathname.includes('movieHome.html')) {
    const userInfo = JSON.parse(localStorage.getItem('usuarioActual'));
    if (userInfo) {

        const avatarImg = document.querySelector('.avatar');
        if (avatarImg) {
            avatarImg.src = userInfo.imagen_usuario;
            avatarImg.alt = `${userInfo.nombre}'s Avatar`;
        }

        const userNameSpan = document.querySelector('.user-info span');
        if (userNameSpan) {
            userNameSpan.textContent = `Hi, ${userInfo.nombre}!`;
        }
    } else {
        console.error('No se encontró información del usuario');
    }
}