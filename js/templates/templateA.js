// =============================================================================
// THE HUMAN ARCHIVE — TEMPLATE A: SURFACE MAP EXPLORER
// Moon records supported here: Apollo 11 clue reveal + Laser Retroreflector sim.
// The renderer is data-driven so Sojourner and Spirit can reuse Template A later.
// =============================================================================

function renderTemplateA(recordId) {
    const app = document.getElementById("app");
    const recordsApi = window.THA?.records;
    const ui = window.THATemplateUI;
    const record = recordsApi?.getRecord(recordId);
    if (!app || !ui || !record || record.template !== "A") {
        if (app) app.innerHTML = `<section class="tha-template-error"><h1>RECORD UNAVAILABLE</h1><p>Template A could not load this record from records.js.</p><button type="button" data-action="back-map">RETURN TO MOON MAP</button></section>`;
        app?.querySelector("[data-action='back-map']")?.addEventListener("click", () => window.THANavigation?.goTo("menu"));
        return;
    }

    window.THAMoonAudio?.stopAll();
    if (record.mechanic === "laser-simulation" || record.interaction?.type === "laser-ranging-simulation") {
        renderTHALaserRecord(app, record, ui);
    } else {
        renderTHAMapClueRecord(app, record, ui);
    }
}

function renderTHAMapClueRecord(app, record, ui) {
    const sourceClues = Array.isArray(record.clues) ? record.clues : [];
    const isTraceMechanic = record.mechanic === "map-traces";
    const clues = sourceClues.length ? sourceClues : (record.interaction?.focus ? [{ order: 1, title: "MISSION TRACE", text: record.interaction.focus }] : []);
    const revealNoun = isTraceMechanic ? "TRACE" : "CLUE";
    let revealedCount = 0;
    let identified = false;

    const initialBody = `
        <div class="tha-record-grid">
            <section class="tha-record-visual-column">
                ${ui.renderRecordImages(record)}
                <div class="tha-detected-state"><span class="tha-detected-led" aria-hidden="true"></span><div><strong>OBJECT DETECTED</strong><small>${ui.escapeHTML(record.objectIdentification?.detectedLabel || "UNIDENTIFIED")}</small></div></div>
            </section>
            <section class="tha-record-interaction-column">
                <div class="tha-interaction-heading"><span>FIELD ANALYSIS // ${revealNoun} SEQUENCE</span><strong id="thaClueCounter">0 / ${clues.length} ${revealNoun}S</strong></div>
                <div class="tha-record-howto">
                    <strong>WHAT TO DO</strong>
                    <p>Reveal all ${clues.length} clues one at a time. Each clue gives you one piece of evidence. After the last clue, press IDENTIFY OBJECT to see the NASA facts and human story.</p>
                </div>
                <p class="tha-record-instruction">STEP 1 OF 2 · REVEAL THE CLUES</p>
                <div class="tha-clue-list" id="thaClueList" aria-live="polite">
                    <div class="tha-clue-empty"><span aria-hidden="true">⌖</span><p>NO CLUES DECLASSIFIED</p><small>Begin the evidence sequence.</small></div>
                </div>
                <button type="button" class="tha-template-primary-button" id="thaRevealClueButton">REVEAL ${revealNoun} 01 <span aria-hidden="true">＋</span></button>
                <button type="button" class="tha-template-secondary-button" id="thaIdentifyButton" hidden>IDENTIFY OBJECT <span aria-hidden="true">↗</span></button>
            </section>
        </div>
        <div class="tha-record-facts" id="thaRecordFacts" hidden></div>`;

    app.innerHTML = ui.renderRecordFrame(record, "OBJECT DETECTED // UNIDENTIFIED", initialBody);
    ui.bindRecordBack(app);

    const clueList = app.querySelector("#thaClueList");
    const counter = app.querySelector("#thaClueCounter");
    const revealButton = app.querySelector("#thaRevealClueButton");
    const identifyButton = app.querySelector("#thaIdentifyButton");
    const facts = app.querySelector("#thaRecordFacts");

    revealButton.addEventListener("click", () => {
        if (identified || revealedCount >= clues.length) return;
        const clue = clues[revealedCount];
        if (!clue) return;
        const card = document.createElement("article");
        card.className = "tha-clue-card is-revealed";
        card.innerHTML = `
            <button type="button" class="tha-clue-toggle" aria-expanded="true">
                <span><small>${revealNoun} ${String(clue.order || revealedCount + 1).padStart(2, "0")}</small><strong>${ui.escapeHTML(clue.title || `${revealNoun} ${revealedCount + 1}`)}</strong></span>
                <i aria-hidden="true">−</i>
            </button>
            <div class="tha-clue-body"><p>${ui.escapeHTML(clue.text)}</p></div>`;
        const toggle = card.querySelector(".tha-clue-toggle");
        toggle.addEventListener("click", () => {
            const collapsed = card.classList.toggle("is-collapsed");
            toggle.setAttribute("aria-expanded", String(!collapsed));
            toggle.querySelector("i").textContent = collapsed ? "+" : "−";
        });
        clueList.querySelector(".tha-clue-empty")?.remove();
        clueList.appendChild(card);
        revealedCount += 1;
        counter.textContent = `${revealedCount} / ${clues.length} ${revealNoun}S`;
        if (revealedCount < clues.length) {
            revealButton.innerHTML = `REVEAL ${revealNoun} ${String(revealedCount + 1).padStart(2, "0")} <span aria-hidden="true">＋</span>`;
        } else {
            revealButton.hidden = true;
            identifyButton.hidden = false;
            const instruction = app.querySelector(".tha-record-instruction");
            if (instruction) instruction.textContent = "STEP 2 OF 2 · IDENTIFY THE OBJECT TO REVEAL THE STORY";
            identifyButton.focus();
        }
    });

    identifyButton.addEventListener("click", () => {
        if (identified || revealedCount !== clues.length) return;
        identified = true;
        identifyButton.hidden = true;
        const detected = app.querySelector(".tha-detected-state small");
        if (detected) detected.textContent = record.objectIdentification?.identifiedLabel || record.title.toUpperCase();
        const detectedState = app.querySelector(".tha-detected-state");
        detectedState?.classList.add("is-identified");
        const title = app.querySelector(".tha-record-title");
        if (title) title.textContent = record.objectIdentification?.identifiedLabel || record.screenTitle || record.title;
        const kicker = app.querySelector(".tha-record-kicker");
        if (kicker) kicker.textContent = "OBJECT IDENTIFIED · NASA DATA + STORY REVEALED";
        facts.hidden = false;
        facts.innerHTML = `${ui.renderNASAData(record)}${ui.renderStory(record)}${ui.renderObjectDNA(record)}
            <div class="tha-record-complete-row"><span>RECORD RECOVERED ✓</span><button type="button" class="tha-template-primary-button" data-action="return-map">RETURN TO ${ui.escapeHTML(ui.getBackLabel(record.chapter))} <span aria-hidden="true">↗</span></button></div>`;
        ui.markRecordComplete(record);
        window.THAMoonAudio?.playPianoNote(1150);
        facts.scrollIntoView({ behavior: "smooth", block: "start" });
        facts.querySelector('[data-action="return-map"]')?.addEventListener("click", () => window.THANavigation?.goTo(ui.getBackRoute(record.chapter)));
    });
}

function renderTHALaserRecord(app, record, ui) {
    let simulationStarted = false;
    let simulationComplete = false;
    const interaction = record.interaction || {};
    const outboundMs = Number(interaction.outbound?.durationMs) || 2000;
    const returnMs = Number(interaction.return?.durationMs) || 2000;
    const totalMs = Number(interaction.totalDurationMs) || outboundMs + returnMs;

    const body = `
        <div class="tha-record-grid tha-laser-grid">
            <section class="tha-record-visual-column">
                ${ui.renderRecordImages(record)}
                <div class="tha-detected-state"><span class="tha-detected-led" aria-hidden="true"></span><div><strong>OBJECT DETECTED</strong><small>${ui.escapeHTML(interaction.detectedLabel || "TYPE: SCIENTIFIC INSTRUMENT")}</small></div></div>
                <div class="tha-simulation-disclaimer"><strong>SIMULATION ONLY</strong><span>${ui.escapeHTML(interaction.disclaimer || "This is a simulation, not a real measurement.")}</span></div>
            </section>
            <section class="tha-record-interaction-column">
                <div class="tha-interaction-heading"><span>LIVE EXPERIMENT // LASER RANGING</span><strong>4.0 SEC</strong></div>
                <div class="tha-record-howto">
                    <strong>WHAT TO DO</strong>
                    <p>Press START SIMULATION. Watch the red beam travel to the Moon for 2 seconds, then watch the green signal return for 2 seconds. You are watching an illustration of the method, not taking a real measurement.</p>
                </div>
                <div class="tha-laser-step-guide" aria-label="Simulation sequence">
                    <span><b>01</b> RED · EARTH TO MOON · 2 SEC</span>
                    <span><b>02</b> GREEN · MOON TO EARTH · 2 SEC</span>
                </div>
                <p class="tha-record-instruction">TOTAL TIME · 4 SECONDS</p>
                <div class="tha-laser-stage" id="thaLaserStage">
                    <svg viewBox="0 0 760 240" role="img" aria-label="Simulated red laser travelling from Earth to Moon and green return signal">
                        <defs>
                            <radialGradient id="thaEarthGlow"><stop offset="0" stop-color="#b3c8d0"/><stop offset="1" stop-color="#263d48"/></radialGradient>
                            <radialGradient id="thaMoonGlow"><stop offset="0" stop-color="#f0f0e7"/><stop offset="1" stop-color="#777a72"/></radialGradient>
                        </defs>
                        <path class="tha-laser-track" d="M112 118 H648" />
                        <path class="tha-laser-outbound" d="M112 118 H648" />
                        <path class="tha-laser-return" d="M648 139 H112" />
                        <circle class="tha-laser-earth" cx="90" cy="128" r="43" fill="url(#thaEarthGlow)" />
                        <path d="M64 107 Q84 88 105 99 Q127 108 119 132 Q104 143 96 161 Q74 157 64 138Z" fill="#8ba78f" opacity=".5" />
                        <circle class="tha-laser-moon" cx="670" cy="128" r="35" fill="url(#thaMoonGlow)" />
                        <circle cx="657" cy="116" r="7" fill="#454a43" opacity=".42"/><circle cx="680" cy="141" r="9" fill="#454a43" opacity=".36"/>
                        <text x="90" y="202" text-anchor="middle">EARTH</text>
                        <text x="670" y="202" text-anchor="middle">MOON</text>
                    </svg>
                    <div class="tha-laser-phase" id="thaLaserPhase">AWAITING SIMULATION</div>
                </div>
                <button type="button" class="tha-template-primary-button" id="thaStartLaserButton">${ui.escapeHTML(interaction.startButtonLabel || "START SIMULATION")} <span aria-hidden="true">↗</span></button>
                <p class="tha-laser-explanation">${ui.escapeHTML(interaction.requiredExplanation || "Scientists use this method to measure.")} <strong>You are not measuring anything in this simulation.</strong></p>
            </section>
        </div>
        <div class="tha-record-facts" id="thaLaserResults" hidden></div>`;

    app.innerHTML = ui.renderRecordFrame(record, "TEMPLATE A // SPECIAL SIMULATION", body);
    ui.bindRecordBack(app);

    const stage = app.querySelector("#thaLaserStage");
    const phase = app.querySelector("#thaLaserPhase");
    const startButton = app.querySelector("#thaStartLaserButton");
    const results = app.querySelector("#thaLaserResults");

    startButton.addEventListener("click", () => {
        if (simulationStarted || simulationComplete) return;
        simulationStarted = true;
        startButton.disabled = true;
        stage.classList.add("is-running");
        phase.textContent = "RED LASER // EARTH → MOON // 00:02";
        window.THAMoonAudio?.playLaserCue();

        window.setTimeout(() => {
            if (!stage.isConnected) return;
            stage.classList.add("is-returning");
            phase.textContent = "STEP 2 OF 2 · GREEN RETURN · MOON → EARTH";
        }, outboundMs);

        window.setTimeout(() => {
            if (!stage.isConnected) return;
            simulationComplete = true;
            stage.classList.add("is-complete");
            phase.textContent = "SIMULATION COMPLETE · 4 SECONDS";
            results.hidden = false;
            results.innerHTML = `
                <section class="tha-laser-result-display" aria-label="Simulation reference values">
                    <div><span>AVERAGE EARTH–MOON DISTANCE</span><strong>${ui.escapeHTML(record.nasaData.averageEarthMoonDistance || "~384,400 km")}</strong></div>
                    <div><span>LASER MEASUREMENTS</span><strong>${ui.escapeHTML(record.nasaData.laserMeasurements || "Centimeter-level precision")}</strong></div>
                </section>
                <p class="tha-simulation-disclaimer-inline">This is a simulation, not a real measurement. ${ui.escapeHTML(interaction.requiredExplanation || "Scientists use this method to measure.")}</p>
                ${ui.renderNASAData(record)}
                ${ui.renderStory(record)}
                ${ui.renderObjectDNA(record)}
                <div class="tha-record-complete-row"><span>RECORD RECOVERED ✓</span><button type="button" class="tha-template-primary-button" data-action="return-map">RETURN TO ${ui.escapeHTML(ui.getBackLabel(record.chapter))} <span aria-hidden="true">↗</span></button></div>`;
            ui.markRecordComplete(record);
            // The script calls for a long silence after the laser sequence, then one note.
            window.setTimeout(() => {
                if (results.isConnected) window.THAMoonAudio?.playPianoNote(1250);
            }, 1400);
            results.querySelector('[data-action="return-map"]')?.addEventListener("click", () => window.THANavigation?.goTo(ui.getBackRoute(record.chapter)));
        }, totalMs);
    });
}
