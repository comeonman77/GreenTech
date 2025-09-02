// ========================================
// GREENTECH WEBSITE - MAIN JAVASCRIPT
// ========================================

// Portfolio Data
const portfolioData = {
    1: {
        title: "고성능 Flexible Duct 시스템",
        image: "images/portfolio/flexible-duct.jpg",
        description: "반도체 Fab 클린룸 환경에 최적화된 플렉시블 덕트 시스템은 최첨단 기술로 제작되어 뛰어난 내구성과 유연성을 자랑합니다. 클린룸의 엄격한 환경 기준을 충족하며, 장기간 안정적인 성능을 보장합니다.",
        features: [
            "클린룸 Class 100 환경 적합",
            "내화학성 및 내열성 우수",
            "유연한 설치 및 유지보수",
            "긴 수명과 높은 신뢰성",
            "맞춤형 사이즈 제작 가능"
        ],
        specs: {
            "재질": "특수 PVC / Stainless Steel",
            "내경": "50mm ~ 500mm",
            "사용온도": "-20°C ~ 80°C",
            "압력": "최대 3000Pa",
            "인증": "ISO 14644-1 Class 5"
        }
    },
    2: {
        title: "차세대 THC 측정기",
        image: "images/portfolio/thc-meter.jpg",
        description: "실시간 모니터링이 가능한 고정밀 THC(Total Hydrocarbon) 측정기는 반도체 공정의 품질 관리에 필수적인 장비입니다. 높은 정확도와 빠른 응답 속도로 공정 효율을 극대화합니다.",
        features: [
            "실시간 데이터 모니터링",
            "ppb 단위의 초정밀 측정",
            "자동 캘리브레이션 기능",
            "데이터 로깅 및 원격 관리",
            "알람 시스템 내장"
        ],
        specs: {
            "측정범위": "0 ~ 10,000 ppb",
            "정확도": "±2% FS",
            "응답시간": "< 10초",
            "통신": "RS-485, Ethernet",
            "디스플레이": "7인치 터치스크린"
        }
    },
    3: {
        title: "맞춤형 히팅 솔루션",
        image: "images/portfolio/heating-system.jpg",
        description: "다양한 반도체 공정에 적용 가능한 맞춤형 히팅 시스템은 정밀한 온도 제어와 균일한 열 분포를 제공합니다. 에너지 효율성과 공정 안정성을 동시에 만족시키는 최적의 솔루션입니다.",
        features: [
            "정밀 온도 제어 (±0.5°C)",
            "균일한 열 분포",
            "에너지 효율 최적화",
            "다양한 공정 적용 가능",
            "안전 시스템 내장"
        ],
        specs: {
            "온도범위": "상온 ~ 500°C",
            "정밀도": "±0.5°C",
            "히터타입": "세라믹 / 할로겐",
            "제어방식": "PID 제어",
            "전원": "220V / 380V 3상"
        }
    }
};

// Configuration Manager Class
class ConfigManager {
    constructor() {
        this.configs = {
            google: null,
            emailjs: null,
            site: null
        };
        this.loadPromise = null;
    }

    async loadConfig(configName, path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${configName} config: ${response.status}`);
            }
            this.configs[configName] = await response.json();
            console.log(`${configName} config loaded successfully`);
            return this.configs[configName];
        } catch (error) {
            console.warn(`Warning: ${configName} config not found. Using defaults.`);
            return this.getDefaultConfig(configName);
        }
    }

    getDefaultConfig(configName) {
        const defaults = {
            google: {
                apiKey: null,
                mapOptions: { zoom: 16 }
            },
            emailjs: {
                publicKey: null,
                serviceId: null,
                templateId: null
            },
            site: {
                company: {
                    name: "(주)그린테크",
                    nameEn: "GREENTECH CO., LTD."
                },
                contact: {
                    email: "jalhanda88@gmail.com"
                },
                location: {
                    coordinates: { lat: 37.1498, lng: 127.0772 }
                }
            }
        };
        return defaults[configName];
    }

    async loadAllConfigs() {
        if (this.loadPromise) return this.loadPromise;

        const configPaths = {
            google: 'config/google-maps.json',
            emailjs: 'config/emailjs.json',
            site: 'config/site-config.json'
        };

        this.loadPromise = Promise.all(
            Object.entries(configPaths).map(([name, path]) => 
                this.loadConfig(name, path)
            )
        );

        await this.loadPromise;
        return this.configs;
    }

    getGoogleMapsKey() {
        return this.configs.google?.apiKey || null;
    }

    getEmailJSConfig() {
        return this.configs.emailjs || null;
    }

    getSiteConfig() {
        return this.configs.site || null;
    }
}

// Initialize Configuration Manager
const configManager = new ConfigManager();

// ========================================
// UI FUNCTIONS
// ========================================

function showLoader() {
    const loader = document.getElementById('loadingSpinner');
    if (loader) loader.classList.add('active');
}

function hideLoader() {
    const loader = document.getElementById('loadingSpinner');
    if (loader) loader.classList.remove('active');
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// ========================================
// PORTFOLIO MODAL FUNCTIONS
// ========================================

function openPortfolioModal(portfolioId) {
    const modal = document.getElementById('portfolioModal');
    const data = portfolioData[portfolioId];
    
    if (!data) return;

    // Update modal content
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDescription').innerHTML = `<p>${data.description}</p>`;
    
    // Update image
    const modalImage = document.getElementById('modalImage');
    modalImage.src = data.image;
    modalImage.alt = data.title;
    modalImage.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U4ZjVlOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM0Q0FGNTA');
    };
    
    // Update features
    const featuresList = document.getElementById('modalFeatures');
    featuresList.innerHTML = data.features.map(feature => `<li>${feature}</li>`).join('');
    
    // Update specs
    const specsDiv = document.getElementById('modalSpecs');
    specsDiv.innerHTML = Object.entries(data.specs)
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('');
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// ========================================
// GOOGLE MAPS FUNCTIONS
// ========================================

async function initMap() {
    const googleConfig = configManager.configs.google;
    const siteConfig = configManager.configs.site;
    
    if (!googleConfig || !googleConfig.apiKey) {
        console.warn('Google Maps API key not configured');
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            mapDiv.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">지도를 불러올 수 없습니다.</div>';
        }
        return;
    }

    const lat = siteConfig?.location?.coordinates?.lat || 37.1498;
    const lng = siteConfig?.location?.coordinates?.lng || 127.0772;
    const greentechLocation = { lat, lng };
    
    try {
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: googleConfig.mapOptions?.zoom || 16,
            center: greentechLocation,
            styles: googleConfig.mapOptions?.styles || []
        });
        
        const marker = new google.maps.Marker({
            position: greentechLocation,
            map: map,
            title: siteConfig?.company?.name || '(주)그린테크',
            animation: google.maps.Animation.DROP
        });
        
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h4>${siteConfig?.company?.name || '(주)그린테크'}</h4>
                    <p>${siteConfig?.location?.address || '경기도 오산시 수목원로88번길 35<br>현대테라타워 B동 1005호'}</p>
                </div>
            `
        });
        
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
    }
}

async function loadGoogleMapsScript() {
    const apiKey = configManager.getGoogleMapsKey();
    
    if (!apiKey) {
        console.warn('Google Maps API key not available');
        return;
    }

    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapCallback`;
        script.async = true;
        script.defer = true;
        script.onerror = reject;
        
        window.initMapCallback = () => {
            initMap();
            resolve();
        };
        
        document.head.appendChild(script);
    });
}

// ========================================
// EMAIL FUNCTIONS
// ========================================

async function initEmailJS() {
    const emailConfig = configManager.getEmailJSConfig();
    
    if (!emailConfig || !emailConfig.publicKey) {
        console.warn('EmailJS configuration not available');
        return false;
    }

    try {
        emailjs.init(emailConfig.publicKey);
        console.log('EmailJS initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing EmailJS:', error);
        return false;
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const emailConfig = configManager.getEmailJSConfig();
    const siteConfig = configManager.getSiteConfig();
    
    if (!emailConfig || !emailConfig.serviceId || !emailConfig.templateId) {
        console.warn('EmailJS not configured, using mailto fallback');
        sendEmailViaMailto();
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
    
    const templateParams = {
        from_name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        from_email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value,
        to_email: siteConfig?.contact?.email || 'jalhanda88@gmail.com'
    };
    
    try {
        await emailjs.send(
            emailConfig.serviceId,
            emailConfig.templateId,
            templateParams
        );
        
        showAlert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.', 'success');
        document.getElementById('contactForm').reset();
    } catch (error) {
        console.error('EmailJS error:', error);
        showAlert('전송 중 오류가 발생했습니다. 직접 이메일로 문의해주세요.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '문의하기';
    }
}

function sendEmailViaMailto() {
    const name = document.getElementById('name').value;
    const company = document.getElementById('company').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    const subject = `[웹사이트 문의] ${name}님의 문의`;
    const body = `
성함: ${name}
회사명: ${company}
이메일: ${email}
연락처: ${phone}

문의내용:
${message}
    `;
    
    const siteConfig = configManager.getSiteConfig();
    const toEmail = siteConfig?.contact?.email || 'jalhanda88@gmail.com';
    
    window.location.href = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ========================================
// INITIALIZATION
// ========================================

async function initApp() {
    showLoader();
    
    try {
        // Load configurations
        await configManager.loadAllConfigs();
        
        // Initialize EmailJS
        await initEmailJS();
        
        // Load Google Maps
        await loadGoogleMapsScript();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    } finally {
        hideLoader();
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initApp();

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Portfolio item click handlers
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', function() {
            const portfolioId = this.getAttribute('data-portfolio-id');
            openPortfolioModal(portfolioId);
        });
    });

    // Modal close handlers
    const modal = document.getElementById('portfolioModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (modalClose) {
        modalClose.addEventListener('click', closePortfolioModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePortfolioModal();
            }
        });
    }

    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePortfolioModal();
        }
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});