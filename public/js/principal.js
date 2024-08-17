document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
    loadNowPlayingMovies();
    loadComingSoonMovies();
});

function updateUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('usuarioActual'));
    console.log('Usuario recuperado:', userInfo); // Para depuración

    if (userInfo) {
        const avatarImg = document.getElementById('user-avatar');
        const userGreeting = document.getElementById('user-greeting');

        if (avatarImg) {
            avatarImg.src = userInfo.imagen_usuario;
            avatarImg.alt = `${userInfo.nombre}'s Avatar`;
            console.log('Avatar src:', avatarImg.src); // Para depuración
        } else {
            console.log('No se encontró el elemento de la imagen del avatar');
        }

        if (userGreeting) {
            userGreeting.textContent = `Hi, ${userInfo.nombre}!`;
        } else {
            console.log('No se encontró el elemento del saludo');
        }

        // Forzar la actualización de la imagen
        if (avatarImg && userInfo.imagen_usuario) {
            avatarImg.src = userInfo.imagen_usuario;
            console.log('Forzando actualización de imagen:', avatarImg.src);
        }
    } else {
        console.log('No se encontró información del usuario en localStorage');
    }
}

async function loadNowPlayingMovies() {
    try {
        const response = await fetch('http://localhost:5001/api/peliculas/estado/En%20cartelera');
        const movies = await response.json();
        const container = document.getElementById('now-playing-container');
        container.innerHTML = ''; // Limpiar el contenedor
        movies.forEach(movie => {
            const movieElement = createMovieElement(movie);
            container.appendChild(movieElement);
        });
    } catch (error) {
        console.error('Error al cargar películas en cartelera:', error);
    }
}

async function loadComingSoonMovies() {
    try {
        const response = await fetch('http://localhost:5001/api/peliculas/estado/Próximo%20estreno');
        const movies = await response.json();
        const container = document.getElementById('coming-soon-container');
        container.innerHTML = ''; // Limpiar el contenedor
        movies.forEach(movie => {
            const movieElement = createComingSoonMovieElement(movie);
            container.appendChild(movieElement);
        });
    } catch (error) {
        console.error('Error al cargar próximas películas:', error);
    }
}

function createMovieElement(movie) {
    const div = document.createElement('div');
    div.className = 'cards_eachOne';
    div.innerHTML = `
        <div class="cards_img">
            <img src="${movie.imagen_pelicula}" alt="${movie.titulo}">
        </div>
        <div class="cards_content">
            <h1>${movie.titulo}</h1>
            <p>${movie.genero}</p>
        </div>
    `;
    return div;
}

function createComingSoonMovieElement(movie) {
    const releaseYear = new Date(movie.estreno).getFullYear();
    const div = document.createElement('div');
    div.className = 'card2';
    div.innerHTML = `
        <div class="card2_img">
            <img src="${movie.imagen_pelicula}" alt="${movie.titulo}">
        </div>
        <div class="card2_title">
            <p>${movie.titulo} (${releaseYear})</p>
            <p1>${movie.genero}</p1>
        </div>
    `;
    return div;
}