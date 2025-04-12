document.addEventListener('DOMContentLoaded', () => {
    // Навигация
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    function setActiveSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            setActiveSection(sectionId);
            window.history.pushState({}, '', `#${sectionId}`);
        });
    });

    // Обработка хеша при загрузке страницы
    const initialHash = window.location.hash.substring(1) || 'home';
    setActiveSection(initialHash);

    // Загрузка проектов с GitHub
    async function fetchGitHubProjects() {
        try {
            const response = await fetch('https://api.github.com/users/your-username/repos?sort=updated');
            const projects = await response.json();
            displayProjects(projects);
        } catch (error) {
            console.error('Ошибка при загрузке проектов:', error);
        }
    }

    function displayProjects(projects) {
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description || 'Описание отсутствует'}</p>
                <div class="project-links">
                    <a href="${project.html_url}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                </div>
            `;
            projectsContainer.appendChild(projectCard);
        });
    }

    // Загрузка проектов при открытии страницы проектов
    const projectsSection = document.getElementById('projects');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fetchGitHubProjects();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(projectsSection);

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
