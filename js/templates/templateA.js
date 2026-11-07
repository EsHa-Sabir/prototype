/* ============================================================================
   THE HUMAN ARCHIVE — TEMPLATE A
   Surface Map Explorer: SVG map, trace marker, zoom hand-off and clue sequence.
   Reusable mechanics are kept here; page copy/data remains in pages + records.js.
   ============================================================================ */
(() => {
  "use strict";

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };
  const button = (label, className, onClick) => {
    const node = el("button", className, label);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  };
  const externalLink = (label, url, className) => {
    const link = el("a", className, label);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  };

  function makeMapFigure(record, options) {
    const location = record?.location || {};
    const figure = el("figure", "tha-moon-map-figure");
    const frame = el("div", "tha-moon-map-frame");
    const map = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    map.classList.add("tha-lunar-map-svg");
    map.setAttribute("viewBox", "0 0 1000 560");
    map.setAttribute("preserveAspectRatio", "xMidYMid slice");
    map.setAttribute("role", "img");
    const recordNumber = Number(record?.number || 1);
    const traceLabel = `TRACE ${String(recordNumber).padStart(2, "0")}`;
    const targetPoint = recordNumber === 3 ? { x: 72, y: 61 } : recordNumber === 2 ? { x: 62, y: 46 } : { x: 54.4, y: 49 };
    map.setAttribute("aria-label", `Custom drawn schematic lunar surface map with craters, coordinate grid and a blinking marker for ${record?.title || "a lunar trace"}`);
    map.innerHTML = `
      <defs>
        <radialGradient id="thaMoonGround" cx="48%" cy="42%" r="78%">
          <stop offset="0" stop-color="#777a78"/><stop offset=".48" stop-color="#4b5151"/><stop offset="1" stop-color="#20292b"/>
        </radialGradient>
        <radialGradient id="thaCraterFloor"><stop offset="0" stop-color="#343b3c"/><stop offset=".72" stop-color="#596060"/><stop offset="1" stop-color="#8d918b"/></radialGradient>
        <linearGradient id="thaRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c2c2b5"/><stop offset=".5" stop-color="#747a76"/><stop offset="1" stop-color="#353e40"/></linearGradient>
        <pattern id="thaRegolith" width="42" height="42" patternUnits="userSpaceOnUse"><circle cx="5" cy="8" r="1.2" fill="#e2e0d3" opacity=".17"/><circle cx="29" cy="25" r="1" fill="#111a1b" opacity=".32"/><circle cx="18" cy="37" r=".8" fill="#f0eee0" opacity=".13"/></pattern>
        <filter id="thaMapGlow"><feGaussianBlur stdDeviation="14"/></filter>
      </defs>
      <rect width="1000" height="560" fill="url(#thaMoonGround)"/>
      <rect width="1000" height="560" fill="url(#thaRegolith)"/>
      <g opacity=".24" stroke="#d3d8d0" stroke-width="1" stroke-dasharray="4 10">
        <path d="M0 112H1000M0 224H1000M0 336H1000M0 448H1000"/>
        <path d="M125 0V560M250 0V560M375 0V560M500 0V560M625 0V560M750 0V560M875 0V560"/>
      </g>
      <g fill="none" stroke="#c5c8bd" opacity=".14" stroke-width="2">
        <path d="M-30 105C105 22 180 52 280 105S470 175 585 98 830 38 1040 128"/>
        <path d="M-40 395C75 323 190 360 290 420S520 500 650 405 875 330 1035 395"/>
        <path d="M58 560C150 480 255 492 342 540M640 0C690 72 804 86 920 40"/>
      </g>
      <g opacity=".88">
        <ellipse cx="160" cy="145" rx="86" ry="64" fill="url(#thaCraterFloor)" stroke="url(#thaRim)" stroke-width="13"/>
        <ellipse cx="160" cy="145" rx="65" ry="45" fill="none" stroke="#d0d0c3" opacity=".28" stroke-width="3"/>
        <ellipse cx="835" cy="150" rx="112" ry="78" fill="url(#thaCraterFloor)" stroke="url(#thaRim)" stroke-width="15"/>
        <ellipse cx="835" cy="150" rx="83" ry="55" fill="none" stroke="#d0d0c3" opacity=".24" stroke-width="3"/>
        <ellipse cx="110" cy="445" rx="118" ry="74" fill="url(#thaCraterFloor)" stroke="url(#thaRim)" stroke-width="14"/>
        <ellipse cx="110" cy="445" rx="86" ry="49" fill="none" stroke="#d0d0c3" opacity=".2" stroke-width="3"/>
        <ellipse cx="900" cy="438" rx="64" ry="49" fill="url(#thaCraterFloor)" stroke="url(#thaRim)" stroke-width="10"/>
        <ellipse cx="900" cy="438" rx="43" ry="31" fill="none" stroke="#d0d0c3" opacity=".2" stroke-width="3"/>
        <ellipse cx="360" cy="82" rx="38" ry="27" fill="url(#thaCraterFloor)" stroke="#999f98" stroke-width="7"/>
        <ellipse cx="690" cy="360" rx="48" ry="34" fill="url(#thaCraterFloor)" stroke="#9ca29b" stroke-width="8"/>
        <ellipse cx="410" cy="470" rx="31" ry="22" fill="url(#thaCraterFloor)" stroke="#a4a69b" stroke-width="6"/>
        <ellipse cx="555" cy="105" rx="25" ry="18" fill="url(#thaCraterFloor)" stroke="#a4a69b" stroke-width="5"/>
      </g>
      <path d="M292 205C354 166 430 164 493 186C550 206 618 190 686 222C735 246 751 306 709 345C668 384 596 388 532 365C470 343 421 366 360 340C301 315 260 251 292 205Z" fill="#414849" opacity=".78" stroke="#a5aaa0" stroke-width="3" stroke-dasharray="8 7"/>
      <path d="M326 235C395 198 457 205 512 223S625 222 682 256" fill="none" stroke="#b9bdb1" stroke-width="2" opacity=".2"/>
      <path d="M337 300C405 326 470 292 528 314S632 344 683 310" fill="none" stroke="#d6d4c8" stroke-width="2" opacity=".13"/>
      <g fill="#e0e3d8" font-family="monospace" letter-spacing="3">
        <text x="42" y="48" font-size="17" opacity=".82">LUNAR SURFACE / ARCHIVE GRID</text>
        <text x="42" y="76" font-size="12" opacity=".62">NEAR-SIDE SCHEMATIC // NOT TO SCALE</text>
        <text x="734" y="518" font-size="13" opacity=".72">0° LATITUDE BAND</text>
      </g>
      <g stroke="#e2e5d9" opacity=".62" fill="none"><path d="M50 495h70m-70 -7v14m70 -14v14"/><path d="M938 45v42m-6 -36h12m-12 30h12"/></g>
      <g fill="#e1e5d9" font-family="monospace" font-size="12" opacity=".76"><text x="50" y="484">SCHEMATIC SCALE</text><text x="952" y="105" text-anchor="end">N</text></g>
      <circle cx="544" cy="275" r="39" fill="#b9f4c7" opacity=".10" filter="url(#thaMapGlow)"/>
      <path d="M544 232V318M501 275H587" stroke="#d7eadb" stroke-dasharray="3 7" opacity=".22"/>
    `;
    frame.append(map, el("div", "tha-map-scan-lines"), el("div", "tha-map-vignette"));

    frame.style.setProperty("--tha-zoom-x", `${targetPoint.x}%`);
    frame.style.setProperty("--tha-zoom-y", `${targetPoint.y}%`);
    const target = button("", "tha-moon-marker", () => {
      options.onTrace?.(frame, target);
    });
    target.style.left = `${targetPoint.x}%`;
    target.style.top = `${targetPoint.y}%`;
    if (targetPoint.x > 58) target.classList.add("tha-marker-label-left");
    target.setAttribute("aria-label", `Investigate ${record?.title || "the lunar trace"}`);
    target.append(el("span", "tha-marker-pulse"), el("span", "tha-marker-core"), el("span", "tha-marker-label", traceLabel));
    frame.append(target);

    const placeLabel = record?.id === "laser-retroreflectors"
      ? "LUNAR LASER ARRAYS"
      : record?.id === "fallen-astronaut"
        ? "HADLEY RILLE"
        : "MARE TRANQUILLITATIS";
    const coordinateLabel = record?.id === "laser-retroreflectors"
      ? "APOLLO 11 / 14 / 15 SITES"
      : location.coordinateDisplay || location.display || "LUNAR ARCHIVE GRID";
    const mapHud = el("div", "tha-map-hud");
    mapHud.append(
      el("span", "tha-map-tag", placeLabel),
      el("span", "tha-map-coordinates", coordinateLabel)
    );
    frame.append(mapHud);
    const mapCaption = el("figcaption", "tha-vector-map-caption", `${location.display || location.name || "LUNAR SURFACE"} · SCHEMATIC MAP`);
    figure.append(frame, mapCaption);
    return figure;
  }

  function makeMapPanel(record, options) {
    const panel = el("section", "tha-moon-map-panel tha-template-a-map");
    const recordNumber = Number(record?.number || 1);
    panel.setAttribute("aria-label", `Custom vector Moon map with detected trace ${recordNumber}`);
    const top = el("div", "tha-moon-panel-top");
    const shortMapName = record?.id === "laser-retroreflectors"
      ? "LASER ARRAYS"
      : record?.id === "fallen-astronaut"
        ? "HADLEY RILLE"
        : "MARE TRANQUILLITATIS";
    top.append(
      el("span", "tha-moon-kicker", `LUNAR SURFACE // ${shortMapName}`),
      el("span", "tha-moon-record-count", `RECORD DETECTED: ${recordNumber}`)
    );
    panel.append(top, makeMapFigure(record, options));
    const legend = el("div", "tha-moon-legend");
    legend.append(
      el("span", "", `● ${`TRACE ${String(recordNumber).padStart(2, "0")}`} — TAP TO INVESTIGATE`),
      el("span", "", "○ CRATER FIELD · LUNAR SURFACE")
    );
    panel.append(legend);
    return panel;
  }

  function makeClueVisual(index, options) {
    const visual = el("div", `tha-clue-visual tha-clue-visual-${index + 1}`);

    // Laser Retroreflector evidence is shown as a four-step visual decode.
    // Every clue stays within the facts and sequence documented in Belge 1.
    if (options.recordId === "laser-retroreflectors") {
      if (index === 0) {
        const figure = el("figure", "tha-clue-evidence-figure");
        const image = document.createElement("img");
        image.src = options.imagePaths.retroreflector;
        image.alt = "Apollo lunar laser ranging retroreflector array, a small instrument made of mirror prisms.";
        image.loading = "eager";
        image.decoding = "async";
        figure.append(image);
        const caption = el("figcaption", "tha-clue-image-credit");
        caption.append(
          el("span", "", "NASA"),
          document.createTextNode(" · "),
          externalLink("PHOTO SOURCE ↗", options.official.retroreflector, "tha-image-source")
        );
        figure.append(caption);
        visual.append(figure);
        return visual;
      }
      if (index === 1) {
        visual.classList.add("tha-laser-clue-prisms");
        visual.append(
          el("span", "tha-clue-visual-symbol", "◇"),
          el("span", "tha-clue-visual-label", "MIRROR-PRISM ARRAY")
        );
        const diagram = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        diagram.setAttribute("viewBox", "0 0 260 88");
        diagram.setAttribute("role", "img");
        diagram.setAttribute("aria-label", "Schematic array of small mirror prisms");
        diagram.innerHTML = `
          <g fill="#b9d9c3" stroke="#e5f4e8" stroke-width="1.4">
            <path d="M35 22 49 14 63 22 63 39 49 47 35 39Z"/>
            <path d="M91 22 105 14 119 22 119 39 105 47 91 39Z"/>
            <path d="M147 22 161 14 175 22 175 39 161 47 147 39Z"/>
            <path d="M203 22 217 14 231 22 231 39 217 47 203 39Z"/>
          </g>
          <path d="M49 55H217" stroke="#9acbaa" stroke-dasharray="3 5" opacity=".6"/>
          <text x="130" y="76" fill="#c4d8ca" text-anchor="middle" font-size="9" letter-spacing="2">REFLECTIVE PRISMS</text>`;
        visual.append(diagram);
        return visual;
      }
      if (index === 2) {
        visual.classList.add("tha-laser-clue-path");
        visual.append(el("span", "tha-clue-visual-label", "TWO-WAY LIGHT PATH"));
        const diagram = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        diagram.setAttribute("viewBox", "0 0 280 94");
        diagram.setAttribute("role", "img");
        diagram.setAttribute("aria-label", "Red laser path from Earth to Moon and green reflected path back to Earth");
        diagram.innerHTML = `
          <circle cx="30" cy="45" r="17" fill="#477b69" stroke="#b4d8c4" stroke-width="1.5"/>
          <circle cx="250" cy="45" r="17" fill="#8a9188" stroke="#e0e5d9" stroke-width="1.5"/>
          <path d="M51 36H224" stroke="#ff7474" stroke-width="3" stroke-linecap="round"/>
          <path d="M224 55H51" stroke="#a5f4b2" stroke-width="3" stroke-linecap="round"/>
          <path d="m216 30 9 6-9 6" fill="none" stroke="#ff9b9b" stroke-width="2"/>
          <path d="m59 49-9 6 9 6" fill="none" stroke="#baf7c5" stroke-width="2"/>
          <text x="30" y="82" fill="#d2e4d8" text-anchor="middle" font-size="9">EARTH</text>
          <text x="250" y="82" fill="#e1e4d8" text-anchor="middle" font-size="9">MOON</text>`;
        visual.append(diagram);
        return visual;
      }
      visual.classList.add("tha-laser-clue-data");
      visual.append(
        el("span", "tha-clue-visual-symbol", "↔"),
        el("span", "tha-clue-visual-label", "ACTIVE SCIENCE"),
        el("strong", "tha-clue-visual-stat", "CENTIMETER-LEVEL"),
        el("span", "tha-clue-visual-caption", "Apollo 11 · 14 · 15 arrays")
      );
      return visual;
    }

    const icons = ["▧", "⌖", "1969", "⇧"];
    const labels = ["PHOTO EVIDENCE", "LANDING SITE", "MISSION LOG", "TWO-STAGE MODULE"];
    if (index === 0 || index === 1) {
      const figure = el("figure", "tha-clue-evidence-figure");
      const image = document.createElement("img");
      image.src = index === 0 ? options.imagePaths.eva : options.imagePaths.lro;
      image.alt = index === 0
        ? "Apollo 11 astronaut Buzz Aldrin beside the United States flag, with the Lunar Module at left."
        : "Lunar Reconnaissance Orbiter view of the Apollo 11 landing site, showing the descent stage and astronaut footprint trails.";
      image.loading = "eager";
      image.decoding = "async";
      figure.append(image);
      const caption = el("figcaption", "tha-clue-image-credit");
      caption.append(
        el("span", "", index === 0
          ? "Image credit: NASA"
          : "Credit: NASA/Goddard Space Flight Center/Arizona State University"),
        document.createTextNode(" · "),
        externalLink(
          index === 0 ? "NASA IMAGE SOURCE ↗" : "NASA LANDING-SITE IMAGE SOURCE ↗",
          index === 0 ? options.official.eva : options.official.lro,
          "tha-image-source"
        )
      );
      figure.append(caption);
      visual.append(figure);
      return visual;
    }
    visual.append(el("span", "tha-clue-visual-symbol", icons[index]), el("span", "tha-clue-visual-label", labels[index]));
    if (index === 3) {
      const diagram = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      diagram.setAttribute("viewBox", "0 0 260 84");
      diagram.setAttribute("role", "img");
      diagram.setAttribute("aria-label", "Diagram showing the ascent stage leaving while the descent stage remains on the Moon");
      diagram.innerHTML = `
        <path d="M18 68 H242" stroke="#87999a" stroke-width="1" stroke-dasharray="3 5" />
        <path d="M72 62 L88 42 L104 62 Z" fill="#b8b8aa" stroke="#e7e2ce" />
        <rect x="83" y="55" width="10" height="7" fill="#d3b879" />
        <path d="M153 34 L165 17 L177 34 L172 43 H158 Z" fill="#d8c28f" stroke="#fff0c8" />
        <path d="M166 44 C170 51 177 54 184 58" stroke="#b6eac2" fill="none" stroke-width="1.5" stroke-dasharray="3 3" />
        <path d="M145 14 L154 5 M154 5 L165 5" stroke="#b6eac2" fill="none" />
        <text x="42" y="80" fill="#c5d1c9" font-size="8">DESCENT STAGE STAYS</text>
        <text x="177" y="14" fill="#c5d1c9" font-size="8">ASCENT STAGE LEAVES</text>`;
      visual.append(diagram);
    }
    return visual;
  }

  function makeClueCard(clue, index, onReveal, options) {
    const card = el("article", "tha-clue is-locked");
    if (index === 0) card.classList.remove("is-locked");
    const trigger = button("", "tha-clue-trigger", () => onReveal(index, card));
    trigger.disabled = index !== 0;
    trigger.setAttribute("aria-expanded", "false");
    trigger.append(
      el("span", "tha-clue-number", `0${index + 1}`),
      el("span", "tha-clue-title", clue.title),
      el("span", "tha-clue-state", index === 0 ? "SCAN CLUE" : "LOCKED")
    );
    const body = el("div", "tha-clue-body");
    body.hidden = true;
    body.append(makeClueVisual(index, options), el("p", "", clue.text));
    card.append(trigger, body);
    return card;
  }

  function createClueSequence({ record, imagePaths, official, onComplete }) {
    const root = el("div", "tha-template-a-clue-flow");
    const heading = el("div", "tha-section-heading");
    heading.append(el("span", "", "FIELD PUZZLE // RECOVER THE EVIDENCE"), el("small", "", "4 CLUES // SCAN IN SEQUENCE"));
    const clues = el("div", "tha-clues");
    const clueData = Array.isArray(record?.clues) && record.clues.length === 4 ? record.clues : [
      { title: "MISSION PHOTOGRAPH", text: "Two astronauts. A flag. A lunar module. What stayed behind?" },
      { title: "LANDING SITE", text: "Mare Tranquillitatis · The Moon · 0.67416° N, 23.47314° E." },
      { title: "MISSION LOG", text: "Apollo 11 · 20 July 1969 · first crewed Moon landing." },
      { title: "TWO-STAGE MODULE", text: "The Lunar Module had two stages. The descent stage landed on the Moon and remained there. The ascent stage carried the astronauts back into lunar orbit. The descent stage had a recorded dry weight of about 2,034 kg." }
    ];
    const revealed = new Set();
    const progress = el("div", "tha-clue-progress");
    const progressFill = el("span", "tha-clue-progress-fill");
    progress.append(progressFill);
    const progressLabel = el("p", "tha-clue-progress-label", "0 / 4 CLUES DECODED");

    function revealClue(index, card) {
      if (revealed.has(index) || index !== revealed.size) return;
      revealed.add(index);
      card.classList.remove("is-locked");
      card.classList.add("is-revealed");
      const trigger = card.querySelector(".tha-clue-trigger");
      trigger.setAttribute("aria-expanded", "true");
      trigger.querySelector(".tha-clue-state").textContent = "RECOVERED";
      const body = card.querySelector(".tha-clue-body");
      body.hidden = false;
      body.classList.add("is-open");
      progressFill.style.width = `${(revealed.size / clueData.length) * 100}%`;
      progressLabel.textContent = `${revealed.size} / 4 CLUES DECODED`;
      const next = clues.querySelectorAll(".tha-clue-trigger")[index + 1];
      if (next) {
        next.disabled = false;
        next.closest(".tha-clue")?.classList.remove("is-locked");
        next.querySelector(".tha-clue-state").textContent = "SCAN CLUE";
      }
      if (revealed.size === clueData.length) {
        progressLabel.textContent = "4 / 4 — OBJECT IDENTIFICATION UNLOCKED";
        window.setTimeout(() => onComplete?.(), 480);
      }
    }

    const options = { imagePaths, official, recordId: record?.id };
    clueData.forEach((clue, index) => clues.append(makeClueCard(clue, index, revealClue, options)));
    root.append(heading, clues, progress, progressLabel);
    return { element: root, get revealedCount() { return revealed.size; } };
  }

  window.THATemplates = window.THATemplates || {};
  window.THATemplates.TemplateA = Object.freeze({
    id: "A",
    name: "Surface Map Explorer",
    createMapPanel({ record, onTrace }) { return makeMapPanel(record, { onTrace }); },
    createClueSequence
  });
})();
