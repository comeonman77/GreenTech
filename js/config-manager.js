// ========================================
// CONFIGURATION MANAGER MODULE
// ========================================

class ConfigManager {
    constructor() {
        this.configs = {
            google: null,
            emailjs: null,
            site: null
        };
        this.loadPromise = null;
    }

    // Get default configurations (fallback values)
    getDefaultConfig(configName) {
        const defaults = {
            google: {
                apiKey: null,
                mapOptions: {
                    zoom: 16,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                    ]
                }
            },
            emailjs: {
                publicKey: null,
                serviceId: null,
                templateId: null
            },
            site: {
                company: {
                    name: "(주)그린테크",
                    nameEn: "GREENTECH CO., LTD.",
                    ceo: "대표자명",
                    businessNumber: "000-00-00000"
                },
                contact: {
                    phone: "070-7010-7988",
                    mobile: "010-4228-5914",
                    fax: "031-665-2833",
                    email: "jalhanda88@gmail.com",
                    emailSecondary: "myglosem@gmail.com"
                },
                location: {
                    address: "경기도 오산시 수목원로88번길 35, 현대테라타워 B동 1005호",
                    coordinates: {
                        lat: 37.1498,
                        lng: 127.0772
                    }
                },
                businessHours: {
                    weekdays: "09:00 - 18:00",
                    saturday: "09:00 - 13:00",
                    sunday: "휴무"
                }
            }
        };
        return defaults[configName] || null;
    }

    // Load a single configuration file
    async loadConfig(configName, path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const config = await response.json();
            this.configs[configName] = config;
            console.log(`✓ ${configName} config loaded successfully`);
            return config;
            
        } catch (error) {
            console.warn(`⚠ ${configName} config not found or invalid. Using defaults.`);
            console.debug(`Error details: ${error.message}`);
            
            // Use default configuration as fallback
            const defaultConfig = this.getDefaultConfig(configName);
            this.configs[configName] = defaultConfig;
            return defaultConfig;
        }
    }

    // Load all configuration files
    async loadAllConfigs() {
        // Return cached promise if already loading
        if (this.loadPromise) {
            return this.loadPromise;
        }

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

    // Getters for specific configurations
    getGoogleMapsKey() {
        return this.configs.google?.apiKey || null;
    }

    getEmailJSConfig() {
        return this.configs.emailjs || null;
    }

    getSiteConfig() {
        return this.configs.site || null;
    }

    // Check if configurations are loaded
    isConfigLoaded(configName) {
        return this.configs[configName] !== null;
    }

    // Check if all configurations are loaded
    areAllConfigsLoaded() {
        return Object.values(this.configs).every(config => config !== null);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
}