// =============================================================================
// THE HUMAN ARCHIVE — CINEMATIC SPLASH
// This screen is visual-only; the story begins in Terminal with YEAR: 2126.
// =============================================================================

let splashTransitioning = false;
let lastSplashAudioRetryAt = 0;
let splashPointerAudioRetry = null;

function updateSplashSoundControl() {
    const button = document.getElementById("splashSoundControl");
    if (!button) return;

    const muted = Boolean(window.THA?.audioMuted);
    const playing = Boolean(window.THA?.openingAudioStatus?.playing);
    const state = muted ? "off" : (playing ? "on" : "blocked");
    const label = muted ? "Turn ambient sound on" : (playing ? "Turn ambient sound off" : "Tap to start ambient sound");
    button.dataset.state = state;
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.setAttribute("aria-pressed", String(!muted && playing));
    button.innerHTML = muted || !playing
        ? `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path class="sound-muted" d="m16 9 5 6m0-6-5 6"/></svg>`
        : `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path class="sound-wave" d="M16 9.2a4 4 0 0 1 0 5.6M18.5 6.8a7.4 7.4 0 0 1 0 10.4"/></svg>`;
}

function removeSplashPointerAudioRetry() {
    if (!splashPointerAudioRetry) return;
    document.removeEventListener("pointermove", splashPointerAudioRetry);
    document.removeEventListener("pointerdown", splashPointerAudioRetry);
    document.removeEventListener("touchstart", splashPointerAudioRetry);
    splashPointerAudioRetry = null;
}

function renderSplash() {
    const app = document.getElementById("app");
    if (!app) {
        console.error("THE HUMAN ARCHIVE: #app container was not found.");
        return;
    }

    window.THAIdentity?.hide();

    // Stop any previous opening ambience before rebuilding the screen.
    if (typeof stopAllOpeningAudio === "function") stopAllOpeningAudio();
    removeSplashPointerAudioRetry();
    splashTransitioning = false;
    lastSplashAudioRetryAt = 0;

    document.documentElement.classList.remove("tha-terminal-active");
    document.body.classList.remove("tha-terminal-active");
    document.documentElement.classList.add("splash-no-scroll");
    document.body.classList.add("splash-no-scroll");

    app.innerHTML = `
        <section class="splash-screen" id="splashScreen" aria-labelledby="splashTitle">
            <button type="button" id="splashSoundControl" class="splash-sound-control" aria-label="Tap to start ambient sound" title="Tap to start ambient sound" aria-pressed="false" data-state="blocked">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path class="sound-muted" d="m16 9 5 6m0-6-5 6"/></svg>
            </button>
            <div class="splash-stars" aria-hidden="true"></div>
            <div class="splash-nebula" aria-hidden="true"></div>
            <div class="splash-radar-sweep" aria-hidden="true"></div>
            <div class="splash-orbit-lines" aria-hidden="true"></div>

            <div class="splash-earth" aria-hidden="true">
                <span class="earth-atmosphere"></span>
                <span class="earth-clouds"></span>
            </div>
            <div class="splash-moon" aria-hidden="true">
                <span class="moon-craters"></span>
            </div>
            <div class="splash-mars" aria-hidden="true">
                <span class="mars-craters"></span>
            </div>
            <div class="splash-station" aria-hidden="true">
                <span class="station-panel station-panel-left"></span>
                <span class="station-arm"></span>
                <span class="station-core"></span>
                <span class="station-panel station-panel-right"></span>
                <span class="station-light"></span>
                <span class="station-antenna"></span>
            </div>

            <main class="splash-content">
                <p class="splash-eyebrow">EARTH ORBIT // DEEP-SPACE ARCHIVE</p>

                <div class="splash-emblem" aria-hidden="true">
                    <span class="splash-orbit orbit-one"></span>
                    <span class="splash-orbit orbit-two"></span>
                    <span class="splash-orbit orbit-three"></span>
                    <span class="splash-core"></span>
                </div>

                <h1 class="splash-title" id="splashTitle">
                    THE HUMAN
                    <span>ARCHIVE</span>
                </h1>

                <div class="splash-divider" aria-hidden="true">
                    <span></span><i></i><span></span>
                </div>

                <p class="splash-description">
                    A forgotten station in Earth orbit.<br>
                    Humanity's traces on the Moon, Mars, and beyond are waiting to be remembered.
                </p>

                <button type="button" id="beginArchive" class="splash-enter-button">
                    <span>ENTER THE STATION</span>
                    <span aria-hidden="true" class="enter-arrow">↗</span>
                </button>
            </main>

            <footer class="splash-footer">ABANDONED ≠ FORGOTTEN</footer>
        </section>
    `;

    const soundButton = document.getElementById("splashSoundControl");
    const enterButton = document.getElementById("beginArchive");

    // Autoplay is attempted on entry. If the browser blocks it, pointer movement is
    // an opportunistic retry; pointerdown and the speaker button provide real user gestures.
    const initiallyMuted = Boolean(window.THA?.audioMuted);
    updateSplashSoundControl();
    if (!initiallyMuted) {
        void startSplashAudio().then(updateSplashSoundControl);
        splashPointerAudioRetry = (event) => {
            if (event?.target?.closest?.("#splashSoundControl")) return;
            if (splashTransitioning || window.THA?.audioMuted || window.THA?.openingAudioStatus?.playing) {
                removeSplashPointerAudioRetry();
                updateSplashSoundControl();
                return;
            }
            const now = Date.now();
            if (now - lastSplashAudioRetryAt < 900) return;
            lastSplashAudioRetryAt = now;
            const start = ["pointerdown", "touchstart"].includes(event?.type) ? startSplashAudioFromGesture : startSplashAudio;
            void start().then((started) => {
                updateSplashSoundControl();
                if (started) removeSplashPointerAudioRetry();
            });
        };
        document.addEventListener("pointermove", splashPointerAudioRetry, { passive: true });
        document.addEventListener("pointerdown", splashPointerAudioRetry, { passive: true });
        document.addEventListener("touchstart", splashPointerAudioRetry, { passive: true });
    }

    soundButton.addEventListener("click", async () => {
        if (splashTransitioning) return;
        const muted = Boolean(window.THA?.audioMuted);
        const playing = Boolean(window.THA?.openingAudioStatus?.playing);

        if (muted) {
            setTHAAudioMuted(false);
            if (typeof unlockTHAAudioContext === "function") unlockTHAAudioContext();
            await startSplashAudioFromGesture();
        } else if (playing) {
            setTHAAudioMuted(true);
            removeSplashPointerAudioRetry();
        } else {
            if (typeof unlockTHAAudioContext === "function") unlockTHAAudioContext();
            await startSplashAudioFromGesture();
        }
        updateSplashSoundControl();
    });

    // Entering the station ends Splash audio and hands control to Terminal.
    enterButton.addEventListener("click", () => {
        if (splashTransitioning) return;

        if (typeof unlockTHAAudioContext === "function") unlockTHAAudioContext();
        splashTransitioning = true;
        enterButton.disabled = true;
        removeSplashPointerAudioRetry();
        void fadeOutSplashAudio(240);

        // The router fades this scene out before Terminal takes over.
        const navigated = window.THANavigation?.goTo("terminal") === true;
        if (!navigated) {
            enterButton.disabled = false;
            splashTransitioning = false;
            updateSplashSoundControl();
        }
    });
}
