/* Funcionalidad de Toda la Pagina

*/

// - Funcionalidad del carrusel
let actualSlide = 0;
const totalSlides = 5;
const slides = document.getElementById('carouselSlides');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function actualizarCarousel() {
    slides.style.transform = `translateX(-${actualSlide * 20}%)`;
    
    // - Actualizar indicadores usando ciclo foreach
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === actualSlide);
    });
}

function nextSlide() {
    actualSlide = (actualSlide + 1) % totalSlides;
    actualizarCarousel();
}

function prevSlide() {
    actualSlide = (actualSlide - 1 + totalSlides) % totalSlides;
    actualizarCarousel();
}

// - Eventos de los botones
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// - Indicadores clickeables
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        actualSlide = index;
        actualizarCarousel();
    });
});

// Auto-play del carrusel
let autoPlayInterval = setInterval(nextSlide, 5000);

// - Pausar auto-play al hacer hover
const heroSection = document.querySelector('.hero');
heroSection.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

heroSection.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
});

// - Navegación scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// - Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// - Animaciones en scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// - Funcionalidad del menú desplegable de Servicios (Aun lo mejorare mas)
const dropdownBtn = document.querySelector('.dropdown .dropdown-btn');
const dropdownContent = document.querySelector('.dropdown-content');

// - Abrir/cerrar el menú
document.addEventListener('click', (e) => {
    if (!dropdownContent.classList.contains('active')) return;
    
    if (!dropdownContent.contains(e.target) && !dropdownBtn.contains(e.target)) {
        closeMenu();
    }
});

dropdownBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownContent.classList.toggle('active');
});

function closeMenu() {
    dropdownContent.classList.remove('active');
}

// - Manejar clics en las opciones
dropdownContent.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
        const option = item.querySelector('.option-text').textContent;
        
        // - Redirigir según la opción seleccionada
        if (option === 'SIUPC - Administrativos') {
            window.location.href = 'http://200.94.123.68/Modulos/Seguridad/Vistas/Login.aspx';
        } else if (option === 'SIUPC - Estudiantes') {
            window.location.href = 'http://200.94.123.67/Modulos/Seguridad/Vistas/Login.aspx';
        }
        
        closeMenu();
    });
});

// - Aca esta el contador animado para estadisticas
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + (obj.innerHTML.includes('+') ? '+' : '') + (obj.innerHTML.includes('%') ? '%' : '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// - Activar contador cuando la sección sea visible
const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-item h3');
            statNumbers.forEach(stat => {
                const finalNumber = parseInt(stat.textContent);
                if (!isNaN(finalNumber)) {
                    animateValue(stat, 0, finalNumber, 2000);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statsObserver.observe(statsSection);

// - Noticias
class NewsCarousel {
    constructor() {
        this.wrapper = document.getElementById('noticiasWrapper');
        this.prevBtn = document.getElementById('prevBtnNoticias');
        this.nextBtn = document.getElementById('nextBtnNoticias');
        this.dotsContainer = document.getElementById('dotsContainerNoticias');
        this.cards = document.querySelectorAll('.news-card');
        this.currentIndex = 0;
        this.cardsToShow = this.getCardsToShow();
        this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);
        
        this.init();
        this.setupEventListeners();
        this.setupAutoplay();
    }

    getCardsToShow() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    init() {
        this.createDots();
        this.updateCarousel();
        this.updateControls();
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i <= this.maxIndex; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateCarousel() {
        const cardWidth = 330; // 300px width + 30px margin
        const translateX = -this.currentIndex * cardWidth;
        this.wrapper.style.transform = `translateX(${translateX}px)`;
        
        // - Actualiza los puntos
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    updateControls() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
    }

    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
            this.updateControls();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
            this.updateControls();
        }
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.updateControls();
    }

    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => this.next());
        this.prevBtn.addEventListener('click', () => this.prev());

        // - Aca esta el touch y el swipe
        let startX = 0;
        let isDragging = false;

        this.wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        this.wrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        this.wrapper.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });

        // - Aca esta el keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // - Aca esta el responsive handling
        window.addEventListener('resize', () => {
            this.cardsToShow = this.getCardsToShow();
            this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.createDots();
            this.updateCarousel();
            this.updateControls();
        });
    }

    setupAutoplay() {
        setInterval(() => {
            if (this.currentIndex >= this.maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateCarousel();
            this.updateControls();
        }, 5000); // Avanza cada 5 segundos
    }
}

// - Aca esta el inicializador del carousel
document.addEventListener('DOMContentLoaded', () => {
    new NewsCarousel();
});

function viewMoreNews() {
    // - Aqui redirigiremos a la página de todas las noticias
    // - Aun no lo he implementado.
    alert('Redirigiendo a la página de noticias...');
    // window.location.href = '/noticias';
}

// - Aca esta el smooth scroll animations
const observerOptionsNoticias = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observerNoticias = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const noticiasObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const noticiasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const wrapper = entry.target;
            const visibleCards = wrapper.querySelectorAll('.news-card');
            visibleCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    });
}, noticiasObserverOptions);

// - Aplicar estilos iniciales a las tarjetas
document.querySelectorAll('.news-card').forEach(card => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// - Observar el contenedor del carrusel
noticiasObserver.observe(document.querySelector('.noticias-wrapper'));

// - Coordenadas en base a latitud y longitud de la UPC
const UPDC_COORDS = { lat: 17.810045785335536, lng: -92.92389313979523 };

// - Inicializar el mapa de google maps
function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: UPDC_COORDS,
        zoom: 15,
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#000000"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{"color": "#000000"}]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#144b53"}]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#08304b"}]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{"color": "#0c4152"}, {"lightness": 5}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#000000"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#0b3d51"}]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [{"color": "#000000"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#021019"}]
            }
        ]
    });

    // - Agregar marcador para la universidad
    new google.maps.Marker({
        position: UPDC_COORDS,
        map: map,
        title: 'Universidad Politécnica del Centro'
    });
}