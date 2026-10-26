// =============================================================
// THE HUMAN ARCHIVE — APPLICATION ENTRY POINT
// Starts the SPA once, after all classic scripts have been loaded.
// =============================================================

(() => {
    let started = false;

    function startApplication() {
        if (started) return;
        started = true;

        const app = document.getElementById("app");
        if (!app) {
            console.error("THE HUMAN ARCHIVE: #app container was not found.");
            return;
        }

        if (typeof router === "undefined" || typeof router.navigateTo !== "function") {
            app.innerHTML = `
                <section class="tha-route-error" role="alert">
                    <p class="tha-route-error-label">ARCHIVE STARTUP ERROR</p>
                    <h1>The archive could not start.</h1>
                    <p>Check that js/router.js loaded successfully before js/main.js.</p>
                </section>`;
            console.error("THE HUMAN ARCHIVE: router.js was not loaded before main.js.");
            return;
        }

        // Splash is the first screen. The Terminal begins only after the user enters.
        router.navigateTo("splash");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startApplication, { once: true });
    } else {
        startApplication();
    }
})();
