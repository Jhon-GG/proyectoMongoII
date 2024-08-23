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
        const response = await fetch('/api/peliculas/estado/Próximo%20estreno');
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
    const estrenoDate = new Date(movie.estreno);
    
    const formattedEstreno = estrenoDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long'
    });

    const div = document.createElement('div');
    div.className = 'card2';
    div.innerHTML = `
        <div class="card2_img" onclick="displayComingSoonMovieDetails(${movie.id})">
            <img src="${movie.imagen_pelicula}" alt="${movie.titulo}">
        </div>
        <div class="card2_title">
            <p>${movie.titulo} (${estrenoDate.getFullYear()})</p>
            <p1>${movie.genero}</p1>
        </div>
    `;
    return div;
}

async function loadNowPlayingMovies() {
    try {
        const res = await fetch('/api/peliculas/estado/En%20cartelera');
        const peliculas = await res.json();
        const contenedorPeliculas = document.getElementById('now-playing-container');
        contenedorPeliculas.innerHTML = '';

        peliculas.forEach(pelicula => {
            const elementoPelicula = createMovieElement(pelicula);
            contenedorPeliculas.appendChild(elementoPelicula);
        });

        // Llamar a initializeCarousel solo después de que se hayan cargado todas las películas
        initializeCarousel();
    } catch (error) {
        console.error('Error al cargar películas en cartelera:', error);
    }
}

function createMovieElement(pelicula) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'cards_eachOne';
    
    cardDiv.onclick = () => {
        showMovieInfo(pelicula.id);
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



async function displayComingSoonMovieDetails(movieId) {
    try {
        const response = await fetch(`/api/peliculas/${movieId}`);
        const movie = await response.json();
        
        if (movie.error) {
            console.error(movie.error);
            return;
        }

        document.body.innerHTML = `
            <div class="movie-details-container">
                <header class="header">
                    <div class="header_box">
                        <div class="header_content">
                            <img src="../storage/flecha.svg" alt="go back" onclick="goToHome()">
                            <h1>Próximos Estrenos</h1>
                            <img src="../storage/dots.svg" alt="dots">
                        </div>
                    </div>
                </header>
                <section class="first_box">
                    <div id="media-container" class="first_box_movie">
                        <img src="${movie.portada}" alt="${movie.titulo}">
                    </div>
                </section>
                <section class="second_box">
                    <div class="second_box_content">
                        <div class="second_box_left">
                            <h1>${movie.titulo}</h1>
                            <p>${movie.genero}</p>
                        </div>
                        <div class="second_box_right">
                            <button id="trailerButton" onclick="toggleTrailer('${movie.trailer}', '${movie.imagen_pelicula}')">
                                <span class="button_icon">▶</span> Ver Trailer
                            </button>
                        </div>
                    </div>
                </section>
                <section class="third-box">
                    <div class="third_box_content">
                        <p>${movie.sinopsis}</p>
                    </div>
                </section>
                <section class="box">
                    <div class="boxt_title">
                        <h1>Reparto</h1>
                    </div>
                </section>
                <section class="actors">
                    <div class="actors_box">
                        ${movie.actores && movie.actores.length > 0 ? movie.actores.map(actor => `
                            <div class="actors_main">
                                <div class="actors_img">
                                    <img src="${actor.imagen_actor}" alt="${actor.nombre}">
                                </div>
                                <div class="actors_content">
                                    <h1>${actor.nombre}</h1>
                                    <p>${actor.personaje}</p>
                                </div>
                            </div>
                        `).join('') : '<p>No hay información de actores disponible.</p>'}
                    </div>
                </section>
            </div>
        `;


        const styleElement = document.createElement('style');
        styleElement.textContent = `
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            /* position: fixed; */
            top: 0;
            left: 0;
        }
        
        body {
            font-family: Arial, sans-serif;
            background-color: #000;
            color: white;
            display: flex;
            flex-direction: column;
        }
        
        .header{
            display: flex;
            /* border: 1px solid green; */
            flex-direction: row;
            width: 100vw;
            height: 6vh;
            margin-top: 3%;
            justify-content: center;
            align-items: center;
        }
        
        .header_box{
            display: flex;
            /* border: 1px solid blue; */
            flex-direction: row;
            width: 86vw;
            height: 6vh;    
        }
        
        .header_content{
            display: flex;
            /* border: 1px solid red; */
            width: 86vw;
            height: 6vh;
            justify-content: space-between;
            align-items: center;
        }
        
        .header_content img{
            display: flex;
            /* border: 1px solid rgb(255, 230, 0); */
            width: 7vw;
            height: 6vh;
        }
        
        .header_content a{
            text-decoration: none;
        }
        
        .header_content h1{
            display: flex;
            /* border: 1px solid rgb(0, 255, 128); */
            font-size: 120%;
        } 
        
        .first_box{
            display: flex;
            /* border: 1px solid pink; */
            margin-top: 4%;
            width: 100vw;
            height: 25vh;
            justify-content: center;
            align-items: center;
        }
        
        .first_box_movie{
            display: flex;
            /* border: 1px solid blue; */
            width: 91vw;
            height: 25vh;
            justify-content: center;
            align-items: center;
            border-radius: 20px;
        }
        
        .first_box_movie img{
            display: flex;
            width: 91vw;
            height: 25vh;
            border-radius: 20px;
        }
        
        .second_box{
            display: flex;
            /* border: 1px solid yellow; */
            flex-direction: row;
            margin-top: 4%;
            width: 100vw;
            height: 5vh;
            align-items: center;
            justify-content: center;
        }
        
        .second_box_content{
            display: flex;
            /* border: 1px solid blue; */
            width: 86vw;
            height: 5vh;
            flex-direction: row;
            justify-content: space-between;
            align-items: start;
        }
        
        .second_box_left{
            display: flex;
            flex-direction: column;
            /* border: 1px solid red; */
            width: 50vw;
            height: 6vh;
        }
        
        .second_box_left h1{
            font-size: 100%;
            white-space: nowrap;
            overflow: hidden; 
            text-overflow: ellipsis;
        }
        
        .second_box_left p{
            font-size: 80%;
        }
        
        .second_box_right{
            display: flex;
            /* border: 1px solid purple; */
            width: 29vw;
            height: 3vh;
            justify-content: center;
            align-items: center;
        }
        
        .second_box_right button{
            display: flex;
            width:100%;
            height:100%;
            border: none;
            justify-content: center;
            align-items: center;
            background-color: #ff0000;
            color: #fff;
            border-radius: 8px;
            font-size: 70%;
            font-weight: bold;
        }
        
        .button_icon {
            margin-right: 10%; /* Ajusta el valor para el espaciado deseado */
            font-size: 100%; /* Ajusta el tamaño del símbolo si es necesario */
        }
        
        
        .third-box{
            display: flex;
            /* border: 1px solid green; */
            width: 100vw;
            align-items: center;
            margin-top: 2%;
        }
        
        .third_box_content{
            display: flex;
            /* border: 1px solid blue; */
            width: 83vw;
            height: 100%;
            margin-left: 6.8%;
        }
        
        .third_box_content p{
            font-size: 90%;
            font-weight: 500;
        }
        
        .box{
            display: flex;
            flex-direction: row;
            margin-top: 7%;
            /* border: 1px solid red; */
            justify-content: center;
            align-items: center;
        }
        
        .boxt_title{
            display: flex;
            /* border: 1px solid blue; */
            width: 86vw;
            height: 100%;
        }
        
        .boxt_title h1{
            font-size: 130%;
        }
        
        .actors{
            display: flex;
            flex-direction: row;
            margin-top: 2%;
            /* border: 1px solid green; */
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 10vh;
        }
        
        .actors_box{
            display: flex;
            flex-direction: row;
            /* border: 1px solid violet; */
            width: 86vw;
            height: 100%; 
            align-items: center;
            overflow-x: auto;
            gap: 15px;
            scrollbar-width: none;
        }
        
        .actors_main{
            display: flex;
            flex-direction: row;
            /* border: 1px solid yellow; */
            justify-content: center;
            align-items: center;
            width: auto; 
            height: 7vh;
        }
        
        .actors_img{
            display: flex;
            /* border: 1px solid blue; */
            width: 16vw;
            height: 6vh;
            border-radius: 50px;
            justify-content: center;
            align-items: center;
            overflow-y: hidden;
        }
        
        .actors_img img{
            width: 100%;
            height: 100%;
            /* border-radius: 50px; */
            object-fit: cover;
        }
        
        .actors_content{
            display: inline-block;
            flex-direction: column;
            /* border: 1px solid red; */
            justify-content: center;
            align-items: flex-start;
            margin-left: 4%;
            width: 100%;
            height: 5vh; 
        }
        
        .actors_content h1{
            display: flex;
            /* border: 1px solid orange; */
            font-size: 80%;
            width: 35vw;
            margin: 0;
        }
        
        .actors_content p{
            width: auto;
            font-size: 70%;
            margin: 0;
        }
        
        .box2{
            display: flex;
            flex-direction: row;
            margin-top: 4%;
            /* border: 1px solid red; */
            justify-content: center;
            align-items: center;
        }
        
        .box2_title{
            display: flex;
            /* border: 1px solid blue; */
            width: 86vw;
            height: 100%;
        }
        
        .box2_title h1{
            font-size: 130%;
        }
        
        .box_cinema{
            display: flex;
            flex-direction: row;
            margin-top: 5%;
            /* border: 1px solid yellow; */
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 10vh;
        }
        
        .box_a{
            text-decoration: none;
            display: flex;
            flex-direction: row;
            /* border: 1px solid green; */
            width: 86vw;
            height: 100%;
            justify-content: space-between;
            align-items: center;
            background: #272727;
            border-radius: 12px;
            border: 2px solid transparent;
            transition: border-color 0.3s;
        }
        
        .box_a:active {
            border-color: red;
        }
        
        .box_base{
            display: flex;
            flex-direction: row;
            /* border: 1px solid green; */
            width: 86vw;
            height: 100%;
            justify-content: space-between;
            align-items: center;
            background: #272727;
            border-radius: 12px;
        }
        
        .box_left{
            display: flex;
            flex-direction: column;
            /* border: 1px solid red; */
            gap: 4px;
            margin-left: 5%;
        }
        
        .box_left h1{
            font-size: 120%;
            color: #fff;
        }
        
        .box_left p{
            font-size: 85%;
            color: #fff;
        }
        
        .box_right{
            display: flex;
            /* border: 1px solid orange; */
            width: 20vw;
            height: 8vh;
            margin-right: 5%;
            border-radius: 10px;
            align-items: center;
            justify-content: center;
        }
        
        .box_right img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
        
        .footer{
            display: flex;
            flex-direction: row;
            /* border: 1px solid red; */
            margin-top: 9%;
            width: 100vw;
            height: 7vh;
            justify-content: center;
            align-items: center;
        }
        
        .footer_button{
            display: flex;
            /* border: 1px solid green; */
            border-radius: 10px;
            width: 86vw;
            height: 100%;
            justify-content: center;
            align-items: center;
        }
        
        .footer_button button{
            display: flex;
            border: none;
            border-radius: 10px;
            width: 86vw;
            height: 100%;
            justify-content: center;
            align-items: center;
            background: #ff0000;
            color: #fff;
            font-weight: bold;
            font-size: 120%;
        }

                    #media-container {
                width: 100%;
                height: 0;
                padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
                position: relative;
                overflow: hidden;
            }
            #media-container img, #media-container iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        `;
        document.head.appendChild(styleElement);

    } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
    }
}

function toggleTrailer(trailerUrl, imageUrl) {
    const mediaContainer = document.getElementById('media-container');
    const trailerButton = document.getElementById('trailerButton');

    if (mediaContainer.querySelector('iframe')) {
        // Si hay un iframe (trailer), lo quitamos y volvemos a la imagen
        mediaContainer.innerHTML = `<img src="${imageUrl}" alt="Movie Poster">`;
        trailerButton.innerHTML = '<span class="button_icon">▶</span> Ver Trailer';
    } else {
        // Si no hay iframe, añadimos el trailer
        const youtubeId = extractYoutubeId(trailerUrl);
        mediaContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
        trailerButton.innerHTML = '<span class="button_icon">⏸</span> Pausar Trailer';
    }
}

function extractYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}


function goToHome() {
    window.location.href = '../views/movieHome.html';
}



function initializeCarousel() {
    const carouselContainer = document.querySelector('.cards_container');
    const indicadorCarousel = document.createElement('div');
    indicadorCarousel.className = 'carousel-indicators';
    carouselContainer.parentNode.insertBefore(indicadorCarousel, carouselContainer.nextSibling);

    const peliculasCards = document.querySelectorAll('.cards_eachOne');

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

    const indiceInicial = Math.floor(peliculasCards.length / 2);
    carouselContainer.scrollLeft = anchoTarjeta * indiceInicial;

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
                card.querySelector('.cards_content').classList.add('visible');
            } else {
                card.classList.remove('active');
                card.querySelector('.cards_content').classList.remove('visible');
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

async function showMovieInfo(movieId) {
        try {
            const response = await fetch(`/api/peliculas/${movieId}`);
            const movie = await response.json();
            
            if (movie.error) {
                console.error(movie.error);
                return;
            }
            document.body.innerHTML = `
            <div class="movie-details-container">
                <header class="header">
                    <div class="header_box">
                        <img src="../storage/flecha.svg" alt="go back" onclick="goToHome()">
                        <h1>Seleccion de Cine</h1>
                        <img src="../storage/dots.svg" alt="dots">
                        </div>
                </header>
                <section class="first_box">
                    <div id="media-container" class="first_box_movie">
                        <img src="${movie.portada}" alt="${movie.titulo}">
                    </div>
                </section>
                <section class="second_box">
                    <div class="second_box_content">
                        <div class="second_box_left">
                            <h1>${movie.titulo}</h1>
                            <p>${movie.genero}</p>
                        </div>
                        <div class="second_box_right">
                            <button id="trailerButton" onclick="toggleTrailer('${movie.trailer}', '${movie.portada}')">
                                <span class="button_icon">▶</span> Ver Trailer
                            </button>
                        </div>
                    </div>
                </section>
                <section class="third-box">
                    <div class="third_box_content">
                        <p>${movie.sinopsis}</p>
                    </div>
                </section>
                <section class="box">
                    <div class="boxt_title">
                        <h1>Reparto</h1>
                    </div>
                </section>
                <section class="actors">
                <div class="actors_box">
                    ${movie.actores && movie.actores.length > 0 ? movie.actores.map(actor => `
                        <div class="actors_main">
                            <div class="actors_img">
                                <img src="${actor.imagen_actor}" alt="${actor.nombre}">
                            </div>
                            <div class="actors_content">
                                <h1>${actor.nombre}</h1>
                                <p>${actor.personaje}</p>
                            </div>
                        </div>
                    `).join('') : '<p>No hay información de actores disponible.</p>'}
                </div>
            </section>
                <section class="box2">
                    <div class="box2_title">
                        <h1>Cinema</h1>
                    </div>
                </section>
                <section class="box_cinema" onclick="activateBookingButton()">
                    <a class="box_a">
                        <div class="box_base">
                            <div class="box_left">
                                <h1>CineCampus</h1>
                                <p>Zona Franca, Floridablanca</p>
                            </div>
                            <div class="box_right">
                                <img src="../storage/cineCampus.png" alt="campus">
                            </div>
                        </div>
                    </a>
                </section>
                <footer class="footer">
                    <div class="footer_button">
                    <button id="bookingButton" onclick="showSeatPicker(${movieId})" disabled>Comprar Ahora</button>
                    </div>
                </footer>
            </div>
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = `
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    /* position: fixed; */
    top: 0;
    left: 0;
}

body {
    font-family: Arial, sans-serif;
    background-color: #000;
    color: white;
    display: flex;
    // flex-direction: column;
}

.header{
    display: flex !important;
    //  border: 1px solid green; 
     background-color: #red;
    // flex-direction: row;
    width: 100vw;
    height: 6vh;
    margin-top: 3%;
    justify-content: center;
    align-items: center;
}

.header_box{
    display: flex !important;
    //  border: 1px solid blue; 
    // flex-direction: row;
    width: 86vw;
    height: 6vh;
    justify-content: space-between !important;
    align-items: center !important;
}

.header_box img{
    display: flex;
//    border: 1px solid rgb(255, 230, 0); 
    width: 7vw;
    height: 6vh;
}

.header_box a{
    text-decoration: none;
}

.header_box h1{
    display: flex;
    /* border: 1px solid rgb(0, 255, 128); */
    font-size: 120%;
} 


.header_content{
    display: flex !important;
     border: 1px solid red; 
    width: 86vw;
    height: 6vh;
    justify-content: space-between !important;
    align-items: center !important;
}


.first_box{
    display: flex;
    /* border: 1px solid pink; */
    margin-top: 4%;
    width: 100vw;
    height: 25vh;
    justify-content: center;
    align-items: center;
}

.first_box_movie{
    display: flex;
    /* border: 1px solid blue; */
    width: 91vw;
    height: 25vh;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
}

.first_box_movie img{
    display: flex;
    width: 91vw;
    height: 25vh;
    border-radius: 20px;
}

.second_box{
    display: flex;
    /* border: 1px solid yellow; */
    flex-direction: row;
    margin-top: 4%;
    width: 100vw;
    height: 5vh;
    align-items: center;
    justify-content: center;
}

.second_box_content{
    display: flex;
    /* border: 1px solid blue; */
    width: 86vw;
    height: 5vh;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
}

.second_box_left{
    display: flex;
    flex-direction: column;
    /* border: 1px solid red; */
    width: 50vw;
    height: 6vh;
}

.second_box_left h1{
    font-size: 100%;
    white-space: nowrap;
    overflow: hidden; 
    text-overflow: ellipsis;
}

.second_box_left p{
    font-size: 80%;
}

.second_box_right{
    display: flex;
    /* border: 1px solid purple; */
    width: 29vw;
    height: 3vh;
    justify-content: center;
    align-items: center;
}

.second_box_right button{
    display: flex;
    width:100%;
    height:100%;
    border: none;
    justify-content: center;
    align-items: center;
    background-color: #ff0000;
    color: #fff;
    border-radius: 8px;
    font-size: 70%;
    font-weight: bold;
}

.button_icon {
    margin-right: 10%; /* Ajusta el valor para el espaciado deseado */
    font-size: 100%; /* Ajusta el tamaño del símbolo si es necesario */
}


.third-box{
    display: flex;
    /* border: 1px solid green; */
    width: 100vw;
    align-items: center;
    margin-top: 2%;
}

.third_box_content{
    display: flex;
    /* border: 1px solid blue; */
    width: 83vw;
    height: 100%;
    margin-left: 6.8%;
}

.third_box_content p{
    font-size: 90%;
    font-weight: 500;
}

.box{
    display: flex;
    flex-direction: row;
    margin-top: 7%;
    /* border: 1px solid red; */
    justify-content: center;
    align-items: center;
}

.boxt_title{
    display: flex;
    /* border: 1px solid blue; */
    width: 86vw;
    height: 100%;
}

.boxt_title h1{
    font-size: 130%;
}

.actors{
    display: flex;
    flex-direction: row;
    margin-top: 2%;
    /* border: 1px solid green; */
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 10vh;
}

.actors_box{
    display: flex;
    flex-direction: row;
    /* border: 1px solid violet; */
    width: 86vw;
    height: 100%; 
    align-items: center;
    overflow-x: auto;
    gap: 15px;
    scrollbar-width: none;
}

.actors_main{
    display: flex;
    flex-direction: row;
    /* border: 1px solid yellow; */
    justify-content: center;
    align-items: center;
    width: auto; 
    height: 7vh;
}

.actors_img{
    display: flex;
    /* border: 1px solid blue; */
    width: 16vw;
    height: 6vh;
    border-radius: 50px;
    justify-content: center;
    align-items: center;
    overflow-y: hidden;
}

.actors_img img{
    width: 100%;
    height: 100%;
    /* border-radius: 50px; */
    object-fit: cover;
}

.actors_content{
    display: inline-block;
    flex-direction: column;
    /* border: 1px solid red; */
    justify-content: center;
    align-items: flex-start;
    margin-left: 4%;
    width: 100%;
    height: 5vh; 
}

.actors_content h1{
    display: flex;
    /* border: 1px solid orange; */
    font-size: 80%;
    width: 35vw;
    margin: 0;
}

.actors_content p{
    width: auto;
    font-size: 70%;
    margin: 0;
}

.box2{
    display: flex;
    flex-direction: row;
    margin-top: 4%;
    /* border: 1px solid red; */
    justify-content: center;
    align-items: center;
}

.box2_title{
    display: flex;
    /* border: 1px solid blue; */
    width: 86vw;
    height: 100%;
}

.box2_title h1{
    font-size: 130%;
}

.box_cinema{
    display: flex;
    flex-direction: row;
    margin-top: 5%;
    /* border: 1px solid yellow; */
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 10vh;
}

.box_a{
    text-decoration: none;
    display: flex;
    flex-direction: row;
    /* border: 1px solid green; */
    width: 86vw;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    background: #272727;
    border-radius: 12px;
    border: 2px solid transparent;
    transition: border-color 0.3s;
}

.box_a:active {
    border-color: red;
}

.box_base{
    display: flex;
    flex-direction: row;
    /* border: 1px solid green; */
    width: 86vw;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    background: #272727;
    border-radius: 12px;
}

.box_left{
    display: flex;
    flex-direction: column;
    /* border: 1px solid red; */
    gap: 4px;
    margin-left: 5%;
}

.box_left h1{
    font-size: 120%;
    color: #fff;
}

.box_left p{
    font-size: 85%;
    color: #fff;
}

.box_right{
    display: flex;
    /* border: 1px solid orange; */
    width: 20vw;
    height: 8vh;
    margin-right: 5%;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
}

.box_right img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}

.footer{
    display: flex;
    flex-direction: row;
    /* border: 1px solid red; */
    margin-top: 9%;
    width: 100vw;
    height: 7vh;
    justify-content: center;
    align-items: center;
}

.footer_button{
    display: flex;
    /* border: 1px solid green; */
    border-radius: 10px;
    width: 86vw;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.footer_button button{
    display: flex;
    border: none;
    border-radius: 10px;
    width: 86vw;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: #ff0000;
    color: #fff;
    font-weight: bold;
    font-size: 120%;
}

            #media-container {
                width: 88%;
                height: 0;
                padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
                position: relative;
                overflow: hidden;
            }
            #media-container img, #media-container iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        `;
    document.head.appendChild(styleElement);


    } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
    }
}

function goToHome() {
    window.location.href = '../views/movieHome.html'; 
}
function activateBookingButton() {
    document.getElementById('bookingButton').disabled = false;
}

function displaySeatSelection(movieId) {
    if (document.getElementById('bookingButton').disabled) {
        alert('Por favor, selecciona un cine primero.');
        return;
    }

    console.log('Mostrar selección de asientos para la película:', movieId);
}




// FILTRAR PELICULAS 


document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search_input');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                buscarPeliculas(searchTerm);
            }
        }
    });
});

async function buscarPeliculas(query) {
    try {
        const response = await fetch(`/api/peliculas/buscar?query=${encodeURIComponent(query)}`);
        const peliculas = await response.json();
        mostrarResultadosBusqueda(peliculas, query);
    } catch (error) {
        console.error('Error al buscar películas:', error);
    }
}

function mostrarResultadosBusqueda(peliculas, query) {
    document.body.innerHTML = `
        <div class="search-results-container">
            <header class="search-header">
                <img src="../storage/flecha.svg" alt="Volver" onclick="goToHome()" class="back-icon">
                <h1 style="font-size: 1.5rem; margin-top: 20px ">Resultados de búsqueda para: "${query}"</h1>
            </header>
            <div class="search-results">
                ${peliculas.length > 0 ? peliculas.map(pelicula => `
                    <div class="movie-card" onclick="showMovieInfo(${pelicula.id})">
                        <img src="${pelicula.imagen_pelicula}" alt="${pelicula.titulo}">
                        <div class="movie-info">
                            <h2>${pelicula.titulo}</h2>
                            <p>${pelicula.genero}</p>
                            <p>${pelicula.director}</p>
                            <p>${pelicula.duracion}</p>
                        </div>
                    </div>
                `).join('') : '<p>No se encontraron resultados.</p>'}
            </div>
        </div>
    `;

    // Añadir estilos inline para la página de resultados
    const style = document.createElement('style');
    style.textContent = `
        body {
            font-family: Arial, sans-serif;
            background-color: #000;
            color: white;
            margin: 0;
            padding: 0;
        }
        .search-results-container {
            padding: 20px;
        }
        .search-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .back-icon {
            width: 24px;
            height: 24px;
            margin-right: 10px;
            cursor: pointer;
        }
        .search-results {
            display: grid;
            grid-template-columns: 1;
            gap: 20px;
        }
        .movie-card {
            background-color: #222;
            border-radius: 10px;
            overflow: hidden;
            cursor: pointer;
        }
        .movie-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .movie-info {
            padding: 10px;
        }
        .movie-info h2 {
            margin: 0;
            font-size: 16px;
        }
        .movie-info p {
            margin: 5px 0 0;
            font-size: 14px;
            color: #aaa;
        }
        
        .movie-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        }
    `;
    document.head.appendChild(style);
}

function goToHome() {
    window.location.href = '../views/movieHome.html';
}





// CREAR 3 VIEW 


async function showSeatPicker(movieId) {
    try {
        const response = await fetch(`/api/boletos/horarios/${movieId}`);
        const movieData = await response.json();

        console.log('Datos recibidos de la API:', movieData);

        if (movieData.error) {
            console.error(movieData.error);
            return;
        }

        const styleElement = document.createElement('style');
        styleElement.textContent = `
            body {
                font-family: 'Roboto', sans-serif;
                background-color: #121212;
                color: #ffffff;
                margin: 0;
                padding: 0;
            }

            .cinema-container {
                max-width: 450px;
                margin: 0 auto;
                padding: 20px;
            }

            .movie-title-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
            }

            .nav-icon, .menu-icon {
                width: 28px;
                height: 28px;
                cursor: pointer;
            }

            .movie-title-bar h2 {
                font-size: 22px;
                margin: 0;
            }

            .cinema-screen {
                text-align: center;
                font-size: 16px;
                margin-bottom: 30px;
                position: relative;
                margin-top: 35px;
            }

            .seat-grid {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 25px;
            }

            .seat-row {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
            }

            .row-id {
                width: 25px;
                text-align: right;
                margin-right: 12px;
                font-weight: bold;
            }

            .seat-unit {
                width: 35px;
                height: 35px;
                margin: 0 6px;
                border-radius: 6px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 14px;
                color: #ffffff;
            }

            .seat-unit.disponible {
                background-color: #424242;
            }

            .seat-unit.reservado {
                background-color: #E0E0E0;
                color: #000000;
                cursor: not-allowed;
            }

            .seat-unit.ocupado {
                background-color: #7B1FA2;
                cursor: not-allowed;
            }

            .seat-unit.chosen {
                background-color: #4CAF50;
            }

            .seat-status {
                display: flex;
                justify-content: space-around;
                margin-bottom: 25px;
            }

            .status-item {
                display: flex;
                align-items: center;
                font-size: 14px;
            }

            .status-icon {
                width: 18px;
                height: 18px;
                border-radius: 4px;
                margin-right: 6px;
            }

            .status-icon.disponible {
                background-color: #424242;
            }

            .status-icon.reservado {
                background-color: #E0E0E0;
            }

            .status-icon.ocupado {
                background-color: #7B1FA2;
            }

            .status-icon.chosen {
                background-color: #4CAF50;
            }

            .date-picker, .time-picker {
                display: flex;
                overflow-x: auto;
                margin-bottom: 25px;
            }

            .date-btn, .time-option {
                background-color: #424242;
                border: none;
                color: #ffffff;
                padding: 12px;
                margin-right: 12px;
                border-radius: 6px;
                cursor: pointer;
                min-width: 70px;
                text-align: center;
            }

            .date-btn.selected, .time-option.active {
                background-color: #1976D2;
            }

            .day {
                font-size: 14px;
            }

            .date-number {
                font-size: 20px;
                font-weight: bold;
            }

            .showtime {
                font-size: 18px;
                font-weight: bold;
            }

            .room-type {
                font-size: 14px;
            }

            .price-summary {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .total-cost {
                font-size: 26px;
                font-weight: bold;
            }

            .purchase-btn {
                background-color: #1976D2;
                color: #ffffff;
                border: none;
                padding: 16px 32px;
                border-radius: 6px;
                font-size: 20px;
                cursor: pointer;
            }
        `;

        document.head.appendChild(styleElement);

        let totalCost = 0;

        const initialDate = movieData.proyecciones[0].horario.fecha_proyeccion;
        const initialProjections = movieData.proyecciones.filter(p => p.horario.fecha_proyeccion === initialDate);

        const seatPickerHTML = `
            <div class="cinema-container">
                <div class="movie-title-bar">
                    <img src="../storage/img/back-arrow.png" alt="Back" class="nav-icon" onclick="returnToMovie(${movieId}, '${movieData.pelicula.estado}')">
                    <h2>Select Seats</h2>
                    <img src="../storage/img/menu-dots.png" alt="Menu" class="menu-icon">
                </div>
                
                <div class="cinema-screen">
                    <img src="../storage/img/screen.png" alt="screen">
                </div>
                
                <div class="seat-grid">
                    ${createSeatLayout(initialProjections[0].asientos)}
                </div>
                
                <div class="seat-status">
                    <span class="status-item"><span class="status-icon disponible"></span> Available</span>
                    <span class="status-item"><span class="status-icon ocupado"></span> Taken</span>
                    <span class="status-item"><span class="status-icon reservado"></span> Reserved</span>
                    <span class="status-item"><span class="status-icon chosen"></span> Selected</span>
                </div>
                
                <div class="date-picker">
                    ${createDateOptions(movieData.proyecciones)}
                </div>
                
                <div class="time-picker">
                    ${createTimeOptions(initialProjections)}
                </div>
                
                <div class="price-summary">
                    <div>
                        <span>Total Price</span>
                        <span class="total-cost">$${totalCost.toFixed(2)}</span>
                    </div>
                    <button class="purchase-btn">Buy Ticket</button>
                </div>
            </div>
        `;
        
        document.body.innerHTML = seatPickerHTML;
        setupEventHandlers(movieData);

        function getActiveDate() {
            const activeDateBtn = document.querySelector('.date-btn.selected');
            return activeDateBtn ? activeDateBtn.dataset.date : initialDate;
        }

        function getActiveProjection() {
            const activeTimeBtn = document.querySelector('.time-option.active');
            const activeDateBtn = document.querySelector('.date-btn.selected');
            return movieData.proyecciones.find(p => 
                p.horario.fecha_proyeccion === activeDateBtn.dataset.date && 
                p.horario.hora_finalizacion === activeTimeBtn.dataset.time
            ) || initialProjections[0];
        }

        function createSeatLayout(asientos) {
            const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
            let seatHTML = '';

            rows.forEach(row => {
                const rowSeats = asientos.filter(seat => seat.fila === row);
                if (rowSeats.length > 0) {
                    seatHTML += `
                        <div class="seat-row">
                            <span class="row-id">${row}</span>
                            ${rowSeats.map(seat => `
                                <div class="seat-unit ${seat.estado}" 
                                     data-id="${seat.id}"
                                     data-row="${seat.fila}" 
                                     data-number="${seat.numero}" 
                                     data-estado="${seat.estado}" 
                                     data-price="${seat.Precio}">
                                    ${seat.numero}
                                </div>
                            `).join('')}
                        </div>
                    `;
                }
            });

            return seatHTML;
        }

        function createDateOptions(proyecciones) {
            const uniqueDates = [...new Set(proyecciones.map(p => p.horario.fecha_proyeccion))];
            return uniqueDates.map((date, index) => {
                const dateObj = new Date(date.split('/').reverse().join('-'));
                dateObj.setDate(dateObj.getDate() + 1);  // Ajuste en la fecha
                return `
                    <button class="date-btn ${index === 0 ? 'selected' : ''}" data-date="${date}">
                        <div class="day">${dateObj.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                        <div class="date">
                            <span class="date-number">${dateObj.getDate()}</span>
                        </div>
                    </button>
                `;
            }).join('');
        }

        function createTimeOptions(proyecciones) {
            return proyecciones.map((proyeccion, index) => `
                <button class="time-option ${index === 0 ? 'active' : ''}" 
                        data-date="${proyeccion.horario.fecha_proyeccion}" 
                        data-time="${proyeccion.horario.hora_finalizacion}"
                        data-sala="${proyeccion.sala.id}">
                    <div class="showtime">${proyeccion.horario.hora_finalizacion}</div>
                    <div class="room-type">$${proyeccion.horario.precio_pelicula.toFixed(2)} - ${proyeccion.sala.tipo}</div>
                </button>
            `).join('');
        }

        function setupEventHandlers(movieData) {
            document.querySelectorAll('.seat-unit').forEach(seat => {
                seat.addEventListener('click', (e) => {
                    const seatElement = e.currentTarget;
                    if (seatElement.classList.contains('disponible')) {
                        seatElement.classList.toggle('chosen');
                        const seatPrice = parseFloat(seatElement.dataset.price);
                        const moviePrice = parseFloat(getActiveProjection().horario.precio_pelicula);

                        if (seatElement.classList.contains('chosen')) {
                            totalCost += (seatPrice + moviePrice);
                        } else {
                            totalCost -= (seatPrice + moviePrice);
                        }

                        document.querySelector('.total-cost').textContent = `$${totalCost.toFixed(2)}`;
                    }
                });
            });

            document.querySelectorAll('.date-btn').forEach(dateBtn => {
                dateBtn.addEventListener('click', (e) => {
                    document.querySelectorAll('.date-btn').forEach(btn => btn.classList.remove('selected'));
                    e.currentTarget.classList.add('selected');
                    updateAvailableTimes();
                });
            });

            document.querySelectorAll('.time-option').forEach(timeBtn => {
                timeBtn.addEventListener('click', (e) => {
                    document.querySelectorAll('.time-option').forEach(btn => btn.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    updateSeats();
                });
            });
        }

        function updateAvailableTimes() {
            const selectedDate = getActiveDate();
            const filteredProjections = movieData.proyecciones.filter(p => p.horario.fecha_proyeccion === selectedDate);
            
            document.querySelector('.time-picker').innerHTML = createTimeOptions(filteredProjections);
            
            document.querySelectorAll('.time-option').forEach(timeBtn => {
                timeBtn.addEventListener('click', (e) => {
                    document.querySelectorAll('.time-option').forEach(btn => btn.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    updateSeats();
                });
            });
    
            updateSeats();
        }

        function updateSeats() {
            const selectedProjection = getActiveProjection();
            document.querySelector('.seat-grid').innerHTML = createSeatLayout(selectedProjection.asientos);
            
            totalCost = 0;
            document.querySelector('.total-cost').textContent = `$${totalCost.toFixed(2)}`;
            
            setupEventHandlers(movieData);
        }

    } catch (error) {
        console.error('Error loading movie data:', error);
    }
}

function returnToMovie(movieId, movieState) {
    console.log('Returning to movie details with ID:', movieId, 'and state:', movieState);
    // Aquí deberías llamar a la función que muestra los detalles de la película
    // Por ejemplo: displayMovieInfo(movieId, movieState);
}