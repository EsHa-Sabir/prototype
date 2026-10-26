// =============================================================
// THE HUMAN ARCHIVE — SHARED AUDIO CONTROLLER
//
// Keep all audio creation and playback in this file. Splash and Terminal
// scripts call these shared functions so two Audio objects cannot overlap.
// Load this script ONCE, before splash.js and terminal.js.
//
// Optional assets in assets/audio/:
//   ambient-hum.mp3       Splash ambience; reused quietly in the Terminal
//   fan.mp3               Optional terminal machine-fan bed while text is typed
//
// Character-synchronized key clicks and the REC cue use Web Audio. The heartbeat
// uses a dedicated, rounded double-thump audio asset so it does not sound like beeps.
// No unrequested CRT power-on/off cues are added.
// =============================================================

const THA_AUDIO_DIRECTORY = new URL("../assets/audio/", document.currentScript.src);
const THA_OPENING_AUDIO_PATH = new URL("ambient-hum.mp3", THA_AUDIO_DIRECTORY).href;
const THA_TERMINAL_FAN_PATH = new URL("fan.mp3", THA_AUDIO_DIRECTORY).href;
const THA_HEARTBEAT_CUE_PATH = new URL("heartbeat.mp3", THA_AUDIO_DIRECTORY).href;

window.THA = window.THA || {};
window.THA.openingAudio = null;
window.THA.terminalSounds = null;
window.THA.archiveHum = null;
window.THA.heartbeatCueAudio = null;
window.THA.openingAudioStatus = {
    playing: false,
    attempting: false,
    blocked: false,
    failed: false
};

// Cancel token lets the mission click stop a two-play heartbeat sequence at once.
let thaHeartbeatSequenceId = 0;
let thaHeartbeatCancelPending = null;

// Web Audio provides quiet key ticks synchronized to visible characters, a
// two-part heartbeat cue, and a short recording-device cue.
let thaKeyAudioContext = null;
let thaKeyNoiseBuffer = null;
let thaArchiveDroneNodes = [];
let thaHeartbeatNodes = []; // Only used by the asset-failure audio-buffer fallback.
let thaHeartbeatTimer = null;
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
        { frequency: 52, gain: 0.034 },
        { frequency: 104, gain: 0.012 }
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
            // The fan is an unobtrusive machine-room bed under synchronized key ticks.
            fan: createTHAAudio(THA_TERMINAL_FAN_PATH, { loop: true, volume: 0.30 })
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

/**
 * Create/resume Web Audio immediately from the Splash button's user gesture.
 * Browsers may block later audio starts if the context was first created after
 * a long typewriter sequence, so Terminal calls this synchronously on entry.
 */
function unlockTHAAudioContext() {
    const context = getTHAKeyAudioContext();
    if (context && context.state === "suspended") context.resume().catch(() => {});
    return context;
}

/** Fan + character-synchronised keyboard ticks while text is actually typing. */
async function startTerminalTypingAudio() {
    const sounds = getTerminalSounds();
    sounds.fan.loop = true;
    sounds.fan.volume = 0.30;
    const fanStarted = await playTHATrack(sounds.fan, true);
    // A soft synthetic machine hum is the fallback when assets/audio/fan.mp3
    // is missing or the browser refuses the media file.
    if (!fanStarted) startTHALowFrequencyDrone();
    return fanStarted;
}

/** Stop terminal fan-bed and any fallback drone between scripted sound phases. */
function stopTerminalTypingAudio() {
    const sounds = window.THA.terminalSounds;
    if (sounds) stopTHATrack(sounds.fan);
    stopTHALowFrequencyDrone();
}

/** Get the authored two-thump cue; a single dedicated clip sounds rounder than raw oscillators. */
function getTerminalHeartbeatCue() {
    if (!window.THA.heartbeatCueAudio) {
        window.THA.heartbeatCueAudio = createTHAAudio(THA_HEARTBEAT_CUE_PATH, {
            loop: false,
            volume: 0.96
        });
    }
    return window.THA.heartbeatCueAudio;
}

/**
 * Fallback cue built as a short audio buffer if the WAV asset cannot play.
 * It uses soft, decaying low-mid thumps (not sustained oscillator beeps).
 */
function createTHAHeartbeatFallbackBuffer(context) {
    const duration = 2.25;
    const sampleRate = context.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = context.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);
    const noise = new Float32Array(frameCount);
    let lowA = 0;
    let lowB = 0;
    const alphaA = 1 - Math.exp((-2 * Math.PI * 250) / sampleRate);
    const alphaB = 1 - Math.exp((-2 * Math.PI * 48) / sampleRate);
    for (let i = 0; i < frameCount; i += 1) {
        const raw = Math.random() * 2 - 1;
        lowA += alphaA * (raw - lowA);
        lowB += alphaB * (raw - lowB);
        noise[i] = lowA - lowB;
    }

    const beats = [
        { start: 0.075, length: 0.56, strength: 1.0, f0: 76, f1: 43 },
        { start: 0.615, length: 0.43, strength: 0.78, f0: 88, f1: 48 }
    ];
    let peak = 0;
    for (let i = 0; i < frameCount; i += 1) {
        const time = i / sampleRate;
        let value = 0;
        for (const beat of beats) {
            const local = time - beat.start;
            if (local < 0 || local > beat.length) continue;
            const attack = Math.min(1, local / 0.012);
            const envelope = attack * (0.74 * Math.exp(-local / 0.115) + 0.26 * Math.exp(-local / 0.29));
            const phase = 2 * Math.PI * (beat.f0 * local + ((beat.f1 - beat.f0) * local * local) / (2 * beat.length));
            const body = Math.sin(phase) * 0.68;
            const body2 = Math.sin(2 * Math.PI * (122 * local - (24 * local * local) / beat.length)) * 0.23;
            const transient = noise[i] * Math.exp(-local / 0.053) * 0.22;
            value += (body + body2 + transient) * envelope * beat.strength;
        }
        data[i] = value;
        peak = Math.max(peak, Math.abs(value));
    }
    if (peak > 0) {
        const scale = 0.72 / peak;
        for (let i = 0; i < frameCount; i += 1) data[i] = Math.tanh(data[i] * scale * 1.18) / Math.tanh(1.18);
    }
    return buffer;
}

function playTHAHeartbeatFallback(context, onStart, onEnded) {
    if (!context || context.state !== "running") return false;
    try {
        const source = context.createBufferSource();
        const gain = context.createGain();
        source.buffer = createTHAHeartbeatFallbackBuffer(context);
        gain.gain.setValueAtTime(0.92, context.currentTime);
        source.connect(gain);
        gain.connect(context.destination);
        source.addEventListener("ended", () => {
            thaHeartbeatNodes = thaHeartbeatNodes.filter((node) => node !== source);
            try { source.disconnect(); gain.disconnect(); } catch (_) {}
            onEnded();
        }, { once: true });
        thaHeartbeatNodes.push(source);
        onStart();
        source.start();
        return true;
    } catch (error) {
        console.warn("THE HUMAN ARCHIVE: fallback heartbeat could not be created.", error);
        return false;
    }
}

/** Play one complete “lub-dub”, with the button's first pulse starting at audio onset. */
function playTHASyncedHeartbeat(onStart = () => {}) {
    return new Promise((resolve) => {
        let settled = false;
        let started = false;
        let usingFallback = false;
        const heartbeatAudio = getTerminalHeartbeatCue();
        const context = unlockTHAAudioContext();

        const cleanupListeners = () => {
            heartbeatAudio.removeEventListener("ended", onAudioEnded);
        };
        const finish = (played) => {
            if (settled) return;
            settled = true;
            cleanupListeners();
            if (thaHeartbeatTimer !== null) {
                window.clearTimeout(thaHeartbeatTimer);
                thaHeartbeatTimer = null;
            }
            if (thaHeartbeatCancelPending === cancel) thaHeartbeatCancelPending = null;
            resolve(played);
        };
        const onAudioEnded = () => finish(true);
        const cancel = () => {
            stopTHATrack(heartbeatAudio);
            for (const source of thaHeartbeatNodes) {
                try { source.stop(); } catch (_) {}
                try { source.disconnect(); } catch (_) {}
            }
            thaHeartbeatNodes = [];
            finish(false);
        };
        const markStarted = () => {
            if (settled || started) return;
            started = true;
            onStart();
            // Safety timeout for browsers that fail to fire `ended` reliably.
            thaHeartbeatTimer = window.setTimeout(() => finish(true), 2600);
        };
        const useFallback = () => {
            if (settled || usingFallback) return;
            usingFallback = true;
            stopTHATrack(heartbeatAudio);
            const startedFallback = playTHAHeartbeatFallback(context, markStarted, () => finish(true));
            if (!startedFallback) {
                // Keep the requested CTA animation and let the hum fade gracefully
                // if this browser blocks both media playback and Web Audio.
                markStarted();
                if (thaHeartbeatTimer !== null) window.clearTimeout(thaHeartbeatTimer);
                thaHeartbeatTimer = window.setTimeout(() => finish(false), 2250);
            }
        };

        thaHeartbeatCancelPending = cancel;
        heartbeatAudio.loop = false;
        heartbeatAudio.volume = 0.96;
        heartbeatAudio.addEventListener("ended", onAudioEnded, { once: true });

        const startPlayback = async () => {
            if (settled) return;
            try {
                rewindTHAAudio(heartbeatAudio);
                await heartbeatAudio.play();
                if (settled) {
                    stopTHATrack(heartbeatAudio);
                    return;
                }
                markStarted();
            } catch (error) {
                console.warn("Dedicated heartbeat asset could not play; using the soft synthesized fallback.", error);
                useFallback();
            }
        };

        if (context && context.state === "suspended") {
            context.resume().then(startPlayback).catch(startPlayback);
        } else {
            void startPlayback();
        }
    });
}

/** Hum begins with the mission prompt; one double-beat follows, then both fade to silence. */
async function startTerminalHeartbeat(onStart = () => {}) {
    stopTerminalTypingAudio();
    stopTerminalHeartbeat();

    const thisSequence = thaHeartbeatSequenceId;
    await startTerminalArchiveAmbient();
    if (thisSequence !== thaHeartbeatSequenceId) {
        stopTerminalArchiveAmbient();
        return false;
    }

    const finished = await playTHASyncedHeartbeat(() => {
        if (thisSequence === thaHeartbeatSequenceId) onStart();
    });
    if (thisSequence !== thaHeartbeatSequenceId) {
        stopTerminalArchiveAmbient();
        return false;
    }

    const button = document.getElementById("acceptMission");
    if (button) button.classList.remove("is-heartbeat-playing");

    // AUDIO AND VISUALS ARE SEPARATE STATES:
    // The sound controller plays one double-beat, then fades the hum to silence.
    // It removes only the temporary beat-synchronized animation class. The
    // independent `is-mission-ready` class keeps a soft visual glow pulsing until
    // the user clicks ACCEPT THE MISSION.
    await fadeOutTerminalArchiveAmbient(680);
    return finished;
}

/** Cancel heartbeat and clear CTA animation immediately on acceptance or navigation. */
function stopTerminalHeartbeat() {
    thaHeartbeatSequenceId += 1;
    stopTHATrack(window.THA.heartbeatCueAudio);
    if (thaHeartbeatCancelPending) {
        const cancel = thaHeartbeatCancelPending;
        thaHeartbeatCancelPending = null;
        cancel();
    }
    if (thaHeartbeatTimer !== null) {
        window.clearTimeout(thaHeartbeatTimer);
        thaHeartbeatTimer = null;
    }
    const context = thaKeyAudioContext;
    const now = context ? context.currentTime : 0;
    for (const oscillator of thaHeartbeatNodes) {
        try { oscillator.stop(now); } catch (_) {}
        try { oscillator.disconnect(); } catch (_) {}
    }
    thaHeartbeatNodes = [];
    const button = document.getElementById("acceptMission");
    if (button) button.classList.remove("is-heartbeat-playing", "is-heartbeat-complete", "is-mission-ready");
}

/** Stop every Terminal sound before white flash / identity assignment / navigation. */
function stopTerminalAudio() {
    stopTerminalTypingAudio();
    stopTerminalHeartbeat();
    stopTerminalArchiveAmbient();
}

// ----------------------- RECORDING DEVICE CUE -----------------------

/** A physical record-button click and a short, old-device confirmation tone, then silence. */
function playTerminalRecCue() {
    const context = getTHAKeyAudioContext();
    if (!context) return false;

    try {
        const now = context.currentTime;

        // Two short filtered noise clicks create a restrained mechanical REC press.
        const clickTimes = [now, now + 0.055];
        for (const [index, when] of clickTimes.entries()) {
            if (!thaKeyNoiseBuffer) break;
            const source = context.createBufferSource();
            const filter = context.createBiquadFilter();
            const gain = context.createGain();
            source.buffer = thaKeyNoiseBuffer;
            filter.type = "bandpass";
            filter.frequency.setValueAtTime(index === 0 ? 1150 : 1850, when);
            filter.Q.setValueAtTime(0.8, when);
            gain.gain.setValueAtTime(0.0001, when);
            gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.07 : 0.035, when + 0.003);
            gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.045);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(context.destination);
            source.start(when);
            source.stop(when + 0.05);
        }

        const beep = context.createOscillator();
        const beepGain = context.createGain();
        const beepStart = now + 0.065;
        beep.type = "sine";
        beep.frequency.setValueAtTime(920, beepStart);
        beep.frequency.exponentialRampToValueAtTime(640, beepStart + 0.14);
        beepGain.gain.setValueAtTime(0.0001, beepStart);
        beepGain.gain.exponentialRampToValueAtTime(0.045, beepStart + 0.009);
        beepGain.gain.exponentialRampToValueAtTime(0.0001, beepStart + 0.19);
        beep.connect(beepGain);
        beepGain.connect(context.destination);
        beep.start(beepStart);
        beep.stop(beepStart + 0.20);
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
        // If Web Audio is unavailable, leave the quiet fan ambience rather than
        // starting an unsynchronized keyboard loop.
    }
}
