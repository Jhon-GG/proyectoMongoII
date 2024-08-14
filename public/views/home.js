document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards');
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
        const cardWidth = cardsContainer.offsetWidth;
        const index = Math.round(scrollPosition / cardWidth);
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    // Inicializar puntos activos
    updateActiveIndicator();

    // Actualizar puntos al hacer scroll
    cardsContainer.addEventListener('scroll', updateActiveIndicator);

    // Navegar al hacer clic en un punto
    indicators.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            cardsContainer.scrollTo({
                left: cardsContainer.offsetWidth * index,
                behavior: 'smooth'
            });
        });
    });
});
