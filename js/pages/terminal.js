// =============================================================
// THE HUMAN ARCHIVE — CINEMATIC TERMINAL
// Locked story text and sequence follow the Complete Script.
// Stage directions / Digital Notes are implementation guidance,
// not on-screen story copy.
// =============================================================

let terminalRunId = 0;
let terminalTransitioning = false;

const TERMINAL_OPENING_LINES = [
    { text: "YEAR: 2126", className: "terminal-year-line", speed: 68, pauseAfter: 520 },
    { text: "", className: "terminal-spacer-line", pauseAfter: 250 },
    { text: "Humanity went to the Moon.", className: "terminal-story-line", speed: 40 },
    { text: "It went to Mars.", className: "terminal-story-line", speed: 44 },
    { text: "It sent signals into the distance.", className: "terminal-story-line", speed: 38, pauseAfter: 320 },
    { text: "", className: "terminal-spacer-line", pauseAfter: 230 },
    { text: "And then, some of the traces it left behind", className: "terminal-story-line", speed: 35 },
    { text: "were forgotten.", className: "terminal-final-story-line", speed: 58, pauseAfter: 0 }
];

// Shown after the required three-second blank/silent interval.
// “Then the terminal begins to speak” is a stage direction, not visible copy.
const TERMINAL_RECOVERY_LINES = [
    { text: "Years passed.", className: "terminal-recovery-line terminal-years-line", speed: 48, pauseAfter: 640 },
    { text: "", className: "terminal-spacer-line", pauseAfter: 260 },
    { text: "One day, inside an abandoned station,", className: "terminal-recovery-line", speed: 31 },
    { text: "a terminal that had not been opened for years", className: "terminal-recovery-line", speed: 28 },
    { text: "was discovered.", className: "terminal-recovery-line terminal-discovered-line", speed: 46, pauseAfter: 360 },
    { text: "", className: "terminal-spacer-line", pauseAfter: 160 }
];

// On-screen text follows the story script's wording and order.
const TERMINAL_ARCHIVE_LINES = [
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 170 },
    { text: "        THE HUMAN ARCHIVE", className: "archive-title-line", speed: 42, pauseAfter: 220 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 180 },
    { text: "   ARCHIVE STATUS:   INCOMPLETE", className: "archive-status-line", speed: 27 },
    { text: "   LAST UPDATED:     2026", className: "archive-data-line", speed: 27 },
    { text: "", className: "archive-spacer-line", pauseAfter: 160 },
    { text: "   ARCHIVE RECORDS:  9", className: "archive-data-line", speed: 27 },
    { text: "   ACCESSIBLE:       0 / 9", className: "archive-data-line", speed: 27, pauseAfter: 240 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 220 },
    { text: "", className: "archive-spacer-line", pauseAfter: 170 },
    { text: "When we leave a world behind,", className: "archive-question-line", speed: 31 },
    { text: "what do we leave with it?", className: "archive-question-line", speed: 33, pauseAfter: 300 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 200 },
    { text: "   RECORDS MISSING.", className: "archive-warning-line", speed: 31 },
    { text: "   TRACES ERASED.", className: "archive-warning-line", speed: 33 },
    { text: "   STORIES UNFINISHED.", className: "archive-warning-line", speed: 34, pauseAfter: 250 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 200 },
    { text: "   A SPACE ARCHAEOLOGIST", className: "archive-call-line", speed: 32 },
    { text: "   IS NEEDED TO FIND THESE TRACES.", className: "archive-call-line", speed: 32, pauseAfter: 310 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 230 }
];

function terminalIsCurrent(runId) {
    return runId === terminalRunId && Boolean(document.getElementById("terminalScreen"));
}

function terminalDelay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function getTerminalCharacterDelay(character, baseSpeed) {
    if (character === " ") return Math.max(12, Math.round(baseSpeed * 0.56));
    if (/[.,:;!?]/u.test(character)) return baseSpeed + 105;
    return baseSpeed + Math.floor(Math.random() * 8);
}

function scrollTerminalOutput(target) {
    target.scrollTop = target.scrollHeight;
}

async function typeTerminalLines(target, lines, runId, defaultSpeed = 30) {
    let activeCaret = null;

    for (const item of lines) {
        if (!terminalIsCurrent(runId)) return false;
        if (activeCaret) {
            activeCaret.remove();
            activeCaret = null;
        }

        const line = document.createElement("div");
        line.className = item.className || "terminal-story-line";
        target.appendChild(line);

        if (item.text.length === 0) {
            line.setAttribute("aria-hidden", "true");
            line.classList.add("terminal-line-spacer");
            scrollTerminalOutput(target);
            await terminalDelay(item.pauseAfter ?? 160);
            continue;
        }

        const textNode = document.createElement("span");
        textNode.className = "terminal-line-text";
        line.appendChild(textNode);

        if (item.static) {
            textNode.textContent = item.text;
            scrollTerminalOutput(target);
            await terminalDelay(item.pauseAfter ?? 150);
            continue;
        }

        activeCaret = document.createElement("span");
        activeCaret.className = "terminal-inline-caret";
        activeCaret.setAttribute("aria-hidden", "true");
        line.appendChild(activeCaret);

        const speed = item.speed ?? defaultSpeed;
        for (const character of item.text) {
            if (!terminalIsCurrent(runId)) return false;
            textNode.textContent += character;
            if (typeof playTerminalKeyTick === "function") playTerminalKeyTick(character);
            scrollTerminalOutput(target);
            await terminalDelay(getTerminalCharacterDelay(character, speed));
        }

        await terminalDelay(item.pauseAfter ?? 120);
    }

    if (activeCaret) activeCaret.remove();
    scrollTerminalOutput(target);
    return terminalIsCurrent(runId);
}

function ensureTHAIdentityBadge() {
    let badge = document.getElementById("thaGlobalIdentityBadge");
    if (badge) return badge;

    badge = document.createElement("aside");
    badge.id = "thaGlobalIdentityBadge";
    badge.className = "tha-global-identity-badge";
    badge.hidden = true;
    badge.setAttribute("aria-label", "Space Archaeologist identity badge");
    badge.innerHTML = `
        <span class="tha-global-badge-icon" aria-hidden="true">
            <svg viewBox="0 0 40 40" focusable="false">
                <circle cx="20" cy="20" r="5.5" fill="none" stroke="currentColor" stroke-width="1.4" />
                <ellipse cx="20" cy="20" rx="17" ry="7.5" fill="none" stroke="currentColor" stroke-width="1.1" transform="rotate(-28 20 20)" />
                <circle cx="33.5" cy="12.5" r="2" fill="currentColor" />
            </svg>
        </span>
        <span class="tha-global-badge-copy">
            <strong>SPACE ARCHAEOLOGIST</strong>
            <small>IDENTITY ASSIGNED</small>
        </span>`;
    document.body.appendChild(badge);
    return badge;
}

function wasTHAIdentityAssigned() {
    try {
        return window.localStorage.getItem("thaIdentityAssigned") === "true";
    } catch (error) {
        return Boolean(window.THA && window.THA.identityAssigned);
    }
}

function restoreTHAIdentityBadge() {
    const assigned = wasTHAIdentityAssigned();
    window.THA = window.THA || {};
    window.THA.identityAssigned = assigned;

    if (!assigned) {
        const existing = document.getElementById("thaGlobalIdentityBadge");
        if (existing) existing.hidden = true;
        return;
    }

    const badge = ensureTHAIdentityBadge();
    const preMissionScreen = Boolean(
        document.getElementById("splashScreen") ||
        document.getElementById("terminalScreen")
    );
    badge.hidden = preMissionScreen;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.setTimeout(restoreTHAIdentityBadge, 0), { once: true });
} else {
    window.setTimeout(restoreTHAIdentityBadge, 0);
}

function renderTerminal() {
    const app = document.getElementById("app");
    if (!app) {
        console.error("THE HUMAN ARCHIVE: #app container was not found.");
        return;
    }

    terminalRunId += 1;
    const runId = terminalRunId;
    terminalTransitioning = false;

    if (typeof stopSplashAudio === "function") stopSplashAudio();
    if (typeof stopTerminalAudio === "function") stopTerminalAudio();

    // Terminal gets its own full-viewport root reset. This prevents generic
    // site-wide body/main/#app styles from adding white gutters or offsets.
    document.documentElement.classList.add("tha-terminal-active");
    document.body.classList.add("tha-terminal-active");

    // Any saved badge stays hidden until the current mission is accepted.
    ensureTHAIdentityBadge().hidden = true;
    document.documentElement.classList.remove("splash-no-scroll");
    document.body.classList.remove("splash-no-scroll");

    app.innerHTML = `
        <section class="terminal-screen is-booting" id="terminalScreen" aria-label="The Human Archive terminal">
            <div class="terminal-room" aria-hidden="true">
                <div class="terminal-observation-port"><span class="terminal-earth-horizon"></span></div>
                <div class="terminal-wall-seams"></div>
                <div class="terminal-room-haze"></div>
                <div class="terminal-floor-grille"></div>
                <div class="terminal-dust"></div>
            </div>

            <div class="terminal-monitor-frame" id="terminalMonitorFrame">
                <div class="terminal-monitor-bezel terminal-monitor-bezel-top" aria-hidden="true">
                    <span class="terminal-frame-screw screw-left"></span>
                    <span class="terminal-hardware-ports"><i></i><i></i><i></i><i></i><i></i></span>
                    <span class="terminal-power-cluster"><i class="power-led"></i><i class="power-led power-led-dim"></i><i class="power-led power-led-dim"></i></span>
                    <span class="terminal-frame-screw screw-right"></span>
                </div>

                <div class="terminal-glass" id="terminalGlass">
                    <div class="terminal-glass-glow" aria-hidden="true"></div>
                    <main class="terminal-stage">
                        <section class="terminal-console" id="terminalConsole" aria-label="Terminal output">
                            <div class="terminal-output" id="terminalOutput" aria-live="polite" aria-atomic="false"></div>
                            <div class="terminal-mission-area" id="terminalMissionArea" hidden>
                                <button type="button" id="acceptMission" class="terminal-mission-button">
                                    <span class="mission-bracket">[</span>
                                    <span>ACCEPT THE MISSION</span>
                                    <span class="mission-bracket">]</span>
                                </button>
                                <div class="terminal-mission-divider" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                            </div>
                        </section>
                    </main>
                    <div class="terminal-glass-reflection" aria-hidden="true"></div>
                    <div class="terminal-scanlines" aria-hidden="true"></div>
                </div>

                <div class="terminal-monitor-bezel terminal-monitor-bezel-bottom" aria-hidden="true">
                    <span class="terminal-vent-group"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
                    <span class="terminal-bezel-mark">THA</span>
                    <span class="terminal-control-group"><i></i><i></i><b></b></span>
                    <span class="terminal-frame-screw screw-left"></span>
                    <span class="terminal-frame-screw screw-right"></span>
                </div>
            </div>

            <div class="terminal-room-shadow" aria-hidden="true"></div>

            <section class="terminal-transition" id="terminalTransition" hidden aria-live="polite">
                <div class="terminal-flash" id="terminalFlash" aria-hidden="true"></div>
                <div class="terminal-assignment-orbit" aria-hidden="true"><i></i><b></b></div>
                <div class="terminal-assignment-card" id="terminalAssignmentCard">
                    <h1>SPACE ARCHAEOLOGIST</h1>
                    <p class="assignment-status">IDENTITY ASSIGNED</p>
                    <div class="assignment-divider"><span></span><i></i><span></span></div>
                    <div class="assignment-rec"><span class="assignment-rec-dot"></span> REC</div>
                </div>
            </section>
        </section>
    `;

    void runTerminalStory(runId);
}

async function runTerminalStory(runId) {
    const output = document.getElementById("terminalOutput");
    const missionArea = document.getElementById("terminalMissionArea");
    const acceptButton = document.getElementById("acceptMission");
    const screen = document.getElementById("terminalScreen");
    if (!output || !missionArea || !acceptButton || !screen) return;

    // The old monitor powers on first; only then does the first script line appear.
    await terminalDelay(740);
    if (!terminalIsCurrent(runId)) return;
    screen.classList.remove("is-booting");

    void startTerminalTypingAudio();
    const openingDone = await typeTerminalLines(output, TERMINAL_OPENING_LINES, runId, 39);
    if (!openingDone || !terminalIsCurrent(runId)) return;
    stopTerminalTypingAudio();

    // Let the final click tick die out, then clear the display and hold exactly
    // three seconds of silence with no story copy or active audio.
    await terminalDelay(60);
    if (!terminalIsCurrent(runId)) return;
    output.replaceChildren();
    output.scrollTop = 0;
    screen.classList.add("is-silent");
    await terminalDelay(3000);
    if (!terminalIsCurrent(runId)) return;
    screen.classList.remove("is-silent");
    screen.classList.add("is-recovery-wake");
    await terminalDelay(420);
    if (!terminalIsCurrent(runId)) return;
    screen.classList.remove("is-recovery-wake");

    // Recovery lines return on the same CRT, with the typewriter effect.
    void startTerminalTypingAudio();
    const recoveryDone = await typeTerminalLines(output, TERMINAL_RECOVERY_LINES, runId, 31);
    if (!recoveryDone || !terminalIsCurrent(runId)) return;
    stopTerminalTypingAudio();

    // Give “was discovered.” a readable pause. Then let the old text fade into
    // phosphor afterglow, briefly cycle the CRT, and only then begin the archive.
    await terminalDelay(1150);
    if (!terminalIsCurrent(runId)) return;
    output.classList.add("is-dissolving");
    screen.classList.add("is-chapter-transition");
    await terminalDelay(760);
    if (!terminalIsCurrent(runId)) return;
    output.replaceChildren();
    output.scrollTop = 0;
    output.classList.remove("is-dissolving");
    screen.classList.remove("is-chapter-transition");
    screen.classList.add("is-archive-wake");
    await terminalDelay(610);
    if (!terminalIsCurrent(runId)) return;
    screen.classList.remove("is-archive-wake");

    // A very quiet archive-room hum (supplied ambient asset + subtle synthesized
    // low tone) begins under the recovered system text, before the heartbeat cue.
    if (typeof startTerminalArchiveAmbient === "function") void startTerminalArchiveAmbient();
    void startTerminalTypingAudio();
    const archiveDone = await typeTerminalLines(output, TERMINAL_ARCHIVE_LINES, runId, 28);
    if (!archiveDone || !terminalIsCurrent(runId)) return;
    stopTerminalTypingAudio();

    await terminalDelay(420);
    if (!terminalIsCurrent(runId)) return;
    missionArea.hidden = false;
    void startTerminalHeartbeat();
    acceptButton.addEventListener("click", () => acceptTerminalMission(runId), { once: true });
}

async function acceptTerminalMission(runId) {
    if (terminalTransitioning || !terminalIsCurrent(runId)) return;
    terminalTransitioning = true;

    const button = document.getElementById("acceptMission");
    const transition = document.getElementById("terminalTransition");
    const flash = document.getElementById("terminalFlash");
    const assignmentCard = document.getElementById("terminalAssignmentCard");

    if (button) {
        button.disabled = true;
        button.innerHTML = "<span>MISSION ACCEPTED</span>";
    }

    if (typeof stopTerminalAudio === "function") stopTerminalAudio();
    transition.hidden = false;
    transition.classList.add("is-flashing");
    await terminalDelay(300);
    if (!terminalIsCurrent(runId)) return;

    transition.classList.remove("is-flashing");
    if (flash) flash.hidden = true;
    transition.classList.add("is-assignment-visible");
    if (assignmentCard) assignmentCard.classList.add("is-revealed");

    window.THA = window.THA || {};
    window.THA.identityAssigned = true;
    try {
        window.localStorage.setItem("thaIdentityAssigned", "true");
    } catch (error) {
        console.info("Identity is assigned for this session, but localStorage is unavailable.");
    }

    // REC cue, a brief silence, then the persistent badge. Keep the assignment
    // screen visible for three seconds before navigating to the Main Menu.
    if (typeof playTerminalRecCue === "function") playTerminalRecCue();
    await terminalDelay(900);
    if (!terminalIsCurrent(runId)) return;
    ensureTHAIdentityBadge().hidden = false;
    await terminalDelay(2100);
    if (!terminalIsCurrent(runId)) return;

    if (typeof router !== "undefined" && router && typeof router.navigateTo === "function") {
        document.documentElement.classList.remove("tha-terminal-active");
        document.body.classList.remove("tha-terminal-active");
        router.navigateTo("menu");
    } else if (typeof navigateTo === "function") {
        document.documentElement.classList.remove("tha-terminal-active");
        document.body.classList.remove("tha-terminal-active");
        navigateTo("menu");
    } else {
        console.error('THE HUMAN ARCHIVE: route "menu" was not found after mission acceptance.');
        transition.classList.add("route-error");
        const status = transition.querySelector(".assignment-overline");
        if (status) status.textContent = 'IDENTITY ASSIGNED · ROUTE "menu" NOT FOUND';
        terminalTransitioning = false;
    }
}
