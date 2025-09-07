// ========================================
// GREENTECH WEBSITE - MAIN JAVASCRIPT (REFACTORED)
// ========================================

// ⭐ ADDED: Portfolio data now includes gallery images (was missing)
const portfolioData = {
    1: {
        title: "고성능 Flexible Duct 시스템",
        images: [
            "images/portfolio/flexible-duct-1.jpg",
            "images/portfolio/flexible-duct-2.jpg"
        ],
        description: "반도체 Fab 클린룸 환경에 최적화된 플렉시블 덕트 시스템은 최첨단 기술로 제작되어 뛰어난 내구성과 유연성을 자랑합니다.",
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
        images: [
            "images/portfolio/thc-meter-1.jpg",
            "images/portfolio/thc-meter-2.jpg",
            "images/portfolio/thc-meter-3.jpg"
        ],
        description: "실시간 모니터링이 가능한 고정밀 THC 측정기는 반도체 공정의 품질 관리에 필수적인 장비입니다.",
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
        images: [
            "images/portfolio/heating-system-1.jpg",
            "images/portfolio/heating-system-2.jpg",
            "images/portfolio/heating-system-3.jpg",
            "images/portfolio/heating-system-4.jpg",
            "images/portfolio/heating-system-5.jpg",
            "images/portfolio/heating-system-6.jpg",
            "images/portfolio/heating-system-7.jpg",
            "images/portfolio/heating-system-8.jpg",
            "images/portfolio/heating-system-9.jpg"
        ],
        description: "다양한 반도체 공정에 적용 가능한 맞춤형 히팅 시스템은 정밀한 온도 제어와 균일한 열 분포를 제공합니다.",
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

// Configuration Manager Class - NO CHANGES
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
            // ⭐ FIXED: Now properly stores default config in this.configs
            const defaultConfig = this.getDefaultConfig(configName);
            this.configs[configName] = defaultConfig;
            return defaultConfig;
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
                    email: "jalhanda88@gmail.com",
                    phone: "070-7010-7988"
                },
                location: {
                    address: "경기도 오산시 수목원로88번길 35, 현대테라타워 B동 1005호",
                    coordinates: { lat: 37.143574621291094, lng: 127.05966031328906 }
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

const configManager = new ConfigManager();

// ========================================
// UI FUNCTIONS
// ========================================

function showLoader() {
    const loader = document.getElementById('loadingSpinner');
    if (loader) {
        loader.classList.add('active');
        loader.style.display = 'block';
    }
}

function hideLoader() {
    const loader = document.getElementById('loadingSpinner');
    if (loader) {
        loader.classList.remove('active');
        loader.style.display = 'none';
    }
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

// ⭐ ADDED: Missing initImageSliders function
function initImageSliders() {
    console.log('Initializing image sliders...');
    const sliders = document.querySelectorAll('.portfolio-image-slider');
    
    if (sliders.length === 0) {
        console.log('No image sliders found - using standard portfolio layout');
        return;
    }
    
    sliders.forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const images = container?.querySelectorAll('.slider-image');
        const dots = slider.querySelectorAll('.dot');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        
        if (!images || images.length === 0) return;
        
        let currentIndex = 0;
        
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            if (images[index]) images[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            if (container) container.setAttribute('data-current', index);
        }
        
        function nextImage(e) {
            if (e) e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }
        
        function prevImage(e) {
            if (e) e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        }
        
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = index;
                showImage(currentIndex);
            });
        });
    });
}

// ========================================
// PORTFOLIO MODAL FUNCTIONS
// ========================================

function openPortfolioModal(portfolioId) {
    const modal = document.getElementById('portfolioModal');
    const data = portfolioData[portfolioId];
    
    if (!data || !modal) return;

    document.getElementById('modalTitle')?.setAttribute('textContent', data.title);
    const modalDescription = document.getElementById('modalDescription');
    if (modalDescription) {
        modalDescription.innerHTML = `<p>${data.description}</p>`;
    }
    
    // ⭐ FIXED: Now uses gallery setup for multiple images
    if (data.images && data.images.length > 0) {
        setupModalGallery(data.images);
    } else {
        // Fallback for single image
        const modalImage = document.getElementById('modalMainImage') || document.getElementById('modalImage');
        if (modalImage) {
            modalImage.src = data.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U4ZjVlOSIvPjwvZz48L3N2Zz4=';
        }
    }
    
    const featuresList = document.getElementById('modalFeatures');
    if (featuresList) {
        featuresList.innerHTML = data.features.map(feature => `<li>${feature}</li>`).join('');
    }
    
    const specsDiv = document.getElementById('modalSpecs');
    if (specsDiv) {
        specsDiv.innerHTML = Object.entries(data.specs)
            .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
            .join('');
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// ⭐ ADDED: Gallery setup function for modal
function setupModalGallery(images) {
    const mainImage = document.getElementById('modalMainImage') || document.getElementById('modalImage');
    const thumbsContainer = document.getElementById('galleryThumbs');
    
    if (!mainImage || !images || images.length === 0) return;
    
    let currentGalleryIndex = 0;
    
    mainImage.src = images[0];
    mainImage.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2U4ZjVlOSIvPjwvZz48L3N2Zz4=';
    };
    
    if (thumbsContainer) {
        thumbsContainer.innerHTML = '';
        images.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'gallery-thumb' + (index === 0 ? ' active' : '');
            thumb.innerHTML = `<img src="${img}" alt="Image ${index + 1}">`;
            thumb.addEventListener('click', () => showGalleryImage(index));
            thumbsContainer.appendChild(thumb);
        });
    }
    
    function showGalleryImage(index) {
        currentGalleryIndex = index;
        mainImage.src = images[index];
        
        const thumbs = thumbsContainer?.querySelectorAll('.gallery-thumb');
        if (thumbs) {
            thumbs.forEach(t => t.classList.remove('active'));
            if (thumbs[index]) thumbs[index].classList.add('active');
        }
    }
    
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    if (prevBtn) {
        prevBtn.onclick = () => {
            currentGalleryIndex = (currentGalleryIndex - 1 + images.length) % images.length;
            showGalleryImage(currentGalleryIndex);
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = () => {
            currentGalleryIndex = (currentGalleryIndex + 1) % images.length;
            showGalleryImage(currentGalleryIndex);
        };
    }
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ========================================
// GOOGLE MAPS FUNCTIONS
// ========================================

// ⭐ FIXED: Updated to use AdvancedMarkerElement to fix deprecation warning
window.initMapCallback = async function() {
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

    const lat = siteConfig?.location?.coordinates?.lat || 37.143574621291094;
    const lng = siteConfig?.location?.coordinates?.lng || 127.05966031328906;
    const greentechLocation = { lat, lng };
    
    try {
        const mapDiv = document.getElementById('map');
        if (!mapDiv) return;
        
        // ⭐ FIXED: Added mapId for AdvancedMarkerElement
        const map = new google.maps.Map(mapDiv, {
            zoom: googleConfig.mapOptions?.zoom || 16,
            center: greentechLocation,
            mapId: 'GREENTECH_MAP', // Required for AdvancedMarkerElement
            styles: googleConfig.mapOptions?.styles || []
        });
        
        // ⭐ FIXED: Check if AdvancedMarkerElement is available
        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
            // Use new AdvancedMarkerElement
            const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
            
            const pinElement = new PinElement({
                background: '#4CAF50',
                borderColor: '#2e7d32',
                glyphColor: 'white'
            });
            
            const marker = new AdvancedMarkerElement({
                map: map,
                position: greentechLocation,
                title: siteConfig?.company?.name || '(주)그린테크',
                content: pinElement.element
            });
            
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px;">
                        <h4>${siteConfig?.company?.name || '(주)그린테크'}</h4>
                        <p>${siteConfig?.location?.address || '경기도 오산시 수목원로88번길 35<br>현대테라타워 B동 1005호'}</p>
                    </div>
                `
            });
            
            marker.element.addEventListener('click', () => {
                infoWindow.open(map, marker);
            });
        } else {
            // Fallback to classic Marker (with deprecation warning)
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
        }
        
        console.log('Google Maps initialized successfully');
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
    }
};

// ⭐ FIXED: Updated to load Maps API with loading=async
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
        // ⭐ FIXED: Added loading=async and libraries=marker
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=marker&callback=initMapCallback`;
        script.async = true;
        script.defer = true;
        script.onerror = reject;
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
        if (typeof emailjs !== 'undefined') {
            emailjs.init(emailConfig.publicKey);
            console.log('EmailJS initialized successfully');
            return true;
        } else {
            console.warn('EmailJS library not loaded');
            return false;
        }
    } catch (error) {
        console.error('Error initializing EmailJS:', error);
        return false;
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const emailConfig = configManager.getEmailJSConfig();
    const siteConfig = configManager.getSiteConfig();
    
    if (!emailConfig || !emailConfig.serviceId || !emailConfig.templateId || typeof emailjs === 'undefined') {
        console.warn('EmailJS not configured, using mailto fallback');
        sendEmailViaMailto();
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';
    }
    
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
        
        showAlert('문의가 성공적으로 전송되었습니다.', 'success');
        document.getElementById('contactForm').reset();
    } catch (error) {
        console.error('EmailJS error:', error);
        showAlert('전송 중 오류가 발생했습니다. 직접 이메일로 문의해주세요.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '문의하기';
        }
    }
}

function sendEmailViaMailto() {
    const name = document.getElementById('name').value;
    const company = document.getElementById('company').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    const subject = `[웹사이트 문의] ${name}님의 문의`;
    const body = `성함: ${name}\n회사명: ${company}\n이메일: ${email}\n연락처: ${phone}\n\n문의내용:\n${message}`;
    
    const siteConfig = configManager.getSiteConfig();
    const toEmail = siteConfig?.contact?.email || 'jalhanda88@gmail.com';
    
    window.location.href = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ========================================
// INITIALIZATION
// ========================================

async function initApp() {
    // More robust loader handling
    const loader = document.getElementById('loadingSpinner');
    const hasLoader = loader !== null;
    
    if (hasLoader) {
        loader.classList.add('active');
        loader.style.display = 'block'; // Force display
    }
    
    try {
        // Load configurations with individual error handling
        try {
            await configManager.loadAllConfigs();
            console.log('✓ Configurations loaded');
        } catch (configError) {
            console.warn('Configuration loading failed, using defaults:', configError);
            // Continue with defaults - don't fail the entire app
        }
        
        // Initialize EmailJS (non-critical)
        try {
            await initEmailJS();
            console.log('✓ EmailJS initialized');
        } catch (emailError) {
            console.warn('EmailJS initialization failed:', emailError);
            // Continue without email functionality
        }
        
        // Load Google Maps (non-critical)
        try {
            await loadGoogleMapsScript();
            console.log('✓ Google Maps loaded');
        } catch (mapsError) {
            console.warn('Google Maps loading failed:', mapsError);
            // Continue without maps
        }
        
        console.log('Application initialized successfully');
        
    } catch (error) {
        console.error('Critical error during initialization:', error);
    } finally {
        // Ensure loader is hidden no matter what
        if (hasLoader) {
            // Use multiple methods to ensure it's hidden
            loader.classList.remove('active');
            loader.style.display = 'none';
            
            // Fallback: remove loader after a short delay if still visible
            setTimeout(() => {
                if (loader && (loader.classList.contains('active') || loader.style.display !== 'none')) {
                    console.warn('Force removing stuck loader');
                    loader.style.display = 'none';
                    loader.classList.remove('active');
                }
            }, 100);
        }
    }
    
    // Additional safety: remove loader if it exists anywhere after init
    setTimeout(() => {
        const anyLoader = document.querySelector('.loading-spinner.active, #loadingSpinner');
        if (anyLoader && anyLoader.style.display !== 'none') {
            console.warn('Removing persistent loader element');
            anyLoader.style.display = 'none';
            anyLoader.classList.remove('active');
        }
    }, 1000);
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initApp();
    
    // Initialize image sliders
    initImageSliders();

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
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
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
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
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
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
            if (portfolioId) {
                openPortfolioModal(portfolioId);
            }
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

// ❌ REMOVED: Duplicate functions and unused code
// - Removed initAdvancedMap() - duplicate of initMapCallback
// - Removed EmailJSHandler class - overly complex for current needs
// - Removed duplicate handleFormSubmit at the end
// - Removed showModal function that was referenced but never defined