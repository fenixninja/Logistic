/**
 * WhatsAuth Logistic - Terminal de Escaneo y Reparto
 * Sincronización entre el iPhone (Sección SCAN) y las 6 Cajas de Cartón (Sección SELECCIONAR PAQUETE)
 */

// Tiny bit of JS to ensure that the notch doesn't move about when you resize the screen (Solicitado por el usuario)
const delay = 300;
let afterResize;
let currentStyle;

window.onresize = function () {
  document.body.classList.add("is-resizing");
  clearTimeout(afterResize);
  afterResize = setTimeout(
    () => document.body.classList.remove("is-resizing"),
    delay
  );
};

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundVideoLoop();
  initPackageSelection();
  initDeliveryCertification();
});

/* ========================================================
   1. REPRODUCCIÓN EN BUCLE DE LOS VÍDEOS DE FONDO
   ======================================================== */
function initBackgroundVideoLoop() {
  const videoPlayer = document.getElementById('bg-video-player');
  if (!videoPlayer) return;

  const PLAYLIST = [
    "video/Delivery_man_walking_city_street_20260915195750.mp4",
    "video/Blue_delivery_van_driving_street_20260915200136.mp4",
    "video/Scooter_driving_down_city_street_20260915210220.mp4"
  ];

  let currentVideoIndex = 0;

  videoPlayer.muted = true;
  videoPlayer.playsInline = true;

  // Cuando termina un vídeo, pasa al siguiente de forma continua
  videoPlayer.addEventListener('ended', () => {
    currentVideoIndex = (currentVideoIndex + 1) % PLAYLIST.length;
    videoPlayer.src = PLAYLIST[currentVideoIndex];
    videoPlayer.play().catch(e => console.log("Autoplay loop wait:", e));
  });

  // Asegurar que inicia la reproducción
  videoPlayer.play().catch(() => {});
}

/* ========================================================
   2. INTERACTIVIDAD DE LAS 6 CAJAS DE CARTÓN (SELECCIÓN)
   ======================================================== */
function initPackageSelection() {
  const boxes = document.querySelectorAll('.cardboard-box');
  const hudPkgId = document.getElementById('hud-pkg-id');
  const hudPkgName = document.getElementById('hud-pkg-name');
  const hudPkgAddress = document.getElementById('hud-pkg-address');
  const hudPkgWeight = document.getElementById('hud-pkg-weight');
  const notchStatusText = document.getElementById('notch-status-text');
  const notchPkgLabel = document.getElementById('notch-pkg-label');
  const laserBeam = document.getElementById('laser-beam');
  const hudHashDisplay = document.getElementById('hud-hash-display');
  const btnCertify = document.getElementById('btn-certify-delivery');
  const btnCertifyLabel = document.getElementById('btn-certify-label');

  boxes.forEach(box => {
    box.addEventListener('click', () => {
      // Quitar estado activo previo
      boxes.forEach(b => {
        b.classList.remove('active');
        const statusEl = b.querySelector('.box-indicator-status');
        const hintEl = b.querySelector('.box-action-hint');
        if (statusEl && !b.classList.contains('delivered')) {
          statusEl.className = 'box-indicator-status pending';
          statusEl.textContent = '○ En espera';
        }
        if (hintEl && !b.classList.contains('delivered')) {
          hintEl.textContent = 'Clic para escanear';
        }
      });

      // Activar caja actual
      box.classList.add('active');
      const statusEl = box.querySelector('.box-indicator-status');
      const hintEl = box.querySelector('.box-action-hint');
      if (statusEl && !box.classList.contains('delivered')) {
        statusEl.className = 'box-indicator-status';
        statusEl.textContent = '● Enfocado en Escáner';
      }
      if (hintEl && !box.classList.contains('delivered')) {
        hintEl.textContent = 'Seleccionado';
      }

      // Extraer datos del dataset
      const pkgId = box.dataset.pkgId;
      const pkgName = box.dataset.name;
      const pkgAddress = box.dataset.address;
      const pkgWeight = box.dataset.weight;

      // Animar láser de escaneo en la pantalla del iPhone
      if (laserBeam) {
        laserBeam.style.animation = 'none';
        void laserBeam.offsetWidth; // forzar reflow
        laserBeam.style.animation = 'scan-move 1.5s ease-in-out infinite alternate';
      }

      // Actualizar datos en la pantalla del iPhone
      if (hudPkgId) hudPkgId.textContent = pkgId;
      if (hudPkgName) hudPkgName.textContent = pkgName;
      if (hudPkgAddress) hudPkgAddress.textContent = pkgAddress;
      if (hudPkgWeight) hudPkgWeight.textContent = pkgWeight;

      // Actualizar Dynamic Island / Notch
      if (notchStatusText) notchStatusText.textContent = "ESCANEANDO...";
      if (notchPkgLabel) notchPkgLabel.textContent = `${pkgId} enfocado`;

      setTimeout(() => {
        if (notchStatusText) notchStatusText.textContent = "CÓDIGO VERIFICADO";
      }, 700);

      // Resetear botón de certificar si este paquete no ha sido entregado
      if (btnCertify && !box.classList.contains('delivered')) {
        btnCertify.disabled = false;
        btnCertify.style.background = 'var(--brand-delivery-orange)';
        if (btnCertifyLabel) btnCertifyLabel.textContent = "CERTIFICAR RECEPCIÓN";
      }

      // Generar hash dinámico preview
      if (hudHashDisplay) {
        const randomHex = Math.random().toString(16).substring(2, 10);
        hudHashDisplay.textContent = `SHA-256: ${randomHex}9d3f...`;
      }
    });

    // Soporte para selección con teclado (Enter / Espacio)
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        box.click();
      }
    });
  });
}

/* ========================================================
   3. ACCIÓN DE CERTIFICAR ENTREGA (SELLADO CRIPTOGRÁFICO)
   ======================================================== */
function initDeliveryCertification() {
  const btnCertify = document.getElementById('btn-certify-delivery');
  const btnCertifyLabel = document.getElementById('btn-certify-label');
  const hudHashDisplay = document.getElementById('hud-hash-display');
  const notchStatusText = document.getElementById('notch-status-text');
  const notchPkgLabel = document.getElementById('notch-pkg-label');

  if (!btnCertify) return;

  btnCertify.addEventListener('click', () => {
    const activeBox = document.querySelector('.cardboard-box.active');
    if (!activeBox || activeBox.classList.contains('delivered')) return;

    btnCertify.disabled = true;
    if (btnCertifyLabel) btnCertifyLabel.textContent = "FIRMANDO COMPROBANTE...";

    setTimeout(() => {
      // Comprobante sellado
      if (btnCertifyLabel) btnCertifyLabel.textContent = "✓ RECEPCIÓN SELLADA";
      btnCertify.style.background = "#10b981";

      const now = new Date();
      const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (hudHashDisplay) {
        hudHashDisplay.innerHTML = `<span style="color:#10b981;">✓ HASH SHA-256 REGISTRADO (${timeStr})</span>`;
      }

      if (notchStatusText) notchStatusText.textContent = "ENTREGA CERTIFICADA";
      if (notchPkgLabel) notchPkgLabel.textContent = "Comprobante inmutable emitido";

      // Marcar caja de cartón como entregada
      activeBox.classList.add('delivered');
      const statusEl = activeBox.querySelector('.box-indicator-status');
      const hintEl = activeBox.querySelector('.box-action-hint');
      if (statusEl) {
        statusEl.className = "box-indicator-status";
        statusEl.innerHTML = `<span style="color:#10b981; font-weight:800;">✓ ENTREGADO</span>`;
      }
      if (hintEl) {
        hintEl.textContent = timeStr;
      }
    }, 800);
  });
}
