// =============================================================
// THE HUMAN ARCHIVE — MAIN MENU / ARCHIVE MAP
// The map and unlock sequence follow the Complete Script and Digital Brief.
// =============================================================

// -----------------------------------------------------------------------------
// Progress state and section totals
// -----------------------------------------------------------------------------
const THA_MENU_PROGRESS_KEY = "thaProgress";

// Keep these route values aligned with the names in your existing router.
const THA_MENU_ROUTES = Object.freeze({
    moon: "moonMap",
    mars: "marsMap",
    other: "otherTraces",
    hidden: "hiddenRecords",
    // The 99% interlude precedes the personal archive in the documented flow.
    your: "archive99"
});

const THA_MENU_TOTALS = Object.freeze({ moon: 3, mars: 4, other: 2, hidden: 2 });
const THA_MENU_PRIMARY_TOTAL = THA_MENU_TOTALS.moon + THA_MENU_TOTALS.mars + THA_MENU_TOTALS.other;

function readTHAMenuProgress() {
    const progress = { moon: 0, mars: 0, other: 0, hidden: 0 };
    try {
        const saved = JSON.parse(window.localStorage.getItem(THA_MENU_PROGRESS_KEY) || "{}");
        if (saved && typeof saved === "object") {
            for (const key of Object.keys(progress)) {
                const alias = key === "other" ? "otherTraces" : key;
                const raw = saved[key] ?? saved[alias];
                const numeric = Number(raw);
                if (Number.isFinite(numeric)) {
                    progress[key] = Math.max(0, Math.min(THA_MENU_TOTALS[key], Math.floor(numeric)));
                }
            }
        }
    } catch (error) {
        console.info("Archive progress is unavailable; using the initial empty archive.");
    }
    return progress;
}

/** Pages can save section completion with window.THA.setProgress("moon", 3). */
function setTHAProgress(section, completedCount) {
    const key = section === "otherTraces" ? "other" : section;
    if (!(key in THA_MENU_TOTALS)) return false;
    const value = Number(completedCount);
    if (!Number.isFinite(value)) return false;

    const progress = readTHAMenuProgress();
    progress[key] = Math.max(0, Math.min(THA_MENU_TOTALS[key], Math.floor(value)));
    try {
        window.localStorage.setItem(THA_MENU_PROGRESS_KEY, JSON.stringify(progress));
        return true;
    } catch (error) {
        console.warn("Archive progress could not be saved to localStorage.", error);
        return false;
    }
}

window.THA = window.THA || {};
window.THA.setProgress = setTHAProgress;
window.THA.readProgress = readTHAMenuProgress;

function getTHAMenuUnlocks(progress) {
    const moonDone = progress.moon >= THA_MENU_TOTALS.moon;
    const marsDone = progress.mars >= THA_MENU_TOTALS.mars;
    const otherDone = progress.other >= THA_MENU_TOTALS.other;
    const hiddenDone = progress.hidden >= THA_MENU_TOTALS.hidden;
    return {
        moon: true,
        mars: moonDone,
        other: moonDone && marsDone,
        hidden: moonDone && marsDone && otherDone,
        your: moonDone && marsDone && otherDone && hiddenDone
    };
}

function getTHAActiveSection(progress, unlocked) {
    if (unlocked.moon && progress.moon < THA_MENU_TOTALS.moon) return "moon";
    if (unlocked.mars && progress.mars < THA_MENU_TOTALS.mars) return "mars";
    if (unlocked.other && progress.other < THA_MENU_TOTALS.other) return "other";
    if (unlocked.hidden && progress.hidden < THA_MENU_TOTALS.hidden) return "hidden";
    if (unlocked.your) return "your";
    return "moon";
}

// -----------------------------------------------------------------------------
// Menu navigation
// -----------------------------------------------------------------------------
function navigateTHAMenuRoute(routeKey) {
    const routeName = THA_MENU_ROUTES[routeKey];
    const status = document.getElementById("thaMenuNotice");

    // Every visible section maps to a named route. The router renders a temporary
    // bridge when a later chapter is not part of this opening-screen build.
    if (typeof routeName !== "string" || !routeName) {
        if (status) {
            status.textContent = `ROUTE NOT CONFIGURED: ${String(routeKey).toUpperCase()}`;
            status.classList.add("is-visible");
        }
        return false;
    }

    // Move the shared badge out of the sticky header before a route replaces #app.
    window.THAIdentity?.moveToBody();
    const navigated = window.THANavigation?.goTo(routeName) === true;
    if (navigated) return true;

    // Restore the badge if the router rejected the route.
    window.THAIdentity?.mountInMenu();
    if (status) {
        status.textContent = `ROUTE NOT CONNECTED: ${routeName}. Check the route name in menu.js.`;
        status.classList.add("is-visible");
    }
    return false;
}

// -----------------------------------------------------------------------------
// Main Menu rendering and event binding
// -----------------------------------------------------------------------------
function renderMenu() {
    const app = document.getElementById("app");
    if (!app) {
        console.error("THE HUMAN ARCHIVE: #app container was not found.");
        return;
    }

    // Rehome the shared badge before replacing the routed screen's DOM.
    window.THAIdentity?.moveToBody();

    // Main Menu is intentionally silent: stop sounds from earlier screens,
    // but do not start or play any audio from this screen.
    if (typeof stopAllOpeningAudio === "function") stopAllOpeningAudio();
    document.documentElement.classList.remove("splash-no-scroll", "tha-terminal-active");
    document.body.classList.remove("splash-no-scroll", "tha-terminal-active");

    const progress = readTHAMenuProgress();
    const unlocked = getTHAMenuUnlocks(progress);
    const active = getTHAActiveSection(progress, unlocked);
    const coreRecovered = progress.moon + progress.mars + progress.other;
    const cards = [
        {
            key: "moon", icon: "🌙", title: "MOON ARCHIVE",
            count: `${progress.moon} / ${THA_MENU_TOTALS.moon}`, unlocked: unlocked.moon,
            complete: progress.moon >= THA_MENU_TOTALS.moon,
            active: active === "moon",
            status: progress.moon === THA_MENU_TOTALS.moon
                ? `RECOVERED // ${THA_MENU_TOTALS.moon} RECORDS COMPLETE`
                : `FIRST RECOVERY ZONE // ${THA_MENU_TOTALS.moon} RECORDS`
        },
        {
            key: "mars", icon: "🔴", title: "MARS ARCHIVE",
            count: `${progress.mars} / ${THA_MENU_TOTALS.mars}`, unlocked: unlocked.mars,
            complete: progress.mars >= THA_MENU_TOTALS.mars,
            active: active === "mars",
            status: unlocked.mars
                ? (progress.mars === THA_MENU_TOTALS.mars
                    ? `RECOVERED // ${THA_MENU_TOTALS.mars} RECORDS COMPLETE`
                    : `MARTIAN SURFACE // ${THA_MENU_TOTALS.mars} RECORDS`)
                : "LOCKED // COMPLETE MOON ARCHIVE"
        },
        {
            key: "other", icon: "🛰️", title: "OTHER TRACES",
            count: `${progress.other} / ${THA_MENU_TOTALS.other}`, unlocked: unlocked.other,
            complete: progress.other >= THA_MENU_TOTALS.other,
            active: active === "other",
            status: !unlocked.other ? "LOCKED // COMPLETE MARS ARCHIVE" : `DEEP SPACE // ${THA_MENU_TOTALS.other} RECORDS`
        },
        {
            key: "hidden", icon: "🔒", title: "HIDDEN RECORDS",
            count: unlocked.hidden ? `${progress.hidden} / ${THA_MENU_TOTALS.hidden}` : "LOCKED", unlocked: unlocked.hidden,
            complete: progress.hidden >= THA_MENU_TOTALS.hidden,
            active: active === "hidden",
            status: !unlocked.hidden ? "LOCKED // FINISH OTHER TRACES" : `UNIDENTIFIED HARDWARE // ${THA_MENU_TOTALS.hidden} RECORDS`
        },
        {
            key: "your", icon: "🫵", title: "YOUR ARCHIVE",
            count: unlocked.your ? "UNLOCKED" : "LOCKED", unlocked: unlocked.your,
            complete: false,
            active: active === "your", personal: true,
            status: unlocked.your ? "PERSONAL ARCHIVE // READY" : "LOCKED // YOUR CONTRIBUTION IS THE FINAL TRACE"
        }
    ];

    app.innerHTML = `
        <section class="tha-menu-screen" id="thaMenuScreen" aria-labelledby="thaMenuTitle">
            <div class="tha-menu-stars" aria-hidden="true"></div>
            <div class="tha-menu-nebula" aria-hidden="true"></div>
            <div class="tha-menu-rings" aria-hidden="true"></div>
            <div class="tha-menu-glass" aria-hidden="true"></div>

            <header class="tha-menu-topbar">
                <div class="tha-menu-brand">
                    <span class="tha-menu-brand-mark" aria-hidden="true">THA</span>
                    <span class="tha-menu-brand-copy">
                        <strong>THE HUMAN ARCHIVE</strong>
                        <small>EARTH ORBIT // RECOVERY STATION</small>
                    </span>
                </div>
                <div class="tha-menu-topbar-actions">
                    <span class="tha-menu-system"><i aria-hidden="true"></i> ARCHIVE LINK ACTIVE</span>
                    <div class="tha-menu-identity-slot" id="thaMenuIdentitySlot" aria-label="Assigned Space Archaeologist"></div>
                </div>
            </header>

            <main class="tha-menu-main">
                <section class="tha-menu-heading">
                    <p class="tha-menu-eyebrow">ARCHIVE NAVIGATION <span>//</span> YEAR 2126</p>
                    <h1 id="thaMenuTitle">THE HUMAN <span>ARCHIVE</span></h1>
                    <div class="tha-menu-rule" aria-hidden="true"><span></span><i></i><span></span></div>
                </section>

                <section class="tha-menu-map-panel" aria-label="Archive sections and recovery progress">
                    <div class="tha-menu-panel-top">
                        <span>ARCHIVE MAP <b>// RECOVERY ROUTE</b></span>
                        <span class="tha-menu-scan-state"><i aria-hidden="true"></i> ${coreRecovered} / 9 PRIMARY RECORDS RECOVERED</span>
                    </div>

                    <div class="tha-menu-schematic" role="img" aria-label="Schematic showing the Moon, Mars and deep-space archive routes. Not to scale.">
                        <svg viewBox="0 0 900 190" aria-hidden="true" focusable="false">
                            <defs>
                                <radialGradient id="thaMenuEarthGlow">
                                    <stop offset="0" stop-color="#b7ffd0" stop-opacity=".88" />
                                    <stop offset=".4" stop-color="#5cbf86" stop-opacity=".55" />
                                    <stop offset="1" stop-color="#1c5135" stop-opacity=".02" />
                                </radialGradient>
                                <linearGradient id="thaMenuRouteLine" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0" stop-color="#a8f5ba" stop-opacity=".75" />
                                    <stop offset="1" stop-color="#78c7e8" stop-opacity=".22" />
                                </linearGradient>
                            </defs>
                            <path class="schematic-orbit" d="M 68 106 C 214 10, 374 15, 454 94 S 694 168, 833 58" />
                            <path class="schematic-orbit schematic-orbit-alt" d="M 48 155 C 217 183, 351 34, 498 52 S 728 151, 861 118" />
                            <path class="schematic-route" d="M 134 109 C 235 72, 299 60, 378 87 S 511 121, 590 92 S 725 57, 793 71" />
                            <path class="schematic-route schematic-route-faint" d="M 134 109 C 224 157, 327 144, 378 87 S 514 38, 590 92 S 708 152, 793 71" />
                            <circle cx="134" cy="109" r="38" fill="url(#thaMenuEarthGlow)" />
                            <circle class="schematic-earth" cx="134" cy="109" r="17" />
                            <path class="schematic-earth-lines" d="M 123 96 C 111 104,117 115,129 116 S 145 125,146 115 M 133 92 C 143 101,132 106,136 117" />
                            <circle class="schematic-node schematic-node-moon" cx="378" cy="87" r="10" />
                            <circle class="schematic-moon-crater" cx="374" cy="84" r="2.5" />
                            <circle class="schematic-node schematic-node-mars" cx="590" cy="92" r="12" />
                            <path class="schematic-mars-crater" d="M 586 86 l4 3 -2 4 5 3" />
                            <circle class="schematic-node schematic-node-deep" cx="793" cy="71" r="5" />
                            <circle class="schematic-ping" cx="793" cy="71" r="12" />
                            <g class="schematic-labels" aria-hidden="true">
                                <text x="134" y="143" text-anchor="middle">EARTH</text>
                                <text x="378" y="110" text-anchor="middle">MOON</text>
                                <text x="590" y="119" text-anchor="middle">MARS</text>
                                <text x="793" y="98" text-anchor="middle">DEEP SPACE</text>
                            </g>
                        </svg>
                        <span class="tha-menu-map-note">SCHEMATIC ROUTE // NOT TO SCALE</span>
                    </div>
                    <div class="tha-menu-map-legend" aria-label="Map key">
                        <span><i aria-hidden="true"></i> EARTH ORBIT</span>
                        <span><i aria-hidden="true"></i> MOON</span>
                        <span><i aria-hidden="true"></i> MARS</span>
                        <span><i aria-hidden="true"></i> DEEP SPACE</span>
                    </div>

                    <div class="tha-menu-cards">
                        ${cards.map((card, index) => renderTHAMenuCard({ ...card, index })).join("")}
                    </div>
                    <p class="tha-menu-notice" id="thaMenuNotice" role="status" aria-live="polite"></p>
                </section>

                <footer class="tha-menu-footer">
                    <span class="tha-menu-footer-line"></span>
                    <p>ABANDONED <span>≠</span> FORGOTTEN</p>
                    <span class="tha-menu-footer-line"></span>
                </footer>
            </main>

            <footer class="tha-menu-bottom-meta">
                <span>STATION: EARTH ORBIT</span>
                <span>RECOVERY ${coreRecovered === THA_MENU_PRIMARY_TOTAL ? "READY FOR HIDDEN RECORDS" : "IN PROGRESS"}</span>
                <span>THA // 2126</span>
            </footer>
        </section>
    `;

    window.THAIdentity?.mountInMenu();

    app.querySelectorAll("[data-tha-menu-route]").forEach((button) => {
        button.addEventListener("click", () => {
            if (button.disabled) return;
            button.classList.add("is-selected");
            navigateTHAMenuRoute(button.dataset.thaMenuRoute);
        });
    });
}

// Render one section card. The template uses only values prepared above.
function renderTHAMenuCard({ key, icon, title, count, unlocked, complete = false, active = false, personal = false, status = "", index = 0 }) {
    const classes = [
        "tha-menu-card",
        active ? "is-active" : "",
        unlocked ? "is-unlocked" : "is-locked",
        personal ? "is-personal" : ""
    ].filter(Boolean).join(" ");
    const iconContent = icon === "🛰️" ? "🛰" : icon;
    const trailing = unlocked ? (complete ? "✓" : "↗") : "⌑";
    const iconMark = iconContent === "🔴" ? "mars" : key;
    return `
        <button type="button" class="${classes}" data-tha-menu-route="${key}" style="--card-index:${index}" ${unlocked ? "" : "disabled"} aria-label="${title}, ${count}. ${status}">
            <span class="tha-menu-card-icon icon-${iconMark}" aria-hidden="true">${iconContent}</span>
            <span class="tha-menu-card-main">
                <span class="tha-menu-card-title">${title}</span>
                <span class="tha-menu-card-status">${status}</span>
            </span>
            <span class="tha-menu-card-count">${count}</span>
            <span class="tha-menu-card-arrow" aria-hidden="true">${trailing}</span>
        </button>`;
}
