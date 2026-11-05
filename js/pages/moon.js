/* ============================================================================
   THE HUMAN ARCHIVE — CHAPTER 2: THE MOON
   Three document-led records, built with reusable Template A and Template C.
   Apollo 11 (A) -> Laser Retroreflectors (A) -> Fallen Astronaut (C).
   ============================================================================ */
(() => {
  "use strict";

  const AUDIO = Object.freeze({
    ping: "assets/audio/electronic-ping.mp3",
    piano: "assets/audio/single-piano-note.wav",
    laser: "assets/audio/laser-whirr.wav",
    click: "assets/audio/click.mp3"
  });
  const IMAGE = Object.freeze({
    apolloLro: "assets/images/apollo-11-landing-site.png",
    apolloMission: "assets/images/apollo-11-as11-40-5927.png",
    retroreflector: "assets/images/lunar-laser-retroreflector-array.png",
    fallenAstronaut: "assets/images/fallen-astronaut-figure-plaque.png"
  });
  const SOURCE = Object.freeze({
    apollo: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
    apolloLroImage: "https://science.nasa.gov/resource/apollo-11-landing-site/",
    apolloMissionImage: "https://images.nasa.gov/details/as11-40-5927",
    retroreflectorImage: "https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/#carousel-dffc9761-6e04-4b75-bced-fc071407341c-2",
    retroreflectorLpi: "https://www.lpi.usra.edu/resources/apollo/frame/?AS11-40-5952",
    retroreflectorData: "https://science.nasa.gov/centers-and-facilities/goddard/nasa-laser-reflecting-instrument-makes-gps-satellite-more-accurate/",
    fallenImage: "https://images.nasa.gov/details/as15-88-11894",
    fallenData: "https://science.nasa.gov/resource/memorial-to-fallen-astronauts-on-the-moon/"
  });

  const PING_INTERVAL_MS = 4000;
  const CAMERA_ZOOM_MS = 2000;
  const PIANO_FALLBACK_MS = 7600; // the supplied single-piano-note.wav is about 7 seconds
  const PROGRESS_KEY = "thaProgress";
  const LEGACY_APOLLO_KEY = "thaApollo11Recovered";
  const RECORD_IDS = ["apollo-11", "laser-retroreflectors", "fallen-astronaut"];

  let activeRoot = null;
  let pingAudio = null;
  let pianoAudio = null;
  let laserAudio = null;
  let clickAudio = null;
  let pingTimer = null;
  let sceneTimers = new Set();
  let audioSession = 0;
  let activePianoCancel = null;
  let completionAudioContext = null;

  const isMuted = () => window.THA?.audioMuted === true;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function button(label, className, onClick) {
    const node = el("button", className, label);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  }

  function externalLink(label, url, className = "tha-moon-source-link") {
    const link = el("a", className, label);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function later(callback, delay) {
    const timer = window.setTimeout(() => {
      sceneTimers.delete(timer);
      callback();
    }, delay);
    sceneTimers.add(timer);
    return timer;
  }

  function clearSceneTimers() {
    sceneTimers.forEach((timer) => window.clearTimeout(timer));
    sceneTimers.clear();
  }

  function makeAudio(path, volume) {
    try {
      const base = document.baseURI || window.location.href;
      const track = new Audio(new URL(path, base).href);
      track.preload = "auto";
      track.volume = volume;
      track.addEventListener("error", () => {
        console.info("THE HUMAN ARCHIVE: optional audio asset is not available:", path);
      }, { once: true });
      return track;
    } catch (error) {
      // Missing/invalid optional audio must never interrupt a record mechanic.
      console.info("THE HUMAN ARCHIVE: audio could not be initialized:", path, error);
      return null;
    }
  }

  function playTrack(track) {
    if (!track || isMuted()) return Promise.resolve(false);
    try {
      track.currentTime = 0;
      const result = track.play();
      return result && typeof result.then === "function"
        ? result.then(() => true).catch(() => false)
        : Promise.resolve(true);
    } catch (_) {
      return Promise.resolve(false);
    }
  }

  function stopTrack(track) {
    if (!track) return;
    track.pause();
    try { track.currentTime = 0; } catch (_) { /* optional media */ }
  }

  function stopPings() {
    audioSession += 1;
    if (pingTimer) window.clearInterval(pingTimer);
    pingTimer = null;
    stopTrack(pingAudio);
  }

  function startMoonPings({ immediate = true } = {}) {
    if (isMuted() || !activeRoot?.isConnected) return;
    stopPings();
    const session = ++audioSession;
    pingAudio = pingAudio || makeAudio(AUDIO.ping, 0.34);
    const tick = () => {
      if (session !== audioSession || isMuted() || !activeRoot?.isConnected) return;
      playTrack(pingAudio);
    };
    if (immediate) tick();
    // The Moon's electronic ping is the chapter-wide sound bed: it continues
    // across the map and record screens, pausing only for the scripted cues.
    pingTimer = window.setInterval(tick, PING_INTERVAL_MS);
  }

  function primeCompletionAudioContext() {
    if (isMuted()) return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    try {
      if (!completionAudioContext) completionAudioContext = new AudioContextClass();
      if (completionAudioContext.state === "suspended") {
        // Called directly from the student's choice click to unlock Web Audio.
        completionAudioContext.resume().catch(() => {});
      }
      return completionAudioContext;
    } catch (_) {
      return null;
    }
  }

  function playCompletionChord() {
    const context = primeCompletionAudioContext();
    if (!context || isMuted()) return Promise.resolve(false);
    try {
      const now = context.currentTime;
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.035, now + 0.055);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
      master.connect(context.destination);
      // A gentle, original three-note completion chord. This is team sound
      // design (not a NASA recording), used because no chord asset was supplied.
      [261.63, 329.63, 392.00].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const voice = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, now);
        voice.gain.setValueAtTime(index === 0 ? 0.42 : 0.30, now);
        oscillator.connect(voice);
        voice.connect(master);
        oscillator.start(now);
        oscillator.stop(now + 0.74);
      });
      return new Promise((resolve) => window.setTimeout(() => resolve(true), 820));
    } catch (error) {
      console.info("THE HUMAN ARCHIVE: completion chord is unavailable in this browser.", error);
      return Promise.resolve(false);
    }
  }

  function primePianoPlaybackFromGesture() {
    // The Laser simulation and Fallen choice cues occur several seconds after
    // the tap. Prime the same media element silently during that tap so the
    // later scripted play() is not rejected as browser autoplay.
    if (isMuted()) return;
    pianoAudio = pianoAudio || makeAudio(AUDIO.piano, 0.62);
    if (!pianoAudio) return;
    const originalVolume = pianoAudio.volume;
    pianoAudio.volume = 0;
    try {
      const attempt = pianoAudio.play();
      const restore = () => {
        stopTrack(pianoAudio);
        pianoAudio.volume = originalVolume;
      };
      if (attempt && typeof attempt.then === "function") attempt.then(restore).catch(() => { pianoAudio.volume = originalVolume; });
      else window.setTimeout(restore, 80);
    } catch (_) {
      pianoAudio.volume = originalVolume;
    }
  }

  function playPianoNote({ durationMs = null, resumePings = true, onComplete = null } = {}) {
    // Honour the shared mute preference; do not block the story if muted.
    if (isMuted()) {
      stopPings();
      onComplete?.(false);
      return Promise.resolve(false);
    }
    // Make a deliberate quiet gap before the piano cue, then resume the
    // four-second Moon ping cycle after the scripted note duration finishes.
    stopPings();
    pianoAudio = pianoAudio || makeAudio(AUDIO.piano, 0.62);
    if (!pianoAudio) {
      if (resumePings && readProgress() < 3) startMoonPings({ immediate: false });
      onComplete?.(false);
      return Promise.resolve(false);
    }

    stopTrack(pianoAudio);
    pianoAudio.loop = false;
    return new Promise((resolve) => {
      let settled = false;
      let fallbackTimer = null;
      const cleanup = () => {
        pianoAudio.removeEventListener("ended", handleEnded);
        pianoAudio.removeEventListener("error", handleError);
        if (fallbackTimer) window.clearTimeout(fallbackTimer);
        if (activePianoCancel === cancelPlayback) activePianoCancel = null;
      };
      const finish = (played, cancelled = false) => {
        if (settled) return;
        settled = true;
        cleanup();
        if (!cancelled) {
          if (resumePings && readProgress() < 3 && activeRoot?.isConnected) {
            startMoonPings({ immediate: false });
          }
          onComplete?.(played);
        }
        resolve(played);
      };
      const handleEnded = () => finish(true, false);
      const handleError = () => finish(false, false);
      const cancelPlayback = () => finish(false, true);
      activePianoCancel = cancelPlayback;
      pianoAudio.addEventListener("ended", handleEnded, { once: true });
      pianoAudio.addEventListener("error", handleError, { once: true });

      const knownDuration = Number.isFinite(pianoAudio.duration) && pianoAudio.duration > 0
        ? Math.ceil(pianoAudio.duration * 1000 + 300)
        : PIANO_FALLBACK_MS;
      const cueDuration = Number.isFinite(durationMs) && durationMs > 0
        ? Math.min(durationMs, knownDuration)
        : knownDuration;
      fallbackTimer = window.setTimeout(() => {
        if (Number.isFinite(durationMs) && durationMs > 0) stopTrack(pianoAudio);
        finish(true, false);
      }, cueDuration);
      try {
        const playPromise = pianoAudio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => finish(false, false));
        }
      } catch (_) {
        finish(false, false);
      }
    });
  }

  function stopAllMoonAudio() {
    clearSceneTimers();
    if (activePianoCancel) activePianoCancel();
    stopPings();
    stopTrack(pianoAudio);
    stopTrack(laserAudio);
    stopTrack(clickAudio);
  }

  window.THAMoonAudio = { stopAll: stopAllMoonAudio };

  function getRecord(id) {
    const db = window.THA?.records;
    if (typeof db?.getRecord === "function") return db.getRecord(id);
    return (db?.all || window.THA_RECORDS || []).find((record) => record.id === id) || null;
  }

  function getMoonRecord(progress) {
    return getRecord(RECORD_IDS[Math.min(2, Math.max(0, progress))]);
  }

  function readProgress() {
    try {
      const apiProgress = window.THA?.readProgress?.();
      if (Number.isFinite(Number(apiProgress?.moon))) return Math.max(0, Math.min(3, Number(apiProgress.moon)));
      const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}");
      if (Number.isFinite(Number(saved.moon))) return Math.max(0, Math.min(3, Number(saved.moon)));
      if (window.localStorage.getItem(LEGACY_APOLLO_KEY) === "true") return 1;
    } catch (_) { /* storage may be disabled */ }
    return 0;
  }

  function markProgress(completedCount) {
    const next = Math.max(readProgress(), Math.min(3, completedCount));
    try {
      const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}");
      saved.moon = next;
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(saved));
      if (next >= 1) window.localStorage.setItem(LEGACY_APOLLO_KEY, "true");
    } catch (_) { /* persistence is optional */ }
    window.THA?.setProgress?.("moon", next);
    return next;
  }

  function makeHeader() {
    const header = el("header", "tha-moon-header");
    const brand = el("div", "tha-moon-brand");
    const mark = el("span", "tha-moon-brand-mark", "THA");
    const copy = el("div", "tha-moon-brand-copy");
    copy.append(el("strong", "", "THE HUMAN ARCHIVE"), el("small", "", "FIELD RECOVERY // 2126"));
    brand.append(mark, copy);
    const right = el("div", "tha-moon-header-right");
    const status = el("span", "tha-moon-live");
    status.append(el("i"), document.createTextNode("ARCHIVE LINK ACTIVE"));
    const identity = el("div", "tha-moon-identity-slot");
    identity.id = "thaMenuIdentitySlot";
    right.append(status, identity);
    header.append(brand, right);
    return header;
  }

  function makeFooter() {
    const footer = el("footer", "tha-moon-footer");
    footer.setAttribute("aria-label", "Space archaeologist navigation");
    const fieldLabel = el("span", "tha-field-label");
    fieldLabel.append(
      el("i", "tha-field-dot"),
      el("span", "tha-field-role", "SPACE ARCHAEOLOGIST"),
      el("b", "tha-field-mode", "FIELD MODE")
    );
    const backButton = button("", "tha-back-button", () => {
      stopAllMoonAudio();
      window.THANavigation?.goTo("menu");
    });
    backButton.setAttribute("aria-label", "Return to Archive Menu");
    backButton.append(el("span", "tha-back-arrow", "←"), el("span", "tha-back-label", "ARCHIVE MENU"));
    footer.append(fieldLabel, backButton);
    return footer;
  }

  function setHUD(root, status, count = readProgress()) {
    const statusNode = root?.querySelector(".tha-moon-status");
    const countNode = root?.querySelector(".tha-moon-progress-value");
    if (statusNode) statusNode.textContent = status;
    if (countNode) countNode.textContent = `${count} / 3`;
  }

  function makeShell({ subtitle = "Apollo 11 landed here in 1969. What stayed behind?", status, progress } = {}) {
    const root = el("main", "tha-moon-screen");
    activeRoot = root;
    root.innerHTML = '<div class="tha-moon-stars" aria-hidden="true"></div><div class="tha-moon-grain" aria-hidden="true"></div>';
    root.append(makeHeader());

    const content = el("div", "tha-moon-content");
    const heading = el("section", "tha-moon-heading");
    heading.append(
      el("p", "tha-moon-eyebrow", "CHAPTER 02 // THE MOON"),
      el("h1", "", "THE MOON"),
      el("p", "tha-moon-subtitle", subtitle)
    );
    const hud = el("div", "tha-moon-hud");
    hud.append(
      el("span", "tha-moon-status", status || "SIGNAL DETECTED // OBJECT UNKNOWN"),
      (() => {
        const item = el("span", "tha-moon-progress");
        item.append(document.createTextNode("MOON ARCHIVE "), el("strong", "tha-moon-progress-value", `${progress ?? readProgress()} / 3`));
        return item;
      })()
    );
    const stage = el("div", "tha-moon-stage");
    const caption = el("p", "tha-moon-map-caption", "Three traces are waiting in the lunar archive.");
    content.append(heading, hud, stage, caption);
    root.append(content, makeFooter());
    return { root, content, heading, stage, caption };
  }

  function subtitleFor(record) {
    if (record?.id === "laser-retroreflectors") return "Apollo crews left mirrors that still help measure lunar distance.";
    if (record?.id === "fallen-astronaut") return "An 8.5 cm figure remembers 14 astronauts and cosmonauts.";
    if (record?.id === "apollo-11") return "Apollo 11's descent stage stayed at Mare Tranquillitatis.";
    return "Three lunar traces. Three different stories of exploration.";
  }

  function setChapterSubtitle(root, record) {
    const subtitle = root?.querySelector(".tha-moon-subtitle");
    if (subtitle) subtitle.textContent = subtitleFor(record);
  }

  function mapCaptionFor(record) {
    if (record?.id === "laser-retroreflectors") return "AN UNEXPECTED ANSWER // Tiny mirrors still return light to Earth.";
    if (record?.id === "fallen-astronaut") return "A DECISION // A memorial at Hadley Rille, Apollo 15 site.";
    return "THE FIRST LIGHT // The Apollo 11 descent stage remains at this site.";
  }

  function showMapForNextRecord(root, stage, completedCount) {
    if (!root?.isConnected || !stage?.isConnected) return;
    const nextRecord = getMoonRecord(completedCount);
    if (!nextRecord) {
      showMoonCompletion(root, stage);
      return;
    }
    stage.classList.remove("is-record-view");
    stage.replaceChildren(window.THATemplates.TemplateA.createMapPanel({
      record: nextRecord,
      onTrace: (frame) => openActiveRecord(root, frame, nextRecord)
    }));
    root.querySelector(".tha-moon-map-caption").textContent = mapCaptionFor(nextRecord);
    setChapterSubtitle(root, nextRecord);
    const status = nextRecord.number === 1
      ? "SIGNAL DETECTED // OBJECT UNKNOWN"
      : `SIGNAL ${String(nextRecord.number).padStart(2, "0")} DETECTED // ${nextRecord.objectType.toUpperCase()}`;
    setHUD(root, status, completedCount);
    startMoonPings();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  function makeDataRows(record) {
    const rows = el("div", "tha-data-rows");
    (record?.nasaData?.fields || []).forEach((field) => {
      const row = el("div", "tha-data-row");
      row.append(el("span", "", field.label), el("strong", "", field.value));
      rows.append(row);
    });
    return rows;
  }

  function makeNASADataCard(record) {
    const card = el("section", "tha-nasa-data");
    card.append(
      el("div", "tha-data-label", "NASA DATA // VERIFIED RECORD"),
      makeDataRows(record),
      el("p", "tha-nasa-source-name", `SOURCE: ${record?.nasaData?.sourceName || record?.nasaData?.sourceOrganization || "NASA"}`),
      externalLink("VIEW OFFICIAL NASA SOURCE ↗", record?.nasaData?.source || "https://www.nasa.gov/", "tha-moon-source-link")
    );
    return card;
  }

  function makeStoryCard(record) {
    const card = el("section", "tha-story-card");
    card.append(
      el("span", "tha-story-label", "THE STORY // 2126 ARCHIVE"),
      el("p", "tha-story-lead", record?.storyLead || "A trace of exploration remained on the Moon."),
      el("p", "tha-story-context", record?.story || "")
    );
    return card;
  }

  function makeImageEvidence({ src, alt, credit, link, linkLabel }) {
    const figure = el("figure", "tha-evidence-figure");
    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    image.loading = "lazy";
    image.decoding = "async";
    const caption = el("figcaption", "tha-image-credit");
    caption.append(el("span", "", credit), document.createTextNode(" · "), externalLink(linkLabel || "OFFICIAL IMAGE ↗", link, "tha-image-source"));
    figure.append(image, caption);
    return figure;
  }

  function makeRecordIntro(kicker, title, subtitle) {
    const intro = el("div", "tha-record-intro");
    intro.append(
      el("p", "tha-moon-eyebrow", kicker),
      el("h1", "", title),
      el("p", "tha-moon-subtitle", subtitle)
    );
    return intro;
  }

  function makeApolloDiagram() {
    const figure = el("figure", "tha-stage-diagram");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 560 190");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Simplified Apollo Lunar Module: ascent stage departed; descent stage remains on the Moon");
    svg.innerHTML = `
      <defs><linearGradient id="thaMetal" x1="0" x2="1"><stop offset="0" stop-color="#6e7777"/><stop offset=".52" stop-color="#d2c7a5"/><stop offset="1" stop-color="#657071"/></linearGradient></defs>
      <path d="M24 151 H536" stroke="#87938c" stroke-width="1" stroke-dasharray="4 6" />
      <path d="M112 148 L137 102 L165 148 M395 148 L422 102 L450 148" fill="none" stroke="#9b9d91" stroke-width="4" />
      <path d="M122 106 H442 L426 138 H139 Z" fill="url(#thaMetal)" stroke="#e0d6ba" stroke-width="1.5" />
      <path d="M173 102 L195 71 H370 L393 102 Z" fill="#8c9690" stroke="#e0d6ba" stroke-width="1.5" />
      <path d="M223 70 L247 34 H315 L339 70 Z" fill="#d0bd8f" stroke="#f0dfb7" stroke-width="1.5" />
      <path d="M255 34 V20 H307 V34" fill="#9aa49c" stroke="#e0d6ba" />
      <path d="M281 15 C303 1 329 1 349 12" stroke="#b3e9c0" stroke-width="1.5" fill="none" stroke-dasharray="4 4" />
      <path d="M342 6 L351 12 L339 15" stroke="#b3e9c0" fill="none" stroke-width="1.5" />
      <text x="28" y="175" fill="#b8c6bd" font-size="10">DESCENT STAGE — LEFT ON THE MOON</text>
      <text x="347" y="28" fill="#b8e9c2" font-size="10">ASCENT STAGE — RETURNED TO ORBIT</text>`;
    figure.append(svg, el("figcaption", "tha-diagram-caption", "Simplified explanatory drawing — not to scale."));
    return figure;
  }

  function makeApolloRecord(record, root) {
    const section = el("section", "tha-apollo-record tha-template-a-record");
    section.setAttribute("aria-label", "Apollo 11 Lunar Module descent stage record");
    const status = el("div", "tha-object-status");
    status.append(el("span", "tha-status-dot"), el("span", "", "OBJECT DETECTED"), el("strong", "", "UNIDENTIFIED"));

    const visual = el("div", "tha-apollo-visual");
    const silhouette = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    silhouette.setAttribute("viewBox", "0 0 680 300");
    silhouette.setAttribute("role", "img");
    silhouette.setAttribute("aria-label", "Unidentified dusty silhouette of a lunar landing structure");
    silhouette.innerHTML = `
      <defs><filter id="thaSilhouetteBlur"><feGaussianBlur stdDeviation="2.2"/></filter><linearGradient id="thaSilhouetteMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b5b7ac"/><stop offset="1" stop-color="#535c5b"/></linearGradient></defs>
      <path d="M0 244 Q135 220 255 245T680 238V300H0Z" fill="#20292a"/>
      <g opacity=".28" fill="#c9c9bb"><circle cx="80" cy="260" r="2"/><circle cx="145" cy="252" r="3"/><circle cx="552" cy="260" r="2"/><circle cx="608" cy="248" r="3"/></g>
      <g filter="url(#thaSilhouetteBlur)" opacity=".78" stroke="#c8c9bd" stroke-width="3" fill="url(#thaSilhouetteMetal)">
        <path d="M220 220L260 142H420L460 220Z"/><path d="M267 142L293 105H387L413 142Z"/>
        <path d="M306 104L327 66H353L374 104Z"/><path d="M322 66V48H358V66Z"/>
        <path d="M228 210L175 252M452 210L505 250M260 220L236 270M420 220L444 270" fill="none" stroke-width="7"/>
        <path d="M250 220H430" fill="none" stroke="#cdbb91" stroke-width="8"/>
      </g>
      <path d="M70 230H610" stroke="#a5aba2" stroke-dasharray="5 10" opacity=".32"/>
      <text x="340" y="284" fill="#aebbb1" text-anchor="middle" font-size="12" letter-spacing="4">UNIDENTIFIED STRUCTURE</text>`;
    visual.append(silhouette, el("span", "tha-visual-reticle", "ARCHIVE RENDER // 01"));

    const clueFlow = window.THATemplates.TemplateA.createClueSequence({
      record,
      imagePaths: { lro: IMAGE.apolloLro, eva: IMAGE.apolloMission },
      official: { lro: SOURCE.apolloLroImage, eva: SOURCE.apolloMissionImage },
      onComplete: () => revealApolloIdentity(answer, record, root)
    });
    const answer = el("section", "tha-apollo-answer");
    answer.hidden = true;
    answer.setAttribute("aria-label", "Apollo 11 identification and verified NASA record");

    section.append(
      status,
      (() => { const figure = el("figure", "tha-apollo-hero-figure"); figure.append(visual, el("figcaption", "tha-diagram-caption", "A reconstructed silhouette. The mission photograph is one of the clues below.")); return figure; })(),
      (() => {
        const intro = makeRecordIntro("RECOVERY FILE // 001", "A FOOTPRINT THAT NEVER LEFT", "A lunar trace. Four clues. What stayed behind?");
        const title = intro.querySelector("h1");
        title.classList.add("tha-apollo-record-title");
        title.replaceChildren(
          el("span", "tha-apollo-title-line", "A FOOTPRINT"),
          el("span", "tha-apollo-title-line tha-apollo-title-line-accent", "THAT NEVER LEFT")
        );
        return intro;
      })(),
      clueFlow.element,
      answer
    );
    return section;
  }

  function revealApolloIdentity(container, record, root) {
    if (!container || container.dataset.revealed === "true") return;
    container.dataset.revealed = "true";
    container.hidden = false;
    container.classList.add("is-visible");
    const header = el("div", "tha-identification-header");
    header.append(
      el("span", "tha-identification-kicker", "OBJECT IDENTIFIED // TRACE 01"),
      el("h2", "", "APOLLO 11 LUNAR MODULE"),
      el("p", "tha-identified-subtitle", "DESCENT STAGE")
    );
    const why = el("section", "tha-why-card");
    why.append(
      el("span", "tha-story-label", "WHY DID IT STAY?"),
      makeApolloDiagram(),
      el("p", "", "The descent stage could not return to Earth. It remained on the Moon as the launch platform while the ascent stage carried the astronauts back toward lunar orbit.")
    );
    const actions = el("div", "tha-record-actions");
    actions.hidden = true;
    actions.append(button("RETURN TO MOON MAP // TRACE 02 →", "tha-next-button", () => {
      const count = markProgress(1);
      showMapForNextRecord(root, root.querySelector(".tha-moon-stage"), count);
    }));
    container.append(header, makeNASADataCard(record), makeStoryCard(record), why, actions);
    markProgress(1);
    // Apollo's script calls for a brief piano note, not the full sustained file.
    playPianoNote({ durationMs: 1600, resumePings: true, onComplete: () => { actions.hidden = false; } });
    setHUD(root, "OBJECT IDENTIFIED // APOLLO 11 DESCENT STAGE", 1);
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function makeLaserBeamSimulation(record, root) {
    const wrap = el("section", "tha-laser-simulation");
    const top = el("div", "tha-section-heading");
    top.append(el("span", "", "LASER RANGING SIMULATION"), el("small", "", "4 SECONDS TOTAL"));
    const view = el("div", "tha-laser-visual");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 760 230");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Animated red laser travels from Earth to the Moon and a green return beam travels back");
    svg.innerHTML = `
      <defs>
        <radialGradient id="thaEarthGlow"><stop offset="0" stop-color="#70b8df"/><stop offset="1" stop-color="#1d5068"/></radialGradient>
        <radialGradient id="thaMoonGlow"><stop offset="0" stop-color="#d8d9cd"/><stop offset="1" stop-color="#6c7775"/></radialGradient>
        <filter id="thaLaserGlow"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <path d="M120 112H640" stroke="#879993" stroke-width="2" stroke-dasharray="4 10" opacity=".32"/>
      <circle cx="92" cy="112" r="39" fill="url(#thaEarthGlow)" stroke="#a5d5e8" stroke-width="2"/>
      <path d="M66 105Q93 81 119 105T119 132Q91 151 66 125Z" fill="#5f9972" opacity=".8"/>
      <circle cx="668" cy="112" r="35" fill="url(#thaMoonGlow)" stroke="#e7e9db" stroke-width="2"/>
      <ellipse cx="657" cy="100" rx="8" ry="5" fill="#7b8580" opacity=".6"/><ellipse cx="681" cy="122" rx="6" ry="4" fill="#7b8580" opacity=".5"/>
      <path class="tha-laser-beam tha-laser-outbound-glow" d="M138 102H625"/>
      <path class="tha-laser-beam tha-laser-outbound" d="M138 102H625"/>
      <path class="tha-laser-beam tha-laser-return-glow" d="M625 122H138"/>
      <path class="tha-laser-beam tha-laser-return" d="M625 122H138"/>
      <text x="92" y="177" fill="#bcd7e4" text-anchor="middle" font-size="13" letter-spacing="2">EARTH</text>
      <text x="668" y="177" fill="#e0e2d7" text-anchor="middle" font-size="13" letter-spacing="2">MOON</text>
      <text x="380" y="70" fill="#e8a0a0" text-anchor="middle" font-size="11" letter-spacing="2" class="tha-beam-label-out">OUTBOUND // RED</text>
      <text x="380" y="151" fill="#b9f2c3" text-anchor="middle" font-size="11" letter-spacing="2" class="tha-beam-label-return">RETURN // GREEN</text>`;
    view.append(svg);
    const status = el("p", "tha-laser-status", "READY // START THE SIMULATION TO TRACE THE SIGNAL.");
    const start = button("▶ START SIMULATION", "tha-next-button tha-laser-start", () => {
      if (start.disabled) return;
      start.disabled = true;
      start.textContent = "SIMULATION RUNNING…";
      primePianoPlaybackFromGesture();
      stopPings();
      view.classList.remove("is-complete");
      view.classList.add("is-running");
      status.textContent = "OUTBOUND BEAM // EARTH → MOON";
      laserAudio = laserAudio || makeAudio(AUDIO.laser, 0.72);
      clickAudio = clickAudio || makeAudio(AUDIO.click, 0.72);
      playTrack(laserAudio);
      const outboundDuration = record?.interaction?.outbound?.durationMs || 2000;
      const returnDuration = record?.interaction?.return?.durationMs || 2000;
      later(() => {
        status.textContent = "REFLECTED // RETURN BEAM → EARTH";
        playTrack(clickAudio);
      }, outboundDuration);
      later(() => {
        view.classList.remove("is-running");
        view.classList.add("is-complete");
        status.textContent = "SIGNAL RETURNED // SIMULATION COMPLETE";
        start.textContent = "SIMULATION COMPLETE ✓";
        try {
          revealLaserResults(results, record, root);
        } catch (error) {
          console.error("THE HUMAN ARCHIVE: laser results could not be revealed.", error);
          results.hidden = false;
          results.classList.add("is-visible");
          results.append(
            el("p", "tha-laser-disclaimer", "The signal returned. Continue to the next lunar trace."),
            button("CONTINUE TO A DECISION // TRACE 03 →", "tha-next-button tha-next-record-button", () => {
              markProgress(2);
              showMapForNextRecord(root, root.querySelector(".tha-moon-stage"), 2);
            })
          );
        }
      }, outboundDuration + returnDuration);
    });
    const results = el("div", "tha-laser-results");
    results.hidden = true;
    wrap.append(top, view, status, start, results);
    return wrap;
  }

  function revealLaserResults(container, record, root) {
    if (!container || container.dataset.revealed === "true") return;
    container.dataset.revealed = "true";
    container.hidden = false;
    container.classList.add("is-visible");
    const stats = el("div", "tha-laser-stats");
    stats.append(
      (() => { const item = el("div", "tha-laser-stat"); item.append(el("span", "", "AVERAGE EARTH–MOON DISTANCE"), el("strong", "", "~384,400 km")); return item; })(),
      (() => { const item = el("div", "tha-laser-stat"); item.append(el("span", "", "LASER MEASUREMENTS"), el("strong", "", "Centimeter-level precision")); return item; })()
    );
    const baseDisclaimer = record?.interaction?.disclaimer || "This is a simulation, not a real measurement.";
    const methodExplanation = record?.interaction?.requiredExplanation || "Scientists use this method to measure.";
    const disclaimer = el("p", "tha-laser-disclaimer", `${baseDisclaimer} ${methodExplanation}`);
    const nextPrompt = el("p", "tha-next-trace-prompt", "SIGNAL RECOVERED // THE THIRD LUNAR TRACE IS READY.");
    const actions = el("div", "tha-record-actions tha-laser-next-actions");
    actions.hidden = true;
    actions.append(button("CONTINUE TO A DECISION // TRACE 03 →", "tha-next-button tha-next-record-button", () => {
      const count = markProgress(2);
      showMapForNextRecord(root, root.querySelector(".tha-moon-stage"), count);
    }));
    container.append(
      stats,
      disclaimer,
      makeNASADataCard(record),
      makeStoryCard(record),
      nextPrompt,
      actions
    );
    markProgress(2);
    setHUD(root, "SIGNAL RETURNED // LASER REFLECTOR VERIFIED", 2);
    // The source script calls for a long silence before the single note.
    // Keep the next-trace control unavailable until that cue has completed,
    // so a quick tap cannot skip the record's audio moment.
    later(() => playPianoNote({
      durationMs: 2500,
      resumePings: true,
      onComplete: () => { actions.hidden = false; }
    }), 2200);
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function makeLaserRecord(record, root) {
    const section = el("section", "tha-laser-record tha-template-a-record");
    const status = el("div", "tha-object-status");
    status.append(el("span", "tha-status-dot"), el("span", "", "OBJECT DETECTED"), el("strong", "", "SCIENTIFIC INSTRUMENT"));
    const intro = makeRecordIntro("AN UNEXPECTED ANSWER // TRACE 02", "THE MOON'S MIRROR", "A tiny instrument. A signal that travels both ways.");
    const image = makeImageEvidence({
      src: IMAGE.retroreflector,
      alt: "Apollo lunar laser ranging retroreflector array on the Moon",
      credit: "NASA / NASA Apollo Archive",
      link: SOURCE.retroreflectorImage,
      linkLabel: "NASA IMAGE ↗"
    });
    const explanation = el("p", "tha-record-explanation", "This is a measuring instrument. Scientists send laser pulses from Earth and detect the light that returns from the Moon.");
    const simulation = makeLaserBeamSimulation(record, root);
    section.append(status, intro, image, explanation, simulation);
    return section;
  }

  function replayMoonChapter(root) {
    const approved = window.confirm(
      "Replay the Moon chapter from the beginning? This resets only Moon progress. Your Space Archaeologist identity and progress in other archives will stay saved."
    );
    if (!approved) return;

    stopAllMoonAudio();
    try {
      const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}");
      saved.moon = 0;
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(saved));
      window.localStorage.removeItem(LEGACY_APOLLO_KEY);
    } catch (error) {
      console.info("THE HUMAN ARCHIVE: Moon replay reset could not be stored locally.", error);
    }
    window.THA?.setProgress?.("moon", 0);
    const stage = root?.querySelector(".tha-moon-stage");
    if (stage) showMapForNextRecord(root, stage, 0);
    setHUD(root, "SIGNAL DETECTED // OBJECT UNKNOWN", 0);
    const caption = root?.querySelector(".tha-moon-map-caption");
    if (caption) caption.textContent = mapCaptionFor(getMoonRecord(0));
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  function makeFallenCompletion(record, root, { holdControls = false } = {}) {
    const complete = el("section", "tha-moon-completion");
    const kicker = el("p", "tha-identification-kicker", "MOON ARCHIVE // FINAL TRACE RECOVERED");
    const motto = el("h2", "", "ABANDONED ≠ FORGOTTEN.");
    const label = el("p", "tha-completion-label", "🌙 MOON ARCHIVE COMPLETE");
    const count = el("strong", "tha-completion-count", "3 / 3 RECORDS RECOVERED");
    const summary = el("p", "tha-completion-story", "Three traces recovered: a launch platform, mirrors for lunar ranging, and a memorial to fourteen lost space explorers.");
    const handoff = el("div", "tha-mars-handoff");
    handoff.hidden = true;
    handoff.append(
      el("span", "tha-mars-handoff-kicker", "NEXT ARCHIVE // MARS"),
      el("p", "", "A new signal waits beyond the Moon.")
    );
    const replay = button("REPLAY MOON CHAPTER ↺", "tha-next-button tha-replay-button", () => replayMoonChapter(root));
    const menu = button("RETURN TO ARCHIVE MENU", "tha-secondary-button", () => {
      stopAllMoonAudio();
      window.THANavigation?.goTo("menu");
    });
    if (holdControls) {
      replay.disabled = true;
      menu.disabled = true;
      complete.classList.add("is-transitioning");
    }
    complete.append(kicker, motto, label, count, summary, handoff, replay, menu);
    setHUD(root, "MOON ARCHIVE COMPLETE // 3 OF 3 RECOVERED", 3);
    return complete;
  }

  async function runMoonEndTransition(root, completion) {
    // A short team-synthesised chord, followed by the document's one-second
    // white frame and a deliberate red hand-off toward the Mars archive.
    await playCompletionChord();
    if (!root?.isConnected || !completion?.isConnected) return;
    const flash = el("div", "tha-moon-completion-flash");
    flash.setAttribute("aria-hidden", "true");
    root.append(flash);
    await new Promise((resolve) => later(resolve, 1000));
    if (!root.isConnected || !completion.isConnected) return;
    root.classList.add("is-red-shift");
    completion.classList.add("is-red-shift");
    const handoff = completion.querySelector(".tha-mars-handoff");
    if (handoff) handoff.hidden = false;
    const status = root.querySelector(".tha-moon-status");
    if (status) status.textContent = "MARS ARCHIVE // NEXT SIGNAL DETECTED";
    const subtitle = root.querySelector(".tha-moon-subtitle");
    if (subtitle) subtitle.textContent = "Three lunar traces recovered. The next signal waits on Mars.";
    flash.classList.add("is-fading");
    later(() => flash.remove(), 720);
    completion.querySelectorAll("button").forEach((control) => { control.disabled = false; });
    completion.classList.remove("is-transitioning");
  }

  function revealFallenRecord(slot, record, root, choice) {
    if (!slot || slot.dataset.revealed === "true") return;
    slot.dataset.revealed = "true";
    slot.classList.add("is-visible");
    // Prime Web Audio synchronously in the student's choice gesture so the
    // final scripted chord can play after the sustained piano note.
    primeCompletionAudioContext();
    primePianoPlaybackFromGesture();
    slot.append(makeNASADataCard(record), makeStoryCard(record));
    markProgress(3);
    setHUD(root, "FINAL TRACE RECOVERED // 3 OF 3", 3);
    stopPings();
    // Wait in silence, play the full sustained piano note, then reveal the
    // archive motto and completion scene only after the note ends.
    later(() => playPianoNote({
      durationMs: 7000,
      resumePings: false,
      onComplete: () => {
        const completion = makeFallenCompletion(record, root, { holdControls: true });
        slot.append(completion);
        completion.scrollIntoView({ behavior: "smooth", block: "center" });
        runMoonEndTransition(root, completion);
      }
    }), 1100);
    slot.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function makeFallenRecord(record, root) {
    const section = el("section", "tha-fallen-record tha-template-c-record");
    const status = el("div", "tha-object-status");
    status.append(el("span", "tha-status-dot"), el("span", "", "OBJECT DETECTED"), el("strong", "", "UNIDENTIFIED MEMORIAL"));
    const intro = makeRecordIntro("A DECISION // TRACE 03", "A MEMORIAL ON THE MOON", "A small figure. Four clues. One question to consider.");
    const image = makeImageEvidence({
      src: IMAGE.fallenAstronaut,
      alt: "Fallen Astronaut aluminum figure and commemorative plaque at the Apollo 15 site",
      credit: "NASA / JSC",
      link: SOURCE.fallenImage,
      linkLabel: "NASA IMAGE AS15-88-11894 ↗"
    });
    const clues = window.THATemplates.TemplateC.createClueSequence({
      record,
      onComplete: () => {
        choiceSlot.hidden = false;
        const interaction = record?.interaction || {};
        const panel = window.THATemplates.TemplateC.createChoicePanel({
          question: interaction.question,
          choices: interaction.choices || [],
          noRightAnswer: true,
          onChoose: (choice) => revealFallenRecord(revealSlot, record, root, choice)
        });
        choiceSlot.append(panel);
        choiceSlot.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
    const choiceSlot = el("div", "tha-fallen-choice-slot");
    choiceSlot.hidden = true;
    const revealSlot = el("div", "tha-fallen-reveal-slot");
    section.append(status, intro, image, clues.element, choiceSlot, revealSlot);
    return section;
  }

  function openActiveRecord(root, frame, record) {
    if (!root?.isConnected || !frame?.isConnected || !record) return;
    const stage = root.querySelector(".tha-moon-stage");
    if (!stage) return;
    const marker = frame.querySelector(".tha-moon-marker");
    if (marker) marker.disabled = true;
    frame.classList.add("is-zooming");
    root.querySelector(".tha-moon-status").textContent = `TRACE ${String(record.number).padStart(2, "0")} // CAMERA APPROACHING`;
    later(() => {
      if (!root.isConnected || !stage.isConnected) return;
      stage.replaceChildren();
      stage.classList.add("is-record-view");
      try {
        if (record.id === "apollo-11") stage.append(makeApolloRecord(record, root));
        else if (record.id === "laser-retroreflectors") stage.append(makeLaserRecord(record, root));
        else if (record.id === "fallen-astronaut") stage.append(makeFallenRecord(record, root));
        else throw new Error(`No Moon renderer found for ${record.id}`);
      } catch (error) {
        console.error(`THE HUMAN ARCHIVE: ${record.id} failed to render.`, error);
        const fallback = el("section", "tha-record-render-error");
        fallback.setAttribute("role", "alert");
        fallback.append(
          el("p", "tha-moon-eyebrow", `RECOVERY FILE // 00${record.number}`),
          el("h2", "", "RECORD UNAVAILABLE"),
          el("p", "", "The archive could not decode this record. Return to the lunar map and try again.")
        );
        fallback.append(button("RETURN TO LUNAR MAP", "tha-next-button", () => {
          showMapForNextRecord(root, stage, readProgress());
        }));
        stage.append(fallback);
      }
      setHUD(root, `OBJECT DETECTED // ${record.objectType.toUpperCase()}`, readProgress());
      setChapterSubtitle(root, record);
      const intro = stage.querySelector(".tha-record-intro");
      if (intro) intro.scrollIntoView({ behavior: "smooth", block: "nearest" });
      else stage.scrollIntoView({ behavior: "smooth", block: "start" });
    }, record?.interaction?.cameraZoomDurationMs || CAMERA_ZOOM_MS);
  }

  function showMoonCompletion(root, stage) {
    stage.classList.add("is-record-view");
    stage.replaceChildren();
    root.classList.add("is-red-shift");
    const complete = makeFallenCompletion(getRecord("fallen-astronaut"), root);
    complete.classList.add("is-red-shift");
    const handoff = complete.querySelector(".tha-mars-handoff");
    if (handoff) handoff.hidden = false;
    stage.append(complete);
    root.querySelector(".tha-moon-map-caption").textContent = "THREE TRACES. THREE LEGACIES. THE NEXT SIGNAL WAITS ON MARS.";
    setChapterSubtitle(root, null);
    const subtitle = root.querySelector(".tha-moon-subtitle");
    if (subtitle) subtitle.textContent = "Three lunar traces recovered. The next signal waits on Mars.";
  }

  function renderMoonMap() {
    stopAllMoonAudio();
    const progress = readProgress();
    const nextRecord = progress < 3 ? getMoonRecord(progress) : null;
    const current = makeShell({
      subtitle: progress >= 3 ? "Three lunar traces recovered. The next signal waits on Mars." : subtitleFor(nextRecord),
      status: progress >= 3 ? "MOON ARCHIVE COMPLETE // 3 OF 3" : progress ? `TRACE ${String(progress + 1).padStart(2, "0")} READY // NEXT SIGNAL DETECTED` : "SIGNAL DETECTED // OBJECT UNKNOWN",
      progress
    });
    if (progress >= 3) {
      showMoonCompletion(current.root, current.stage);
    } else {
      const record = getMoonRecord(progress);
      current.stage.append(window.THATemplates.TemplateA.createMapPanel({
        record,
        onTrace: (frame) => openActiveRecord(current.root, frame, record)
      }));
      current.caption.textContent = mapCaptionFor(record);
      requestAnimationFrame(() => {
        if (activeRoot === current.root && current.root.isConnected) startMoonPings();
      });
    }
    return current.root;
  }

  window.renderMoonMap = renderMoonMap;
})();
