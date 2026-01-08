// ==================== ПРОВЕРКА СТАТУСА САЙТА ====================
(async function checkSiteStatus() {
    // Не проверяем на странице 404
    if (window.location.pathname.includes('/404')) return;

    const API_BASE = 'https://dom-falcone-auth.dom-falcone-official.workers.dev/api';

    try {
        const res = await fetch(API_BASE + '/site-status');

        if (res.ok) {
            const data = await res.json();

            if (!data.enabled) {
                // Проверяем, не админ ли это
                const token = localStorage.getItem('auth_token');

                if (token) {
                    const userRes = await fetch(API_BASE + '/me', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });

                    if (userRes.ok) {
                        const user = await userRes.json();

                        // Админы могут заходить даже при отключенном сайте
                        if (user.role === 'admin') {
                            console.log('🔐 Admin access: site disabled but admin logged in');

                            // Показываем предупреждение админу
                            const warningBanner = document.createElement('div');
                            warningBanner.style.cssText = `
                                position: fixed;
                                top: 0;
                                left: 0;
                                right: 0;
                                background: linear-gradient(135deg, #d32f2f, #f44336);
                                color: white;
                                padding: 0.8rem;
                                text-align: center;
                                font-weight: 700;
                                z-index: 999999;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                            `;
                            warningBanner.innerHTML = '⚠️ САЙТ ОТКЛЮЧЕН - Видно только администраторам';
                            document.body.prepend(warningBanner);

                            return;
                        }
                    }
                }

                // Перенаправляем обычных пользователей на 404
                window.location.replace('../404');
            }
        }
    } catch (err) {
        console.error('Site status check error:', err);
        // При ошибке не блокируем доступ (fail-safe)
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Create canvas for embers effect
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);

    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = -Math.random() * 1 - 0.5;
            this.size = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.fade = Math.random() * 0.005 + 0.002;
            this.color = `255, ${Math.floor(Math.random() * 100)}, 0`; // Orange/Red
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.fade;

            if (this.alpha <= 0 || this.y < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();

    // Add parallax effect to hero background
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroBg.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
        });
    }

    // Add scroll reveal for elements
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fade-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

});


// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('birth-name').value;
        const letter = document.getElementById('official-letter').value;
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        submitBtn.innerText = 'Отправка...';
        submitBtn.disabled = true;

        const templateParams = {
            name: name,
            from_name: name,
            message: letter,
            to_email: 'kolyanchik497@gmail.com'
        };

        emailjs.send('service_4o6sh1m', 'template_gvj56tm', templateParams)
            .then(function () {
                showSuccessModal('Послание успешно отправлено Дону!');
                contactForm.reset();
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }, function (error) {
                console.error('EmailJS Error:', error);
                if (error.status === 412) {
                    showErrorModal('Ошибка конфигурации отправки (Invalid Grant). Пожалуйста, свяжитесь с администратором.');
                } else {
                    showErrorModal('Произошла ошибка при отправке. Попробуйте позже.');
                }
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

if (lightbox) {
    // Open lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox functions
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    };

    // Close on button click
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Legacy Login System removed - now handled by inline scripts in login/index.html

// Check Login State & Update Header
const checkLoginState = () => {
    const currentUser = localStorage.getItem('domFalconeUser');
    const authBtn = document.getElementById('auth-btn');

    if (currentUser && authBtn) {
        authBtn.textContent = currentUser;
        authBtn.href = '#';
        authBtn.classList.remove('btn-login');
        authBtn.classList.add('btn-user-profile');

        // Logout functionality
        authBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLogoutModal(currentUser);
        });
    }
};

// Create and inject Logout Modal
const createLogoutModal = () => {
    if (document.getElementById('logout-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'logout-modal';
    modal.className = 'logout-modal';
    modal.innerHTML = `
        <div class="logout-modal-content">
            <div class="logout-modal-text">Выйти из аккаунта <span id="logout-username"></span>?</div>
            <div class="logout-modal-buttons">
                <button class="btn-logout-confirm">Да</button>
                <button class="btn-logout-cancel">Нет</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Event Listeners
    const confirmBtn = modal.querySelector('.btn-logout-confirm');
    const cancelBtn = modal.querySelector('.btn-logout-cancel');

    confirmBtn.addEventListener('click', () => {
        localStorage.removeItem('domFalconeUser');
        window.location.reload();
    });

    cancelBtn.addEventListener('click', hideLogoutModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideLogoutModal();
        }
    });
};

const showLogoutModal = (username) => {
    createLogoutModal(); // Ensure it exists
    const modal = document.getElementById('logout-modal');
    const usernameSpan = document.getElementById('logout-username');
    usernameSpan.textContent = username;
    modal.classList.add('active');
};

const hideLogoutModal = () => {
    const modal = document.getElementById('logout-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// Create and inject Success Modal
const createSuccessModal = () => {
    if (document.getElementById('success-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'success-modal';
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-modal-text" id="success-modal-message"></div>
            <div class="success-modal-buttons">
                <button class="btn-success-confirm">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Event Listeners
    const confirmBtn = modal.querySelector('.btn-success-confirm');

    confirmBtn.addEventListener('click', hideSuccessModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideSuccessModal();
        }
    });
};

const showSuccessModal = (message) => {
    createSuccessModal(); // Ensure it exists
    const modal = document.getElementById('success-modal');
    const messageDiv = document.getElementById('success-modal-message');
    messageDiv.textContent = message;
    modal.classList.add('active');
};

const hideSuccessModal = () => {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// Create and inject Error Modal
const createErrorModal = () => {
    if (document.getElementById('error-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'error-modal';
    modal.className = 'error-modal';
    modal.innerHTML = `
        <div class="error-modal-content">
            <div class="error-modal-text" id="error-modal-message"></div>
            <div class="error-modal-buttons">
                <button class="btn-error-confirm">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Event Listeners
    const confirmBtn = modal.querySelector('.btn-error-confirm');

    confirmBtn.addEventListener('click', hideErrorModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideErrorModal();
        }
    });
};

const showErrorModal = (message) => {
    createErrorModal(); // Ensure it exists
    const modal = document.getElementById('error-modal');
    const messageDiv = document.getElementById('error-modal-message');
    messageDiv.textContent = message;
    modal.classList.add('active');
};

const hideErrorModal = () => {
    const modal = document.getElementById('error-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// ============ CONFIRM MODAL (with Yes/Cancel) ============
let confirmResolve = null;

const createConfirmModal = () => {
    if (document.getElementById('confirm-modal')) return;

    const style = document.createElement('style');
    style.textContent = `
        .confirm-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(5px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 100000;
            animation: fadeIn 0.2s ease;
        }
        .confirm-modal.active {
            display: flex;
        }
        .confirm-modal-content {
            background: linear-gradient(165deg, #1a1a1a, #0d0d0d);
            border: 2px solid #4CAF50;
            border-radius: 20px;
            padding: 2rem 2.5rem;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(76, 175, 80, 0.2);
            animation: modalSlideIn 0.3s ease;
            max-width: 400px;
        }
        @keyframes modalSlideIn {
            from { transform: scale(0.9) translateY(-20px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .confirm-modal-text {
            color: white;
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }
        .confirm-modal-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        .btn-confirm-yes {
            padding: 0.8rem 2rem;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            border: none;
            border-radius: 50px;
            color: white;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
        }
        .btn-confirm-yes:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
        }
        .btn-confirm-cancel {
            padding: 0.8rem 2rem;
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50px;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
        }
        .btn-confirm-cancel:hover {
            border-color: rgba(255, 255, 255, 0.6);
            color: white;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'confirm-modal';
    modal.className = 'confirm-modal';
    modal.innerHTML = `
        <div class="confirm-modal-content">
            <div class="confirm-modal-text" id="confirm-modal-message"></div>
            <div class="confirm-modal-buttons">
                <button class="btn-confirm-yes">Да</button>
                <button class="btn-confirm-cancel">Отмена</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Event Listeners
    const yesBtn = modal.querySelector('.btn-confirm-yes');
    const cancelBtn = modal.querySelector('.btn-confirm-cancel');

    yesBtn.addEventListener('click', () => {
        hideConfirmModal();
        if (confirmResolve) confirmResolve(true);
    });

    cancelBtn.addEventListener('click', () => {
        hideConfirmModal();
        if (confirmResolve) confirmResolve(false);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideConfirmModal();
            if (confirmResolve) confirmResolve(false);
        }
    });
};

const showConfirmModal = (message) => {
    return new Promise((resolve) => {
        createConfirmModal();
        confirmResolve = resolve;
        const modal = document.getElementById('confirm-modal');
        const messageDiv = document.getElementById('confirm-modal-message');
        messageDiv.textContent = message;
        modal.classList.add('active');
    });
};

const hideConfirmModal = () => {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// Run check on load
document.addEventListener('DOMContentLoaded', checkLoginState);

// News Modal Functionality
const newsModal = document.getElementById('news-modal');
if (newsModal) {
    const modalTitle = newsModal.querySelector('.news-modal-title');
    const modalDate = newsModal.querySelector('.news-modal-date');
    const modalText = newsModal.querySelector('.news-modal-text');
    const closeBtn = newsModal.querySelector('.news-modal-close');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');

    // Open Modal
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Find parent card
            const card = btn.closest('.news-card-content') || btn.closest('.featured-news-content');

            // Get content
            const title = card.querySelector('h2, h3').innerText;
            const date = card.querySelector('.news-date').innerText;
            const fullContent = card.querySelector('.news-full-content').innerHTML;

            // Check if featured
            const isFeatured = card.classList.contains('featured-news-content');
            const modalContent = newsModal.querySelector('.news-modal-content');

            if (isFeatured) {
                modalContent.classList.add('featured-theme');
            } else {
                modalContent.classList.remove('featured-theme');
            }

            // Populate modal
            modalTitle.innerText = title;
            modalDate.innerText = date;
            modalText.innerHTML = fullContent;

            // Show modal
            newsModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Re-initialize lightbox for new images
            if (typeof lightbox !== 'undefined') {
                const newGalleryItems = modalText.querySelectorAll('.gallery-item');
                newGalleryItems.forEach(item => {
                    item.addEventListener('click', () => {
                        const img = item.querySelector('img');
                        const lightboxImg = document.getElementById('lightbox-img');
                        const lightbox = document.getElementById('lightbox');
                        if (lightbox && lightboxImg) {
                            lightboxImg.src = img.src;
                            lightbox.classList.add('active');
                        }
                    });
                });
            }
        });
    });

    // Close Modal Function
    const closeModal = () => {
        newsModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close on button
    closeBtn.addEventListener('click', closeModal);

    // Close on background click
    newsModal.addEventListener('click', (e) => {
        if (e.target === newsModal) {
            closeModal();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && newsModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// --- Stranger Things Timer Logic ---
function updateStrangerTimer() {
    const timerContainer = document.getElementById('stranger-timer');
    const messageElement = document.getElementById('stranger-message');

    // Elements for individual units
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    const headerElement = document.querySelector('.stranger-header');

    if (!timerContainer || !messageElement || !daysEl) return;

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
    const currentHour = now.getHours();

    // Meeting time: Friday 17:00 to Saturday 02:00
    let isMeetingTime = false;

    // Friday >= 17:00
    if (currentDay === 5 && currentHour >= 17) {
        isMeetingTime = true;
    }
    // Saturday < 02:00
    else if (currentDay === 6 && currentHour < 2) {
        isMeetingTime = true;
    }

    if (isMeetingTime) {
        timerContainer.style.display = 'none';
        if (headerElement) headerElement.style.display = 'none';
        messageElement.style.display = 'block';
    } else {
        timerContainer.style.display = 'flex'; // Changed to flex for grid layout
        if (headerElement) headerElement.style.display = 'block';
        messageElement.style.display = 'none';

        // Calculate next Friday 17:00
        let nextFriday = new Date(now);
        nextFriday.setHours(17, 0, 0, 0);
        nextFriday.setMinutes(0);
        nextFriday.setSeconds(0);
        nextFriday.setMilliseconds(0);

        // If today is Friday before 17:00, nextFriday is already set correctly (today 17:00)
        // If today is Friday after 17:00 (handled by isMeetingTime, but for robustness):
        // If today is Saturday after 02:00:

        if (currentDay === 5 && currentHour < 17) {
            // Target is today 17:00. Date is correct.
        } else {
            // Find next Friday
            let daysUntilFriday = (5 - currentDay + 7) % 7;
            if (daysUntilFriday === 0) {
                // It's Friday (after 17:00 handled above, so this is for next week)
                daysUntilFriday = 7;
            }

            // Special case: If it's Saturday (6) after 02:00.
            // (5 - 6 + 7) % 7 = 6. Correct.

            nextFriday.setDate(now.getDate() + daysUntilFriday);
        }

        const diff = nextFriday - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const format = (num) => num.toString().padStart(2, '0');

        daysEl.textContent = format(days);
        hoursEl.textContent = format(hours);
        minutesEl.textContent = format(minutes);
        secondsEl.textContent = format(seconds);
    }
}

setInterval(updateStrangerTimer, 1000);
document.addEventListener('DOMContentLoaded', updateStrangerTimer);

// Add Site Version Label
document.addEventListener('DOMContentLoaded', () => {
    const versionText = 'Версия сайта: 1.1. Идет разработка.';

    // Update ALL .site-version elements (footer + mobile menu)
    const versionElements = document.querySelectorAll('.site-version');
    versionElements.forEach(el => {
        el.textContent = versionText;
    });

    // Fallback: create and insert in footer if not found
    if (versionElements.length === 0) {
        const footerSmall = document.querySelector('.site-footer .container small');
        if (footerSmall) {
            const versionDiv = document.createElement('div');
            versionDiv.className = 'site-version';
            versionDiv.textContent = versionText;
            footerSmall.insertAdjacentElement('afterend', versionDiv);
        }
    }
});
// --- Page Loader Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('page-loader');

    if (loader) {
        // Minimum load time set to 0 for immediate dismissal
        const minLoadTime = 0;
        const startTime = Date.now();

        window.addEventListener('load', () => {
            // Skip for news page - it handles its own loading after API call
            const isNewsPage = window.location.pathname.includes('/news');
            if (isNewsPage) return;

            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadTime - elapsedTime);

            setTimeout(() => {
                loader.classList.add('loaded');
                // Stop loader audio if playing
                const loaderAudio = document.getElementById('loader-audio');
                if (loaderAudio) {
                    loaderAudio.pause();
                    loaderAudio.currentTime = 0; // Optional: reset to start
                }
            }, remainingTime);
        });

        // Loader Hymn Player
        const loaderAudio = document.getElementById('loader-audio');
        const loaderPlayBtn = document.getElementById('loader-play-btn');
        const loaderProgress = document.getElementById('loader-progress');

        if (loaderAudio) {
            loaderAudio.volume = 0.5;
        }
        const loaderPlayerContainer = document.querySelector('.loader-player-container');

        if (loaderAudio && loaderPlayBtn && loaderProgress) {
            loaderPlayBtn.addEventListener('click', () => {
                if (loaderAudio.paused) {
                    loaderAudio.play();
                    loaderPlayerContainer.classList.add('playing');
                } else {
                    loaderAudio.pause();
                    loaderPlayerContainer.classList.remove('playing');
                }
            });

            loaderAudio.addEventListener('timeupdate', () => {
                const percent = (loaderAudio.currentTime / loaderAudio.duration) * 100;
                loaderProgress.style.width = percent + '%';
            });

            loaderAudio.addEventListener('ended', () => {
                loaderPlayerContainer.classList.remove('playing');
                loaderProgress.style.width = '0%';
            });
        }
    }
});

// Auth System Integration removed - now handled by inline scripts in login/index.html

// ============ NAVIGATION ACTIVE STATE ============
// This MUST be at the very end of the file to ensure the DOM is fully parsed
// when the script runs (since script is loaded at end of body)
(function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav a');
    if (!navLinks.length) return; // No navigation found

    const currentPath = window.location.pathname; // e.g., /about/, /enemies/, /

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Extract the folder name from href (e.g., "../about" -> "about", "../homepage" -> "homepage")
        const linkPageName = href.substring(href.lastIndexOf('/') + 1);

        // Extract the current page folder from URL (e.g., "/about/" -> "about", "/" -> "")
        const pathParts = currentPath.split('/').filter(Boolean);
        let currentPageName = pathParts.length > 0 ? pathParts[0] : '';

        // Treat root "/" as "homepage"
        if (currentPath === '/' || currentPath === '/homepage/' || currentPath === '/homepage') {
            currentPageName = 'homepage';
        }

        // Compare folder names (case-insensitive)
        if (linkPageName.toLowerCase() === currentPageName.toLowerCase()) {
            link.classList.add('active');
        }
    });
})();

// ==================== BURGER MENU ====================
(function initBurgerMenu() {
    const burgerMenu = document.getElementById('burger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const body = document.body;

    if (!burgerMenu || !mobileNav || !mobileNavOverlay) return;

    function toggleMenu() {
        burgerMenu.classList.toggle('active');
        mobileNav.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        body.classList.toggle('mobile-menu-open');
    }

    function closeMenu() {
        burgerMenu.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        body.classList.remove('mobile-menu-open');
    }

    // Toggle menu on burger click
    burgerMenu.addEventListener('click', toggleMenu);

    // Close menu on overlay click
    mobileNavOverlay.addEventListener('click', closeMenu);

    // Close menu on link click
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Highlight active page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    mobileNavLinks.forEach(link => {
        const href = link.getAttribute('href').replace('../', '').replace('/', '');
        if (href === currentPage || (currentPage === '' && href === 'homepage')) {
            link.classList.add('active');
        }
    });
})();