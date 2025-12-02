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
                    alert('Ошибка конфигурации отправки (Invalid Grant). Пожалуйста, свяжитесь с администратором.');
                } else {
                    alert('Произошла ошибка при отправке. Попробуйте позже.');
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

// Login System
const loginSection = document.querySelector('.login-section');
if (loginSection) {
    const userBtns = document.querySelectorAll('.user-btn');
    const passwordInput = document.getElementById('password-input');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const loginError = document.getElementById('login-error');
    const loginFormGroup = document.querySelector('.login-form-group');
    let selectedUser = null;

    // User Selection
    userBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Deselect all
            userBtns.forEach(b => b.classList.remove('selected'));
            // Select clicked
            btn.classList.add('selected');
            selectedUser = btn.dataset.user;

            // Enable password field
            loginFormGroup.classList.add('active');
            passwordInput.disabled = false;
            loginSubmitBtn.disabled = false;
            passwordInput.focus();
            loginError.textContent = '';
        });
    });

    // Login Submission
    const handleLogin = () => {
        const password = passwordInput.value;
        let isValid = false;

        if (selectedUser === 'Dimone de Patrone') {
            isValid = (password === '0952012070');
        } else if (selectedUser === 'Don Falcone') {
            isValid = (password === '0634935384');
        } else if (selectedUser === 'Maxone Povarone') {
            isValid = (password === '26121968M@x');
        } else if (selectedUser === 'Antone Snusone') {
            isValid = (password === '2KC2wjud_');
        } else {
            isValid = (password === '12345678');
        }

        if (isValid) {
            // Success
            localStorage.setItem('domFalconeUser', selectedUser);
            window.location.href = 'index.html';
        } else {
            // Error
            loginError.textContent = 'Неверный пароль. Доступ запрещен.';
            passwordInput.value = '';
            passwordInput.focus();
        }
    };

    loginSubmitBtn.addEventListener('click', handleLogin);

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
}

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
    console.log('Stranger Timer updated');

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
    const footerContainer = document.querySelector('.site-footer .container');
    if (footerContainer) {
        const versionDiv = document.createElement('div');
        versionDiv.className = 'site-version';
        versionDiv.textContent = 'Версия сайта: 1.3.3. Идет разработка.';
        footerContainer.appendChild(versionDiv);
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
