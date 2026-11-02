// =============================================================================
// THE HUMAN ARCHIVE — SINGLE-PAGE ROUTER
// Routes are stable names. Opening renderers run directly; future screen modules
// can be added without changing the Main Menu's navigation map.
// =============================================================================

const THA_ROUTE_RENDERERS = Object.freeze({
    splash: "renderSplash",
    terminal: "renderTerminal",
    menu: "renderMenu",
    moonMap: "renderMoonMap",
    marsMap: "renderMarsMap",
    otherTraces: "renderOtherTraces",
    hiddenRecords: "renderHiddenRecords",
    templateA: "renderTemplateA",
    templateB: "renderTemplateB",
    templateC: "renderTemplateC",
    archive99: "renderArchive99",
    yourArchive: "renderYourArchive",
    finale: "renderFinale"
});

const THA_ROUTE_BRIDGE_INFO = Object.freeze({
    moonMap: { title: "MOON ARCHIVE", detail: "3 records · First recovery zone" },
    marsMap: { title: "MARS ARCHIVE", detail: "4 records · Martian surface" },
    otherTraces: { title: "OTHER TRACES", detail: "2 records · Deep-space traces" },
    hiddenRecords: { title: "HIDDEN RECORDS", detail: "2 records · Unidentified hardware" },
    templateA: { title: "SURFACE MAP EXPLORER", detail: "Record template A" },
    templateB: { title: "CHRONO SLIDER", detail: "Record template B" },
    templateC: { title: "MISSION IDENTITY ANALYZER", detail: "Record template C" },
    archive99: {
        title: "99%",
        detail: "The archive recovery interlude",
        nextRoute: "yourArchive",
        action: "CONTINUE TO YOUR ARCHIVE"
    },
    yourArchive: {
        title: "YOUR ARCHIVE",
        detail: "The personal archive",
        nextRoute: "finale",
        action: "CONTINUE TO FINAL"
    },
    finale: { title: "FINAL TRANSMISSION", detail: "Archive finale" }
});

const THA_REQUIRED_OPENING_ROUTES = new Set(["splash", "terminal", "menu"]);
const THA_ROUTE_EXIT_MS = 240;
let thaRouteNavigationPending = false;
let thaRouteNavigationToken = 0;

function createTHARouteBridge(screenName) {
    const appSection = document.createElement("section");
    const info = THA_ROUTE_BRIDGE_INFO[screenName] || { title: "ARCHIVE MODULE", detail: "Reserved route" };
    appSection.className = "tha-route-bridge";
    appSection.setAttribute("aria-labelledby", "thaRouteBridgeTitle");
    appSection.innerHTML = `
        <div class="tha-route-bridge-panel">
            <p class="tha-route-bridge-eyebrow">THE HUMAN ARCHIVE // ROUTE READY</p>
            <h1 id="thaRouteBridgeTitle">${info.title}</h1>
            <p class="tha-route-bridge-detail">${info.detail}</p>
            <p class="tha-route-bridge-message">This chapter is still being prepared. Return to the Archive Map and explore a chapter that is ready to open.</p>
            <button type="button" class="tha-route-bridge-button">${info.action || "RETURN TO ARCHIVE MAP"}</button>
        </div>`;
    appSection.querySelector("button").addEventListener("click", () => {
        window.THANavigation?.goTo(info.nextRoute || "menu");
    });
    return appSection;
}

function renderTHARouteError(app, label, message) {
    app.replaceChildren();
    const section = document.createElement("section");
    section.className = "tha-route-error";
    section.setAttribute("role", "alert");
    const eyebrow = document.createElement("p");
    eyebrow.className = "tha-route-error-label";
    eyebrow.textContent = label;
    const heading = document.createElement("h1");
    heading.textContent = "The archive could not open this screen.";
    const detail = document.createElement("p");
    detail.textContent = message;
    section.append(eyebrow, heading, detail);
    app.appendChild(section);
}

const router = {
    currentScreen: "splash",

    // Known destination names remain valid even when a later page is not bundled.
    hasRoute(screenName) {
        return Object.prototype.hasOwnProperty.call(THA_ROUTE_RENDERERS, screenName);
    },

    navigateTo(screenName, recordId = null) {
        const app = document.getElementById("app");
        if (!app) {
            console.error("THE HUMAN ARCHIVE: #app container was not found.");
            return false;
        }
        if (thaRouteNavigationPending) return false;

        const rendererName = THA_ROUTE_RENDERERS[screenName];
        if (!rendererName) {
            console.error(`THE HUMAN ARCHIVE: unknown route "${screenName}".`);
            return false;
        }

        const renderer = window[rendererName];
        const isOpeningRoute = THA_REQUIRED_OPENING_ROUTES.has(screenName);
        if (typeof renderer !== "function" && isOpeningRoute) {
            renderTHARouteError(app, "ARCHIVE OPENING ERROR", `The required renderer ${rendererName} is not loaded. Check script order.`);
            return false;
        }

        const previousScreen = app.firstElementChild;
        // Menu opens as a steady archive map: skip the shared brightness/slide
        // transition here so the screen does not flash or appear to jump.
        const shouldAnimate = Boolean(previousScreen && this.currentScreen !== screenName
            && screenName !== "menu"
            && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
        const token = ++thaRouteNavigationToken;

        const renderDestination = () => {
            if (token !== thaRouteNavigationToken) return false;

            // Stop audio owned by the screen being left before the new renderer starts.
            if (this.currentScreen !== screenName) window.THAMoonAudio?.stopAll();

            document.documentElement.classList.remove("splash-no-scroll", "tha-terminal-active");
            document.body.classList.remove("splash-no-scroll", "tha-terminal-active");
            this.currentScreen = screenName;
            window.THA = window.THA || {};
            window.THA.currentRoute = screenName;
            app.replaceChildren();

            try {
                if (typeof renderer === "function") {
                    const result = renderer(recordId);
                    if (result instanceof Node && result.parentNode !== app) app.appendChild(result);
                } else {
                    app.appendChild(createTHARouteBridge(screenName));
                }

                if (app.childElementCount === 0) {
                    throw new Error(`${rendererName} did not render content into #app or return a node.`);
                }

                const destination = app.firstElementChild;
                if (destination && shouldAnimate) {
                    destination.classList.add("tha-route-enter");
                    window.setTimeout(() => destination.classList.remove("tha-route-enter"), 620);
                }
                window.THAIdentity?.restoreForCurrentRoute();
                window.scrollTo({ top: 0, left: 0, behavior: "auto" });
                return true;
            } catch (error) {
                console.error(`THE HUMAN ARCHIVE: route "${screenName}" failed to render.`, error);
                renderTHARouteError(app, "ARCHIVE ROUTE ERROR", "Check the browser console, then verify the route renderer.");
                return false;
            }
        };

        if (!shouldAnimate) return renderDestination();

        thaRouteNavigationPending = true;
        previousScreen.classList.add("tha-route-exit");
        previousScreen.setAttribute("aria-hidden", "true");
        window.setTimeout(() => {
            try { renderDestination(); }
            finally { thaRouteNavigationPending = false; }
        }, THA_ROUTE_EXIT_MS);
        return true;
    }
};

// Compatibility alias for record/page scripts from the earlier router contract.
function navigateTo(screenName, recordId = null) {
    return router.navigateTo(screenName, recordId);
}
