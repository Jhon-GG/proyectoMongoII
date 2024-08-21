document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
    loadNowPlayingMovies();
    loadComingSoonMovies();
    initializeCarousel();
});

function updateUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('usuarioActual'));
    console.log('Usuario recuperado:', userInfo);

    if (userInfo) {
        const avatarImg = document.getElementById('user-avatar');
        const userGreeting = document.getElementById('user-greeting');

        if (avatarImg) {
            avatarImg.src = userInfo.imagen_usuario;
            avatarImg.alt = `${userInfo.nombre}'${userInfo.apellido}'s Avatar`;
            console.log('Avatar src:', avatarImg.src);
        } else {
            console.log('No se encontró el elemento de la imagen del avatar');
        }

        if (userGreeting) {
            userGreeting.textContent = `Hola, ${userInfo.nombre} ${userInfo.apellido} !`;
        } else {
            console.log('No se encontró el elemento del saludo');
        }

        if (avatarImg && userInfo.imagen_usuario) {
            avatarImg.src = userInfo.imagen_usuario;
            console.log('Forzando actualización de imagen:', avatarImg.src);
        }
    } else {
        console.log('No se encontró información del usuario en localStorage');
    }
}



async function loadComingSoonMovies() {
    try {
        const response = await fetch('http://localhost:5001/api/peliculas/estado/Próximo%20estreno');
        const movies = await response.json();
        const container = document.getElementById('coming-soon-container');
        container.innerHTML = '';
        movies.forEach(movie => {
            const movieElement = createComingSoonMovieElement(movie);
            container.appendChild(movieElement);
        });
    } catch (error) {
        console.error('Error al cargar próximas películas:', error);
    }
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


async function loadNowPlayingMovies() {
    try {
        const res = await fetch('http://localhost:5001/api/peliculas/estado/En%20cartelera');
        const peliculas = await res.json();
        const contenedorPeliculas = document.getElementById('now-playing-container');
        contenedorPeliculas.innerHTML = '';

        peliculas.forEach(pelicula => {
            const elementoPelicula = createMovieElement(pelicula);
            contenedorPeliculas.appendChild(elementoPelicula);
        });

        initializeCarousel(); // Inicializar el carrusel después de cargar las películas
    } catch (error) {
        console.error('Error al cargar películas en cartelera:', error);
    }
}

function createMovieElement(pelicula) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'cards_eachOne';
    
    cardDiv.onclick = () => {
        window.location.href = `../views/cinemaSelection.html?peliculaId=${pelicula.id}`;
    };
    
    cardDiv.innerHTML = `
        <div class="cards_img">
            <img src="${pelicula.imagen_pelicula}" alt="${pelicula.titulo}" loading="lazy" onerror="this.src='path_to_default_image.jpg'">
        </div>
        <div class="cards_content">
            <h1>${pelicula.titulo}</h1>
            <p>${pelicula.genero}</p>
        </div>
    `;
    
    return cardDiv;
}


function initializeCarousel() {
    const carouselContainer = document.querySelector('.cards_container');
    const indicadorCarousel = document.createElement('div');
    indicadorCarousel.className = 'carousel-indicators';
    carouselContainer.parentNode.insertBefore(indicadorCarousel, carouselContainer.nextSibling);

    const peliculasCards = document.querySelectorAll('.cards_eachOne');

    // Clonar las tarjetas para crear un efecto infinito
    const cantidadClones = 3;
    for (let i = 0; i < cantidadClones; i++) {
        peliculasCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.onclick = card.onclick;
            carouselContainer.appendChild(clone);
        });
    }

    const todasLasCards = document.querySelectorAll('.cards_eachOne');
    const anchoTarjeta = peliculasCards[0].offsetWidth;
    const anchoContenedor = carouselContainer.offsetWidth;
    const tarjetasVisibles = Math.floor(anchoContenedor / anchoTarjeta);
    const pasoScroll = anchoTarjeta * tarjetasVisibles;
    const anchoTotal = anchoTarjeta * peliculasCards.length;

    // Posicionar el scroll en el centro
    const indiceInicial = Math.floor(peliculasCards.length / 2);
    carouselContainer.scrollLeft = anchoTarjeta * indiceInicial;

    // Crear 5 indicadores fijos
    for (let i = 0; i < 5; i++) {
        const botonIndicador = document.createElement('button');
        botonIndicador.dataset.index = i;
        indicadorCarousel.appendChild(botonIndicador);
    }

    const indicadores = document.querySelectorAll('.carousel-indicators button');

    function actualizarIndicadorActivo() {
        const posicionScroll = carouselContainer.scrollLeft;
        const posicionAjustadaScroll = posicionScroll % anchoTotal;
        const indiceActivo = Math.floor((posicionAjustadaScroll / anchoTotal) * 5);
        
        indicadores.forEach((indicador, i) => {
            if (i === indiceActivo) {
                indicador.classList.add('active');
                indicador.style.width = '24px';
            } else {
                indicador.classList.remove('active');
                indicador.style.width = '8px';
            }
        });
    }

    function manejarScrollInfinito() {
        const scrollIzquierdo = carouselContainer.scrollLeft;
        const maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;
        
        if (scrollIzquierdo <= 0) {
            carouselContainer.scrollLeft = anchoTotal;
        } else if (scrollIzquierdo >= maxScroll) {
            carouselContainer.scrollLeft = anchoTotal;
        }
    }

    function actualizarVisibilidadTarjetas() {
        const centroContenedor = carouselContainer.offsetWidth / 2;
        const posicionScroll = carouselContainer.scrollLeft;
        
        todasLasCards.forEach((card) => {
            const centroCard = card.offsetLeft - posicionScroll + (card.offsetWidth / 2);
            const distanciaDesdeElCentro = Math.abs(centroContenedor - centroCard);
            
            if (distanciaDesdeElCentro < card.offsetWidth / 2) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    carouselContainer.addEventListener('scroll', () => {
        actualizarIndicadorActivo();
        manejarScrollInfinito();
        actualizarVisibilidadTarjetas();
    });

    indicadores.forEach((boton, index) => {
        boton.addEventListener('click', () => {
            const posicionScroll = (anchoTotal / 5) * index + anchoTotal;
            carouselContainer.scrollTo({
                left: posicionScroll,
                behavior: 'smooth'
            });
        });
    });

    actualizarIndicadorActivo();
    actualizarVisibilidadTarjetas();
}
