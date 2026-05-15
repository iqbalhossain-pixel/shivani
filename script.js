/* ============================================================
   SHIVANI RAJPUT - PROFESSIONAL CV & PORTFOLIO
   script.js
   ============================================================ */

'use strict';

/* ---- Tab Switching ---- */
function switchTab(tab) {
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
    const panel = document.getElementById(tab + '-view');
    const btn   = document.getElementById('tab-' + tab);
    if (panel) panel.classList.add('active');
    if (btn)   { btn.classList.add('active'); btn.setAttribute('aria-selected', 'true'); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Emirates ID Modal ---- */
function openEIDModal() {
    const modal = document.getElementById('eid-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Reset to state 1
    const s1 = document.getElementById('eid-s1');
    const s2 = document.getElementById('eid-s2');
    if (s1) s1.style.display = '';
    if (s2) s2.style.display = 'none';
}

function closeEIDModal() {
    const modal = document.getElementById('eid-modal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function closeEIDOnOutside(e) {
    if (e.target === document.getElementById('eid-modal')) closeEIDModal();
}

function revealEID() {
    const s1 = document.getElementById('eid-s1');
    const s2 = document.getElementById('eid-s2');
    if (s1) s1.style.display = 'none';
    if (s2) s2.style.display = '';
}

// Close on Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeEIDModal();
});

/* ---- QR Code Generator ---- */
function generateQR(canvasId, url) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;

    // Use a simple QR library approach via the qrcode library
    // If QRCode lib is loaded, use it
    if (typeof QRCode !== 'undefined') {
        canvas.style.display = 'none';
        const wrapper = canvas.parentElement;
        const div = document.createElement('div');
        div.id = canvasId + '_qr';
        wrapper.insertBefore(div, canvas);
        new QRCode(div, {
            text: url,
            width: size,
            height: size,
            colorDark: '#1A5276',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
        return;
    }

    // Fallback: draw a placeholder with URL text
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#1A5276';
    ctx.fillRect(4, 4, 24, 24);
    ctx.fillRect(size - 28, 4, 24, 24);
    ctx.fillRect(4, size - 28, 24, 24);
    ctx.fillStyle = '#fff';
    ctx.fillRect(8, 8, 16, 16);
    ctx.fillRect(size - 24, 8, 16, 16);
    ctx.fillRect(8, size - 24, 16, 16);
    ctx.fillStyle = '#1A5276';
    ctx.fillRect(12, 12, 8, 8);
    ctx.fillRect(size - 20, 12, 8, 8);
    ctx.fillRect(12, size - 20, 8, 8);
    // small cells
    const cells = [
        [4,32],[12,32],[20,32],[32,4],[32,12],[32,20],
        [36,36],[44,36],[52,36],[36,44],[52,44],[36,52],[44,52],[52,52],
        [64,4],[68,4],[72,4],[64,12],[68,12],[72,12],
        [4,64],[8,64],[4,68],[4,72],[8,72],[12,72],[16,72]
    ];
    cells.forEach(([x, y]) => { ctx.fillRect(x, y, 4, 4); });
    ctx.fillStyle = '#555';
    ctx.font = '5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('srportfolio.kestford.com', size / 2, size - 4);
}

/* ---- Load QR library dynamically then generate ---- */
function loadQRAndGenerate() {
    if (typeof QRCode !== 'undefined') {
        doGenerateQR();
        return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    s.onload = doGenerateQR;
    s.onerror = function() { generateQR('qr-canvas', 'https://srportfolio.kestford.com'); };
    document.head.appendChild(s);
}

function doGenerateQR() {
    const url = 'https://srportfolio.kestford.com';
    if (typeof QRCode !== 'undefined') {
        // Clear any existing
        ['qr-resume'].forEach(function(id) {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = '';
            new QRCode(el, {
                text: url,
                width: 90,
                height: 90,
                colorDark: '#1A5276',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        });
    }
}

/* ---- PDF Download ---- */
function downloadResume() {
    // First switch to resume tab
    switchTab('resume');

    setTimeout(function() {
        // Load html2pdf if not loaded
        if (typeof html2pdf !== 'undefined') {
            triggerPDF();
            return;
        }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        s.onload  = triggerPDF;
        s.onerror = function() { window.print(); };
        document.head.appendChild(s);
    }, 600);
}

function triggerPDF() {
    const element = document.getElementById('resume-page-content');
    if (!element) { window.print(); return; }

    // Make sure images are loaded
    const imgs = element.querySelectorAll('img');
    const promises = Array.from(imgs).map(function(img) {
        if (img.complete) return Promise.resolve();
        return new Promise(function(res) { img.onload = res; img.onerror = res; });
    });

    Promise.all(promises).then(function() {
        const opt = {
            margin:      [10, 10, 10, 10],
            filename:    'Shivani_Rajput_Resume.pdf',
            image:       { type: 'jpeg', quality: 0.97 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                letterRendering: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(opt).from(element).save();
    });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', function() {
    loadQRAndGenerate();
});
