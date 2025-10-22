document.addEventListener('DOMContentLoaded', function() {

    // Helper function untuk membuat delay/jeda
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    // Fungsi untuk menjalankan prolog
    async function playCinematicIntro() {
        const introTexts = document.querySelectorAll('.intro-text');
        
        for (const textElement of introTexts) {
            textElement.classList.add('visible');
            await delay(6000); 
            textElement.classList.remove('visible');
            await delay(3000);
        }

        // Setelah prolog selesai, arahkan ke halaman lagu
        // Ini adalah tempat yang BENAR untuk perintah pindah halaman
        document.body.classList.add('fade-out'); // Tambahkan efek fade-out
        await delay(1000); // Tunggu animasi selesai
        window.location.href = 'chapter1-song.html'; 
    }

    // Jalankan prolog setelah halaman dimuat
    playCinematicIntro();

    // -- BARIS YANG MENYEBABKAN MASALAH SUDAH DIHAPUS DARI SINI --

    // Jalankan juga animasi hati untuk halaman ini
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
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