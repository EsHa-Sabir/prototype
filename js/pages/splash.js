// js/pages/splash.js
// Chapter 1: Silence - Year 2126 Station Opening

function renderSplash() {
    const container = document.createElement('div');
    container.className = 'splash-container';

    container.innerHTML = `
        <div class="terminal-card">
            <p class="terminal-header-line" style="color: var(--text-muted);">YEAR: 2126</p>
            <div class="terminal-divider"></div>
            
            <div class="typewriter-text">
                <p>Humanity went to the Moon.</p>
                <p>It went to Mars.</p>
                <p>It sent signals into the distance.</p>
                <p style="color: var(--electric-cyan); margin-top: 10px;">
                    And then, some of the traces it left behind were forgotten.
                </p>
            </div>

            <div class="terminal-divider"></div>
            
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 25px;">
                Years passed. One day, inside an abandoned station, a terminal that had not been opened for years was discovered...
            </p>

            <button id="open-terminal-btn" class="glow-btn pulse-button" style="width: 100%;">
                [ OPEN TERMINAL ]
            </button>
        </div>
    `;

    setTimeout(() => {
        const btn = container.querySelector('#open-terminal-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                // Play opening ambient hum
                const ambientAudio = new Audio('assets/audio/ambient_hum.mp3');
                ambientAudio.volume = 0.4;
                ambientAudio.loop = true;
                ambientAudio.play().catch(e => console.log('Audio autoplay prevented:', e));

                router.navigateTo('terminal');
            });
        }
    }, 100);

    return container;
}