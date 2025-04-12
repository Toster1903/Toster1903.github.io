async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/Toster1903/repos?sort=updated&direction=desc');
        const projects = await response.json();
        
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = ''; // Очищаем существующие проекты

        projects.forEach(project => {
            if (!project.fork) { // Показываем только нефоркнутые репозитории
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <h3>${project.name}</h3>
                    <p>${project.description || 'Описание отсутствует'}</p>
                    <div class="project-stats">
                        <span>⭐ ${project.stargazers_count}</span>
                        <span>📚 ${project.language || 'Не указан'}</span>
                        <span>📅 ${new Date(project.updated_at).toLocaleDateString()}</span>
                    </div>
                    <a href="${project.html_url}" target="_blank" class="project-link">Посмотреть проект</a>
                `;
                projectsGrid.appendChild(projectCard);
            }
        });
    } catch (error) {
        console.error('Ошибка при загрузке проектов:', error);
        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = '<p class="error">Не удалось загрузить проекты. Попробуйте позже.</p>';
    }
}

// Навигация по страницам
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка проектов
    fetchGitHubProjects();

    // Получаем все ссылки навигации
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    // Функция для переключения активной секции
    function setActiveSection(sectionId) {
        // Убираем активный класс у всех секций и ссылок
        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        // Добавляем активный класс выбранной секции и ссылке
        document.getElementById(sectionId).classList.add('active');
        document.querySelector(`.nav-links a[href="#${sectionId}"]`).classList.add('active');
    }

    // Обработчик клика по ссылкам навигации
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            setActiveSection(sectionId);
        });
    });

    // Плавная прокрутка к секциям
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
});

// Мобильное меню
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Закрытие меню при клике вне меню
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}); 