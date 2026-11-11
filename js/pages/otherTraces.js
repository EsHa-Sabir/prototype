/* ============================================================================
   THE HUMAN ARCHIVE — CHAPTER FOUR: OTHER TRACES
   Deep-space signal observatory. This chapter deliberately has its own visual
   language instead of reusing the Moon surface map or Mars field survey.

   Records:
     08 Voyager 1      — Learning Console + Chrono Slider + Story
     09 Pioneer Plaque — Learning Console + Story (no added chronology)

   Core sequence:
     Chapter unlock → Voyager 1 → Pioneer Plaque → Chapter completion
   ============================================================================ */
(() => {
  'use strict';

  const $ = (tag, cls = '', text = null) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== null && text !== undefined) node.textContent = String(text);
    return node;
  };
  const button = (label, cls, onClick) => {
    const node = $('button', cls, label);
    node.type = 'button';
    node.addEventListener('click', onClick);
    return node;
  };
  const IMAGE_ROOT = new URL('../../assets/images/', document.currentScript.src);
  const AUDIO_ROOT = new URL('../../assets/audio/', document.currentScript.src);
  const PROGRESS_KEY = 'thaProgress';
  const COMPLETE_SEEN_KEY = 'thaOtherCompletionSeen';
  const VOYAGER_COMPLETE_KEY = 'thaVoyagerRecordFullyRecovered';
  const NASA_MILESTONE_UTC = Date.UTC(2026, 10, 18, 10, 16, 7); // 02:16:07 PST
  const NASA_MILESTONE_DISTANCE_KM = 25_902_000_000;
  const NASA_REPORTED_SPEED_KMH = 61_155;
  const LIGHT_SPEED_KM_S = 299_792.458;

  let activeMedia = new Set();
  let scheduled = [];
  const preloadedAudio = new Map();
  let audioAssetsPrimed = false;
  const CHAPTER_AUDIO_FILES = [
    'radio-static-rise.mp3', 'ambient-hum.mp3', 'greeting.mp3', 'weak-signal-pulse.mp3',
    'beep.mp3', 'electronic-ping.mp3', 'click.mp3',
    'short-musical-passage.mp3', 'signal.mp3', 'week-signal.mp3', 'single-piano-note.mp3', 'piano.mp3'
  ];
  let currentRoot = null;
  let currentRecordId = null;
  let audioGeneration = 0;
  let audioScene = 'stopped';

  function makeVoyagerTodayStop() {
    const milestoneReached = Date.now() >= NASA_MILESTONE_UTC;
    return {
      date: 'TODAY',
      label: `${new Date().getFullYear()} STATUS`,
      title: milestoneReached ? 'One light-day from Earth' : 'Approaching one light-day',
      detail: milestoneReached
        ? 'Voyager 1 passed the one-light-day distance milestone on November 18, 2026. NASA’s live status page remains the source for current distance and instrument status.'
        : 'NASA/JPL expects Voyager 1 to reach one light-day from Earth on November 18, 2026. The distance shown below is a calculated estimate, not live spacecraft telemetry.'
    };
  }

  const RECORDS = {
    'voyager-1': {
      id: 'voyager-1', number: '08', title: 'VOYAGER 1', eyebrow: 'THE INTERSTELLAR MESSENGER',
      subtitle: 'A spacecraft that carried a small part of Earth beyond the Sun’s protective bubble.',
      image: 'voyager-spacecraft-golden-record.webp',
      imageAlt: 'NASA illustration of the Voyager spacecraft and the gold-plated Golden Record',
      imageCredit: 'NASA / JPL-Caltech',
      imageSource: 'https://images.nasa.gov/details/PIA14113',
      imageSourceLabel: 'NASA Image and Video Library — PIA14113',
      missionSource: 'https://www.jpl.nasa.gov/missions/voyager-1/',
      positionSource: 'https://science.nasa.gov/specials/apps/voyager-vital-signs/table/',
      goldenSource: 'https://science.nasa.gov/mission/voyager/golden-record-contents/images/',
      updateSource: 'https://www.jpl.nasa.gov/news/nasas-voyager-1-conserves-power-resolves-brief-communications-pause/',
      timeline: [
        { date: '1977', label: 'LAUNCH', title: 'A journey begins', detail: 'Voyager 1 launched on September 5, 1977, from Cape Canaveral. Its first task was to study the giant planets of our outer Solar System.' },
        { date: '1979', label: 'JUPITER', title: 'Jupiter up close', detail: 'Voyager 1 flew past Jupiter, returning detailed observations of the planet, its atmosphere and its moons.' },
        { date: '1980', label: 'SATURN', title: 'A ringed world', detail: 'The spacecraft flew past Saturn and studied its rings and moons, including the hazy moon Titan.' },
        { date: '1990', label: 'PALE BLUE DOT', title: 'Earth becomes a tiny point', detail: 'From billions of kilometres away, Voyager 1 looked back and photographed Earth as a tiny pale-blue point. This timeline stop is intentionally silent.' },
        { date: '2012', label: 'INTERSTELLAR', title: 'Beyond the heliopause', detail: 'On August 25, 2012, Voyager 1 crossed the heliopause and entered interstellar space — the first human-made object to do so.' },
        makeVoyagerTodayStop()
      ],
      discover: {
        lead: 'Voyager 1 is a robotic spacecraft sent from Earth to explore the outer Solar System and then continue into interstellar space.',
        what: 'It is a long-lived space probe. It does not carry astronauts. Its instruments measure the space around it and send information back to Earth by radio.',
        purpose: 'Its original mission included close flybys of Jupiter and Saturn. After those encounters, it continued outward to study the region beyond the Sun’s heliosphere.',
        importance: 'Voyager 1 showed that a human-built machine could travel farther than any other spacecraft and directly investigate interstellar space.',
        takeaway: 'A spacecraft can carry more than instruments. Voyager also carries a carefully chosen message about Earth.'
      },
      explore: {
        facts: [
          ['LAUNCH', 'September 5, 1977'],
          ['HELIOPAUSE CROSSING', 'August 25, 2012'],
          ['SPACECRAFT TYPE', 'Robotic outer-planet / interstellar probe'],
          ['GOLDEN RECORD', '12-inch gold-plated copper phonograph record'],
          ['GREETINGS', '55 languages'],
          ['IMAGES', '115 images'],
          ['MUSIC', 'About 90 minutes of musical selections'],
          ['SOUNDS', 'Natural sounds and other recordings from Earth'],
          ['LATEST COMMUNICATION UPDATE', 'NASA / JPL reported on October 29, 2026 that contact was restored on October 20 after a 48-hour pause, with communication maintained since the signal returned.']
        ]
      }
    },
    'pioneer-plaque': {
      id: 'pioneer-plaque', number: '09', title: 'PIONEER PLAQUE', eyebrow: 'THE FIRST COSMIC POSTCARD',
      subtitle: 'A small engraved diagram designed to tell a distant finder where we came from.',
      image: 'pioneer-plaque-artwork.webp',
      imageAlt: 'Pioneer plaque artwork showing two human figures, pulsar lines and a Solar System diagram',
      imageCredit: 'NASA / NASA Ames Research Center',
      imageSource: 'https://science.nasa.gov/resource/pioneer-plaque/',
      imageSourceLabel: 'NASA Science — Pioneer Plaque',
      missionSource: 'https://science.nasa.gov/resource/pioneer-plaque/',
      historySource: 'https://www.nasa.gov/history/50-years-ago-pioneer-10-launches-to-explore-jupiter/',
      discover: {
        lead: 'The Pioneer Plaque is a small metal message fixed to Pioneer 10 and Pioneer 11 before they left Earth.',
        what: 'It is not a screen, a radio or a container of recorded voices. It is a picture engraved into a gold-anodized aluminium plate.',
        purpose: 'The drawing was designed to help a possible finder understand that the spacecraft came from Earth and to give clues about where Earth is in the galaxy.',
        importance: 'The plaques were among humanity’s first physical messages deliberately sent beyond the Solar System. They turned two spacecraft into carriers of a message about their makers.',
        takeaway: 'The Pioneer message is silent, but its diagram still carries information about the people who sent it.'
      },
      explore: {
        facts: [
          ['PIONEER 10 LAUNCH', 'March 2, 1972'],
          ['PIONEER 11 LAUNCH', 'April 5, 1973'],
          ['DESIGN', 'Carl Sagan and Frank Drake'],
          ['ARTWORK', 'Linda Salzman Sagan'],
          ['MATERIAL', 'Gold-anodized aluminium'],
          ['SIZE', '6 × 9 inches (about 15 × 23 cm)'],
          ['PLACEMENT', 'Attached to each spacecraft'],
          ['STATUS', 'Both Pioneer spacecraft are now silent']
        ]
      }
    }
  };

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
      const value = Number(saved.other ?? saved.otherTraces ?? saved.other_traces ?? 0);
      return Math.max(0, Math.min(2, Number.isFinite(value) ? Math.floor(value) : 0));
    } catch (_) { return 0; }
  }

  function writeProgress(value) {
    const count = Math.max(0, Math.min(2, Math.floor(Number(value) || 0)));
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
      saved.other = count;
      saved.otherTraces = count;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(saved));
    } catch (error) {
      console.warn('Other Traces progress could not be saved locally.', error);
    }
    window.THA?.setProgress?.('other', count);
    return count;
  }

  function isVoyagerFullyRecovered() {
    try { return localStorage.getItem(VOYAGER_COMPLETE_KEY) === 'true'; } catch (_) { return false; }
  }
  function markVoyagerFullyRecovered() {
    try { localStorage.setItem(VOYAGER_COMPLETE_KEY, 'true'); } catch (_) {}
    writeProgress(1);
  }

  function isMuted() { return window.THA?.audioMuted === true; }

  function preloadChapterAudio() {
    if (audioAssetsPrimed || isMuted()) return;
    audioAssetsPrimed = true;
    CHAPTER_AUDIO_FILES.forEach((filename) => {
      try {
        const audio = new Audio(new URL(filename, AUDIO_ROOT).href);
        audio.preload = 'auto';
        audio.volume = 0;
        audio.load?.();
        preloadedAudio.set(filename, audio);
      } catch (error) {
        console.warn(`Other Traces audio preload skipped: ${filename}`, error);
      }
    });
  }

  function stopAudio() {
    audioGeneration += 1;
    scheduled.forEach((timer) => window.clearTimeout(timer));
    scheduled = [];
    activeMedia.forEach((media) => {
      try { media.pause(); media.currentTime = 0; } catch (_) {}
    });
    activeMedia.clear();
  }

  function scheduleAudioStep(callback, delay, generation = audioGeneration) {
    const timer = window.setTimeout(() => {
      scheduled = scheduled.filter((item) => item !== timer);
      if (generation === audioGeneration) callback();
    }, Math.max(0, delay));
    scheduled.push(timer);
    return timer;
  }

  function playAudio(filename, volume = 0.18, loop = false, onEnded = null) {
    if (isMuted()) return null;
    const generation = audioGeneration;
    const audio = preloadedAudio.get(filename) || new Audio(new URL(filename, AUDIO_ROOT).href);
    preloadedAudio.delete(filename);
    try { audio.pause(); audio.currentTime = 0; } catch (_) {}
    audio.preload = 'auto';
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.loop = Boolean(loop);
    activeMedia.add(audio);
    audio.addEventListener('ended', () => {
      if (!audio.loop) activeMedia.delete(audio);
      if (!audio.loop && generation === audioGeneration && typeof onEnded === 'function') onEnded();
    }, { once: !loop });
    audio.addEventListener('error', () => {
      activeMedia.delete(audio);
      console.warn(`Other Traces audio could not be loaded: ${filename}`);
    }, { once: true });
    const request = audio.play();
    if (request && typeof request.catch === 'function') {
      request.catch((error) => {
        activeMedia.delete(audio);
        // A route opened outside a user gesture can be blocked by browser
        // autoplay policy. Normal Archive Map entry is primed by its tap.
        if (error?.name !== 'NotAllowedError') console.warn(`Other Traces audio playback failed: ${filename}`, error);
      });
    }
    return audio;
  }

  // Other Traces opens with repeating radio static only. Golden Record greetings
  // are reserved for the 1990 Voyager reveal. The Archive Map tap primes playback.
  function startLandingSoundscape() {
    if (isMuted()) return false;
    if (audioScene === 'landing' && (activeMedia.size > 0 || scheduled.length > 0)) return true;
    stopAudio();
    audioScene = 'landing';
    const generation = audioGeneration;
    const playStep = (step) => {
      if (generation !== audioGeneration || audioScene !== 'landing' || currentRecordId !== null || isMuted()) return;
      // The landing screen is intentionally a radio-static-only soundscape.
      // Golden Record greetings belong to the 1990 reveal inside Voyager.
      const audio = playAudio('radio-static-rise.mp3', 0.90, false, () => {
        scheduleAudioStep(() => playStep(0), 650, generation);
      });
      if (!audio) return;
    };
    playStep(0);
    return true;
  }

  // A soft, clean ambient bed replaces the harsh repeating radio pulse on
  // Voyager's opening view. The first timeline interaction stops it; from then
  // on, each stop has only its own click/tone and no repeating radio bed.
  function startVoyagerAmbience() {
    if (isMuted() || currentRecordId !== 'voyager-1') return false;
    stopAudio();
    audioScene = 'voyager-ambient';
    playAudio('ambient-hum.mp3', 0.16, true);
    return true;
  }

  function playGoldenRecordGreetingAndMusic(session) {
    if (isMuted() || currentRecordId !== 'voyager-1') return;
    stopAudio();
    audioScene = 'golden-record-silence';
    const generation = audioGeneration;
    // The 1990 stop and the first two seconds after the Golden Record appears
    // remain silent. Then the musical excerpt begins and loops; the greeting
    // plays once on every fresh visit to this stop.
    scheduleAudioStep(() => {
      if (generation !== audioGeneration || audioScene !== 'golden-record-silence' || currentRecordId !== 'voyager-1') return;
      audioScene = 'golden-record-excerpt';
      playAudio('short-musical-passage.mp3', 0.95, true);
      playAudio('greeting.mp3', 0.95, false);
    }, 2000, generation);
  }

  function playVoyagerStopCue(index) {
    if (currentRecordId !== 'voyager-1') return;
    if (index === 3) {
      // Pale Blue Dot is completely silent for two seconds after it appears.
      stopAudio();
      audioScene = 'voyager-1990-silence';
      return;
    }
    const cues = {
      0: ['beep.mp3', 0.90],
      1: ['electronic-ping.mp3', 0.90],
      2: ['single-piano-note.mp3', 0.90],
      4: ['signal.mp3', 0.90],
      5: ['week-signal.mp3', 0.84]
    };
    // Every new stop gets a click plus its own tone. Nothing restarts behind it.
    stopAudio();
    audioScene = 'voyager-stop-cue';
    playAudio('click.mp3', 0.88, false);
    const cue = cues[index];
    if (cue) playAudio(cue[0], cue[1], false);
  }

  function makeHeader() {
    const header = $('header', 'tha-moon-header tha-other-header');
    const brand = $('div', 'tha-moon-brand');
    brand.append($('span', 'tha-moon-brand-mark', 'THA'));
    const copy = $('div', 'tha-moon-brand-copy');
    copy.append($('strong', '', 'THE HUMAN ARCHIVE'), $('small', '', 'FIELD RECOVERY // 2126'));
    brand.append(copy);
    const right = $('div', 'tha-moon-header-right');
    const signal = $('span', 'tha-moon-live');
    signal.append($('i'), document.createTextNode('DEEP SPACE LINK // ARCHIVE'));
    const identity = $('div', 'tha-moon-identity-slot');
    identity.id = 'thaMenuIdentitySlot';
    right.append(signal, identity);
    header.append(brand, right);
    return header;
  }

  function makeFooter(label = 'DEEP SPACE // TWO TRANSMISSIONS // 2126') {
    const footer = $('footer', 'other-footer');
    footer.append($('span', '', 'THE HUMAN ARCHIVE'), $('span', '', label));
    return footer;
  }

  function makeImageFigure(record, priority = false, compact = false) {
    const figure = $('figure', compact ? 'other-artwork other-artwork-compact' : 'other-artwork');
    const image = $('img');
    image.src = new URL(record.image, IMAGE_ROOT).href;
    image.alt = record.imageAlt;
    image.loading = priority ? 'eager' : 'lazy';
    image.decoding = 'async';
    image.width = record.id === 'voyager-1' ? 1639 : 1261;
    image.height = record.id === 'voyager-1' ? 880 : 993;
    if (priority) image.fetchPriority = 'high';
    figure.append(image);
    const caption = $('figcaption', 'other-image-credit');
    caption.append($('span', '', `IMAGE CREDIT: ${record.imageCredit}`));
    const source = $('a', '', 'IMAGE SOURCE ↗');
    source.href = record.imageSource;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.setAttribute('aria-label', `Open ${record.imageSourceLabel}`);
    caption.append(source);
    figure.append(caption);
    return figure;
  }

  function createLayerContent(record, type) {
    const data = record[type];
    const panel = $('div', `other-layer-panel other-layer-${type}`);
    const tag = $('p', 'other-layer-kicker', type === 'discover' ? 'THE OBJECT // IN SIMPLE WORDS' : 'MISSION FILE // VERIFIED DETAILS');
    panel.append(tag);
    if (type === 'discover') {
      panel.append($('p', 'other-layer-lead', data.lead));
      [
        ['WHAT IS IT?', data.what],
        ['WHAT WAS ITS PURPOSE?', data.purpose],
        ['WHY DOES IT MATTER?', data.importance]
      ].forEach(([heading, copy], index) => {
        const card = $('article', 'other-learning-card');
        card.append($('span', 'other-learning-index', `0${index + 1}`), $('h3', '', heading), $('p', '', copy));
        panel.append(card);
      });
      const takeaway = $('p', 'other-takeaway', data.takeaway);
      panel.append(takeaway);
    } else {
      const grid = $('dl', 'other-fact-grid');
      data.facts.forEach(([label, value]) => {
        const group = $('div', 'other-fact');
        group.append($('dt', '', label), $('dd', '', value));
        grid.append(group);
      });
      panel.append(grid);
      const sources = $('section', 'other-source-list');
      sources.append($('h3', '', 'OFFICIAL MISSION SOURCES'));
      const links = record.id === 'voyager-1'
        ? [
            ['NASA / JPL — Voyager 1 Mission', record.missionSource],
            ['NASA — Golden Record image contents', record.goldenSource],
            ['NASA — Live Voyager position table', record.positionSource],
            ['NASA / JPL — Latest Voyager 1 update', record.updateSource]
          ]
        : [
            ['NASA — Pioneer Plaque', record.missionSource],
            ['NASA History — Pioneer 10 mission and plaque', record.historySource]
          ];
      links.forEach(([label, url]) => {
        const link = $('a', 'other-source-link', label + ' ↗');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        sources.append(link);
      });
      panel.append(sources);
    }
    return panel;
  }

  function createLayers(record, session, updateCompletion) {
    const section = $('section', 'other-layers');
    const top = $('div', 'other-layer-heading');
    top.append($('p', 'other-section-kicker', 'LEARNING CONSOLE'), $('h2', '', 'DISCOVER / EXPLORE'));
    section.append(top);
    const tabs = $('div', 'other-layer-tabs');
    const discoverButton = button('DISCOVER', 'other-layer-tab is-active', () => select('discover'));
    const exploreButton = button('EXPLORE', 'other-layer-tab', () => select('explore'));
    discoverButton.setAttribute('aria-pressed', 'true');
    exploreButton.setAttribute('aria-pressed', 'false');
    tabs.append(discoverButton, exploreButton);
    const content = $('div', 'other-layer-content');
    let active = 'discover';
    let discoverPanel = createLayerContent(record, 'discover');
    let explorePanel = createLayerContent(record, 'explore');
    content.append(discoverPanel, explorePanel);
    explorePanel.hidden = true;
    session.layers.discover = true;

    function select(which) {
      active = which;
      discoverPanel.hidden = which !== 'discover';
      explorePanel.hidden = which !== 'explore';
      discoverButton.classList.toggle('is-active', which === 'discover');
      exploreButton.classList.toggle('is-active', which === 'explore');
      discoverButton.setAttribute('aria-pressed', String(which === 'discover'));
      exploreButton.setAttribute('aria-pressed', String(which === 'explore'));
      session.layers[which] = true;
      updateCompletion();
    }
    section.append(tabs, content);
    return section;
  }

  function getVoyagerDistanceSnapshot() {
    const now = Date.now();
    const hoursFromMilestone = (now - NASA_MILESTONE_UTC) / 3_600_000;
    const distanceKm = Math.max(0, NASA_MILESTONE_DISTANCE_KM + hoursFromMilestone * NASA_REPORTED_SPEED_KMH);
    const oneWayHours = distanceKm / LIGHT_SPEED_KM_S / 3600;
    const billion = (distanceKm / 1_000_000_000).toFixed(2);
    return {
      distance: `≈ ${billion} billion km`,
      lightTime: `≈ ${oneWayHours.toFixed(1)} hours one way`,
    };
  }

  function makeVoyagerLivePanel() {
    const live = $('section', 'other-live-panel');
    const estimate = getVoyagerDistanceSnapshot();
    live.append(
      $('p', 'other-live-kicker', 'RUNTIME DISTANCE ESTIMATE // NOT LIVE TELEMETRY'),
      $('strong', 'other-live-distance', estimate.distance),
      $('p', 'other-live-time', `Radio travel time at this estimate: ${estimate.lightTime}.`),
      $('p', 'other-live-note', 'Calculated from NASA’s November 18, 2026 one-light-day milestone and the speed reported for Voyager 1. This is an estimate, not live telemetry. NASA’s October 29, 2026 update reported that contact had been restored on October 20 and was maintained since.')
    );
    const link = $('a', 'other-live-link', 'CHECK LIVE NASA COSMIC ODOMETER ↗');
    link.href = RECORDS['voyager-1'].positionSource;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    live.append(link);
    return live;
  }

  function createGoldenRecordPanel(session, record) {
    const panel = $('section', 'other-golden-panel');
    panel.append(
      $('p', 'other-section-kicker', 'SPECIAL CARGO // TRANSMISSION FROM EARTH'),
      $('h2', '', 'THE GOLDEN RECORD'),
      $('p', 'other-golden-copy', 'A 12-inch gold-plated copper record carried by Voyager 1 and Voyager 2. It gathers sounds, images, greetings and music chosen to represent Earth.')
    );
    const chips = $('div', 'other-golden-facts');
    [['55','LANGUAGES'],['115','IMAGES'],['90 MIN','MUSIC'],['EARTH','SOUNDS']].forEach(([value, label]) => {
      const fact = $('div', 'other-golden-fact');
      fact.append($('strong', '', value), $('span', '', label));
      chips.append(fact);
    });
    panel.append(chips);
    panel.append(
      $('p', 'other-golden-auto-note', 'The panel remains silent for two seconds. Then the musical excerpt begins and repeats; the greeting plays once alongside it. The music stops when you move on from 1990.'),
      $('p', 'other-golden-source-note', 'Golden Record contents: NASA / JPL. The local audio clips are the project’s supplied playback assets; their original licensing/provenance notes were not included in the ZIP.')
    );
    const source = $('a', 'other-source-link', 'EXPLORE THE GOLDEN RECORD CONTENTS ↗');
    source.href = record.goldenSource;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    panel.append(source);
    return panel;
  }

  function createTimeline(record, session, updateCompletion) {
    const section = $('section', 'other-timeline');
    const head = $('div', 'other-timeline-head');
    head.append($('p', 'other-section-kicker', 'CHRONO SLIDER // TRANSMISSION LOG'), $('h2', '', 'FOLLOW THE SIGNAL THROUGH TIME'));
    section.append(head);
    const readout = $('div', 'other-time-readout');
    const date = $('p', 'other-time-date');
    const label = $('p', 'other-time-label');
    const title = $('h3', 'other-time-title');
    const detail = $('p', 'other-time-detail');
    readout.append(date, label, title, detail);
    section.append(readout);

    const sliderWrap = $('div', 'other-slider-wrap');
    const range = $('input', 'other-range');
    range.type = 'range';
    range.min = '0';
    range.max = String(record.timeline.length - 1);
    range.step = '1';
    const initialIndex = 0;
    range.value = String(initialIndex);
    range.setAttribute('aria-label', `Timeline for ${record.title}`);
    range.setAttribute('aria-valuetext', `${record.timeline[0].date} — ${record.timeline[0].label}`);
    sliderWrap.append(range);
    const stopList = $('div', 'other-stop-list');
    const stopButtons = record.timeline.map((stop, index) => {
      const item = button('', `other-stop${index === initialIndex ? ' is-current is-visited' : ''}`, () => select(index));
      item.append($('span', 'other-stop-date', stop.date), $('span', 'other-stop-label', stop.label));
      item.setAttribute('aria-label', `${stop.date}: ${stop.label}`);
      item.setAttribute('aria-pressed', String(index === initialIndex));
      stopList.append(item);
      return item;
    });
    sliderWrap.append(stopList);
    section.append(sliderWrap);

    if (record.id === 'voyager-1') {
      const live = makeVoyagerLivePanel();
      live.hidden = true;
      section.append(live);
      session.goldenPanel = createGoldenRecordPanel(session, record);
      session.goldenPanel.hidden = true;
      section.append(session.goldenPanel);
      session.livePanel = live;
    }

    let activeStop = initialIndex;
    function select(index, playCue = true) {
      const selected = Math.max(0, Math.min(record.timeline.length - 1, Number(index) || 0));
      const item = record.timeline[selected];
      const changed = selected !== activeStop;
      activeStop = selected;
      session.visitedStops.add(selected);
      range.value = String(selected);
      range.setAttribute('aria-valuetext', `${item.date} — ${item.label}`);
      date.textContent = item.date;
      label.textContent = item.label;
      title.textContent = item.title;
      detail.textContent = item.detail;
      stopButtons.forEach((stopButton, i) => {
        stopButton.classList.toggle('is-current', i === selected);
        stopButton.classList.toggle('is-visited', session.visitedStops.has(i));
        stopButton.setAttribute('aria-pressed', String(i === selected));
      });
      if (record.id === 'voyager-1') {
        // The Golden Record reveal belongs to the 1990 Pale Blue Dot stop,
        // not the later 2012 interstellar crossing.
        if (selected === 3) session.goldenUnlocked = true;
        // Reveal the Golden Record only while 1990 / Pale Blue Dot is selected.
        // It must disappear again when the user moves on to 2012 or Today.
        const revealGoldenNow = selected === 3 && session.goldenPanel.hidden;
        session.goldenPanel.hidden = selected !== 3;
        if (revealGoldenNow && playCue) playGoldenRecordGreetingAndMusic(session);
        // The live-distance panel is specific to the final current-status stop.
        session.livePanel.hidden = selected !== 5;
        if (changed && playCue && selected !== 3) playVoyagerStopCue(selected);
      }
      updateCompletion();
    }
    range.addEventListener('input', () => select(Number(range.value), true));
    select(initialIndex, false);
    return section;
  }

  function createStory(record) {
    const story = $('section', 'other-story-card');
    story.append(
      $('p', 'other-section-kicker', 'THE STORY // 2126 ARCHIVE')
    );
    if (record.id === 'voyager-1') {
      story.append(
        $('h2', '', 'HUMANITY TRIED TO TELL ITS STORY.'),
        $('p', '', 'No answer came. Not yet.'),
        $('p', 'other-story-support', 'The farthest human-made object in history. Having left the solar system in 2012, it is still communicating with Earth right now! It carries a golden copper record packed with greetings in 55 languages, music, and pictures of our home planet.')
      );
    } else {
      story.append(
        $('h2', '', 'THE MESSAGE IN THE DARK'),
        $('p', '', "Gold-anodized metal sheets safely bolted to the outside of the old Pioneer spacecraft. Engraved with drawings of humans and a cosmic map pointing back to Earth—humanity's ultimate message in a bottle floating through the dark ocean of space.")
      );
    }
    return story;
  }

  function createPioneerAfterword() {
    const section = $('section', 'other-message-seal');
    const copy = $('div', 'other-message-seal-copy');
    copy.append(
      $('strong', '', 'A MESSAGE.'),
      $('span', '', 'NO GUARANTEE OF A REPLY.')
    );
    section.append(copy);
    return section;
  }

  function renderRecord(root, recordId) {
    const record = RECORDS[recordId];
    if (!record) return;
    stopAudio();
    currentRecordId = recordId;
    // Opening Voyager marks it visited so Pioneer is available even when the
    // user leaves before completing every timeline stop or learning layer.
    if (recordId === 'voyager-1') writeProgress(1);
    audioScene = recordId === 'voyager-1' ? 'voyager-ambient' : 'pioneer-silence';
    const session = { layers: { discover: false, explore: false }, visitedStops: new Set(), goldenUnlocked: false };
    root.className = 'tha-other-screen is-record';
    root.replaceChildren(makeHeader());

    const main = $('main', 'other-main other-record-main');
    const masthead = $('section', 'other-record-masthead');
    if (record.id === 'voyager-1') masthead.append(button('← OTHER TRACES', 'other-back-button', () => { writeProgress(1); renderLanding(root); }));
    masthead.append(
      $('p', 'other-record-id', `CHAPTER FOUR // RECORD ${record.number} · ${record.eyebrow}`),
      $('h1', '', record.title),
      $('p', 'other-record-subtitle', record.subtitle)
    );
    main.append(masthead);

    const hero = $('section', 'other-record-hero');
    hero.append(makeImageFigure(record, true));
    const telemetry = $('aside', 'other-record-telemetry');
    telemetry.append(
      $('p', 'other-section-kicker', 'RECOVERED OBJECT // IDENTITY'),
      $('h2', '', record.id === 'voyager-1' ? 'INTERSTELLAR PROBE' : 'PICTORIAL MESSAGE'),
      $('p', 'other-telemetry-description', record.id === 'voyager-1'
        ? 'A spacecraft carrying instruments — and a record of sounds and images from Earth.'
        : 'A gold-anodized aluminium plate fixed to two Pioneer spacecraft, designed as a message for a possible future finder.'),
      $('div', 'other-telemetry-line'),
      $('span', 'other-telemetry-label', 'MISSION / CARRIERS'),
      $('strong', 'other-telemetry-value', record.id === 'voyager-1' ? 'VOYAGER 1' : 'PIONEER 10 + 11'),
      $('span', 'other-telemetry-label', 'ORIGIN'),
      $('strong', 'other-telemetry-value', 'EARTH'),
      $('span', 'other-telemetry-label', 'ARCHIVE CLASS'),
      $('strong', 'other-telemetry-value', record.id === 'voyager-1' ? 'INTERSTELLAR TRANSMISSION' : 'PHYSICAL MESSAGE')
    );
    if (record.id === 'voyager-1') {
      const signal = $('p', 'other-telemetry-status', 'SIGNAL TRACK // LONG-RANGE RADIO');
      telemetry.append(signal);
      // The opening Voyager view uses a soft hum, never the repeating radio pulse.
      startVoyagerAmbience();
    }
    hero.append(telemetry);
    main.append(hero);

    let completeButton = null;
    let returnButton = null;
    const updateCompletion = () => {
      if (!completeButton) return;
      const allStops = record.id !== 'voyager-1' || session.visitedStops.size === record.timeline.length;
      const bothLayers = session.layers.discover && session.layers.explore;
      const goldenDone = record.id !== 'voyager-1' || session.goldenUnlocked;
      const ready = allStops && bothLayers && goldenDone;
      completeButton.hidden = !ready;
      if (ready) completeButton.textContent = record.id === 'voyager-1' ? 'RETURN TO OTHER TRACES →' : 'PRESERVE PIONEER MESSAGE // COMPLETE CHAPTER →';
      if (returnButton) returnButton.hidden = ready;
    };

    const timeline = record.id === 'voyager-1' ? createTimeline(record, session, updateCompletion) : null;
    const layers = createLayers(record, session, updateCompletion);
    const story = createStory(record);
    main.append(layers);
    if (timeline) main.append(timeline);
    main.append(story);
    if (record.id === 'pioneer-plaque') main.append(createPioneerAfterword());
    const actions = $('div', 'other-record-actions');
    completeButton = button('RECORD IN PROGRESS', 'other-primary-button', () => {
      if (record.id === 'voyager-1') {
        markVoyagerFullyRecovered();
        currentRecordId = null;
        stopAudio();
        renderLanding(root);
      } else {
        writeProgress(2);
        currentRecordId = null;
        stopAudio();
        renderCompletion(root, false);
      }
    });
    completeButton.hidden = true;
    actions.append(completeButton);
    if (record.id === 'voyager-1') {
      returnButton = button('RETURN TO OTHER TRACES', 'other-secondary-button', () => { writeProgress(1); renderLanding(root); });
      actions.append(returnButton);
    }
    main.append(actions, makeFooter(`RECORD ${record.number} // ${record.title} // PRESERVATION IN PROGRESS`));
    root.append(main);
    window.THAIdentity?.mountInMenu?.();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    updateCompletion();
  }

  function createRecordCard(root, record, progress) {
    const isVoyager = record.id === 'voyager-1';
    const complete = isVoyager ? isVoyagerFullyRecovered() : progress >= 2;
    const visitedUnlock = isVoyager && progress >= 1 && !complete;
    const ready = isVoyager ? !complete : !complete && progress >= 1;
    const card = $('article', `other-record-card${ready ? ' is-ready' : ''}${complete ? ' is-recovered' : ''}${!ready && !complete ? ' is-locked' : ''}`);
    const visual = $('div', 'other-card-visual');
    const img = $('img');
    img.src = new URL(record.image, IMAGE_ROOT).href;
    img.alt = record.imageAlt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = isVoyager ? 1639 : 1261;
    img.height = isVoyager ? 880 : 993;
    visual.append(img);
    visual.append($('span', 'other-card-number', `RECORD ${record.number}`));
    card.append(visual);
    const body = $('div', 'other-card-body');
    const status = complete ? 'RECOVERED' : visitedUnlock ? 'VISITED // PIONEER UNLOCKED' : ready ? 'SIGNAL DETECTED // OPEN' : 'LOCKED // VISIT VOYAGER FIRST';
    body.append($('p', 'other-card-status', status), $('h2', '', record.title), $('p', 'other-card-description', record.subtitle));
    const meta = $('div', 'other-card-meta');
    meta.append($('span', '', isVoyager ? '1977 → INTERSTELLAR SPACE' : '1972 + 1973 → OUTBOUND'), $('span', '', complete ? '✓ PRESERVED' : visitedUnlock ? '● VISITED' : ready ? '● READY' : '⌑ SEALED'));
    body.append(meta);
    const open = button(complete ? 'RECORD RECOVERED' : visitedUnlock ? 'REOPEN VOYAGER →' : ready ? 'OPEN RECORD →' : 'RECORD LOCKED', 'other-card-open', () => {
      if (!ready) return;
      renderRecord(root, record.id);
    });
    open.disabled = !ready;
    body.append(open);
    card.append(body);
    return card;
  }

  function renderLanding(root, preserveUnlockCue = false) {
    if (!preserveUnlockCue) stopAudio();
    currentRecordId = null;
    const progress = readProgress();
    root.className = 'tha-other-screen';
    root.replaceChildren(makeHeader());
    const main = $('main', 'other-main');

    const intro = $('section', 'other-intro');
    const copy = $('div', 'other-intro-copy');
    copy.append(
      $('p', 'other-overline', 'CHAPTER FOUR // DEEP SPACE ARCHIVE'),
      $('p', 'other-unlocked-label', '🛰 OTHER TRACES // UNLOCKED'),
      $('h1', '', 'OTHER TRACES'),
      $('p', 'other-intro-subtitle', 'THE MESSAGES HUMANITY SENT BEYOND ITS HOME.'),
      $('p', 'other-intro-narrative', 'Humanity did not go only to the Moon and Mars. It also sent a message from itself into the universe.')
    );
    const signal = $('div', 'other-signal-visual');
    signal.setAttribute('aria-hidden', 'true');
    signal.innerHTML = `<svg viewBox="0 0 440 280" role="presentation" focusable="false"><defs><radialGradient id="otSignalGlow"><stop offset="0" stop-color="#b5a8ff" stop-opacity=".35"/><stop offset="1" stop-color="#b5a8ff" stop-opacity="0"/></radialGradient><linearGradient id="otWave" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#84dce8" stop-opacity=".12"/><stop offset=".5" stop-color="#e6c887"/><stop offset="1" stop-color="#a99aff" stop-opacity=".2"/></linearGradient></defs><circle cx="220" cy="140" r="115" fill="url(#otSignalGlow)"/><g fill="none" stroke="#8f94c4" stroke-opacity=".36"><ellipse cx="220" cy="140" rx="176" ry="48" transform="rotate(-26 220 140)"/><ellipse cx="220" cy="140" rx="176" ry="48" transform="rotate(26 220 140)"/><circle cx="220" cy="140" r="76" stroke-dasharray="2 9"/></g><circle cx="220" cy="140" r="19" fill="#e7d39a" fill-opacity=".85"/><circle cx="220" cy="140" r="32" fill="none" stroke="#e7d39a" stroke-opacity=".5"/><path d="M27 140h73l12-18 15 37 16-55 18 74 15-38 12 0h104l15-17 15 36 17-53 18 69 16-35h82" fill="none" stroke="url(#otWave)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><g fill="#c6c1e4" font-family="monospace" font-size="9" letter-spacing="2"><text x="220" y="26" text-anchor="middle">TRANSMISSION FIELD</text><text x="220" y="270" text-anchor="middle">EARTH → DEEP SPACE</text></g></svg>`;
    intro.append(copy, signal);
    main.append(intro);

    const statusBar = $('section', 'other-index-bar');
    const left = $('div', 'other-index-heading');
    left.append($('p', 'other-section-kicker', 'SIGNAL INDEX // RECOVERY ORDER'), $('h2', '', 'TWO TRANSMISSIONS DETECTED'));
    const meter = $('div', 'other-progress-meter');
    meter.append($('strong', '', `${progress} / 2`), $('span', '', 'RECORDS ACCESSED'));
    statusBar.append(left, meter);
    main.append(statusBar);

    const cards = $('section', 'other-record-grid');
    cards.setAttribute('aria-label', 'Other Traces records');
    cards.append(createRecordCard(root, RECORDS['voyager-1'], progress), createRecordCard(root, RECORDS['pioneer-plaque'], progress));
    main.append(cards);

    main.append(makeFooter());
    root.append(main);
    window.THAIdentity?.mountInMenu?.();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    if (!preserveUnlockCue || audioScene !== 'landing') startLandingSoundscape();
  }

  function renderCompletion(root, returnVisit = false) {
    stopAudio();
    currentRecordId = null;
    try { localStorage.setItem(COMPLETE_SEEN_KEY, 'true'); } catch (_) {}
    root.className = 'tha-other-screen other-completion-screen';
    root.replaceChildren(makeHeader());
    const main = $('main', 'other-main other-completion-main');
    const mark = $('div', 'other-completion-mark', '✦');
    mark.setAttribute('aria-hidden', 'true');
    const content = $('section', 'other-completion-content');
    content.append(
      $('p', 'other-overline', 'CHAPTER FOUR // RECOVERY VERIFIED'),
      $('p', 'other-completion-kicker', 'ALL DEEP-SPACE TRANSMISSIONS RECOVERED'),
      $('div', 'other-completion-score')
    );
    const score = content.querySelector('.other-completion-score');
    score.append($('strong', '', '02'), $('span', '', '/ 02 RECORDS PRESERVED'));
    content.append(
      $('h1', '', 'OTHER TRACES COMPLETE'),
      $('p', 'other-completion-lead', 'Humanity did not leave only machines. It left a message from itself, too.'),
      $('p', 'other-completion-copy', 'One spacecraft carries sounds and images from Earth into interstellar space. Two earlier spacecraft carry a silent diagram of the people who made them. Both are traces of a species trying to be remembered.')
    );
    const log = $('ol', 'other-completion-log');
    [['08', 'VOYAGER 1', 'GOLDEN RECORD PRESERVED'], ['09', 'PIONEER PLAQUE', 'MESSAGE PRESERVED']].forEach(([number, title, status]) => {
      const row = $('li', 'other-completion-row');
      row.append($('span', 'other-log-number', number), $('strong', '', title), $('span', 'other-log-status', status));
      log.append(row);
    });
    content.append(log);
    const actions = $('div', 'other-completion-actions');
    if (returnVisit) {
      actions.append(
        button('CONTINUE TO HIDDEN RECORDS →', 'other-primary-button', () => {
          window.THAIdentity?.moveToBody?.();
          window.THANavigation?.goTo('hiddenRecords');
        }),
        button('RETURN TO ARCHIVE MAP', 'other-secondary-button', () => window.THANavigation?.goTo('menu'))
      );
    } else {
      actions.append(
        button('REPLAY OTHER TRACES ↺', 'other-primary-button', () => {
          writeProgress(0);
          try { localStorage.removeItem(COMPLETE_SEEN_KEY); localStorage.removeItem(VOYAGER_COMPLETE_KEY); } catch (_) {}
          renderLanding(root);
        }),
        button('RETURN TO ARCHIVE MAP', 'other-secondary-button', () => window.THANavigation?.goTo('menu'))
      );
    }
    content.append(actions);
    main.append(mark, content, makeFooter('OTHER TRACES // 02 OF 02 // RECOVERY COMPLETE'));
    root.append(main);
    window.THAIdentity?.mountInMenu?.();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    audioScene = 'completion';
    playAudio('piano.mp3', 0.30); // Match Moon's completion chord level (0.30).
  }

  function renderOtherTraces() {
    const root = $('section', 'tha-other-screen');
    currentRoot = root;
    let seen = false;
    try { seen = localStorage.getItem(COMPLETE_SEEN_KEY) === 'true'; } catch (_) {}
    if (readProgress() >= 2 && seen) renderCompletion(root, true);
    else renderLanding(root, true);
    return root;
  }

  window.THAOtherAudio = {
    stop() {
      stopAudio();
      audioScene = 'stopped';
    },
    playUnlockCueFromGesture() {
      if (isMuted()) return false;
      // Once both records are recovered, re-entering this chapter must not
      // briefly replay the landing radio static before the completion chord.
      if (readProgress() >= 2) {
        stopAudio();
        audioScene = 'completion';
        return false;
      }
      preloadChapterAudio();
      currentRecordId = null;
      return startLandingSoundscape();
    }
  };
  window.renderOtherTraces = renderOtherTraces;
})();
