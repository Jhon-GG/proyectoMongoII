document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards_container');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const cards = document.querySelectorAll('.cards_eachOne');
    
    // Crear puntos de navegación
    cards.forEach((_, index) => {
        const button = document.createElement('button');
        button.dataset.index = index;
        indicatorsContainer.appendChild(button);
    });
    
    const indicators = document.querySelectorAll('.carousel-indicators button');

    function updateActiveIndicator() {
        const scrollPosition = cardsContainer.scrollLeft;
        const cardWidth = cards[0].offsetWidth;
        const index = Math.round(scrollPosition / cardWidth);
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
                indicator.style.width = '24px';
            } else {
                indicator.classList.remove('active');
                indicator.style.width = '8px';
            }
        });
    }

    // Inicializar puntos activos
    updateActiveIndicator();

    // Actualizar puntos al hacer scroll
    cardsContainer.addEventListener('scroll', updateActiveIndicator);

    // Navegar al hacer clic en un punto
    indicators.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.dataset.index);
            const scrollPosition = cards[0].offsetWidth * index;
            cardsContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
    });
});
