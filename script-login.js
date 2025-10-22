document.addEventListener('DOMContentLoaded', function() {

    // === BAGIAN 1: LOGIKA LOGIN ===
    const correctPassword = 'Fenfen2004';
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const loginBox = document.querySelector('.login-box');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const userInput = passwordInput.value;
        if (userInput === correctPassword) {
            // JIKA BENAR:
            // 1. Simpan "tiket" ke sessionStorage
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // 2. Beri efek fade out sebelum pindah halaman
            document.body.classList.add('fade-out');
            
            // 3. Pindahkan pengguna ke halaman Chapter 1 setelah animasi
            setTimeout(() => {
                window.location.href = 'chapter1.html';
            }, 500); // Sesuaikan dengan durasi fade-out di CSS

        } else {
            // Logika error (tidak berubah)
            errorMessage.classList.remove('hidden');
            loginBox.classList.add('shake');
            passwordInput.value = '';
            setTimeout(() => { loginBox.classList.remove('shake'); }, 500);
        }
    });

    passwordInput.addEventListener('focus', function() {
        errorMessage.classList.add('hidden');
    });

    // === BAGIAN 2: LOGIKA BACKGROUND HATI MELAYANG (Sama seperti sebelumnya) ===
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    // ... (Salin dan tempel SELURUH kode animasi hati dari file script.js Anda sebelumnya di sini) ...
    // Pastikan kode dari "let particles = [];" sampai "animate();" ada di sini.
    let particles = [];
    let animationId;
    const colorPalette = ['rgba(255, 182, 193, 0.7)', 'rgba(255, 215, 0, 0.7)', 'rgba(221, 160, 221, 0.7)', 'rgba(255, 105, 180, 0.7)'];
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    class Particle {
        constructor() { this.x = Math.random() * canvas.width; this.y = canvas.height + Math.random() * 100; this.size = Math.random() * 15 + 5; this.speed = Math.random() * 1 + 0.5; this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)]; this.sway = Math.random() * 0.5 - 0.25; }
        update() { this.y -= this.speed; this.x += this.sway; if (this.y < -this.size * 2) { this.y = canvas.height + this.size * 2; this.x = Math.random() * canvas.width; } }
        draw() { const x = this.x; const y = this.y; const size = this.size; ctx.beginPath(); ctx.moveTo(x, y + size); ctx.bezierCurveTo(x, y + size * 0.7, x - size, y, x - size, y); ctx.bezierCurveTo(x - size, y - size * 0.7, x, y - size * 0.7, x, y); ctx.bezierCurveTo(x, y - size * 0.7, x + size, y - size * 0.7, x + size, y); ctx.bezierCurveTo(x + size, y, x, y + size * 0.7, x, y + size); ctx.closePath(); ctx.filter = 'blur(5px)'; ctx.fillStyle = this.color; ctx.fill(); ctx.filter = 'none'; }
    }
    function init() { particles = []; let numberOfParticles = 50; for (let i = 0; i < numberOfParticles; i++) { particles.push(new Particle()); } }
    function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); for (let i = 0; i < particles.length; i++) { particles[i].update(); particles[i].draw(); } animationId = requestAnimationFrame(animate); }
    init();
    animate();
});