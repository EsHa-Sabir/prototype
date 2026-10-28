// =============================================================================
// THE HUMAN ARCHIVE — CINEMATIC SPLASH
// This screen is visual-only; the story begins in Terminal with YEAR: 2126.
// =============================================================================

let splashTransitioning = false;
let splashAudioRetryHandler = null;
let splashAudioRetryPending = false;
let lastSplashAudioRetryAt = 0;

function removeSplashAudioRetryHandler() {
    const screen = document.getElementById("splashScreen");
    if (screen && splashAudioRetryHandler) {
        for (const eventName of ["pointermove", "touchstart", "keydown"]) {
            screen.removeEventListener(eventName, splashAudioRetryHandler);
        }
    }
    splashAudioRetryHandler = null;
}

function renderSplash() {
    const app = document.getElementById("app");
    if (!app) {
        console.error("THE HUMAN ARCHIVE: #app container was not found.");
        return;
    }

    window.THAIdentity?.hide();

    // Stop any previous Splash ambience before rebuilding the screen.
    if (typeof stopAllOpeningAudio === "function") stopAllOpeningAudio();
    removeSplashAudioRetryHandler();
    splashTransitioning = false;
    splashAudioRetryPending = false;
    lastSplashAudioRetryAt = 0;

    document.documentElement.classList.remove("tha-terminal-active");
    document.body.classList.remove("tha-terminal-active");
    document.documentElement.classList.add("splash-no-scroll");
    document.body.classList.add("splash-no-scroll");

    app.innerHTML = `
        <section class="splash-screen" id="splashScreen" aria-labelledby="splashTitle">
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

    const splashScreen = document.getElementById("splashScreen");
    const enterButton = document.getElementById("beginArchive");

    // Try ambient audio on entry. If autoplay is restricted, retry in a guarded
    // manner on pointer movement; the audio controller serializes play attempts.
    splashAudioRetryHandler = async (event) => {
        // Browsers may reject autoplay. Retry from a real input event; touch
        // devices do not reliably emit mousemove events.
        if (event?.type === "keydown" && !["Enter", " "].includes(event.key)) return;
        if (splashTransitioning || !splashScreen.isConnected || splashAudioRetryPending) return;
        const now = Date.now();
        if (now - lastSplashAudioRetryAt < 1200) return;
        lastSplashAudioRetryAt = now;
        splashAudioRetryPending = true;
        try {
            const started = await startSplashAudio();
            if (started) removeSplashAudioRetryHandler();
        } finally {
            splashAudioRetryPending = false;
        }
    };
    splashScreen.addEventListener("pointermove", splashAudioRetryHandler, { passive: true });
    splashScreen.addEventListener("touchstart", splashAudioRetryHandler, { passive: true });
    splashScreen.addEventListener("keydown", splashAudioRetryHandler);

    startSplashAudio().then((started) => {
        if (started) removeSplashAudioRetryHandler();
    });

    // Entering the station ends Splash audio and hands control to Terminal.
    enterButton.addEventListener("click", () => {
        if (splashTransitioning) return;

        if (typeof unlockTHAAudioContext === "function") unlockTHAAudioContext();
        splashTransitioning = true;
        enterButton.disabled = true;
        removeSplashAudioRetryHandler();
        window.THAIdentity?.hide();

        // renderTerminal() owns the route-entry audio cleanup; do not stop the
        // Splash track twice during a successful transition.
        const navigated = window.THANavigation?.goTo("terminal") === true;
        if (!navigated) {
            enterButton.disabled = false;
            splashTransitioning = false;
        }
    });
}
