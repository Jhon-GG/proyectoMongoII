document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards_container');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const cards = document.querySelectorAll('.cards_eachOne');
    
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


    updateActiveIndicator();


    cardsContainer.addEventListener('scroll', updateActiveIndicator);


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


const cardsContainer = document.querySelector('.cards_container');
const cards = document.querySelectorAll('.cards_eachOne');

function updateCardScale() {
    const containerWidth = cardsContainer.offsetWidth;
    const cardWidth = cards[0].offsetWidth;
    const scrollPosition = cardsContainer.scrollLeft;
    
    cards.forEach((card, index) => {
        const cardCenter = (index * cardWidth) - scrollPosition + (cardWidth / 2);
        const distanceFromCenter = Math.abs(containerWidth / 2 - cardCenter);
        const scale = Math.max(1, 1 - (distanceFromCenter / containerWidth) * 0.2);
        
        card.style.transform = `scale(${scale})`;
    });
}

cardsContainer.addEventListener('scroll', updateCardScale);
updateCardScale(); // Llamar inicialmente para configurar las escalas
