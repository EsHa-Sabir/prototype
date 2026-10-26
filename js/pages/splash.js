// =====================================================
// THE HUMAN ARCHIVE — CINEMATIC SPLASH
// Visual opening only. The actual story begins in Terminal
// with the first visible line: YEAR: 2126.
// =====================================================

let splashTransitioning = false;
let splashMouseMoveHandler = null;

function renderSplash() {
    const app = document.getElementById("app");
    if (!app) {
        console.error("THE HUMAN ARCHIVE: #app container was not found.");
        return;
    }

    window.THAIdentity?.hide();

    // Stop any previous Splash ambience before this screen is rebuilt.
    stopSplashAudio();
    splashTransitioning = false;

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

    // Keep the requested mouse-movement retry for ambient-hum.mp3.
    // Browsers may still require a click/tap to permit audio playback.
    splashMouseMoveHandler = async () => {
        if (splashTransitioning || !splashScreen.isConnected) return;
        const started = await startSplashAudio(true);
        if (started && splashMouseMoveHandler) {
            splashScreen.removeEventListener("mousemove", splashMouseMoveHandler);
            splashMouseMoveHandler = null;
        }
    };
    splashScreen.addEventListener("mousemove", splashMouseMoveHandler, { passive: true });

    startSplashAudio().then((started) => {
        if (started && splashMouseMoveHandler) {
            splashScreen.removeEventListener("mousemove", splashMouseMoveHandler);
            splashMouseMoveHandler = null;
        }
    });

    enterButton.addEventListener("click", () => {
        if (splashTransitioning) return;

        // Direct hand-off: do not show an intermediate “Entering the station”
        // label or wait through a fade. Terminal owns its own story timing.
        splashTransitioning = true;
        enterButton.disabled = true;

        if (splashMouseMoveHandler) {
            splashScreen.removeEventListener("mousemove", splashMouseMoveHandler);
            splashMouseMoveHandler = null;
        }
        window.THAIdentity?.hide();
        stopSplashAudio();

        const navigated = window.THANavigation
            ? window.THANavigation.goTo("terminal")
            : (typeof router !== "undefined" && router && typeof router.navigateTo === "function"
                ? router.navigateTo("terminal")
                : false);

        if (!navigated) {
            enterButton.disabled = false;
            splashTransitioning = false;
        }
    });
}
