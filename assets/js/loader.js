
// --- Page Loader Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('page-loader');

    if (loader) {
        // Minimum load time of 1.5 seconds for effect
        const minLoadTime = 1500;
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadTime - elapsedTime);

            setTimeout(() => {
                loader.classList.add('loaded');
                // Stop loader audio if playing (optional, but good UX to let them continue listening if they want, 
                // but usually loader music stops or fades. The request said "listen while loading", so we keep it playing 
                // or let user control it. We'll leave it as is for now.)
            }, remainingTime);
        });

        // Loader Hymn Player
        const loaderAudio = document.getElementById('loader-audio');
        const loaderPlayBtn = document.getElementById('loader-play-btn');
        const loaderProgress = document.getElementById('loader-progress');
        const loaderPlayerContainer = document.querySelector('.loader-player-container');

        if (loaderAudio && loaderPlayBtn && loaderProgress) {
            loaderPlayBtn.addEventListener('click', () => {
                if (loaderAudio.paused) {
                    loaderAudio.play();
                    loaderPlayerContainer.classList.add('playing');
                } else {
                    loaderAudio.pause();
                    loaderPlayerContainer.classList.remove('playing');
                }
            });

            loaderAudio.addEventListener('timeupdate', () => {
                const percent = (loaderAudio.currentTime / loaderAudio.duration) * 100;
                loaderProgress.style.width = percent + '%';
            });

            loaderAudio.addEventListener('ended', () => {
                loaderPlayerContainer.classList.remove('playing');
                loaderProgress.style.width = '0%';
            });
        }
    }
});
