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
            avatarImg.alt = `${userInfo.nombre}'s Avatar`;
            console.log('Avatar src:', avatarImg.src);
        } else {
            console.log('No se encontró el elemento de la imagen del avatar');
        }

        if (userGreeting) {
            userGreeting.textContent = `Hi, ${userInfo.nombre}!`;
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

async function loadNowPlayingMovies() {
    try {
        const response = await fetch('http://localhost:5001/api/peliculas/estado/En%20cartelera');
        const movies = await response.json();
        const container = document.getElementById('now-playing-container');
        container.innerHTML = '';
        movies.forEach(movie => {
            const movieElement = createMovieElement(movie);
            container.appendChild(movieElement);
        });
        initializeCarousel(); // Inicializar el carrusel después de cargar las películas
    } catch (error) {
        console.error('Error al cargar películas en cartelera:', error);
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

function initializeCarousel() {
    const cardsContainer = document.querySelector('.cards_container');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const cards = document.querySelectorAll('#now-playing-container .cards_eachOne');

    const cloneCount = 3;
    for (let i = 0; i < cloneCount; i++) {
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            cardsContainer.appendChild(clone);
        });
    }

    const allCards = document.querySelectorAll('.cards_eachOne');
    const totalWidth = allCards[0].offsetWidth * cards.length;

    const initialIndex = 2;
    cardsContainer.scrollLeft = (totalWidth / cards.length) * initialIndex;

    for (let i = 0; i < 5; i++) {
        const button = document.createElement('button');
        button.dataset.index = i;
        indicatorsContainer.appendChild(button);
    }

    const indicators = document.querySelectorAll('.carousel-indicators button');

    function updateActiveIndicator() {
        const scrollPosition = cardsContainer.scrollLeft;
        const cardWidth = allCards[0].offsetWidth;
        const adjustedScrollPosition = scrollPosition % totalWidth;
        const activeIndex = Math.round(adjustedScrollPosition / cardWidth) % cards.length;
        
        const indicatorIndex = Math.floor((activeIndex / cards.length) * 5);
                            
        indicators.forEach((indicator, i) => {
            if (i === indicatorIndex) {
                indicator.classList.add('active');
                indicator.style.width = '24px';
            } else {
                indicator.classList.remove('active');
                indicator.style.width = '8px';
            }
        });
    }

    function handleInfiniteScroll() {
        const scrollLeft = cardsContainer.scrollLeft;
        const maxScroll = cardsContainer.scrollWidth - cardsContainer.clientWidth;
        
        if (scrollLeft <= 0) {
            cardsContainer.scrollLeft = totalWidth;
        } else if (scrollLeft >= maxScroll) {
            cardsContainer.scrollLeft = totalWidth;
        }
    }

    cardsContainer.addEventListener('scroll', () => {
        updateActiveIndicator();
        handleInfiniteScroll();
        updateCardScale();
    });

    indicators.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.dataset.index);
            const scrollPosition = (totalWidth / 5) * index + totalWidth;
            cardsContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
    });

    function updateCardScale() {    
        const containerWidth = cardsContainer.offsetWidth;
        const cardWidth = allCards[0].offsetWidth;
        const scrollPosition = cardsContainer.scrollLeft;
        
        allCards.forEach((card, index) => {
            const cardCenter = (index * cardWidth) - scrollPosition + (cardWidth / 2);
            const distanceFromCenter = Math.abs(containerWidth / 2 - cardCenter);
            const scale = Math.max(1, 1 - (distanceFromCenter / containerWidth) * 0.2);
            
            card.style.transform = `scale(${scale})`;
        });
    }

    updateCardScale();
    updateActiveIndicator();
}