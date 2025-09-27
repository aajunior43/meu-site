// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {

    // ===== DETECÇÃO DE DISPOSITIVO MOBILE =====
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

    // ===== NAVEGAÇÃO MOBILE =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle do menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fecha o menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== SCROLL SUAVE E NAVEGAÇÃO ATIVA =====
    const sections = document.querySelectorAll('section[id]');
    
    // Função para destacar o link ativo na navegação
    function highlightActiveSection() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    // ===== HEADER TRANSPARENTE NO SCROLL =====
    const header = document.querySelector('.header');
    
    function handleScroll() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        highlightActiveSection();
    }

    window.addEventListener('scroll', handleScroll);

    // ===== ANIMAÇÃO DAS BARRAS DE HABILIDADES =====
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                bar.classList.add('animated');
            }
        });
    }

    // ===== FILTROS DO PORTFÓLIO =====
    const portfolioFilters = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (portfolioFilters.length > 0) {
        portfolioFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Remove active class from all filters
                portfolioFilters.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked filter
                this.classList.add('active');
                
                // Filter portfolio items
                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeInUp 0.6s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ===== NAVEGAÇÃO ENTRE PÁGINAS =====
    // Atualiza o link ativo baseado na página atual
    function updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Chama a função ao carregar a página
    updateActiveNavLink();

    // ===== FORMULÁRIO DE CONTATO =====
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Adiciona validação em tempo real
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Validação completa
            if (!validateForm()) {
                showNotification('Por favor, corrija os erros no formulário.', 'error');
                return;
            }

            // Simula envio do formulário
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            // Simula delay de envio
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso! Retornarei em breve.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Remove classes de erro
                inputs.forEach(input => {
                    input.classList.remove('error');
                    const errorMsg = input.parentNode.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                });
            }, 2000);
        });
    }

    // Função de validação de campo individual
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove erro anterior
        clearFieldError(e);

        switch(field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'E-mail inválido';
                }
                break;
            case 'tel':
                const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
                if (value && !phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Formato: (00) 00000-0000';
                }
                break;
        }

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    // Função para limpar erro do campo
    function clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }

    // Função para mostrar erro no campo
    function showFieldError(field, message) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    // Função de validação completa do formulário
    function validateForm() {
        const form = document.querySelector('.contact-form');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'Este campo é obrigatório');
                isValid = false;
            } else {
                // Valida campos específicos
                const fakeEvent = { target: field };
                if (!validateField(fakeEvent)) {
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // ===== FUNÇÕES AUXILIARES =====
    
    // Validação de e-mail
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Sistema de notificações
    function showNotification(message, type = 'info') {
        // Remove notificação existente se houver
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Adiciona estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        
        document.body.appendChild(notification);
        
        // Anima a entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Botão de fechar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    // ===== ANIMAÇÕES NO SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Anima barras de habilidades quando a seção fica visível
                if (entry.target.id === 'skills') {
                    setTimeout(animateSkillBars, 300);
                }
            }
        });
    }, observerOptions);

    // Observa todas as seções para animações
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observa elementos específicos para animações
    const animatedElements = document.querySelectorAll('.stat, .skill-category, .timeline-item, .portfolio-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // ===== EFEITO PARALLAX SUAVE NO HERO =====
    const hero = document.querySelector('.hero');
    
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    }

    // ===== CONTADOR ANIMADO PARA ESTATÍSTICAS =====
    const stats = document.querySelectorAll('.stat h3');
    
    function animateCounters() {
        stats.forEach(stat => {
            const rect = stat.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !stat.classList.contains('counted')) {
                const target = parseInt(stat.textContent);
                const increment = target / 50;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '') + (stat.textContent.includes('%') ? '%' : '');
                }, 40);
                
                stat.classList.add('counted');
            }
        });
    }

    // ===== SMOOTH SCROLL PARA LINKS INTERNOS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== EVENT LISTENERS PARA SCROLL =====
    let ticking = false;
    
    function updateOnScroll() {
        animateSkillBars();
        animateCounters();
        parallaxEffect();
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });

    // ===== LOADING INICIAL =====
    window.addEventListener('load', function() {
        // Remove qualquer loader se existir
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
        
        // Inicia animações iniciais
        setTimeout(() => {
            animateSkillBars();
            animateCounters();
        }, 500);
    });

    // ===== PREVENÇÃO DE SPAM NO FORMULÁRIO =====
    let formSubmitted = false;
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (formSubmitted) {
                e.preventDefault();
                showNotification('Aguarde um momento antes de enviar outra mensagem.', 'error');
                return;
            }
            
            formSubmitted = true;
            setTimeout(() => {
                formSubmitted = false;
            }, 30000); // 30 segundos de cooldown
        });
    }

    // ===== EASTER EGG - KONAMI CODE =====
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.length === konamiSequence.length && 
            konamiCode.every((code, index) => code === konamiSequence[index])) {
            showNotification('🎉 Código Konami ativado! Você encontrou o easter egg!', 'success');
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }
    });

    // Adiciona CSS para o easter egg
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // ===== INICIALIZAÇÃO DE EFEITOS INTERATIVOS =====
    createParticles();
    createMouseFollower();
    addRippleEffect();

    // Inicia efeito typing com delay
    setTimeout(() => {
        typewriterEffect();
    }, 1000);

    // ===== VALIDAÇÃO AVANÇADA PARA PÁGINA DE CONTATO =====
    initContactFormValidation();

    // ===== INICIALIZAÇÃO DO SISTEMA DE TEMA =====
    initThemeToggle();

    // ===== INICIALIZAÇÃO DO FAQ =====
    initFAQ();

    // ===== INICIALIZAÇÃO DO LOADER =====
    initPageLoader();

    // ===== INICIALIZAÇÃO DO MAPA INTERATIVO =====
    initInteractiveMap();

    // ===== INICIALIZAÇÃO DOS CERTIFICADOS =====
    initCertificates();

    console.log('🚀 Site carregado com sucesso! Desenvolvido com ❤️');
    console.log('✨ Efeitos interativos ativados!');
});

// ===== SISTEMA DE PARTÍCULAS =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Posição inicial aleatória
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

        particlesContainer.appendChild(particle);
    }
}

// ===== FUNÇÃO PARA SCROLL SUAVE =====
function scrollToNext() {
    const heroHeight = document.querySelector('.hero').offsetHeight;
    window.scrollTo({
        top: heroHeight,
        behavior: 'smooth'
    });
}

// ===== EFEITO MOUSE SEGUIDOR =====
function createMouseFollower() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(0,212,255,0.4) 100%);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    // Efeito hover em elementos interativos
    const interactiveElements = document.querySelectorAll('a, button, .btn, .social-link');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'radial-gradient(circle, rgba(255,107,157,0.8) 0%, rgba(196,113,237,0.4) 100%)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(0,212,255,0.4) 100%)';
        });
    });
}

// ===== EFEITO RIPPLE NOS BOTÕES =====
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .social-link');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Adiciona CSS da animação ripple
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// ===== ANIMAÇÃO DE TYPING PARA O TÍTULO =====
function typewriterEffect() {
    const heroName = document.querySelector('.hero-name');
    if (!heroName) return;

    const text = heroName.textContent;
    heroName.textContent = '';
    heroName.style.borderRight = '3px solid rgba(255,255,255,0.8)';

    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            heroName.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            setTimeout(() => {
                heroName.style.borderRight = 'none';
            }, 1000);
        }
    }, 100);
}

// ===== VALIDAÇÃO AVANÇADA DO FORMULÁRIO DE CONTATO =====
function initContactFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.querySelector('.form-progress-bar');
    const progressFill = document.querySelector('.progress-fill');

    // Contador de caracteres para mensagem
    const messageField = fields.message;
    const charCounter = document.querySelector('.character-counter');
    const currentChars = document.querySelector('.current-chars');
    const maxChars = 500;

    if (messageField && charCounter) {
        messageField.addEventListener('input', function() {
            const length = this.value.length;
            currentChars.textContent = length;

            charCounter.classList.remove('warning', 'danger');
            if (length > maxChars * 0.8) {
                charCounter.classList.add('warning');
            }
            if (length > maxChars * 0.95) {
                charCounter.classList.add('danger');
            }

            // Limita caracteres
            if (length > maxChars) {
                this.value = this.value.substring(0, maxChars);
                currentChars.textContent = maxChars;
            }
        });
    }

    // Validação em tempo real
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (!field) return;

        const formGroup = field.closest('.form-group');

        field.addEventListener('input', () => validateField(field, formGroup));
        field.addEventListener('blur', () => validateField(field, formGroup));
        field.addEventListener('focus', () => clearFieldStatus(formGroup));
    });

    // Validação individual de campo
    function validateField(field, formGroup) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove status anterior
        clearFieldStatus(formGroup);

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        } else if (value) {
            switch (field.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'E-mail inválido';
                    }
                    break;
                case 'tel':
                    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
                    if (value && !phoneRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Formato: (00) 00000-0000';
                    }
                    break;
            }

            // Validação de nome
            if (field.name === 'name' && value.length < 2) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
            }

            // Validação de mensagem
            if (field.name === 'message' && value.length < 10) {
                isValid = false;
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
            }
        }

        // Aplica status visual
        if (isValid && value) {
            formGroup.classList.add('valid');
            formGroup.classList.remove('invalid');
        } else if (!isValid) {
            formGroup.classList.add('invalid');
            formGroup.classList.remove('valid');
            showErrorTooltip(formGroup, errorMessage);
        }

        updateFormProgress();
        return isValid;
    }

    // Limpa status do campo
    function clearFieldStatus(formGroup) {
        formGroup.classList.remove('valid', 'invalid');
        const tooltip = formGroup.querySelector('.error-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Mostra tooltip de erro
    function showErrorTooltip(formGroup, message) {
        const existingTooltip = formGroup.querySelector('.error-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.className = 'error-tooltip';
        tooltip.textContent = message;
        formGroup.appendChild(tooltip);

        setTimeout(() => {
            tooltip.classList.add('show');
        }, 100);

        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.classList.remove('show');
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // Atualiza barra de progresso
    function updateFormProgress() {
        const totalRequiredFields = Object.keys(fields).filter(key =>
            fields[key] && fields[key].hasAttribute('required')
        ).length;

        const validFields = Object.keys(fields).filter(key => {
            const field = fields[key];
            if (!field || !field.hasAttribute('required')) return false;
            const formGroup = field.closest('.form-group');
            return formGroup && formGroup.classList.contains('valid');
        }).length;

        const progress = (validFields / totalRequiredFields) * 100;

        if (progress > 0) {
            progressBar.classList.add('active');
            progressFill.style.width = progress + '%';
        } else {
            progressBar.classList.remove('active');
        }
    }

    // Formatação automática de telefone
    if (fields.phone) {
        fields.phone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d+)/, '($1) $2');
            }
            e.target.value = value;
        });
    }

    // Submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Valida todos os campos
        let allValid = true;
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (field) {
                const formGroup = field.closest('.form-group');
                if (!validateField(field, formGroup)) {
                    allValid = false;
                }
            }
        });

        if (!allValid) {
            showNotification('Por favor, corrija os erros no formulário.', 'error');
            return;
        }

        // Simula envio
        submitBtn.classList.add('loading');
        progressBar.classList.add('active');
        progressFill.style.width = '100%';

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            showNotification('Mensagem enviada com sucesso! Retornarei em breve.', 'success');
            form.reset();

            // Limpa todos os status
            Object.keys(fields).forEach(fieldName => {
                const field = fields[fieldName];
                if (field) {
                    const formGroup = field.closest('.form-group');
                    clearFieldStatus(formGroup);
                }
            });

            progressBar.classList.remove('active');
            progressFill.style.width = '0%';
            if (currentChars) currentChars.textContent = '0';

        }, 2500);
    });
}



// ===== SISTEMA DE ALTERNÂNCIA DE TEMA =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const toggleIcon = document.querySelector('.toggle-icon');
    const body = document.body;

    if (!themeToggle) return;

    // Carrega tema salvo ou define padrão como escuro
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // Adiciona event listener para o toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Função para aplicar o tema
    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-theme');
            toggleIcon.className = 'toggle-icon fas fa-moon';
        } else {
            body.classList.remove('light-theme');
            toggleIcon.className = 'toggle-icon fas fa-sun';
        }

        // Adiciona classe de transição
        body.classList.add('theme-transition');

        // Remove a classe de transição após a animação
        setTimeout(() => {
            body.classList.remove('theme-transition');
        }, 300);
    }

    // Detecta preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'light' : 'dark');
        }
    });
}

// ===== FUNÇÕES GLOBAIS =====

// Função legacy mantida para compatibilidade
function toggleTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.click();
    }
}

// Função para compartilhar nas redes sociais
function shareOnSocial(platform, url = window.location.href, text = 'Confira este portfólio incrível!') {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Função para copiar texto para clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Texto copiado para a área de transferência!', 'success');
    } catch (err) {
        console.error('Erro ao copiar texto: ', err);
        showNotification('Erro ao copiar texto.', 'error');
    }
}





// ===== SISTEMA DE MAPA INTERATIVO =====
function initInteractiveMap() {
    const interactiveMap = document.getElementById('interactiveMap');
    if (!interactiveMap) return;

    // Funções globais para controles do mapa
    window.toggleMapFullscreen = function() {
        const map = document.getElementById('interactiveMap');
        const expandIcon = document.querySelector('.map-control-btn i.fa-expand');
        const compressIcon = document.querySelector('.map-control-btn i.fa-compress');

        if (map.classList.contains('fullscreen')) {
            map.classList.remove('fullscreen');
            if (expandIcon) expandIcon.className = 'fas fa-expand';
            document.body.style.overflow = '';
        } else {
            map.classList.add('fullscreen');
            if (expandIcon) expandIcon.className = 'fas fa-compress';
            document.body.style.overflow = 'hidden';
        }
    };

    window.centerMap = function() {
        const iframe = document.getElementById('locationMap');
        if (iframe) {
            // Recarrega o iframe para centralizar
            const currentSrc = iframe.src;
            iframe.src = currentSrc;

            // Feedback visual
            showNotification('Mapa centralizado!', 'success');
        }
    };

    window.toggleMapType = function() {
        const iframe = document.getElementById('locationMap');
        if (!iframe) return;

        const currentSrc = iframe.src;
        let newSrc;

        if (currentSrc.includes('maptype=satellite')) {
            // Volta para normal
            newSrc = currentSrc.replace('&maptype=satellite', '');
            showNotification('Visualização: Mapa', 'info');
        } else if (currentSrc.includes('maptype=hybrid')) {
            // Muda para satélite
            newSrc = currentSrc.replace('&maptype=hybrid', '&maptype=satellite');
            showNotification('Visualização: Satélite', 'info');
        } else {
            // Muda para híbrido
            newSrc = currentSrc + '&maptype=hybrid';
            showNotification('Visualização: Híbrido', 'info');
        }

        iframe.src = newSrc;
    };

    // Escape para sair do fullscreen
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && interactiveMap.classList.contains('fullscreen')) {
            toggleMapFullscreen();
        }
    });

    // Animação do pin de localização
    const locationPin = document.querySelector('.location-pin');
    if (locationPin) {
        locationPin.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'mapPinPulse 2s ease-in-out infinite';
            }, 100);

            showNotification('📍 Inajá, Paraná - Atendimento presencial e remoto disponível!', 'info');
        });
    }

    // Lazy loading do mapa
    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target.querySelector('iframe');
                if (iframe && !iframe.dataset.loaded) {
                    iframe.dataset.loaded = 'true';
                    // Adiciona efeito de carregamento
                    iframe.style.opacity = '0';
                    iframe.onload = function() {
                        this.style.transition = 'opacity 0.5s ease';
                        this.style.opacity = '1';
                    };
                }
                mapObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    mapObserver.observe(interactiveMap);
}

// ===== SISTEMA DE CERTIFICADOS =====
function initCertificates() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certificateCards = document.querySelectorAll('.certificate-card');
    const modal = document.getElementById('certificateModal');

    if (!filterButtons.length || !certificateCards.length) return;

    // Sistema de filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Remove active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona active ao clicado
            this.classList.add('active');

            // Filtra certificados
            certificateCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });

            // Feedback visual
            showNotification(`Filtro aplicado: ${this.textContent.trim()}`, 'info');
        });
    });

    // Dados dos certificados (simulado)
    const certificatesData = {
        'react-advanced': {
            title: 'React.js Avançado',
            issuer: 'Rocketseat',
            date: 'Dezembro 2024',
            hours: '40 horas',
            id: 'RC-2024-ADV-001'
        },
        'javascript-es6': {
            title: 'JavaScript ES6+',
            issuer: 'Alura',
            date: 'Novembro 2024',
            hours: '30 horas',
            id: 'AL-2024-JS6-002'
        },
        'nodejs-api': {
            title: 'Node.js API REST',
            issuer: 'Udemy',
            date: 'Outubro 2024',
            hours: '25 horas',
            id: 'UD-2024-NOD-003'
        },
        'python-django': {
            title: 'Python Django',
            issuer: 'Coursera',
            date: 'Setembro 2024',
            hours: '35 horas',
            id: 'CS-2024-PYD-004'
        },
        'react-native': {
            title: 'React Native',
            issuer: 'Rocketseat',
            date: 'Agosto 2024',
            hours: '45 horas',
            id: 'RC-2024-RN-005'
        },
        'aws-practitioner': {
            title: 'AWS Cloud Practitioner',
            issuer: 'Amazon Web Services',
            date: 'Julho 2024',
            hours: '20 horas',
            id: 'AWS-2024-CP-006'
        },
        'docker-k8s': {
            title: 'Docker & Kubernetes',
            issuer: 'Digital Innovation One',
            date: 'Junho 2024',
            hours: '30 horas',
            id: 'DIO-2024-DK8-007'
        },
        'ui-ux-design': {
            title: 'UI/UX Design',
            issuer: 'Origamid',
            date: 'Maio 2024',
            hours: '50 horas',
            id: 'OR-2024-UXD-008'
        },
        'data-science': {
            title: 'Data Science & Analytics',
            issuer: 'Data Science Academy',
            date: 'Abril 2024',
            hours: '60 horas',
            id: 'DSA-2024-DS-009'
        }
    };

    // Função global para visualizar certificado
    window.viewCertificate = function(certificateId) {
        const data = certificatesData[certificateId];
        if (!data || !modal) return;

        // Preenche os dados do modal
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalIssuer').textContent = data.issuer;
        document.getElementById('modalDate').textContent = data.date;
        document.getElementById('modalHours').textContent = data.hours;
        document.getElementById('modalId').textContent = data.id;

        // Exibe o modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Adiciona animação de entrada
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease';
    };

    // Função global para fechar modal
    window.closeCertificateModal = function() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Função global para verificar certificado
    window.verifyCertificate = function() {
        const certificateId = document.getElementById('modalId').textContent;
        showNotification(`Verificando autenticidade do certificado ${certificateId}...`, 'info');

        setTimeout(() => {
            showNotification('✅ Certificado verificado e autêntico!', 'success');
        }, 2000);
    };

    // Fecha modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeCertificateModal();
        }
    });

    // Animação dos cards de estatísticas
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.6s ease forwards`;

                        // Anima o número
                        const numberElement = entry.target.querySelector('.stat-info h3');
                        if (numberElement) {
                            animateNumber(numberElement);
                        }
                    }, index * 200);

                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        statCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            statsObserver.observe(card);
        });
    }

    // Função para animar números
    function animateNumber(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const targetNumber = parseInt(text.replace(/[^\d]/g, ''));

        let currentNumber = 0;
        const increment = targetNumber / 50;
        const duration = 1500;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }

            let displayText = Math.floor(currentNumber).toString();
            if (hasPlus) displayText += '+';
            if (hasPercent) displayText += '%';

            element.textContent = displayText;
        }, stepTime);
    }

    // Animação dos cards de certificados
    const certificateObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                }, index * 100);
                certificateObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    certificateCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        certificateObserver.observe(card);
    });

    // Micro-interações avançadas
    addMicroInteractions();

    // Melhorar acessibilidade
    initAccessibility();

    // Adiciona CSS das animações
    const certificatesAnimationCSS = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(251, 191, 36, 0.5); }
            50% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(0, 212, 255, 0.5); }
        }
    `;

    // Adiciona o CSS ao documento se ainda não existir
    if (!document.querySelector('#certificates-animations')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'certificates-animations';
        styleSheet.textContent = certificatesAnimationCSS;
        document.head.appendChild(styleSheet);
    }

    // Adiciona efeitos de partículas nos certificados
    addCertificateParticles();
}

// ===== MICRO-INTERAÇÕES AVANÇADAS =====
function addMicroInteractions() {
    // Otimização para dispositivos móveis
    if (isMobile) {
        // Simplificar micro-interações em mobile
        const certificateCards = document.querySelectorAll('.certificate-card');
        certificateCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.2s ease';
            });

            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // Botões de filtro simplificados para mobile
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });

            button.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });

        return; // Sair da função para mobile
    }

    // Efeito shimmer nos cards (apenas desktop)
    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            createShimmerEffect(this);
        });
    });

    // Efeito de focus nos botões de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('focus', function() {
            this.style.animation = 'glow 1s ease-in-out';
        });

        button.addEventListener('blur', function() {
            this.style.animation = '';
        });
    });

    // Efeito de shake nos botões quando clicados rapidamente
    let clickCount = 0;
    const buttons = document.querySelectorAll('.btn-view, .btn-download');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            clickCount++;
            if (clickCount > 2) {
                this.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    this.style.animation = '';
                    clickCount = 0;
                }, 500);
            }

            setTimeout(() => {
                if (clickCount > 0) clickCount--;
            }, 1000);
        });
    });

    // Efeito de ripple personalizado nos stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this, 'rgba(251, 191, 36, 0.3)');
        });
    });

    // Adiciona CSS para micro-interações
    const microInteractionsCSS = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .shimmer-effect {
            position: relative;
            overflow: hidden;
        }

        .shimmer-effect::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            animation: shimmer 2s ease-in-out;
            z-index: 1;
        }

        .certificate-card:hover .certificate-content {
            position: relative;
            z-index: 2;
        }
    `;

    const microStyleSheet = document.createElement('style');
    microStyleSheet.textContent = microInteractionsCSS;
    document.head.appendChild(microStyleSheet);
}

// Função para criar efeito shimmer
function createShimmerEffect(element) {
    element.classList.add('shimmer-effect');
    setTimeout(() => {
        element.classList.remove('shimmer-effect');
    }, 2000);
}

// Função para criar efeito ripple personalizado
function createRippleEffect(event, element, color = 'rgba(255, 255, 255, 0.3)') {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: ${color};
        transform: scale(0);
        animation: ripple 0.8s linear;
        pointer-events: none;
        z-index: 10;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// ===== SISTEMA DE PARTÍCULAS PARA CERTIFICADOS =====
function addCertificateParticles() {
    const certificatesSection = document.querySelector('.certificates-section');
    if (!certificatesSection) return;

    // Otimização para mobile - menos partículas ou desabilitadas
    if (isMobile) {
        // Adicionar apenas efeitos leves para mobile
        const particleCount = 5; // Reduzir drasticamente
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle mobile-optimized';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: rgba(251, 191, 36, 0.4);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 2 + 3}s ease-in-out infinite;
                animation-delay: ${Math.random() * 1}s;
                pointer-events: none;
                z-index: 1;
                opacity: 0.6;
            `;
            certificatesSection.appendChild(particle);
        }
        return; // Não adicionar cursor trail em mobile
    }

    // Desktop - partículas completas
    for (let i = 0; i < 15; i++) { // Reduzido de 20 para 15
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, rgba(251, 191, 36, 0.8), rgba(0, 212, 255, 0.6));
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 3 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            pointer-events: none;
            z-index: 1;
        `;

        certificatesSection.appendChild(particle);
    }

    // Efeito de cursor trail apenas para desktop
    document.addEventListener('mousemove', function(e) {
        if (e.target.closest('.certificates-section')) {
            createCursorTrail(e.clientX, e.clientY);
        }
    });
}

// Função para criar rastro do cursor
function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: radial-gradient(circle, rgba(251, 191, 36, 0.8), transparent);
        border-radius: 50%;
        left: ${x - 3}px;
        top: ${y - 3}px;
        pointer-events: none;
        z-index: 9999;
        animation: trailFade 1s ease-out forwards;
    `;

    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 1000);

    // CSS para o trail
    if (!document.querySelector('#trail-animation')) {
        const trailCSS = `
            @keyframes trailFade {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.5);
                }
            }
        `;
        const trailStyleSheet = document.createElement('style');
        trailStyleSheet.id = 'trail-animation';
        trailStyleSheet.textContent = trailCSS;
        document.head.appendChild(trailStyleSheet);
    }
}

// ===== SISTEMA DE FAQ =====
function initFAQ() {
    window.toggleFaq = function(element) {
        const faqItem = element.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');

        // Fecha todos os FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Abre o clicado se não estava ativo
        if (!isActive) {
            faqItem.classList.add('active');
        }
    };
}

// ===== SISTEMA DE LOADER =====
function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    // Simula carregamento
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 1500);

    // Remove loader se a página já carregou
    window.addEventListener('load', () => {
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    });
}

// ===== SISTEMA DE ACESSIBILIDADE =====
function initAccessibility() {
    // Gerenciar estados ARIA dos filtros
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('role', 'button');

        button.addEventListener('click', function() {
            // Reset outros botões
            filterButtons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
            // Ativar o clicado
            this.setAttribute('aria-pressed', 'true');
        });

        // Navegação por teclado
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Tornar cards de certificado acessíveis
    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Certificado ${index + 1}`);

        // Navegação por teclado nos cards
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const viewButton = card.querySelector('.btn-view');
                if (viewButton) viewButton.click();
            }
        });
    });

    // Melhorar navegação por teclado no menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'nav-menu');
        hamburger.setAttribute('aria-label', 'Abrir menu de navegação');

        navMenu.setAttribute('id', 'nav-menu');

        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            this.setAttribute('aria-label', isExpanded ? 'Abrir menu de navegação' : 'Fechar menu de navegação');
        });
    }

    // Adicionar labels apropriados para modais
    const modals = document.querySelectorAll('.cert-modal');
    modals.forEach(modal => {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');

        const closeButton = modal.querySelector('.cert-modal-close');
        if (closeButton) {
            closeButton.setAttribute('aria-label', 'Fechar modal');
        }
    });

    // Gerenciar foco nos modais
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.cert-modal.active');
            if (activeModal) {
                const closeButton = activeModal.querySelector('.cert-modal-close');
                if (closeButton) closeButton.click();
            }
        }
    });

    // Anunciar mudanças de filtro para leitores de tela
    const certificatesGrid = document.querySelector('.certificates-grid');
    if (certificatesGrid) {
        certificatesGrid.setAttribute('aria-live', 'polite');
        certificatesGrid.setAttribute('aria-label', 'Lista de certificados');
    }

    // Melhorar acessibilidade dos botões de ação
    const actionButtons = document.querySelectorAll('.btn-view, .btn-download');
    actionButtons.forEach(button => {
        if (button.classList.contains('btn-view')) {
            button.setAttribute('aria-label', 'Visualizar certificado');
        } else if (button.classList.contains('btn-download')) {
            button.setAttribute('aria-label', 'Baixar certificado');
        }
    });

    // Adicionar skip link se não existir
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Pular para o conteúdo principal';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Adicionar ID ao conteúdo principal se não existir
    const mainSection = document.querySelector('.certificates-section') || document.querySelector('main');
    if (mainSection && !mainSection.id) {
        mainSection.id = 'main-content';
    }
}

