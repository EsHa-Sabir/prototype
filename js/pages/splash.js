// =====================================================
// THE HUMAN ARCHIVE — CINEMATIC SPLASH
// This screen is only the visual opening. Story text and
// the YEAR: 2126 typewriter sequence belong to Terminal.
// =====================================================

let splashTransitioning = false;
let splashMouseMoveHandler = null;

function renderSplash() {
    const app = document.getElementById("app");

    if (!app) {
        console.error("The #app container was not found.");
        return;
    }

    // Splash is the pre-mission intro. A badge restored from localStorage must
    // never overlay this screen; it is revealed after ACCEPT THE MISSION.
    const savedIdentityBadge = document.getElementById("thaGlobalIdentityBadge");
    if (savedIdentityBadge) savedIdentityBadge.hidden = true;
    document.querySelectorAll(".terminal-identity-badge").forEach((badge) => {
        badge.hidden = true;
    });

    // Ensure a previous Splash instance cannot leave sound running.
    stopSplashAudio();
    splashTransitioning = false;

    document.documentElement.classList.add("splash-no-scroll");
    document.body.classList.add("splash-no-scroll");

    app.innerHTML = `
        <section class="splash-screen" id="splashScreen" aria-labelledby="splashTitle">
            <div class="splash-stars" aria-hidden="true"></div>
            <div class="splash-nebula" aria-hidden="true"></div>
            <div class="splash-radar-sweep" aria-hidden="true"></div>
            <div class="splash-orbit-lines" aria-hidden="true"></div>

            <!-- CSS-built planetary silhouettes keep the opening lightweight. -->
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

            <!-- A distant, inactive-looking station sets the story location. -->
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

    // Keep the requested mouse-movement trigger. It is a fallback, not a
    // guaranteed browser autoplay permission; some browsers only accept clicks/taps.
    splashMouseMoveHandler = async () => {
        if (splashTransitioning) return;

        const started = await startSplashAudio(true);
        if (started) {
            splashScreen.removeEventListener("mousemove", splashMouseMoveHandler);
        }
    };
    splashScreen.addEventListener("mousemove", splashMouseMoveHandler, { passive: true });

    // Try as soon as Splash appears. The mousemove listener above retries if blocked.
    startSplashAudio().then((started) => {
        if (started) {
            splashScreen.removeEventListener("mousemove", splashMouseMoveHandler);
        }
    });

    enterButton.addEventListener("click", () => {
        if (splashTransitioning) return;

        splashTransitioning = true;
        enterButton.disabled = true;
        enterButton.querySelector("span").textContent = "ENTERING THE STATION";

        // Stop this screen's ambience before Terminal or its audio is initialized.
        if (splashMouseMoveHandler) {
            splashScreen.removeEventListener("mousemove", splashMouseMoveHandler);
            splashMouseMoveHandler = null;
        }
        stopSplashAudio();

        document.documentElement.classList.remove("splash-no-scroll");
        document.body.classList.remove("splash-no-scroll");

        // Preserve the router API already used in this project.
        router.navigateTo("terminal");
    });
}
