// =============================================================
// THE HUMAN ARCHIVE — CINEMATIC TERMINAL
// Locked story text and sequence follow the Complete Script.
// Stage directions / Digital Notes are implementation guidance,
// not on-screen story copy.
// =============================================================

// A run ID invalidates pending timers when Terminal is re-rendered or left.
let terminalRunId = 0;
let terminalTransitioning = false;

const TERMINAL_OPENING_LINES = [
    { text: "YEAR: 2126", className: "terminal-year-line", speed: 68, pauseAfter: 180 },
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
    { text: "THE HUMAN ARCHIVE", className: "archive-title-line", speed: 42, pauseAfter: 220 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 180 },
    { text: "ARCHIVE STATUS: INCOMPLETE", className: "archive-status-line", speed: 27 },
    { text: "LAST UPDATED: 2026", className: "archive-data-line", speed: 27 },
    { text: "", className: "archive-spacer-line", pauseAfter: 160 },
    { text: "ARCHIVE RECORDS: 9", className: "archive-data-line", speed: 27 },
    { text: "ACCESSIBLE: 0 / 9", className: "archive-data-line", speed: 27, pauseAfter: 240 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 220 },
    { text: "", className: "archive-spacer-line", pauseAfter: 170 },
    { text: "When we leave a world behind,", className: "archive-question-line", speed: 31 },
    { text: "what do we leave with it?", className: "archive-question-line", speed: 33, pauseAfter: 300 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 200 },
    { text: "RECORDS MISSING.", className: "archive-warning-line", speed: 31 },
    { text: "TRACES ERASED.", className: "archive-warning-line", speed: 33 },
    { text: "STORIES UNFINISHED.", className: "archive-warning-line", speed: 34, pauseAfter: 250 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 200 },
    { text: "A SPACE ARCHAEOLOGIST", className: "archive-call-line", speed: 32 },
    { text: "IS NEEDED TO FIND THESE TRACES.", className: "archive-call-line", speed: 32, pauseAfter: 310 },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", className: "archive-divider-line", static: true, pauseAfter: 230 }
];

function terminalIsCurrent(runId) {
    return runId === terminalRunId && Boolean(document.getElementById("terminalScreen"));
}

// Keep all timed waits in one place so sequence timing is easy to audit.
function terminalDelay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function terminalPrefersReducedMotion() {
    return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

function getTerminalCharacterDelay(character, baseSpeed) {
    if (character === " ") return Math.max(12, Math.round(baseSpeed * 0.56));
    if (/[.,:;!?]/u.test(character)) return baseSpeed + 105;
    return baseSpeed + Math.floor(Math.random() * 8);
}

function scrollTerminalOutput(target) {
    target.scrollTop = target.scrollHeight;
}

// Keep visual typewriter text and screen-reader announcements synchronized.
function announceTerminalLine(text) {
    const announcement = document.getElementById("terminalAnnouncement");
    if (announcement) announcement.textContent = text;
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
            announceTerminalLine(item.text);
            await terminalDelay(item.pauseAfter ?? 150);
            continue;
        }

        // With reduced motion enabled, show each line immediately and skip key ticks.
        // Scripted pauses remain intact because they carry story meaning, not animation.
        if (terminalPrefersReducedMotion()) {
            textNode.textContent = item.text;
            scrollTerminalOutput(target);
            announceTerminalLine(item.text);
            await terminalDelay(item.pauseAfter ?? 120);
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

        announceTerminalLine(item.text);
        await terminalDelay(item.pauseAfter ?? 120);
    }

    if (activeCaret) activeCaret.remove();
    scrollTerminalOutput(target);
    return terminalIsCurrent(runId);
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

    if (typeof stopAllOpeningAudio === "function") stopAllOpeningAudio();

    // The Terminal owns the viewport until the Main Menu takes over.
    window.THAIdentity?.hide();
    document.documentElement.classList.remove("splash-no-scroll");
    document.body.classList.remove("splash-no-scroll");
    document.documentElement.classList.add("tha-terminal-active");
    document.body.classList.add("tha-terminal-active");

    app.innerHTML = `
        <section class="terminal-screen" id="terminalScreen" aria-label="The Human Archive terminal">
            <div class="terminal-room" aria-hidden="true">
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
                            <div class="terminal-output" id="terminalOutput" aria-live="off" aria-atomic="false"></div>
                            <p class="tha-sr-only" id="terminalAnnouncement" aria-live="polite" aria-atomic="true"></p>
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

    // The script does not call for mechanical CRT boot/shutdown effects.
    // Unlock audio from the real Splash button gesture for typing/heartbeat cues.
    if (typeof unlockTHAAudioContext === "function") unlockTHAAudioContext();
    void runTerminalStory(runId);
}

async function runTerminalStory(runId) {
    const output = document.getElementById("terminalOutput");
    const missionArea = document.getElementById("terminalMissionArea");
    const acceptButton = document.getElementById("acceptMission");
    const screen = document.getElementById("terminalScreen");
    if (!output || !missionArea || !acceptButton || !screen) return;

    // Give the newly displayed terminal a full second of quiet before its first line.
    // This is a pause only; no unrequested power-on effect or sound is added.
    await terminalDelay(1000);
    if (!terminalIsCurrent(runId)) return;

    // Opening transcript: only terminal text is typed, with fan + synced key ticks.
    void startTerminalTypingAudio();
    const openingDone = await typeTerminalLines(output, TERMINAL_OPENING_LINES, runId, 39);
    if (!openingDone || !terminalIsCurrent(runId)) return;

    // Script: “Three seconds of silence.” Stop fan/keying and let any synthetic
    // fallback hum finish its short decay, then hold a full three silent seconds.
    if (typeof stopTerminalTypingAudioAndWaitForSilence === "function") {
        await stopTerminalTypingAudioAndWaitForSilence();
    } else {
        stopTerminalTypingAudio();
    }
    await terminalDelay(3000);
    if (!terminalIsCurrent(runId)) return;

    // Recovery transcript appears on the same continuously visible terminal.
    // No unrequested screen-off/on animation or mechanical power cue is added.
    void startTerminalTypingAudio();
    const recoveryDone = await typeTerminalLines(output, TERMINAL_RECOVERY_LINES, runId, 31);
    if (!recoveryDone || !terminalIsCurrent(runId)) return;

    // Separate the recovery transcript from the archive output with a full second.
    // Let the fan/keying stop, keep the recovered text visible, then reset the
    // terminal content without a black-screen hold or invented power-cycle effect.
    stopTerminalTypingAudio();
    await terminalDelay(1000);
    if (!terminalIsCurrent(runId)) return;
    output.replaceChildren();
    output.scrollTop = 0;

    // Archive display: separators stay clean and only typed characters make key ticks.
    void startTerminalTypingAudio();
    const archiveDone = await typeTerminalLines(output, TERMINAL_ARCHIVE_LINES, runId, 28);
    if (!archiveDone || !terminalIsCurrent(runId)) return;
    stopTerminalTypingAudio();

    // Digital Note: low-frequency hum + one deep heartbeat cycle (“once, twice”), then silence.
    // The CTA's first and second CSS pulses are synchronized to the two audio thumps;
    // its softer mission-ready glow continues after the sound stops.
    await terminalDelay(420);
    if (!terminalIsCurrent(runId)) return;
    missionArea.hidden = false;
    void startTerminalHeartbeat(() => {
        if (!terminalIsCurrent(runId)) return;
        // This class owns the persistent visual glow; it is not tied to audio
        // playback. The heartbeat class is temporary and syncs only the two beats.
        acceptButton.classList.remove("is-heartbeat-playing", "is-heartbeat-complete", "is-mission-ready");
        void acceptButton.offsetWidth;
        acceptButton.classList.add("is-mission-ready", "is-heartbeat-playing");
    });
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
    if (button) button.classList.remove("is-heartbeat-playing");
    transition.hidden = false;
    transition.classList.add("is-flashing");
    await terminalDelay(300);
    if (!terminalIsCurrent(runId)) return;

    transition.classList.remove("is-flashing");
    if (flash) flash.hidden = true;
    transition.classList.add("is-assignment-visible");
    if (assignmentCard) assignmentCard.classList.add("is-revealed");

    if (window.THAIdentity) {
        window.THAIdentity.assign();
    } else {
        window.THA = window.THA || {};
        window.THA.identityAssigned = true;
        try { window.localStorage.setItem("thaIdentityAssigned", "true"); } catch (_) {}
    }

    // REC cue, a brief silence, then the persistent badge. Keep the assignment
    // screen visible for three seconds before navigating to the Main Menu.
    if (typeof playTerminalRecCue === "function") playTerminalRecCue();
    await terminalDelay(900);
    if (!terminalIsCurrent(runId)) return;
    window.THAIdentity?.show();
    // The assignment card is visible for 3 seconds after the 300 ms white flash.
    // The badge appears after 900 ms; the remaining 2100 ms completes the hold.
    await terminalDelay(2100);
    if (!terminalIsCurrent(runId)) return;

    const navigated = window.THANavigation?.goTo("menu") === true;

    if (!navigated) {
        transition.classList.add("route-error");
        const status = transition.querySelector(".assignment-status");
        if (status) status.textContent = 'IDENTITY ASSIGNED · ROUTE "menu" NOT FOUND';
        terminalTransitioning = false;
    }
}
