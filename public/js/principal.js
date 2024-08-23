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
                    <div class="first_box_movie">
                        <img src="${movie.imagen_pelicula}" alt="${movie.titulo}">
                    </div>
                </section>
                <section class="second_box">
                    <div class="second_box_content">
                        <div class="second_box_left">
                            <h1>${movie.titulo}</h1>
                            <p>${movie.genero}</p>
                        </div>
                        <div class="second_box_right">
                            <button id="myButton" onclick="window.location.href='${movie.trailer}'">
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
        `;
        document.head.appendChild(styleElement);

    } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
    }
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
                        <div class="header_content">
                            <img src="../storage/flecha.svg" alt="go back" onclick="goToHome()">
                            <h1>Seleccion de Cine</h1>
                            <img src="../storage/dots.svg" alt="dots">
                        </div>
                    </div>
                </header>
                <section class="first_box">
                    <div class="first_box_movie">
                        <img src="${movie.imagen_pelicula}" alt="${movie.titulo}">
                    </div>
                </section>
                <section class="second_box">
                    <div class="second_box_content">
                        <div class="second_box_left">
                            <h1>${movie.titulo}</h1>
                            <p>${movie.genero}</p>
                        </div>
                        <div class="second_box_right">
                            <button id="myButton" onclick="window.location.href='${movie.trailer}'">
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
                        <button id="bookingButton" onclick="displaySeatSelection(${movieId})" disabled>Comprar Ahora</button>
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
    const bookingButton = document.getElementById('bookingButton');
    if (bookingButton) {
        bookingButton.disabled = false;
        bookingButton.style.opacity = '1';
        bookingButton.style.cursor = 'pointer';
    }
}

function displaySeatSelection(movieId) {
    if (document.getElementById('bookingButton').disabled) {
        alert('Por favor, selecciona un cine primero.');
        return;
    }

    console.log('Mostrar selección de asientos para la película:', movieId);
}