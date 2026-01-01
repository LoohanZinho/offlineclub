/**
 * Offline Club - Button Click Tracking
 * Rastreia cliques em botões brancos (CTAs principais)
 * Integrado com: Google Analytics 4, Facebook Pixel e Firebase Firestore
 */
(function () {
    'use strict';

    // Firebase Configuration
    const firebaseConfig = {
        projectId: "offlineclub-admin-2025",
        appId: "1:548650740560:web:cb4aea73bbd005b1785a55",
        storageBucket: "offlineclub-admin-2025.firebasestorage.app",
        apiKey: "AIzaSyB35dGg37sgbgB-EOV1qMAHGvqhaTm54lE",
        authDomain: "offlineclub-admin-2025.firebaseapp.com",
        messagingSenderId: "548650740560"
    };

    // Initialize Firebase (only if not already initialized)
    let db = null;
    try {
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.firestore();
            console.log('[Offline Club Tracking] Firebase initialized');
        } else {
            console.warn('[Offline Club Tracking] Firebase SDK not loaded - Firestore tracking disabled');
        }
    } catch (err) {
        console.error('[Offline Club Tracking] Firebase init error:', err);
    }

    // Configuração de eventos
    const EVENT_CONFIG = {
        'conhecer': {
            category: 'CTA',
            action: 'Click - Conhecer Membro',
            ga_event: 'conhecer_membro_click',
            fb_event: 'ViewContent'
        },
        'comecar-agora': {
            category: 'CTA',
            action: 'Click - Começar Agora',
            ga_event: 'comecar_agora_click',
            fb_event: 'InitiateCheckout'
        },
        'entrar': {
            category: 'Navigation',
            action: 'Click - Entrar',
            ga_event: 'entrar_click',
            fb_event: 'ViewContent'
        },
        'fazer-parte': {
            category: 'Conversion',
            action: 'Click - Fazer Parte',
            ga_event: 'fazer_parte_click',
            fb_event: 'AddToCart'
        },
        'faq': {
            category: 'Support',
            action: 'Click - Perguntas Frequentes',
            ga_event: 'faq_click',
            fb_event: 'ViewContent'
        },
        'suporte': {
            category: 'Support',
            action: 'Click - Falar com Suporte',
            ga_event: 'suporte_click',
            fb_event: 'Contact'
        },
        'form-contato': {
            category: 'Lead',
            action: 'Submit - Formulário Contato',
            ga_event: 'form_contato_submit',
            fb_event: 'Lead'
        }
    };

    // Get URL parameter for socio/partner tracking
    function getUrlParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    // Função para enviar evento
    function trackButtonClick(buttonType, metadata = {}) {
        const config = EVENT_CONFIG[buttonType];

        if (!config) {
            console.warn('[Offline Club Tracking] Button type not configured:', buttonType);
            return;
        }

        const eventLabel = metadata.memberName || config.action || buttonType;

        // 1. Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', config.ga_event, {
                event_category: config.category,
                event_label: eventLabel,
                value: metadata.value || 1
            });
        }

        // 2. Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', config.fb_event, {
                content_name: metadata.memberName || config.action,
                content_category: config.category,
                button_type: buttonType
            });
        }

        // 3. Firebase Firestore (para o painel /admin)
        if (db) {
            const socio = getUrlParam('socio') || getUrlParam('s') || null;

            db.collection('clicks').add({
                element: eventLabel, // "Igor Kadooka" ou "Click - Começar Agora"
                buttonType: buttonType,
                memberName: metadata.memberName || null,
                category: config.category,
                action: config.action,
                url: metadata.url || window.location.href,
                path: window.location.pathname,
                socio: socio,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userAgent: navigator.userAgent,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
                source: socio || 'Direto'
            })
                .then(() => {
                    console.log('[Offline Club Tracking] Saved to Firestore:', eventLabel);
                })
                .catch((error) => {
                    console.error('[Offline Club Tracking] Firestore error:', error);
                });
        }

        // 4. Lead Capture for Contact Form
        if (buttonType === 'form-contato' && db) {
            const nome = document.querySelector('input[name="nome"]')?.value || 'N/A';
            const email = document.querySelector('input[name="email"]')?.value || 'N/A';
            const whatsapp = document.querySelector('input[name="whatsapp"]')?.value || 'N/A';

            if (nome !== 'N/A' || email !== 'N/A') {
                db.collection('leads').add({
                    nome,
                    email,
                    whatsapp,
                    socio: getUrlParam('socio') || getUrlParam('s') || null,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    path: window.location.pathname,
                    source: getUrlParam('socio') || 'Direto'
                }).then(() => console.log('[Offline Club Tracking] Lead saved to Firestore'));
            }
        }

        // Console log para debug
        console.log('[Offline Club Tracking]', {
            type: buttonType,
            event: config.ga_event,
            metadata: metadata,
            firestore: db ? 'saved' : 'disabled'
        });
    }

    // Inicializar tracking
    function initButtonTracking() {
        // Selecionar todos os botões rastreáveis
        const trackableButtons = document.querySelectorAll('[data-track-button]');

        trackableButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const buttonType = this.getAttribute('data-track-button');
                const memberName = this.getAttribute('data-member-name');
                const label = this.getAttribute('data-track-label');

                trackButtonClick(buttonType, {
                    memberName: memberName,
                    label: label,
                    url: this.href
                });
            });
        });

        console.log('[Offline Club Tracking] Initialized:', trackableButtons.length, 'buttons');
    }

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initButtonTracking);
    } else {
        initButtonTracking();
    }
})();
