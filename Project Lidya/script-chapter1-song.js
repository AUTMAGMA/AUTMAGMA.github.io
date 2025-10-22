document.addEventListener('DOMContentLoaded', function() {

    const song = document.getElementById('birthday-song');
    const startOverlay = document.getElementById('start-overlay');
    const musicVideoContainer = document.getElementById('music-video-container');
    const lyricDisplay = document.getElementById('lyric-display');
    const spotifyPlayer = document.getElementById('spotify-player');
    const progressBar = document.getElementById('progress-bar');

    const lyricsData = [
        { time: 11.0, text: "I've been so afraid of love, baby doll" },
        { time: 14.5, text: "but you make it easy." },
        { time: 17.5, text: "Like I was living in the dark for so long," },
        { time: 21.0, text: "then you shined your light." },
        { time: 24.5, text: "I never thought I'd find the one, so alone," },
        { time: 27.5, text: "but you finally see me." },
        { time: 31.0, text: "Oh I couldn't do you wrong, no, oh," },
        { time: 33.5, text: "even if I tried." },
        { time: 36.5, text: "And every day I fall in love with you" },
        { time: 39.5, text: "just a little bit harder." },
        { time: 42.5, text: "Ain't it obvious to you..." },
        { time: 48.0, text: "That I don't care where we're going" },
        { time: 54.0, text: "'Cause it don't matter what's down the road." },
        { time: 57.0, text: "'Cause you're right here and I won't let go." },
        { time: 60.5, text: "I don't care where we're going" },
        { time: 66.0, text: "When I'm with you the world's so far away." },
        { time: 69.5, text: "It's all I got, you next to me." },
        { time: 73.5, text: "I've been trying to find the words" },
        { time: 76.0, text: "but I always seem to write the wrong ones." },
        { time: 79.5, text: "Like it all adds up" },
        { time: 82.0, text: "but it doesn't show the way I feel." },
        { time: 86.0, text: "Like I never really lived 'til I loved you," },
        { time: 88.5, text: "now I could die young." },
        { time: 92.0, text: "Got my heart in overdrive and" },
        { time: 94.5, text: "baby you're behind the wheel." },
        { time: 98.0, text: "And every day I fall in love with you" },
        { time: 101.5, text: "just a little bit harder." },
        { time: 104.5, text: "Ain't it obvious to you..." },
        { time: 110.0, text: "That I don't care where we're going" },
        { time: 116.0, text: "'Cause it don't matter what's down the road." },
        { time: 119.0, text: "'Cause you're right here and I won't let go." },
        { time: 122.5, text: "I don't care where we're going" },
        { time: 128.0, text: "When I'm with you the world's so far away." },
        { time: 131.5, text: "It's all I got, you next to me." },
        { time: 156.5, text: "I don't care where we're going..." },
    ];
    
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    async function startMusicExperience() {
        startOverlay.style.opacity = '0';
        // Hapus background awal (foto & hati)
        const initialBackground = document.getElementById('initial-background');
        if(initialBackground) initialBackground.style.opacity = '0';
        
        await delay(500);

        musicVideoContainer.classList.add('visible');
        await delay(1000);
        
        if(startOverlay) startOverlay.style.display = 'none';
        if(initialBackground) initialBackground.style.display = 'none';

        spotifyPlayer.classList.add('visible');
        song.play();
        syncLyrics();
    }

    startOverlay.addEventListener('click', startMusicExperience, { once: true });

    function syncLyrics() {
        let currentLine = '';
        song.addEventListener('timeupdate', () => {
            const progressPercent = (song.currentTime / song.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;

            let newLine = '';
            for (let i = 0; i < lyricsData.length; i++) {
                if (song.currentTime >= lyricsData[i].time) { newLine = lyricsData[i].text; }
            }
            if (newLine !== currentLine) {
                lyricDisplay.style.opacity = 0;
                setTimeout(() => {
                    currentLine = newLine;
                    lyricDisplay.innerText = currentLine;
                    lyricDisplay.style.opacity = 1;
                }, 300); 
            }
        });
    }

    // === PINDAH KE CHAPTER BERIKUTNYA SAAT LAGU SELESAI ===
    song.addEventListener('ended', async () => {
        console.log("Lagu selesai, pindah ke chapter berikutnya..."); // Pesan untuk debugging
        
        // Tambahkan efek fade-out
        document.body.classList.add('fade-out');
        
        // Tunggu animasi fade-out selesai
        await delay(1000); // Pastikan fungsi delay() sudah didefinisikan di atas
        
        // Arahkan ke halaman Peta Kenangan
        window.location.href = 'chapter2-map.html'; 
    });

}); // <-- Ini adalah kurung kurawal penutup terakhir dari DOMContentLoaded