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
        const paymentMethod = document.getElementById('payment-method');

        if (avatarImg) {
            avatarImg.src = userInfo.imagen_usuario || '';
            avatarImg.alt = `${userInfo.nombre} ${userInfo.apellido}'s Avatar`;
            console.log('Avatar src:', avatarImg.src);
        } else {
            console.log('No se encontró el elemento de la imagen del avatar');
        }

        if (userGreeting) {
            userGreeting.textContent = `Hola, ${userInfo.nombre} ${userInfo.apellido}!`;
        } else {
            console.log('No se encontró el elemento del saludo');
        }

        if (paymentMethod) {
            if (userInfo.metodo_pago) {
                console.log('Método de pago encontrado:', userInfo.metodo_pago);
                paymentMethod.innerHTML = `
                    <img src="${userInfo.metodo_pago.imagenBanco}" alt="${userInfo.metodo_pago.nombreBanco}" style="width: 50px; height: auto;">
                    <span>${userInfo.metodo_pago.nombreBanco}</span>
                    <span>**** **** **** ${userInfo.metodo_pago.numeroBanco.slice(-4)}</span>
                `;
            } else {
                console.log('No hay información de método de pago para el usuario');
                paymentMethod.innerHTML = '<p>No se ha configurado un método de pago</p>';
            }
        } else {
            console.log('No se encontró el elemento del método de pago');
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
            <p>${movie.titulo} (2024)</p>
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
                <footer class="footer1">
                    <div class="footer1_button">
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
    margin-top: 4%;
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
    margin-top: 2%;
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

.footer1{
    display: flex;
    flex-direction: row;
    /* border: 1px solid red; */
    margin-top: 9%;
    width: 100vw;
    height: 7vh;
    justify-content: center;
    align-items: center;
}

.footer1_button{
    display: flex;
    /* border: 1px solid green; */
    border-radius: 10px;
    width: 86vw;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.footer1_button button{
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

let totalCost = 0;
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
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
}

body {
    font-family: Arial, sans-serif;
    background-color: #000;
    color: #fff;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.movie-info-container {
    max-width: 100%;
    margin: 0 auto;
}

.movie-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 20px;
}

.back-arrow, .options-menu {
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin-right: 18px;
    margin-left: 20px;
}

.movie-header h1 {
    font-size: 20px;
    margin: 0;
}

.screen-area {
    text-align: center;
    font-size: 14px;
    margin-bottom: 20px;
    position: relative;
    margin-top: 30px;
}

.seat-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.seat-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.row-label {
    width: 20px;
    text-align: right;
    margin-right: 10px;
    font-weight: bold;
}

.seat {
    width: 30px;
    height: 30px;
    margin: 0 5px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    color: #fff;
}

.seat.free {
    background-color: #323232;
}

.seat.taken {
    background-color: #632727;
    cursor: not-allowed;
}

.seat.selected {
    background-color: #FE0000;
}

.seat-legend {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    gap: 5px;
}

.legend-item {
    display: flex;
    align-items: center;
    font-size: 12px;
}

.seat-icon {
    width: 15px;
    height: 15px;
    border-radius: 3px;
    margin-right: 5px;
}

.seat-icon.free {
    background-color: #323232;
}

.seat-icon.taken {
    background-color: #632727;
}

.date-picker, .time-picker {
    display: flex;
    overflow-x: auto;
    margin-bottom: 20px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    margin-left: 5%;
}

.date-picker::-webkit-scrollbar,
.time-picker::-webkit-scrollbar {
    display: none;
}

.date-option, .time-option {
    background-color: #fff;
    border: none;
    color: #969696;
    padding: 10px;
    margin-right: 10px;
    border-radius: 5px;
    cursor: pointer;
    min-width: 60px;
    text-align: center;
}

.date-option {
    height: 90px;
    border-radius: 8px;
}

.date-option span {
    color: #000;
    font-size: 25px;
    margin-top: 4%;
}

.time-option {
    width: 26vw;
}

.time-display {
    color: #000;
    font-size: 25px;
    margin-top: 4%;
}

.date-option.active, .time-option.active {
    background-color: #e50914;
    color: #fff;
}

.date-option.active span, .time-option.active .time-display {
    color: #fff;
}

.day-name {
    font-size: 12px;
}

.date-number {
    font-size: 18px;
    font-weight: bold;
}

.price-info {
    font-size: 0.7rem;
    font-weight: bold;
}

.pricing-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 5%;
    width: 90vw;
}

.total-cost {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: baseline;
    gap: 5px; 
    margin-top: 20px;
    margin-left: 2%;
}

.cost-amount {
    font-size: 24px;
    font-weight: bold;
}

.purchase-btn {
    background-color: #e50914;
    color: #fff;
    border: none;
    padding: 15px 30px;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    margin-top: 20px;
    margin-right: 4%;
}

.seat-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.seat-group {
    display: flex;
    margin-bottom: -10px;
}

.seat-gap {
    width: 35px;
    height: 30px;
}

.row-b {
    margin-bottom: 40px;
}

.screen-text {
    font-size: 0.8rem;
    margin-top: -5%;
    margin-bottom: 10%;
}

.seat .seat-label {
    display: none;
}

.seat.selected .seat-label {
    display: block;
    font-size: 1rem;
    font-weight: bold;
}

.seat {
    width: 30px;
    height: 30px;
    margin: 0 5px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    color: #fff;
}

.seat.disponible {
    background-color: #323232;
}

.seat.ocupado {
    background-color: #632727;
    cursor: not-allowed;
}

.seat.selected {
    background-color: #FE0000;
}

.seat-legend {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    gap: 5px;
}

.legend-item {
    display: flex;
    align-items: center;
    font-size: 12px;
}

.seat-icon {
    width: 15px;
    height: 15px;
    border-radius: 3px;
    margin-right: 5px;
}

.seat-icon.disponible {
    background-color: #323232;
}

.seat-icon.ocupado {
    background-color: #632727;
}

.seat-icon.selected {
    background-color: #FE0000;
}
        `;

        document.head.appendChild(styleElement);

        let totalCost = 0;

        const seatPickerHTML = `
            <div class="movie-info-container">
                <div class="movie-header">
                    <img src="../storage/flecha.svg" alt="Back" class="back-arrow" onclick="showMovieInfo(${movieId}, '${movieData.pelicula.estado}')">
                    <h1>Seleccionar Asientos</h1>
                    <img src="../storage/dots.svg" alt="More options" class="options-menu">
                </div>
                
                <div class="screen-area">
                    <img src="../storage/screen.svg" alt="screen">
                    <p class="screen-text">Pantalla en esta dirección</p>
                </div>
                
                <div class="seat-grid">
                    ${generateSeatGrid(movieData.proyecciones[0].asientos)}
                </div>
                
                <div class="seat-legend">
                        <span class="legend-item"><span class="seat-icon disponible"></span> Disponible</span>
                        <span class="legend-item"><span class="seat-icon ocupado"></span> Ocupado</span>
                        <span class="legend-item"><span class="seat-icon selected"></span> Seleccionado</span>
                </div>
                
                <div class="date-picker">
                    ${generateDateOptions(movieData.proyecciones)}
                </div>
                
                <div class="time-picker">
                    ${generateTimeOptions(movieData.proyecciones.filter(p => p.horario.fecha_proyeccion === getActiveDate()))}
                </div>
                
                <div class="pricing-section">
                    <div class="total-cost">
                        <span>Costo Total</span>
                        <span class="cost-amount">COP ${totalCost.toFixed(2)}</span>
                    </div>
                    <button class="purchase-btn" id="purchaseBtn">Comprar boleto</button>
                </div>
            </div>
        `;

        document.body.innerHTML = seatPickerHTML;
        setupEventHandlers(movieData);

        document.getElementById('purchaseBtn').addEventListener('click', () => {
            const selectedSeats = Array.from(document.querySelectorAll('.seat.selected'));
            proceedToTicketConfirmation(movieId, movieData, selectedSeats);
        });

        function getActiveDate() {
            const activeDateBtn = document.querySelector('.date-option.active');
            return activeDateBtn ? activeDateBtn.dataset.date : movieData.proyecciones[0].horario.fecha_proyeccion;
        }

        function getActiveProjection() {
            const activeTimeBtn = document.querySelector('.time-option.active');
            const activeDateBtn = document.querySelector('.date-option.active');
            return activeTimeBtn
                ? movieData.proyecciones.find(p => p.horario.hora_finalizacion === activeTimeBtn.dataset.time && p.horario.fecha_proyeccion === activeDateBtn.dataset.date)
                : movieData.proyecciones.find(p => p.horario.fecha_proyeccion === getActiveDate());
        }

        function generateSeatGrid(seats) {
            const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
            let gridHTML = '<div class="seat-container">';
        
            rows.forEach(row => {
                const rowSeats = seats.filter(seat => seat.fila === row);
                if (rowSeats.length > 0) {
                    gridHTML += `
                        <div class="seat-row ${row === 'B' ? 'row-b' : ''}">
                            <span class="row-label">${row}</span>
                            <div class="seat-group">
                                ${row === 'A' ? '<div class="seat-gap"></div><div class="seat-gap"></div>' : ''}
                                ${row === 'B' ? '<div class="seat-gap"></div>' : ''}
                                ${rowSeats.map(seat => `
                                    <div class="seat ${seat.estado}" 
                                         data-id="${seat.id}"
                                         data-row="${seat.fila}" 
                                         data-number="${seat.numero}" 
                                         data-status="${seat.estado}" 
                                         data-price="${seat.Precio}">
                                        <span class="seat-label">${seat.numero}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
            });
        
            gridHTML += '</div>';
            return gridHTML;
        }

        function generateDateOptions(projections) {
            const uniqueDates = [...new Set(projections.map(p => p.horario.fecha_proyeccion))];

            return uniqueDates.map((date, index) => {
                const dateObj = new Date(date.split('/').reverse().join('-'));
                dateObj.setDate(dateObj.getDate() + 1);

                return `
                    <button class="date-option ${index === 0 ? 'active' : ''}" data-date="${date}">
                        <div class="day-name">${dateObj.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                        <div class="date-display">
                            <span class="date-number">${dateObj.getDate()}</span>
                        </div>
                    </button>
                `;
            }).join('');
        }

        function generateTimeOptions(projections) {
            return projections.map((projection, index) => {
                const roomType = projection.sala.tipo; 
                const price = projection.horario.precio_pelicula;
                
                return `
                    <button class="time-option ${index === 0 ? 'active' : ''}" 
                            data-date="${projection.horario.fecha_proyeccion}" 
                            data-time="${projection.horario.hora_finalizacion}"
                            data-room="${projection.sala.id}">
                        <div class="time-display">${projection.horario.hora_finalizacion}</div>
                        <div class="price-info">${price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} · ${roomType}</div>
                    </button>
                `;
            }).join('');
        }

        function setupEventHandlers(movieData) {
            const seatElements = document.querySelectorAll('.seat');
        
            seatElements.forEach(seatElement => {
                if (seatElement.dataset.status !== 'ocupado') {
                    seatElement.addEventListener('click', () => {
                        seatElement.classList.toggle('selected');
                        const seatPrice = parseFloat(seatElement.dataset.price);
                        const moviePrice = parseFloat(getActiveProjection().horario.precio_pelicula);
        
                        if (seatElement.classList.contains('selected')) {
                            totalCost += seatPrice + moviePrice;
                        } else {
                            totalCost -= seatPrice + moviePrice;
                        }
        
                        document.querySelector('.cost-amount').textContent = `${totalCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
                    });
                }
            });

            const dateOptions = document.querySelectorAll('.date-option');
            dateOptions.forEach(dateOption => {
                dateOption.addEventListener('click', () => {
                    document.querySelector('.date-option.active').classList.remove('active');
                    dateOption.classList.add('active');
                    updateAvailableTimes();
                    updateSeatGrid();
                    resetSeatSelection();
                });
            });

            const timeOptions = document.querySelectorAll('.time-option');
            timeOptions.forEach(timeOption => {
                timeOption.addEventListener('click', () => {
                    document.querySelector('.time-option.active').classList.remove('active');
                    timeOption.classList.add('active');
                    updateSeatGrid();
                    resetSeatSelection();
                });
            });

            function resetSeatSelection() {
        totalCost = 0;
        document.querySelector('.cost-amount').textContent = `${totalCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
        const selectedSeats = document.querySelectorAll('.seat.selected');
        selectedSeats.forEach(seat => seat.classList.remove('selected'));
    }

            function updateAvailableTimes() {
                const selectedDate = getActiveDate();
                const filteredProjections = movieData.proyecciones.filter(p => p.horario.fecha_proyeccion === selectedDate);

                const timePicker = document.querySelector('.time-picker');
                timePicker.innerHTML = generateTimeOptions(filteredProjections);
            }

            function updateSeatGrid() {
                const selectedProjection = getActiveProjection();
                const seatContainer = document.querySelector('.seat-grid');
                seatContainer.innerHTML = generateSeatGrid(selectedProjection.asientos);
                setupEventHandlers(movieData);
            }
        }

    } catch (error) {
        console.error('Error al cargar los datos de la película:', error);
    }
}






// 4 View

async function proceedToTicketConfirmation(movieId, movieData) {
    const selectedDateElement = document.querySelector('.date-option.active');
    const selectedTimeElement = document.querySelector('.time-option.active');
    const selectedSeats = Array.from(document.querySelectorAll('.seat.selected'));

    if (!selectedDateElement || !selectedTimeElement) {
        alert('Por favor, selecciona una fecha y hora antes de continuar.');
        return;
    }

    if (selectedSeats.length === 0) {
        alert('Por favor, selecciona al menos un asiento antes de continuar.');
        return;
    }

    const selectedDate = selectedDateElement.dataset.date;
    const selectedTime = selectedTimeElement.dataset.time;

    const selectedProjection = movieData.proyecciones.find(p =>
        p.horario.fecha_proyeccion === selectedDate && p.horario.hora_finalizacion === selectedTime
    );

    if (!selectedProjection) {
        console.error('No se encontró la proyección seleccionada');
        alert('Error al cargar los detalles de la proyección');
        return;
    }

    const moviePrice = selectedProjection.horario.precio_pelicula;
    let regularSeats = [];
    let vipSeats = [];
    let seatNames = [];

    selectedSeats.forEach(seat => {
        const seatData = selectedProjection.asientos.find(s => s.id.toString() === seat.dataset.id);
        if (seatData) {
            seatNames.push(seatData.nombre_general);
            if (seatData.tipo === "Preferencial") {
                vipSeats.push(seatData);
            } else {
                regularSeats.push(seatData);
            }
        }
    });

    // Obtener la información del usuario actual desde localStorage
    const userInfo = JSON.parse(localStorage.getItem('usuarioActual'));
    
    // Obtener el porcentaje de descuento de la tarjeta VIP del usuario
    let vipDiscount = 0;
    let isVip = false;
    if (userInfo && userInfo.tarjeta_vip) {
        vipDiscount = userInfo.tarjeta_vip.porcentaje_descuento / 100;
        isVip = true;
    }

    let regularSeatPrice = regularSeats.length > 0 ? regularSeats[0].Precio + moviePrice : 0;
    let vipSeatPrice = vipSeats.length > 0 ? vipSeats[0].Precio + moviePrice : 0;

    // Calcular precios con y sin descuento
    const regularPriceNoDiscount = regularSeatPrice;
    const vipPriceNoDiscount = vipSeatPrice;

    // Aplicar descuento si el usuario tiene tarjeta VIP
    if (isVip) {
        regularSeatPrice *= (1 - vipDiscount);
        vipSeatPrice *= (1 - vipDiscount);
    }

    const totalRegularPrice = regularSeatPrice * regularSeats.length;
    const totalVipPrice = vipSeatPrice * vipSeats.length;
    const serviceFee = 1.99 * selectedSeats.length;
    const totalPrice = totalRegularPrice + totalVipPrice + serviceFee;

    // Generar ORDER NUMBER
    const orderNumber = Math.floor(Math.random() * 100000000);

    // Generar HTML para los métodos de pago
    let paymentMethodsHTML = '';
    if (userInfo && userInfo.metodo_pago) {
      console.log('Generando HTML para método de pago');
      paymentMethodsHTML = `
        <div class="payment-method-option">
          <label for="${userInfo.metodo_pago.nombreBanco}">
            <img src="${userInfo.metodo_pago.imagenBanco}" alt="${userInfo.metodo_pago.nombreBanco}">
            <div class="union">
              <span class="tarjet-name">${userInfo.metodo_pago.nombreBanco} </span>
              <span class="number-tarjet">**** **** ${userInfo.metodo_pago.numeroBanco.slice(-4)}</span>
            </div>
            <input type="radio" id="${userInfo.metodo_pago.nombreBanco}" name="payment-method" value="${userInfo.metodo_pago.nombreBanco}" checked>
          </label>
        </div>
      `;
    } else {
      console.log('No se encontró información de método de pago');
      paymentMethodsHTML = '<p>No se encontraron métodos de pago</p>';
    }
    console.log('paymentMethodsHTML:', paymentMethodsHTML);

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
            top: 0;
            left: 0;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #000;
            color: #fff;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .movie-details-container4part {
            background-color: #121212;
            padding: 20px;
            width: 100%;
            margin: 0 auto;
        }

        .movie-header4 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            margin-top: 5%;
        }

        .back-button2, .more-options {
            width: 24px;
            height: 24px;
            cursor: pointer;
        }

        h1 {
            font-size: 20px;
            font-weight: bold;
        }

        .movie-information {
            display: flex;
            margin-bottom: 20px;
        }

        .movie-image {
            width: 100px;
            height: 35vw;
            margin-left: 6%;
            border-radius: 10px;
            object-fit: cover;
        }

        .movie-details h2 {
            font-size: 18px;
            margin-bottom: 5px;
            color:red;
        }


        .order-details p {
            font-size: 14px;
            margin-bottom: 10px;
        }

    .payment-method h3 {
        font-size: 16px;
        margin-bottom: 15px;
        color: #ffffff;
        margin-top: 8%;
    }

.payment-method-option {
    background-color: #2a2a2a;
    border-radius: 10px;
    height: 70px;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    width: 80vw;
    border: 1px solid #b9b9b994;
}

    .payment-method-option label {
        display: flex;
        align-items: center;
        width: 100%;
        cursor: pointer;
    }

    .payment-method-option img {
        width: 70px;
        height: 50px;
        margin-right: 15px;
        border-radius: 10px;
    }



    .payment-method-option input[type="radio"] {
        appearance: none;
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        outline: none;
        margin-left: auto;
    }

    .payment-method-option input[type="radio"]:checked {
        background-color: #e50914;
        border-color: #e50914;
    }

    .payment-method-option input[type="radio"]:checked::before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        background-color: #ffffff;
        border-radius: 50%;
        margin: 3px auto;
    }

        .buy-ticket-btn {
            background-color: #e50914;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            height: 12vw;
            margin-top: 20px;
        }

        .buy-ticket-btn:hover {
            background-color: #f40612;
        }

        .order-summary{
            margin-top: 12%;
        }

        .movie-details{
            margin-left: 8%;
        }

        .cine-campus{
        margin-top: 20%;
        margin-bottom: 5%;
        color: white;
        font-weight: bold;
        }

        .genero{
            font-size: 0.9rem;
            color: gray;
        }
        
        .fecha{
            color: gray;
            font-size: 0.9rem;
        }

        .order-details{
            margin: 7% 10%;
        }

        .union{
            display: flex;
            flex-direction: column;
        }

        tarjet-name{
            font-size: 1.1rem;
        font-weight: bold;
        }

        .line {
            margin-top: -3%;
            margin-bottom: 6%;
        }

        .number-tarjet{
            font-size: 0.8rem;
            font-weight: bold;
            margin-top: 5%;
        }
        

        .movie-details-containerpay {
            width: 100%;
        }

        .order-details {
            font-family: Arial, sans-serif;
            color: #fff;
        }

        .flex-row {
            display: flex;
            justify-content: space-between;
        }

        .timer-display {
        background-color: rgba(66, 10, 10, 0.8); /* Dark red with some transparency */
        color: white;
        width: 80vw;
        padding: 10px 15px;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: normal;
        box-sizing: border-box;
        margin-top: 5%;
        margin-bottom: 10%;
        }

        #time {
        font-weight: bold;
        color: #ff0000; /* Bright red for the timer */
        }

        .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .popup-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
        }

        #close-popup {
            margin-top: 10px;
            padding: 5px 10px;
            background-color: #FE0000;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }


    `;

    // Añade el estilo al documento
    document.head.appendChild(styleElement);

    const orderSummaryHTML = `
        <div class="movie-details-container4part">
            <div class="movie-header4">
                <img src="../storage/flecha.svg" alt="Back" class="back-button2" onclick="goBack()">
                <h1>Resumen de Pedido</h1>
                <img src="../storage/dots.svg" alt="More options" class="more-options">
            </div>
            <div class="order-summary">
                <div class="movie-information">
                    <img src="${movieData.pelicula.imagen_pelicula}" alt="${movieData.pelicula.titulo}" class="movie-image">
                    <div class="movie-details">
                        <h2>${movieData.pelicula.titulo}</h2>
                        <p class="genero">${movieData.pelicula.genero}</p>
                        <p class="cine-campus">CINE CAMPUS</p>
                        <p class="fecha">${formatearFecha(selectedDate)}, ${selectedTime}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="movie-details-containerpay">
            <div class="order-details">
                <p>ORDER NUMBER: ${orderNumber}</p>

                <p class="line">▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</p>

                <div class="flex-row">
                    <p>${selectedSeats.length} TICKET(S):</p>
                    <p>${seatNames.join(', ')}</p>
                </div>


                <p class="line">▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</p>

                ${regularSeats.length > 0 ? `
                    <div class="flex-row">
                        <p>ASIENTO REGULAR${vipDiscount > 0 ? ` (${vipDiscount * 100}% Descuento VIP Aplicado)` : ''}:</p>
                        <p>${regularSeatPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} x ${regularSeats.length}</p>
                    </div>` : ''}

                ${vipSeats.length > 0 ? `
                    <div class="flex-row">
                        <p>ASIENTO VIP${vipDiscount > 0 ? ` (${vipDiscount * 100}% Descuento VIP Aplicado)` : ''}:</p>
                        <p>${vipSeatPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} x ${vipSeats.length}</p>
                    </div>` : ''}


                <p class="line">▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</p>

                <div class="flex-row">
                    <p>CARGO POR SERVICIO:</p>
                    <p>${serviceFee.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                </div>

                <p class="line">▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</p>

                <div class="flex-row">
                    <p>TOTAL:</p>
                    <p>${totalPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                </div>

                <p class="line">▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</p>

                <div class="payment-method">
                    <h3 class="Payment">Método de pago</h3>
                    <div id="payment-methods-container">
                        ${paymentMethodsHTML}
                    </div>
                </div>
                    <div class="timer-display">
                    <span id="message">Complete your payment in</span>
                    <span id="time"></span>
                    </div>

                <button class="buy-ticket-btn">Comprar boleto</button>
            </div>

            <div id="expiration-popup" class="popup" style="display:none;">
                <div class="popup-content">
                    <h2>Tiempo Expirado</h2>
                    <p>El tiempo para completar el pago ha expirado.</p>
                    <button id="close-popup">Aceptar</button>
                </div>
            </div>
        </div>
    `;

    document.body.innerHTML = orderSummaryHTML;

    const timerDisplay = document.querySelector('.timer-display');
    const timerDuration = 15 * 60; // 15 minutos
    const timerId = startTimer(timerDuration, timerDisplay);

    document.querySelector('.buy-ticket-btn').addEventListener('click', async () => {
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (selectedPaymentMethod) {
            clearInterval(timerId);
            await handleTicketPurchase(movieId, movieData, selectedSeats, selectedPaymentMethod.value, orderNumber, totalPrice, selectedProjection);
        } else {
            alert('Por favor, selecciona un método de pago');
        }
    });
}

function formatearFecha(fecha) {
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const [dia, mes, anio] = fecha.split('/');
    const fechaObj = new Date(anio, mes - 1, dia);
    
    return `${diasSemana[fechaObj.getDay()]}, ${dia} ${meses[fechaObj.getMonth()]} ${anio}`;
}

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    return setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.querySelector('#time').textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(this);
            showExpirationPopup();
        }
    }, 1000);
}

async function handleTicketPurchase(movieId, movieData, selectedSeats, paymentMethod, orderNumber, totalPrice, selectedProjection) {
    const userInfo = JSON.parse(localStorage.getItem('usuarioActual'));

    if (!selectedProjection || !selectedProjection.horario) {
        console.error('No se encontró la proyección seleccionada o falta información del horario');
        alert('Error al procesar la compra. Faltan datos de la proyección.');
        return;
    }

    const purchaseData = {
        id: orderNumber,
        id_pelicula: movieId,
        id_horario_proyeccion: selectedProjection.horario.id,
        id_usuario: userInfo.id,
        asientos_comprados: selectedSeats.map(seat => parseInt(seat.dataset.id)),
        modo_compra: "virtual",
        fecha_compra: new Date().toLocaleDateString('en-US'),
        total: totalPrice,
        metodo_pago: "tarjeta de crédito",
        id_reserva: null,
        estado_compra: "completada"
    };

    // Generar el código de barras
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, orderNumber.toString(), {
        format: "CODE128",
        width: 2,
        height: 100,
    });

    // Convertir el canvas a una cadena base64
    const barcodeBase64 = canvas.toDataURL("image/png");

    // Añadir el código de barras a purchaseData
    purchaseData.barcode = barcodeBase64;

    try {
        const response = await fetch('/api/boletos/confirmacion-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(purchaseData),
        });
    
        if (response.ok) {
            const result = await response.json();
            
            // Crear y mostrar el popup
            const popup = document.createElement('div');
            popup.className = 'exito-compra';
            popup.textContent = 'Compra realizada con éxito';
            document.body.appendChild(popup);
    
            // Eliminar el popup después de 3 segundos
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 3000);
            
            // Mostrar el ticket
            await showTicketDetails(purchaseData, movieData, movieId);
        } else {
            alert('Error al realizar la compra');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la compra');
    }
    
    function goBack() {

        window.location.href = '../views/movieHome.html';
    }
}















async function showTicketDetails(purchaseData, movieData, movieId) {
    // Crear el elemento de estilo
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #000;
            color: #fff;
        }

        .movie-header5 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            margin-top: 10%;
        }

        .header {
            background-color: #111;
            padding: 10px;
        }
        .header_content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header_content img {
            width: 24px;
            height: 24px;
        }

        .card {
            display: flex;
            flex-direction: column;
            background-color: #fff;
            /* width: 300px; */
            border-radius: 10px;
            margin: 8vw;
            padding: 20px;
            color: black;
        }

        .back-button2, .more-options {
            width: 24px;
            height: 24px;
            cursor: pointer;
            margin-left: 9%;
            margin-right: 6%;
        }


        .card_img img {
            width: 100%;
            border-radius: 10px;
            height: 15vh;
        }
        .card_title h1 {
            font-size: 24px;
            margin-bottom: 5px;
            margin-top: 2%;
        }
        .card_title p {
            color: #888;
        }
        .card_content, .card_boxes, .card_boxes1, .card_boxes2 {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .card_right img {
            width: 50px;
            border-radius: 10px;
        }
        .line img {
            width: 100%;
            margin: 20px 0;
        }
        .barras img {
            width: 100%;
            height: 12vh;
            margin-top: -10%;
        }
            
        .color-gray {
            color: gray;
        }

        .titulo-ticket{
            font-size: 1.2rem;
        }

        .card_time{
            margin-right: 20%;
        }

        .card_seat{
            margin-right: 3%;
        }

        .card_order{
            margin-right: 8%;
        }


        .liner{
            color: #D9D9D9;
            margin-top: 4%;
        }

        .exito-compra {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 5px;
            z-index: 1000;
            text-align: center;
            font-size: 18px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
    `;
    document.head.appendChild(styleElement);

 
        const ticketHTML = `
        <div class="movie-header5">
                <img src="../storage/flecha.svg" alt="Back" class="back-button2" onclick="goBack()">
            <h1>Resumen de Pedido</h1>
            <img src="../storage/dots.svg" alt="More options" class="more-options">
        </div>
        <section class="card">
            <div class="card_img">
                <img src="${movieData.pelicula.portada}" alt="${movieData.pelicula.titulo}">
            </div>
            <div class="card_title">
                <h2 class="titulo-ticket">${movieData.pelicula.titulo}</h2>
                <p>Muestra esto en la entrada del cine.</p>
            </div>
            <p class="liner">________________________________</p>
            <div class="card_content">
                <div class="card_left">
                    <h1 class="color-gray">Cine</h1>
                    <h2>Cine Campus</h2>
                </div>
                <div class="card_right">
                    <img src="../storage/img/newLogo.webp" alt="">
                </div>
            </div>
            <div class="card_boxes">
                <div class="card_date">
                    <h1 class="color-gray">Día</h1>
                    <h2>${formatearFecha(movieData.proyecciones.find(p => p.horario.id === purchaseData.id_horario_proyeccion)?.horario.fecha_proyeccion || 'N/A')}</h2>
                </div>
                <div class="card_time">
                    <h1 class="color-gray">Hora</h1>
                    <h2>${movieData.proyecciones.find(p => p.horario.id === purchaseData.id_horario_proyeccion)?.horario.horario_proyeccion || 'N/A'}</h2>
                </div>
            </div>
            <div class="card_boxes1">
                <div class="card_cinema">
                    <h1 class="color-gray">Sala #</h1>
                    <h2>${movieData.proyecciones.find(p => p.horario.id === purchaseData.id_horario_proyeccion)?.sala.nombre || 'N/A'}</h2>
                </div>
                <div class="card_seat">
                    <h1 class="color-gray">Asiento(s)</h1>
                    <h2>${purchaseData.asientos_comprados.map(id => 
                        movieData.proyecciones.find(p => p.horario.id === purchaseData.id_horario_proyeccion)?.asientos.find(a => a.id === id)?.nombre_general
                    ).join(', ')}</h2>
                </div>
            </div>
            <div class="card_boxes2">
                <div class="card_cost">
                    <h1 class="color-gray">Costo</h1>
                    <h2>$${purchaseData.total.toLocaleString('es-CO')}</h2>
                </div>
                <div class="card_order">
                    <h1 class="color-gray">ID Orden</h1>
                    <h2>${purchaseData.id}</h2>
                </div>
            </div>
            <div class="line">
                <img src="../storage/Line.svg" alt="line">
            </div>
            <div class="barras">
                <img src="${purchaseData.barcode}" alt="Código de barras">
            </div>
        </section>
    `;


    document.body.innerHTML = ticketHTML;
}

function formatearFecha(fechaString) {
    const [dia, mes, año] = fechaString.split('/');
    const fecha = new Date(año, mes - 1, dia); // Mes es 0-indexado en JavaScript
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const diaSemana = diasSemana[fecha.getDay()];
    const diaNum = fecha.getDate();
    const mesNombre = meses[fecha.getMonth()];
    const añoNum = fecha.getFullYear();
    
    return `${diaSemana}, ${diaNum} ${mesNombre} ${añoNum}`;
}
function goBack() {

    window.location.href = '../views/movieHome.html';
}