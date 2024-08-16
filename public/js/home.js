document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards_container');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const cards = document.querySelectorAll('.cards_eachOne');

    // Clonar las cards múltiples veces para crear un efecto infinito
    const cloneCount = 3;
    for (let i = 0; i < cloneCount; i++) {
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            cardsContainer.appendChild(clone);
        });
    }

    const allCards = document.querySelectorAll('.cards_eachOne');
    const totalWidth = allCards[0].offsetWidth * cards.length;

    // Posicionar el scroll en la tercera tarjeta (índice 2) del contenedor
    const initialIndex = 2;
    cardsContainer.scrollLeft = (totalWidth / cards.length) * initialIndex;

    // Crear 5 indicadores fijos
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
        
        // Calcular qué indicador debe estar activo
        const indicatorIndex = Math.floor((activeIndex / cards.length) * 7);
                            
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
});


function updateActiveIndicator() {
    const scrollPosition = cardsContainer.scrollLeft;
    const cardWidth = allCards[0].offsetWidth;
    const adjustedScrollPosition = scrollPosition % totalWidth;
    const activeIndex = Math.round(adjustedScrollPosition / cardWidth) % cards.length;
    
    // Calcular qué indicador debe estar activo
    const indicatorIndex = Math.floor((activeIndex / cards.length) * 7);
                        
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