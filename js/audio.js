// =============================================================
// THE HUMAN ARCHIVE — SHARED AUDIO CONTROLLER
//
// Keep all audio creation and playback in this file. Splash and Terminal
// scripts call these shared functions so two Audio objects cannot overlap.
// Load this script ONCE, before splash.js and terminal.js.
//
// Expected assets in assets/audio/:
//   ambient-hum.mp3       Splash ambience; loops until Splash is left
//   fan.mp3               Terminal machine fan; loops only while typing
//   keyboard-typing.mp3   Keyboard texture; loops only while typing
//   heartbeat.mp3         One heartbeat cue (the recording may contain both pulses)
// =============================================================

const THA_AUDIO_DIRECTORY = new URL("../assets/audio/", document.currentScript.src);
const THA_OPENING_AUDIO_PATH = new URL("ambient-hum.mp3", THA_AUDIO_DIRECTORY).href;
const THA_TERMINAL_FAN_PATH = new URL("fan.mp3", THA_AUDIO_DIRECTORY).href;
const THA_TERMINAL_KEYBOARD_PATH = new URL("keyboard-typing.mp3", THA_AUDIO_DIRECTORY).href;
const THA_TERMINAL_HEARTBEAT_PATH = new URL("heartbeat.mp3", THA_AUDIO_DIRECTORY).href;

// The supplied heartbeat file is treated as ONE cue. The script describes its
// rhythm as “once, twice”; do not replay an entire 8-second file twice.

window.THA = window.THA || {};
window.THA.openingAudio = null;
window.THA.terminalSounds = null;
window.THA.archiveHum = null;
window.THA.openingAudioStatus = {
    playing: false,
    attempting: false,
    blocked: false,
    failed: false
};

// Cancel token lets the mission click stop a two-play heartbeat sequence at once.
let thaHeartbeatSequenceId = 0;
let thaHeartbeatCancelPending = null;

// Web Audio provides very quiet key ticks synchronized to visible characters;
// the recorded keyboard MP3 supplies the fuller mechanical texture underneath.
let thaKeyAudioContext = null;
let thaKeyNoiseBuffer = null;
let thaArchiveDroneNodes = [];
const thaAudioFadeTokens = new WeakMap();

function createTHAAudio(path, options = {}) {
    const audio = new Audio(path);
    audio.preload = "auto";
    audio.loop = options.loop === true;
    audio.volume = Number.isFinite(options.volume) ? options.volume : 1;

    audio.addEventListener("error", () => {
        console.error("THE HUMAN ARCHIVE audio could not be loaded:", path, audio.error);
    });

    audio.load();
    return audio;
}

/** Rewind safely; seeking may fail briefly before the browser reads metadata. */
function rewindTHAAudio(audio) {
    if (!audio) return;
    try {
        audio.currentTime = 0;
    } catch (error) {
        console.debug("Audio rewind will complete when media metadata is available.");
    }
}

/** Pause and rewind one track so it cannot spill into the next story phase. */
function stopTHATrack(audio) {
    if (!audio) return;
    audio.pause();
    rewindTHAAudio(audio);
}

/** Smooth, bounded volume ramp used for scene-to-scene audio hand-offs. */
function fadeTHAAudioVolume(audio, targetVolume, durationMs = 300, isCurrent = () => true) {
    if (!audio) return Promise.resolve();
    const startVolume = audio.volume;
    const target = Math.max(0, Math.min(1, targetVolume));
    const steps = Math.max(1, Math.ceil(durationMs / 28));
    const fadeToken = (thaAudioFadeTokens.get(audio) || 0) + 1;
    thaAudioFadeTokens.set(audio, fadeToken);
    let step = 0;

    return new Promise((resolve) => {
        const update = () => {
            if (thaAudioFadeTokens.get(audio) !== fadeToken || !isCurrent()) { resolve(); return; }
            step += 1;
            const progress = Math.min(1, step / steps);
            audio.volume = startVolume + (target - startVolume) * progress;
            if (step >= steps) resolve();
            else window.setTimeout(update, durationMs / steps);
        };
        if (durationMs <= 0) {
            audio.volume = target;
            resolve();
            return;
        }
        window.setTimeout(update, durationMs / steps);
    });
}

// ------------------------------ SPLASH ------------------------------

function getSplashAudio() {
    if (!window.THA.openingAudio) {
        const audio = createTHAAudio(THA_OPENING_AUDIO_PATH, { loop: true, volume: 0.42 });

        // Ignore stale events from an audio instance that belonged to an old Splash screen.
        audio.addEventListener("playing", () => {
            if (window.THA.openingAudio !== audio) return;
            window.THA.openingAudioStatus.playing = true;
            window.THA.openingAudioStatus.blocked = false;
            window.THA.openingAudioStatus.failed = false;
        });
        audio.addEventListener("pause", () => {
            if (window.THA.openingAudio === audio) {
                window.THA.openingAudioStatus.playing = false;
            }
        });

        window.THA.openingAudio = audio;
    }
    return window.THA.openingAudio;
}

/**
 * Try to play Splash ambience on entry, then retry on mouse movement if the
 * browser blocked autoplay. `fromMouseMovement` bypasses a pending page-load
 * attempt so a real interaction-triggered retry is not ignored.
 */
async function startSplashAudio(fromMouseMovement = false) {
    const audio = getSplashAudio();
    const status = window.THA.openingAudioStatus;

    if (!audio.paused) {
        status.playing = true;
        return true;
    }
    if (status.attempting && !fromMouseMovement) return false;
    if (!fromMouseMovement) status.attempting = true;

    const shouldFadeIn = status.playing === false && audio.currentTime < 0.08;
    if (shouldFadeIn) audio.volume = 0.001;
    try {
        await audio.play();
        // If navigation happened during a pending play(), never restart Splash audio over Terminal.
        if (window.THA.openingAudio !== audio) {
            audio.pause();
            return false;
        }
        status.playing = true;
        status.blocked = false;
        status.failed = false;
        if (shouldFadeIn) {
            await fadeTHAAudioVolume(audio, 0.42, 560, () => window.THA.openingAudio === audio && !audio.paused);
        } else {
            audio.volume = 0.42;
        }
        return true;
    } catch (error) {
        // A concurrent attempt may have succeeded despite this attempt rejecting.
        if (window.THA.openingAudio === audio && !audio.paused) {
            status.playing = true;
            status.blocked = false;
            status.failed = false;
            return true;
        }
        status.playing = false;
        if (error && error.name === "NotAllowedError") {
            status.blocked = true;
            console.info("Splash ambience autoplay was restricted; retrying on mouse movement or another permitted interaction.");
        } else {
            status.failed = true;
            console.error("Splash ambience failed to start:", error);
        }
        return false;
    } finally {
        if (!fromMouseMovement) status.attempting = false;
    }
}

/** Stop Splash ambience immediately when ENTER THE STATION is used. */
function stopSplashAudio() {
    const audio = window.THA.openingAudio;
    window.THA.openingAudio = null;
    stopTHATrack(audio);
    window.THA.openingAudioStatus = {
        playing: false,
        attempting: false,
        blocked: false,
        failed: false
    };
}

async function fadeOutSplashAudio(durationMs = 320) {
    const audio = window.THA.openingAudio;
    if (!audio) return;
    await fadeTHAAudioVolume(audio, 0, durationMs, () => window.THA.openingAudio === audio && !audio.paused);
    if (window.THA.openingAudio === audio) stopSplashAudio();
    else stopTHATrack(audio);
}

// ----------------------------- TERMINAL -----------------------------

function getTerminalArchiveHum() {
    if (!window.THA.archiveHum) {
        // Reuse the supplied ambient-hum asset as a quiet archive-room bed.
        // The source file is not reprocessed; low playback volume keeps it subtle.
        window.THA.archiveHum = createTHAAudio(THA_OPENING_AUDIO_PATH, { loop: true, volume: 0.18 });
    }
    return window.THA.archiveHum;
}

function startTHALowFrequencyDrone() {
    const context = getTHAKeyAudioContext();
    if (!context || thaArchiveDroneNodes.length) return Boolean(context);

    // A quiet, team-created low-frequency bed adds weight beneath the supplied
    // ambient-hum MP3. This is sound design, not a NASA field recording.
    const tones = [
        { frequency: 52, gain: 0.009 },
        { frequency: 104, gain: 0.0025 }
    ];

    try {
        for (const tone of tones) {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(tone.frequency, context.currentTime);
            gain.gain.setValueAtTime(0.0001, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(tone.gain, context.currentTime + 0.7);
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start();
            thaArchiveDroneNodes.push({ oscillator, gain });
        }
        return true;
    } catch (error) {
        console.info("Low-frequency archive ambience is unavailable in this browser.");
        return false;
    }
}

function stopTHALowFrequencyDrone() {
    if (!thaKeyAudioContext || !thaArchiveDroneNodes.length) return;
    const context = thaKeyAudioContext;
    const nodes = thaArchiveDroneNodes;
    thaArchiveDroneNodes = [];
    const now = context.currentTime;

    for (const node of nodes) {
        try {
            node.gain.gain.cancelScheduledValues(now);
            node.gain.gain.setValueAtTime(Math.max(node.gain.gain.value, 0.0001), now);
            node.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
            node.oscillator.addEventListener("ended", () => {
                node.oscillator.disconnect();
                node.gain.disconnect();
            }, { once: true });
            node.oscillator.stop(now + 0.25);
        } catch (error) {
            try { node.oscillator.disconnect(); node.gain.disconnect(); } catch (_) {}
        }
    }
}

async function startTerminalArchiveAmbient() {
    const hum = getTerminalArchiveHum();
    hum.loop = true;
    let mp3Started = false;
    try {
        if (hum.paused) {
            hum.volume = 0.001;
            await hum.play();
            mp3Started = true;
            // Let the ambience and drone rise while the heartbeat cue starts,
            // rather than delaying the heartbeat until the fade is complete.
            void fadeTHAAudioVolume(hum, 0.18, 520, () => window.THA.archiveHum === hum && !hum.paused);
        } else {
            mp3Started = true;
        }
    } catch (error) {
        console.warn("Supplied archive ambient audio was blocked or failed:", error);
    }
    const droneStarted = startTHALowFrequencyDrone();
    return mp3Started || droneStarted;
}

async function fadeOutTerminalArchiveAmbient(durationMs = 340) {
    const hum = window.THA.archiveHum;
    if (hum && !hum.paused) {
        await fadeTHAAudioVolume(hum, 0, durationMs, () => window.THA.archiveHum === hum && !hum.paused);
    }
    stopTerminalArchiveAmbient();
}

function stopTerminalArchiveAmbient() {
    stopTHATrack(window.THA.archiveHum);
    stopTHALowFrequencyDrone();
}

function getTerminalSounds() {
    if (!window.THA.terminalSounds) {
        window.THA.terminalSounds = {
            // The fan is an unobtrusive machine-room bed under typing.
            fan: createTHAAudio(THA_TERMINAL_FAN_PATH, { loop: true, volume: 0.42 }),
            // The full keyboard recording loops only for the active typewriter phase.
            keyboard: createTHAAudio(THA_TERMINAL_KEYBOARD_PATH, { loop: true, volume: 0.25 }),
            // Never use native looping for the heartbeat; the controller sequences it intentionally.
            heartbeat: createTHAAudio(THA_TERMINAL_HEARTBEAT_PATH, { loop: false, volume: 0.92 })
        };
    }
    return window.THA.terminalSounds;
}

/** Start one track from the beginning. */
async function playTHATrack(audio, restart = true) {
    if (!audio) return false;
    if (restart) rewindTHAAudio(audio);
    try {
        await audio.play();
        return true;
    } catch (error) {
        console.warn("THE HUMAN ARCHIVE audio was blocked or failed:", error);
        return false;
    }
}

/** Fan and keyboard begin together; their loops are stopped at the exact phase boundary. */
async function startTerminalTypingAudio() {
    const sounds = getTerminalSounds();
    sounds.fan.loop = true;
    sounds.keyboard.loop = true;
    const results = await Promise.all([
        playTHATrack(sounds.fan, true),
        playTHATrack(sounds.keyboard, true)
    ]);
    return results.every(Boolean);
}

/** Stop the two typing beds without touching the heartbeat. */
function stopTerminalTypingAudio() {
    const sounds = window.THA.terminalSounds;
    if (!sounds) return;
    stopTHATrack(sounds.fan);
    stopTHATrack(sounds.keyboard);
}

/** Wait until the supplied heartbeat recording ends, while allowing cancellation. */
function playTHAAudioToEnd(audio) {
    return new Promise((resolve) => {
        let settled = false;

        const finish = (playedToEnd) => {
            if (settled) return;
            settled = true;
            audio.removeEventListener("ended", onEnded);
            audio.removeEventListener("error", onError);
            if (thaHeartbeatCancelPending === cancelWait) {
                thaHeartbeatCancelPending = null;
            }
            resolve(playedToEnd);
        };

        const onEnded = () => finish(true);
        const onError = () => finish(false);
        const cancelWait = () => finish(false);

        thaHeartbeatCancelPending = cancelWait;
        audio.addEventListener("ended", onEnded);
        audio.addEventListener("error", onError);

        audio.play().catch((error) => {
            console.warn("Heartbeat audio was blocked or failed:", error);
            finish(false);
        });
    });
}

/**
 * Pair one heartbeat cue with a quiet archive hum, then stop both for silence.
 * The full heartbeat asset is played once; a click can cancel it immediately.
 */
async function startTerminalHeartbeat() {
    stopTerminalTypingAudio();
    stopTerminalHeartbeat();

    const sounds = getTerminalSounds();
    const audio = sounds.heartbeat;
    const thisSequence = thaHeartbeatSequenceId;
    audio.loop = false;

    await startTerminalArchiveAmbient();
    if (thisSequence !== thaHeartbeatSequenceId) {
        stopTerminalArchiveAmbient();
        return false;
    }

    rewindTHAAudio(audio);
    const finished = await playTHAAudioToEnd(audio);
    if (thisSequence !== thaHeartbeatSequenceId) {
        stopTerminalArchiveAmbient();
        return false;
    }

    // Let the ambient bed fade away, then preserve the script's silence.
    await fadeOutTerminalArchiveAmbient(360);
    return finished;
}

/** Cancel a heartbeat replay and stop its current playback immediately. */
function stopTerminalHeartbeat() {
    thaHeartbeatSequenceId += 1;
    if (thaHeartbeatCancelPending) {
        const cancel = thaHeartbeatCancelPending;
        thaHeartbeatCancelPending = null;
        cancel();
    }

    const sounds = window.THA.terminalSounds;
    if (sounds) stopTHATrack(sounds.heartbeat);
}

/** Stop all Terminal audio before white flash, identity or Main Menu navigation. */
function stopTerminalAudio() {
    stopTerminalTypingAudio();
    stopTerminalHeartbeat();
    stopTerminalArchiveAmbient();
}

// ----------------------- RECORDING DEVICE CUE -----------------------

/** Play one short, restrained REC confirmation beep, then leave silence. */
function playTerminalRecCue() {
    const context = getTHAKeyAudioContext();
    if (!context) return false;

    try {
        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.exponentialRampToValueAtTime(660, now + 0.085);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.045, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.125);
        return true;
    } catch (error) {
        console.warn("Recording-device cue could not play:", error);
        return false;
    }
}

// ------------------------ SYNCHRONIZED KEY TICKS ------------------------

/** Lazily build a tiny noise buffer for short key clicks synchronized to typed characters. */
function getTHAKeyAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!thaKeyAudioContext) {
        thaKeyAudioContext = new AudioContextClass();
        const sampleRate = thaKeyAudioContext.sampleRate;
        const buffer = thaKeyAudioContext.createBuffer(1, Math.floor(sampleRate * 0.035), sampleRate);
        const channel = buffer.getChannelData(0);
        for (let index = 0; index < channel.length; index += 1) {
            channel[index] = (Math.random() * 2 - 1) * (1 - index / channel.length);
        }
        thaKeyNoiseBuffer = buffer;
    }

    if (thaKeyAudioContext.state === "suspended") {
        thaKeyAudioContext.resume().catch(() => {});
    }
    return thaKeyAudioContext;
}

/** Fire one subtle synthesized key tick exactly when a visible character is added. */
function playTerminalKeyTick(character) {
    // ASCII-like decorative divider bars should appear as a clean rule, not a flurry of keys.
    if (/[━─—]/u.test(character)) return;

    const context = getTHAKeyAudioContext();
    if (!context || !thaKeyNoiseBuffer) return;

    try {
        const now = context.currentTime;
        const source = context.createBufferSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();

        source.buffer = thaKeyNoiseBuffer;
        filter.type = "highpass";
        filter.frequency.setValueAtTime(character === " " ? 1450 : 1900, now);
        filter.Q.setValueAtTime(0.65, now);

        // Spaces and punctuation are softer; ordinary characters use a quiet tick.
        const peak = character === " " ? 0.026 : /[.,:!?]/u.test(character) ? 0.034 : 0.052;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(context.destination);
        source.start(now);
        source.stop(now + 0.032);
    } catch (error) {
        // If Web Audio is unavailable, the recorded keyboard texture still plays.
    }
}
