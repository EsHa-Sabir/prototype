// =============================================================
// THE HUMAN ARCHIVE — SINGLE-PAGE ROUTER
// Supports page functions that render into #app or return an HTMLElement.
// =============================================================

const THA_ROUTE_RENDERERS = {
    splash: "renderSplash",
    terminal: "renderTerminal",
    menu: "renderMenu",
    moonMap: "renderMoonMap",
    marsMap: "renderMarsMap",
    templateA: "renderTemplateA",
    templateB: "renderTemplateB",
    templateC: "renderTemplateC",
    archive99: "renderArchive99",
    yourArchive: "renderYourArchive",
    finale: "renderFinale"
};

const router = {
    currentScreen: "splash",

    /** Render the requested screen and pass recordId to record templates. */
    navigateTo(screenName, recordId = null) {
        const app = document.getElementById("app");
        if (!app) {
            console.error("THE HUMAN ARCHIVE: #app container was not found.");
            return false;
        }

        const rendererName = THA_ROUTE_RENDERERS[screenName];
        const renderer = rendererName ? window[rendererName] : null;
        if (typeof renderer !== "function") {
            console.error(`THE HUMAN ARCHIVE: renderer for route "${screenName}" is not loaded.`);
            app.innerHTML = `
                <section class="tha-route-error" role="alert">
                    <p class="tha-route-error-label">ARCHIVE ROUTE UNAVAILABLE</p>
                    <h1>This archive screen could not be opened.</h1>
                    <p>Check the route name and make sure its page script is loaded before router.js.</p>
                </section>`;
            return false;
        }

        // Clear previous screen locks before a new route applies its own state.
        document.documentElement.classList.remove("splash-no-scroll", "tha-terminal-active");
        document.body.classList.remove("splash-no-scroll", "tha-terminal-active");
        this.currentScreen = screenName;
        app.replaceChildren();

        try {
            const result = renderer(recordId);

            // Some legacy renderers return a node; the Splash/Terminal/Menu
            // renderers instead write directly into #app and return undefined.
            if (result instanceof Node && result.parentNode !== app) {
                app.appendChild(result);
            }

            if (app.childElementCount === 0) {
                throw new Error(`${rendererName} did not render content into #app or return a node.`);
            }

            // Badge placement depends on the screen that has just been rendered.
            window.THAIdentity?.restoreForCurrentRoute();
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            return true;
        } catch (error) {
            console.error(`THE HUMAN ARCHIVE: route "${screenName}" failed to render.`, error);
            app.innerHTML = `
                <section class="tha-route-error" role="alert">
                    <p class="tha-route-error-label">ARCHIVE ROUTE ERROR</p>
                    <h1>This archive screen could not be opened.</h1>
                    <p>Check the browser console for the render error, then verify the route script is loaded.</p>
                </section>`;
            return false;
        }
    }
};

// Keep the shortcut used by older pages while routing through one implementation.
function navigateTo(screenName, recordId = null) {
    return router.navigateTo(screenName, recordId);
}
