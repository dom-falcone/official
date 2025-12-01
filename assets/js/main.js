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
                alert('Послание успешно отправлено Дону!');
                contactForm.reset();
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }, function (error) {
                alert('Ошибка отправки: ' + JSON.stringify(error));
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
            if (confirm(`Выйти из аккаунта ${currentUser}?`)) {
                localStorage.removeItem('domFalconeUser');
                window.location.reload();
            }
        });
    }
};

// Run check on load
document.addEventListener('DOMContentLoaded', checkLoginState);