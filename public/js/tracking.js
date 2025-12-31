(function () {
    // Configuração do Firebase (garante que só inicializa uma vez)
    const firebaseConfig = {
        projectId: "offlineclub-admin-2025",
        appId: "1:548650740560:web:cb4aea73bbd005b1785a55",
        storageBucket: "offlineclub-admin-2025.firebasestorage.app",
        apiKey: "AIzaSyB35dGg37sgbgB-EOV1qMAHGvqhaTm54lE",
        authDomain: "offlineclub-admin-2025.firebaseapp.com",
        messagingSenderId: "548650740560"
    };

    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded. Tracking skipped.');
        return;
    }

    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // 1. Captura Slug da URL e persiste no localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('s') || urlParams.get('ref');

    if (slug) {
        localStorage.setItem('offline_partner_slug', slug);
    }

    const currentSlug = localStorage.getItem('offline_partner_slug');

    // 2. Rastreamento de Visita Única Diária
    function logDailyVisit() {
        const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const lastVisitDate = localStorage.getItem('offline_last_visit_date');

        if (lastVisitDate !== today) {
            db.collection('visits').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                source: currentSlug || 'Direto',
                path: window.location.pathname,
                userAgent: navigator.userAgent
            }).then(() => {
                localStorage.setItem('offline_last_visit_date', today);
                console.log('OfflineClub: Daily visit logged via ' + (currentSlug || 'Direto'));
            }).catch(err => console.error('Tracking Error:', err));
        } else {
            console.log('OfflineClub: Visit already logged today.');
        }
    }

    logDailyVisit();

    // 3. Rastreamento de Cliques
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');
        if (target) {
            db.collection('clicks').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                source: currentSlug || 'Direto',
                element: target.innerText || target.tagName,
                href: target.href || null,
                path: window.location.pathname
            });
        }
    });

    // 4. Rastreamento de Envio de Formulário (Leads)
    const form = document.querySelector('.elementor-form[name="Pop-Up OFFLINE"]');
    if (form) {
        form.addEventListener('submit', (e) => {
            // Pequeno delay para garantir que os valores foram preenchidos (caso haja validação)
            setTimeout(() => {
                const nome = form.querySelector('input[name*="nome"]')?.value || form.querySelector('#form-field-nome')?.value || '';
                const email = form.querySelector('input[name*="email"]')?.value || form.querySelector('#form-field-email')?.value || '';
                const whatsapp = form.querySelector('input[name*="whatsapp"]')?.value || form.querySelector('#form-field-whatsapp')?.value || '';

                if (nome && email) {
                    db.collection('leads').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        socio: currentSlug || 'Direto',
                        nome: nome,
                        email: email,
                        whatsapp: whatsapp,
                        source: 'formulario',
                        path: window.location.pathname
                    }).then(() => {
                        console.log('OfflineClub: Lead captured via ' + (currentSlug || 'Direto'));
                    }).catch(err => console.error('Lead Tracking Error:', err));
                }
            }, 500);
        });
    }
})();
