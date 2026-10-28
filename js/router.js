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
            <p class="tha-route-bridge-message">This destination is mapped and navigable. Its story renderer belongs to the next implementation phase and will replace this bridge when its page script is loaded.</p>
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

        const rendererName = THA_ROUTE_RENDERERS[screenName];
        if (!rendererName) {
            console.error(`THE HUMAN ARCHIVE: unknown route "${screenName}".`);
            return false;
        }

        const renderer = window[rendererName];
        const isOpeningRoute = THA_REQUIRED_OPENING_ROUTES.has(screenName);

        // Missing opening renderers are genuine startup errors; missing future
        // renderers use a bridge, not a broken route or an emptied Menu.
        if (typeof renderer !== "function" && isOpeningRoute) {
            renderTHARouteError(app, "ARCHIVE OPENING ERROR", `The required renderer ${rendererName} is not loaded. Check script order.`);
            return false;
        }

        // Release route-specific locks before the destination applies its own state.
        document.documentElement.classList.remove("splash-no-scroll", "tha-terminal-active");
        document.body.classList.remove("splash-no-scroll", "tha-terminal-active");
        this.currentScreen = screenName;
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

            window.THAIdentity?.restoreForCurrentRoute();
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            return true;
        } catch (error) {
            console.error(`THE HUMAN ARCHIVE: route "${screenName}" failed to render.`, error);
            renderTHARouteError(app, "ARCHIVE ROUTE ERROR", "Check the browser console, then verify the route renderer.");
            return false;
        }
    }
};

// Compatibility alias for record/page scripts from the earlier router contract.
function navigateTo(screenName, recordId = null) {
    return router.navigateTo(screenName, recordId);
}
