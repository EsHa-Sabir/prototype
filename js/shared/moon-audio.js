// =============================================================================
// THE HUMAN ARCHIVE — MOON AUDIO CUES
// Uses the team's supplied files. The Moon itself stays silent between cues:
// no wind, no atmosphere bed, and one electronic ping every four seconds.
// =============================================================================
(() => {
    "use strict";

    // These trackers must exist before createAudio() is called. Keeping them
    // here prevents the previous temporal-dead-zone error that stopped this
    // entire controller before window.THAMoonAudio could be created.
    const audioBaseVolumes = new WeakMap();
    const activeAudio = new Set();
    const activePlaybackTimers = new Map();
    const activeNodes = new Set();

    const scriptURL = document.currentScript?.src || window.location.href;
    const audioDirectory = new URL("../../assets/audio/", scriptURL);
    const audioURL = (filename) => new URL(filename, audioDirectory).href;

    const AUDIO_FILES = Object.freeze({
        ping: "electronic-ping.mp3",
        laserWhirr: "laser-whirr.wav",
        click: "click.mp3",
        piano: "single-piano-note.mp3"
    });

    function createAudio(filename, volume = 0.7) {
        const audio = new Audio(audioURL(filename));
        audio.preload = "auto";
        audio.volume = Math.max(0, Math.min(1, volume));
        audioBaseVolumes.set(audio, audio.volume);
        audio.addEventListener("error", () => {
            console.error("THE HUMAN ARCHIVE: Moon audio asset could not be loaded:", filename, audio.error);
            emitAudioStatus("error", `${filename} could not be loaded`);
        }, { once: true });
        audio.load();
        return audio;
    }

    const pingAudio = createAudio(AUDIO_FILES.ping, 0.38);
    const laserWhirrAudio = createAudio(AUDIO_FILES.laserWhirr, 0.72);
    const clickAudio = createAudio(AUDIO_FILES.click, 0.68);
    const pianoAudio = createAudio(AUDIO_FILES.piano, 0.76);
    const allAudio = [pingAudio, laserWhirrAudio, clickAudio, pianoAudio];

    let mapTimeout = null;
    let mapInterval = null;
    let laserClickTimeout = null;
    let audioUnlocked = false;
    let mapRunId = 0;
    let audioContext = null;

    function emitAudioStatus(status, message = "") {
        window.dispatchEvent(new CustomEvent("tha:moon-audio-status", {
            detail: { status, message, enabled: audioUnlocked }
        }));
    }

    function resetAudioElement(audio, wasMuted) {
        audio.pause();
        try { audio.currentTime = 0; } catch (_) {}
        audio.muted = wasMuted;
    }

    // Call this only from a real user action (the menu click or the visible
    // ENABLE SOUND button). Muted playback primes each supplied file for later
    // scheduled cues without adding any sound to the Moon's silence.
    function primeAudioElement(audio) {
        const wasMuted = audio.muted;
        audio.muted = true;
        let attempt;
        try {
            attempt = audio.play();
        } catch (error) {
            resetAudioElement(audio, wasMuted);
            return Promise.resolve(false);
        }
        if (!attempt || typeof attempt.then !== "function") {
            resetAudioElement(audio, wasMuted);
            return Promise.resolve(true);
        }
        return attempt.then(() => {
            resetAudioElement(audio, wasMuted);
            return true;
        }).catch((error) => {
            resetAudioElement(audio, wasMuted);
            console.info("Moon audio needs a direct user gesture:", error?.name || "playback blocked");
            return false;
        });
    }

    async function enableAudioFromGesture() {
        const results = await Promise.all(allAudio.map(primeAudioElement));
        audioUnlocked = results.every(Boolean);
        emitAudioStatus(audioUnlocked ? "enabled" : "blocked", audioUnlocked
            ? "Moon sound is enabled. One ping will sound every four seconds on the map."
            : "Your browser blocked audio. Tap Enable Sound again or check the device's sound settings.");
        return audioUnlocked;
    }

    function clearPlaybackTimers(audio) {
        const timers = activePlaybackTimers.get(audio) || [];
        timers.forEach((timer) => {
            window.clearTimeout(timer);
            window.clearInterval(timer);
        });
        activePlaybackTimers.delete(audio);
    }

    function cleanupAudio(audio) {
        clearPlaybackTimers(audio);
        activeAudio.delete(audio);
        audio.pause();
        try { audio.currentTime = 0; } catch (_) {}
        audio.volume = audioBaseVolumes.get(audio) ?? 1;
        audio.onended = null;
    }

    function playOneShot(audio, stopAfterMs = null) {
        cleanupAudio(audio);
        audio.volume = audioBaseVolumes.get(audio) ?? audio.volume;
        audio.currentTime = 0;
        activeAudio.add(audio);
        audio.onended = () => cleanupAudio(audio);
        let attempt;
        try {
            attempt = audio.play();
        } catch (error) {
            cleanupAudio(audio);
            emitAudioStatus("blocked", "A sound cue was blocked by the browser.");
            return null;
        }
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch((error) => {
                cleanupAudio(audio);
                console.warn("Moon audio playback was blocked by the browser.", error);
                emitAudioStatus("blocked", "A sound cue was blocked. Use Enable Sound on the Moon map.");
            });
        }

        if (Number.isFinite(stopAfterMs) && stopAfterMs > 0) {
            const fadeMs = Math.min(260, Math.max(120, Math.round(stopAfterMs * 0.22)));
            const timers = [];
            const fadeTimeout = window.setTimeout(() => {
                const startVolume = audio.volume;
                const steps = 10;
                let step = 0;
                const fadeInterval = window.setInterval(() => {
                    step += 1;
                    audio.volume = Math.max(0, startVolume * (1 - step / steps));
                    if (step >= steps) cleanupAudio(audio);
                }, fadeMs / steps);
                timers.push(fadeInterval);
            }, Math.max(0, stopAfterMs - fadeMs));
            timers.push(fadeTimeout);
            activePlaybackTimers.set(audio, timers);
        }
        return audio;
    }

    function playPing() {
        if (!audioUnlocked) {
            emitAudioStatus("blocked", "Tap Enable Sound to hear the four-second Moon signal.");
            return false;
        }
        if (!pingAudio.paused) return false;
        pingAudio.currentTime = 0;
        activeAudio.add(pingAudio);
        const attempt = pingAudio.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch((error) => {
                activeAudio.delete(pingAudio);
                console.warn("Moon electronic ping was blocked by the browser.", error);
                emitAudioStatus("blocked", "The browser blocked the Moon signal. Tap Enable Sound.");
            });
        }
        return true;
    }

    function startMapAtmosphere() {
        stopMapAtmosphere();
        const runId = mapRunId;
        // Attempt a silent prime while the Menu → Moon click is still the
        // initiating action. The visible button below remains the fallback.
        if (!audioUnlocked) {
            Promise.all(allAudio.map(primeAudioElement)).then((results) => {
                if (runId !== mapRunId) return;
                audioUnlocked = results.every(Boolean);
                emitAudioStatus(audioUnlocked ? "enabled" : "blocked", audioUnlocked
                    ? "Moon sound is enabled."
                    : "Tap Enable Sound to hear the signal.");
            });
        }
        // First ping is at 4 seconds; subsequent pings are exactly 4 seconds apart.
        mapTimeout = window.setTimeout(() => {
            if (runId !== mapRunId) return;
            playPing();
            mapInterval = window.setInterval(() => {
                if (runId === mapRunId) playPing();
            }, 4000);
        }, 4000);
    }

    function stopMapAtmosphere() {
        mapRunId += 1;
        if (mapTimeout !== null) window.clearTimeout(mapTimeout);
        if (mapInterval !== null) window.clearInterval(mapInterval);
        mapTimeout = null;
        mapInterval = null;
        pingAudio.pause();
        pingAudio.currentTime = 0;
        activeAudio.delete(pingAudio);
    }

    function playPianoNote(durationMs = 1250) {
        return playOneShot(pianoAudio, durationMs);
    }

    function playSustainedPianoNote() {
        // Let the supplied recording decay naturally for the memorial moment.
        return playOneShot(pianoAudio);
    }

    function playLaserCue(clickDelayMs = 2000) {
        if (laserClickTimeout !== null) window.clearTimeout(laserClickTimeout);
        // Prime the delayed arrival-click while this call is still inside the
        // START SIMULATION button gesture; some browsers block timer-only audio.
        primeAudioElement(clickAudio);
        playOneShot(laserWhirrAudio);
        // A single click marks the red Earth → Moon beam reaching the reflector.
        // The green Moon → Earth return is intentionally silent.
        laserClickTimeout = window.setTimeout(() => {
            laserClickTimeout = null;
            playOneShot(clickAudio);
        }, Math.max(0, clickDelayMs));
    }

    function getAudioContext() {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return null;
        if (!audioContext) audioContext = new Context();
        if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
        return audioContext;
    }

    function playCompletionChord() {
        const ctx = getAudioContext();
        if (!ctx) return;
        const notes = [
            { frequency: 392, volume: 0.025 },
            { frequency: 494, volume: 0.018 },
            { frequency: 587, volume: 0.014 }
        ];
        notes.forEach(({ frequency, volume }) => {
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();
            const start = ctx.currentTime;
            const node = { oscillator, gain };
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(frequency, start);
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.linearRampToValueAtTime(volume, start + 0.035);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.95);
            oscillator.connect(gain);
            gain.connect(ctx.destination);
            activeNodes.add(node);
            oscillator.addEventListener("ended", () => {
                activeNodes.delete(node);
                try { oscillator.disconnect(); } catch (_) {}
                try { gain.disconnect(); } catch (_) {}
            }, { once: true });
            oscillator.start(start);
            oscillator.stop(start + 0.98);
        });
    }

    function stopAll() {
        stopMapAtmosphere();
        if (laserClickTimeout !== null) window.clearTimeout(laserClickTimeout);
        laserClickTimeout = null;
        activeAudio.forEach((audio) => cleanupAudio(audio));
        activeAudio.clear();
        activeNodes.forEach(({ oscillator, gain }) => {
            try { oscillator.stop(); } catch (_) {}
            try { oscillator.disconnect(); } catch (_) {}
            try { gain.disconnect(); } catch (_) {}
        });
        activeNodes.clear();
    }

    window.THAMoonAudio = Object.freeze({
        audioFiles: AUDIO_FILES,
        startMapAtmosphere,
        stopMapAtmosphere,
        enableAudioFromGesture,
        isAudioEnabled: () => audioUnlocked,
        playPing,
        playPianoNote,
        playSustainedPianoNote,
        playCompletionChord,
        playLaserCue,
        stopAll
    });
})();
