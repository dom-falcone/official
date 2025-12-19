/**
 * Универсальный скрипт для отображения статуса авторизации в шапке сайта
 * Подключите этот файл на всех страницах: <script src="../assets/js/auth-header.js"></script>
 */

const API_BASE = "https://dom-falcone-auth.dom-falcone-official.workers.dev/api";

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
        await loadUserHeader(token);
    }
});

async function loadUserHeader(token) {
    try {
        const res = await fetch(API_BASE + "/me", {
            headers: { 
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error('Token invalid');
        }

        const userData = await res.json();
        displayUserMenu(userData);
    } catch (err) {
        console.error('Auth header error:', err);
        // Удаляем невалидный токен
        localStorage.removeItem('auth_token');
        showLoginButton();
    }
}

function displayUserMenu(userData) {
    const authAction = document.querySelector('.auth-action');
    if (!authAction) return;

    // Получаем инициалы для аватарки
    const initials = userData.display_name 
        ? userData.display_name.charAt(0).toUpperCase() 
        : userData.email.charAt(0).toUpperCase();

    // Создаём HTML для авторизованного пользователя
    authAction.innerHTML = `
        <div class="user-header-container">
            <div class="user-points-badge">
                <span class="points-icon">⭐</span>
                <span class="points-value">${userData.points || 0}</span>
            </div>
            <a href="../dashboard" class="user-profile-link">
                <div class="user-avatar-small">
                    ${userData.avatar_url 
                        ? `<img src="${userData.avatar_url}" alt="${userData.display_name || 'User'}" class="avatar-image">` 
                        : `<span class="avatar-initials">${initials}</span>`
                    }
                </div>
                <span class="user-name-display">${userData.display_name || 'Пользователь'}</span>
            </a>
            <button class="logout-btn-small" onclick="handleLogout()">Выход</button>
        </div>
    `;

    // Добавляем стили если их ещё нет
    if (!document.getElementById('auth-header-styles')) {
        addAuthHeaderStyles();
    }
}

function showLoginButton() {
    const authAction = document.querySelector('.auth-action');
    if (!authAction) return;
    
    authAction.innerHTML = `
        <a href="../login" class="btn-login">Войти</a>
    `;
}

function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('auth_token');
        window.location.href = '../login';
    }
}

function addAuthHeaderStyles() {
    const styleElement = document.createElement('style');
    styleElement.id = 'auth-header-styles';
    styleElement.textContent = `
        .user-header-container {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .user-points-badge {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.4rem 0.8rem;
            background: rgba(255, 23, 68, 0.1);
            border: 1px solid rgba(255, 23, 68, 0.3);
            border-radius: 20px;
            font-size: 0.85rem;
        }

        .points-icon {
            font-size: 1rem;
        }

        .points-value {
            color: var(--color-primary, #ff1744);
            font-weight: 600;
        }

        .user-profile-link {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            padding: 0.4rem 0.8rem;
            border-radius: 25px;
        }

        .user-profile-link:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .user-avatar-small {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;
            background: linear-gradient(135deg, #ff1744, #ff6e40);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .avatar-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .avatar-initials {
            color: white;
            font-weight: 700;
            font-size: 1rem;
        }

        .user-name-display {
            font-weight: 600;
            font-size: 0.95rem;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .logout-btn-small {
            padding: 0.5rem 1rem;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.7);
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .logout-btn-small:hover {
            background: rgba(255, 23, 68, 0.1);
            border-color: var(--color-primary, #ff1744);
            color: var(--color-primary, #ff1744);
        }

        /* Адаптивность */
        @media (max-width: 768px) {
            .user-header-container {
                gap: 0.5rem;
            }

            .user-name-display {
                display: none;
            }

            .logout-btn-small {
                padding: 0.4rem 0.8rem;
                font-size: 0.75rem;
            }

            .user-points-badge {
                padding: 0.3rem 0.6rem;
                font-size: 0.75rem;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Экспортируем функцию для использования в глобальной области
window.handleLogout = handleLogout;
