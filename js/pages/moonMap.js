// =============================================================================
// THE HUMAN ARCHIVE — CHAPTER TWO: THE MOON
// Three Moon records, in the exact story order from Belge 1 and Belge 2.
// Template A is used for Apollo 11 and Laser Retroreflectors; Template C for
// Fallen Astronaut. Map positions are schematic, not a geodetic projection.
// =============================================================================

const THA_MOON_MARKER_LAYOUT = Object.freeze({
    "apollo-11": { left: "34%", top: "43%", short: "APOLLO 11" },
    "laser-retroreflectors": { left: "63%", top: "31%", short: "LRRR" },
    "fallen-astronaut": { left: "71%", top: "68%", short: "HADLEY RILLE" }
});

function getTHAMoonRecords() {
    const api = window.THA?.records;
    if (!api || typeof api.getRecordsByChapter !== "function") return [];
    return api.getRecordsByChapter("moon");
}

function getTHAMoonCompleted() {
    return window.THATemplateUI?.getCompletedRecords("moon") || [];
}

function renderTHAMoonSVG() {
    const craters = [
        [93, 82, 34, 21], [228, 65, 22, 14], [376, 99, 40, 24], [565, 77, 28, 18],
        [755, 102, 48, 29], [916, 66, 23, 14], [130, 231, 49, 30], [307, 215, 26, 17],
        [490, 248, 56, 34], [690, 218, 34, 21], [880, 246, 62, 37], [64, 399, 29, 18],
        [245, 376, 66, 40], [437, 403, 28, 18], [626, 379, 46, 27], [813, 414, 30, 18],
        [976, 390, 58, 34], [155, 545, 43, 25], [356, 543, 56, 32], [559, 535, 29, 18],
        [762, 546, 50, 30], [936, 551, 35, 21]
    ];
    return `
        <svg class="tha-moon-svg" viewBox="0 0 1040 640" preserveAspectRatio="none" role="img" aria-label="Schematic cratered lunar surface with three archive markers">
            <defs>
                <radialGradient id="thaMoonSurface" cx="37%" cy="28%" r="82%">
                    <stop offset="0" stop-color="#c7c8c1" />
                    <stop offset=".46" stop-color="#858781" />
                    <stop offset="1" stop-color="#333732" />
                </radialGradient>
                <radialGradient id="thaCraterFill">
                    <stop offset="0" stop-color="#30342f" stop-opacity=".74" />
                    <stop offset=".58" stop-color="#555a53" stop-opacity=".62" />
                    <stop offset=".82" stop-color="#d2d2c9" stop-opacity=".28" />
                    <stop offset="1" stop-color="#222722" stop-opacity=".12" />
                </radialGradient>
                <linearGradient id="thaMoonLight" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stop-color="#f0f0e8" stop-opacity=".22" />
                    <stop offset=".5" stop-color="#e3e3dc" stop-opacity="0" />
                    <stop offset="1" stop-color="#111711" stop-opacity=".52" />
                </linearGradient>
                <pattern id="thaMoonGrain" width="44" height="44" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="8" r="1.1" fill="#f0f0e9" opacity=".22" />
                    <circle cx="29" cy="18" r=".8" fill="#171b17" opacity=".2" />
                    <circle cx="15" cy="37" r=".7" fill="#f2f1e8" opacity=".18" />
                    <path d="M0 26 L7 24 M33 3 L39 5" stroke="#171c17" stroke-opacity=".16" stroke-width="1" />
                </pattern>
            </defs>
            <rect width="1040" height="640" fill="url(#thaMoonSurface)" />
            <rect width="1040" height="640" fill="url(#thaMoonLight)" />
            <rect width="1040" height="640" fill="url(#thaMoonGrain)" />
            ${craters.map(([x,y,rx,ry]) => `
                <g class="tha-map-crater">
                    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#thaCraterFill)" />
                    <ellipse cx="${x-rx*.1}" cy="${y-ry*.12}" rx="${rx*.77}" ry="${ry*.73}" fill="none" stroke="#ecece3" stroke-opacity=".16" stroke-width="2" />
                    <ellipse cx="${x+rx*.12}" cy="${y+ry*.12}" rx="${rx*.54}" ry="${ry*.48}" fill="none" stroke="#171b17" stroke-opacity=".18" stroke-width="2" />
                </g>`).join("")}
            <path d="M0 158 C180 116 252 177 384 160 S650 122 780 176 S930 208 1040 156" fill="none" stroke="#eef0e7" stroke-opacity=".08" stroke-width="3" />
            <path d="M0 463 C170 424 270 487 400 450 S720 455 860 487 S980 460 1040 470" fill="none" stroke="#1a201a" stroke-opacity=".14" stroke-width="4" />
            <g opacity=".6" fill="#f4f2e9" font-family="monospace" font-size="16" letter-spacing="3">
                <text x="28" y="36">LUNAR SURFACE // SCHEMATIC</text>
                <text x="28" y="612" font-size="12">NORTH ↑</text>
                <text x="1010" y="612" font-size="12" text-anchor="end">LUNAR ARCHIVE SECTOR 01</text>
            </g>
        </svg>`;
}

function renderTHAMoonCompletion(app) {
    window.THAMoonAudio?.stopAll();
    app.innerHTML = `
        <section class="tha-moon-complete-screen" aria-labelledby="thaMoonCompleteTitle">
            <div class="tha-moon-complete-flash" aria-hidden="true"></div>
            <header class="tha-moon-complete-topbar">
                <span>THE HUMAN ARCHIVE <i>/</i> CHAPTER 02</span>
                <div class="tha-page-identity-slot" data-tha-identity-slot></div>
            </header>
            <div class="tha-moon-complete-content">
                <p class="tha-moon-complete-eyebrow">THE FIRST LIGHT · FINAL RECOVERY</p>
                <div class="tha-moon-complete-emblem" aria-hidden="true">🌙</div>
                <p class="tha-moon-complete-label">ALL THREE RECORDS RECOVERED</p>
                <h1 id="thaMoonCompleteTitle">MOON ARCHIVE COMPLETE</h1>
                <p class="tha-moon-complete-count">3 <span>/</span> 3 <b aria-hidden="true">✓</b></p>
                <p class="tha-moon-complete-story">You found three traces left on the Moon. Each one tells a different human story.</p>
                <p class="tha-moon-complete-mantra">ABANDONED ≠ FORGOTTEN.</p>
                <p class="tha-moon-complete-next">The Moon chapter is complete. Your next destination is the Mars archive.</p>
                <div class="tha-moon-complete-actions">
                    <button type="button" class="tha-moon-primary-button" data-action="continue-mars">CONTINUE TO MARS <span aria-hidden="true">↗</span></button>
                    <button type="button" class="tha-moon-secondary-button" data-action="return-menu">RETURN TO MAIN MENU</button>
                </div>
            </div>
        </section>`;

    // Story sequence: short chord → one-second white flash → red route transition.
    window.THAMoonAudio?.playCompletionChord();
    window.setTimeout(() => {
        app.querySelector(".tha-moon-complete-screen")?.classList.add("is-transition-red");
    }, 1950);
    app.querySelector('[data-action="continue-mars"]')?.addEventListener("click", () => window.THANavigation?.goTo("marsMap"));
    app.querySelector('[data-action="return-menu"]')?.addEventListener("click", () => window.THANavigation?.goTo("menu"));
}

function renderMoonMap() {
    const app = document.getElementById("app");
    if (!app) return;

    window.THAMoonAudio?.stopAll();
    const records = getTHAMoonRecords();
    if (records.length !== 3) {
        app.innerHTML = `<section class="tha-moon-error"><h1>MOON ARCHIVE DATA ERROR</h1><p>Expected 3 Moon records in records.js; found ${records.length}.</p><button type="button" data-action="return-menu">RETURN TO MAIN MENU</button></section>`;
        app.querySelector("button")?.addEventListener("click", () => window.THANavigation?.goTo("menu"));
        return;
    }

    const completed = getTHAMoonCompleted();
    if (completed.length >= 3) {
        renderTHAMoonCompletion(app);
        return;
    }

    const firstIncompleteIndex = records.findIndex((record) => !completed.includes(record.id));
    const activeRecord = records[Math.max(0, firstIncompleteIndex)];
    const detectedNumber = Math.min(3, completed.length + 1);
    const listMarkup = records.map((record, index) => {
        const isComplete = completed.includes(record.id);
        const unlocked = index <= firstIncompleteIndex;
        const state = isComplete ? "RECOVERED" : unlocked ? "SIGNAL DETECTED" : "SIGNAL LOCKED";
        const layout = THA_MOON_MARKER_LAYOUT[record.id];
        const buttonDisabled = !unlocked;
        return `
            <button type="button" class="tha-moon-record-row ${isComplete ? "is-complete" : ""} ${index === firstIncompleteIndex ? "is-current" : ""} ${!unlocked ? "is-locked" : ""}"
                data-record-id="${record.id}" ${buttonDisabled ? "disabled aria-disabled=\"true\"" : ""}>
                <span class="tha-moon-record-index">0${index + 1}</span>
                <span class="tha-moon-record-copy"><strong>${record.title}</strong><small>${layout.short} · ${state}</small></span>
                <span class="tha-moon-record-state" aria-hidden="true">${isComplete ? "✓" : unlocked ? "↗" : "⌑"}</span>
            </button>`;
    }).join("");

    const markerMarkup = records.map((record, index) => {
        // The next signal appears only after the previous record is recovered.
        if (index > firstIncompleteIndex) return "";
        const isComplete = completed.includes(record.id);
        const layout = THA_MOON_MARKER_LAYOUT[record.id];
        return `
            <button type="button" class="tha-moon-marker ${isComplete ? "is-complete" : "is-current"}"
                style="left:${layout.left};top:${layout.top}" data-record-id="${record.id}"
                aria-label="${record.title}: ${isComplete ? "recovered" : "open record"}">
                <span class="tha-moon-marker-pulse" aria-hidden="true"></span><span class="tha-moon-marker-core" aria-hidden="true">${isComplete ? "✓" : `0${index + 1}`}</span>
                <span class="tha-moon-marker-label">${layout.short}</span>
            </button>`;
    }).join("");

    const media = activeRecord.media || {};
    const activeImage = media.src
        ? `<img src="${media.src}" alt="${media.alt || activeRecord.title}" loading="eager">`
        : `<div class="tha-moon-preview-placeholder">IMAGE NOT MAPPED</div>`;

    app.innerHTML = `
        <section class="tha-moon-screen" aria-labelledby="thaMoonTitle">
            <div class="tha-moon-atmosphere" aria-hidden="true"><span></span><span></span><span></span></div>
            <header class="tha-moon-topbar">
                <button type="button" class="tha-moon-back-button" data-action="return-menu"><span aria-hidden="true">←</span> ARCHIVE MENU</button>
                <div class="tha-moon-brand"><span class="tha-moon-brand-mark">THA</span><span>THE HUMAN ARCHIVE <i>/</i> CHAPTER 02</span></div>
                <div class="tha-moon-progress"><span>RECOVERED</span><strong>${completed.length} / 3</strong></div>
                <div class="tha-page-identity-slot" data-tha-identity-slot></div>
            </header>

            <main class="tha-moon-main">
                <div class="tha-moon-heading-row">
                    <div>
                        <p class="tha-moon-eyebrow">CHAPTER TWO // THE FIRST RECOVERY ZONE</p>
                        <h1 id="thaMoonTitle">MOON — LOST OBJECT MAP</h1>
                        <p class="tha-moon-intro">Gray. Cratered. Silent. There is no wind on the Moon and no atmosphere. Somewhere in that silence, a single light blinks.</p>
                    </div>
                    <div class="tha-moon-signal-readout"><span class="tha-signal-led" aria-hidden="true"></span><span>RECORD DETECTED: <strong>${detectedNumber}</strong></span><small>STATUS: ${completed.length === 0 ? "UNKNOWN" : "PARTIAL RECOVERY"}</small></div>
                </div>

                <section class="tha-moon-howto" aria-label="How to explore the Moon archive">
                    <div class="tha-moon-howto-heading"><span>YOUR MISSION</span><strong>Recover 3 traces left on the Moon.</strong></div>
                    <ol>
                        <li><b>1</b><span>Open the blinking light.</span></li>
                        <li><b>2</b><span>Read the clues or try the simulation.</span></li>
                        <li><b>3</b><span>Return to the map to find the next light.</span></li>
                    </ol>
                </section>

                <div class="tha-moon-layout">
                    <section class="tha-moon-map-panel" aria-label="Moon lost object map">
                        <div class="tha-moon-map-panel-top"><span>SECTOR 01 · LUNAR SURFACE</span><span>SCHEMATIC MAP / NOT TO SCALE</span></div>
                        <div class="tha-moon-map-viewport" id="thaMoonMapViewport">
                            ${renderTHAMoonSVG()}
                            <div class="tha-moon-map-markers">${markerMarkup}</div>
                            <div class="tha-moon-map-crosshair" aria-hidden="true"><span></span><i></i></div>
                            <div class="tha-moon-map-scale" aria-hidden="true"><span></span><small>FIELD VIEW</small></div>
                        </div>
                        <div class="tha-moon-map-caption"><span><b class="tha-map-key-active"></b> NEXT TRACE</span><span><b class="tha-map-key-done"></b> RECOVERED</span><span><b class="tha-map-key-locked"></b> LOCKED</span></div>
                        <p class="tha-moon-map-note">Marker placement is a visual archive schematic. Record coordinates and site descriptions appear inside each record.</p>
                    </section>

                    <aside class="tha-moon-side-panel">
                        <section class="tha-moon-next-card">
                            <p class="tha-moon-panel-label">YOUR NEXT DISCOVERY // 0${detectedNumber} OF 03</p>
                            <div class="tha-moon-preview-image">${activeImage}</div>
                            <h2>${activeRecord.title}</h2>
                            <p>${activeRecord.objectType || activeRecord.title}. Open this record, complete its activity, then return here.</p>
                            <button type="button" class="tha-moon-primary-button" data-record-id="${activeRecord.id}">OPEN THIS DISCOVERY <span aria-hidden="true">↗</span></button>
                        </section>
                        <section class="tha-moon-record-list" aria-labelledby="thaMoonRecordsHeading">
                            <div class="tha-moon-list-heading"><h2 id="thaMoonRecordsHeading">RECOVERY LOG</h2><span>${completed.length}/3</span></div>
                            ${listMarkup}
                        </section>
                        <section class="tha-moon-audio-note" aria-label="Moon audio controls">
                            <span class="tha-audio-symbol" aria-hidden="true">◌</span>
                            <div class="tha-moon-audio-copy"><strong id="thaMoonAudioTitle" aria-live="polite">MOON SOUND</strong><small id="thaMoonAudioStatus">Silence between signals. No wind or background ambience.</small></div>
                            <button type="button" class="tha-moon-audio-button" id="thaMoonEnableAudio">ENABLE SOUND</button>
                        </section>
                    </aside>
                </div>
            </main>
            <footer class="tha-moon-footer"><span>THE HUMAN ARCHIVE</span><span>NO ATMOSPHERIC WIND // SILENCE BETWEEN SIGNALS</span><span>ABANDONED ≠ FORGOTTEN</span></footer>
        </section>`;

    app.querySelector('[data-action="return-menu"]')?.addEventListener("click", () => {
        window.removeEventListener("tha:moon-audio-status", updateAudioUI);
        window.THANavigation?.goTo("menu");
    });

    const audioButton = app.querySelector("#thaMoonEnableAudio");
    const audioTitle = app.querySelector("#thaMoonAudioTitle");
    const audioStatus = app.querySelector("#thaMoonAudioStatus");
    const updateAudioUI = (event) => {
        const status = event?.detail?.status;
        const message = event?.detail?.message;
        if (!audioTitle || !audioStatus) return;
        if (status === "enabled") {
            audioTitle.textContent = "MOON SOUND ENABLED";
            audioStatus.textContent = "A soft electronic ping sounds every 4 seconds. Silence between pings.";
            if (audioButton) audioButton.textContent = "SOUND ON ✓";
        } else if (status === "blocked" || status === "error") {
            audioTitle.textContent = status === "error" ? "AUDIO FILE NOT FOUND" : "SOUND NEEDS PERMISSION";
            audioStatus.textContent = message || "Tap Enable Sound, or check your device volume.";
            if (audioButton) audioButton.textContent = "TRY SOUND AGAIN";
        }
    };
    window.addEventListener("tha:moon-audio-status", updateAudioUI);
    audioButton?.addEventListener("click", async () => {
        audioButton.disabled = true;
        audioButton.textContent = "ENABLING…";
        const enabled = await window.THAMoonAudio?.enableAudioFromGesture();
        if (audioButton.isConnected) {
            audioButton.disabled = false;
            if (!enabled) audioButton.textContent = "TRY SOUND AGAIN";
        }
        if (enabled) updateAudioUI({ detail: { status: "enabled" } });
    });

    function openRecord(recordId, trigger) {
        const selected = records.find((record) => record.id === recordId);
        if (!selected) return;
        const index = records.findIndex((record) => record.id === recordId);
        if (index > firstIncompleteIndex) return;
        if (trigger?.dataset.busy === "true") return;
        if (trigger) {
            trigger.dataset.busy = "true";
            trigger.disabled = true;
        }
        // Stop the four-second Moon signal loop as soon as the user leaves the map.
        // The two-second camera zoom is intentionally silent.
        window.removeEventListener("tha:moon-audio-status", updateAudioUI);
        window.THAMoonAudio?.stopMapAtmosphere();
        const viewport = app.querySelector("#thaMoonMapViewport");
        viewport?.classList.add("is-zooming");
        app.querySelectorAll(".tha-moon-marker").forEach((marker) => marker.classList.add("is-dimmed"));
        window.setTimeout(() => {
            const route = selected.template === "C" ? "templateC" : "templateA";
            window.THANavigation?.goTo(route, selected.id);
        }, 2000);
    }

    app.querySelectorAll("[data-record-id]").forEach((button) => {
        if (button.disabled) return;
        button.addEventListener("click", () => openRecord(button.dataset.recordId, button));
    });

    window.THAMoonAudio?.startMapAtmosphere();
}
