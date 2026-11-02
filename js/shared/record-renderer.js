// =============================================================================
// THE HUMAN ARCHIVE — SHARED RECORD VIEW / PROGRESS HELPERS
// Used by Template A and Template C; record content remains in records.js.
// =============================================================================
(() => {
    "use strict";

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[character]);
    }

    function readCompleted() {
        try {
            const saved = JSON.parse(window.localStorage.getItem("thaCompletedRecords") || "{}");
            return saved && typeof saved === "object" ? saved : {};
        } catch (_) {
            return window.THA?.completedRecords || {};
        }
    }

    function getCompletedRecords(chapter) {
        const all = readCompleted();
        const values = Array.isArray(all[chapter]) ? all[chapter] : [];
        return [...new Set(values.filter((value) => typeof value === "string"))];
    }

    function markRecordComplete(record) {
        if (!record || !record.id || !record.chapter) return false;
        const all = readCompleted();
        const list = Array.isArray(all[record.chapter]) ? [...all[record.chapter]] : [];
        if (!list.includes(record.id)) list.push(record.id);
        all[record.chapter] = list;
        window.THA = window.THA || {};
        window.THA.completedRecords = all;
        try {
            window.localStorage.setItem("thaCompletedRecords", JSON.stringify(all));
        } catch (error) {
            console.warn("Record completion could not be persisted in this browser.", error);
        }
        if (typeof window.THA.setProgress === "function") {
            window.THA.setProgress(record.chapter, list.length);
        }
        return true;
    }

    function renderRecordImages(record) {
        const media = record?.media || {};
        const primary = media.src
            ? `<figure class="tha-record-hero-image"><img src="${escapeHTML(media.src)}" alt="${escapeHTML(media.alt || record.title)}" loading="eager"><figcaption>${escapeHTML(media.requiredImage || "ARCHIVE IMAGE")}</figcaption></figure>`
            : `<div class="tha-record-image-missing" role="img" aria-label="Image asset not mapped">IMAGE ASSET NOT MAPPED</div>`;
        const supporting = Array.isArray(media.secondaryImages) ? media.secondaryImages : [];
        const extras = supporting.map((item) => `
            <figure class="tha-record-support-image">
                <img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.alt || record.title)}" loading="lazy">
                <figcaption>${escapeHTML(item.filename || "SUPPORTING IMAGE")}</figcaption>
            </figure>`).join("");
        return `<div class="tha-record-image-stack">${primary}${extras ? `<div class="tha-record-support-grid">${extras}</div>` : ""}</div>`;
    }

    function renderNASAData(record) {
        const fields = Array.isArray(record?.nasaData?.fields) ? record.nasaData.fields : [];
        const content = fields.map((field) => `
            <div class="tha-data-row">
                <dt>${escapeHTML(field.label)}</dt>
                <dd>${escapeHTML(field.value)}</dd>
            </div>`).join("");
        const source = record?.nasaData?.source;
        const sourceLink = source
            ? `<a class="tha-source-link" href="${escapeHTML(source)}" target="_blank" rel="noopener noreferrer">VIEW OFFICIAL SOURCE <span aria-hidden="true">↗</span></a>`
            : "";
        // sourceNotes are internal editorial / verification notes for the team.
        // Keep them in records.js and the audit report, not in audience-facing NASA cards.
        return `
            <section class="tha-info-card tha-nasa-card" aria-labelledby="thaNasaTitle">
                <div class="tha-info-card-heading"><span class="tha-data-dot" aria-hidden="true"></span><h2 id="thaNasaTitle">NASA DATA</h2><span class="tha-info-card-code">VERIFIED REFERENCE</span></div>
                <dl class="tha-data-list">${content}</dl>
                ${sourceLink}
            </section>`;
    }

    function renderStory(record) {
        return `
            <section class="tha-info-card tha-story-card" aria-labelledby="thaStoryTitle">
                <div class="tha-info-card-heading"><span class="tha-story-dot" aria-hidden="true"></span><h2 id="thaStoryTitle">STORY</h2><span class="tha-info-card-code">HUMAN INTERPRETATION</span></div>
                ${record.storyLead ? `<p class="tha-story-lead">${escapeHTML(record.storyLead)}</p>` : ""}
                <p class="tha-story-copy">${escapeHTML(record.story)}</p>
            </section>`;
    }

    function renderObjectDNA(record) {
        const location = record?.location?.display || record?.location?.name || "Location reference in record data";
        const rows = [
            ["OBJECT CLASS", record?.objectType || record?.title || "Archive object"],
            ["WORLD", record?.location?.world || record?.chapter || "Unknown"],
            ["ARCHIVE LOCATION", location]
        ];
        return `
            <section class="tha-info-card tha-object-dna-card" aria-labelledby="thaObjectDNATitle">
                <div class="tha-info-card-heading"><span class="tha-dna-dot" aria-hidden="true"></span><h2 id="thaObjectDNATitle">OBJECT DNA</h2><span class="tha-info-card-code">IDENTITY PROFILE</span></div>
                <dl class="tha-data-list">${rows.map(([label, value]) => `<div class="tha-data-row"><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join("")}</dl>
            </section>`;
    }

    const CHAPTER_ROUTES = {
        moon: { route: "moonMap", label: "MOON ARCHIVE MAP", chapter: "CHAPTER 02 · THE MOON" },
        mars: { route: "marsMap", label: "MARS ARCHIVE MAP", chapter: "CHAPTER 03 · MARS" },
        other: { route: "otherTraces", label: "OTHER TRACES", chapter: "CHAPTER 04 · OTHER TRACES" },
        hidden: { route: "hiddenRecords", label: "HIDDEN RECORDS", chapter: "CHAPTER 05 · HIDDEN RECORDS" }
    };

    function getBackRoute(chapter) {
        return CHAPTER_ROUTES[chapter]?.route || "menu";
    }

    function getBackLabel(chapter) {
        return CHAPTER_ROUTES[chapter]?.label || "ARCHIVE MENU";
    }

    function renderRecordFrame(record, subtitle, bodyMarkup) {
        const chapter = CHAPTER_ROUTES[record.chapter] || { route: "menu", label: "ARCHIVE MENU", chapter: "THE HUMAN ARCHIVE" };
        return `
            <section class="tha-record-screen" aria-label="${escapeHTML(record.title)} record">
                <header class="tha-record-topbar">
                    <button type="button" class="tha-record-back" data-action="back-map" data-back-route="${escapeHTML(chapter.route)}"><span aria-hidden="true">←</span> ${escapeHTML(chapter.label)}</button>
                    <div class="tha-record-topbar-center"><span>THE HUMAN ARCHIVE</span><i aria-hidden="true">/</i><span>${escapeHTML(chapter.chapter)}</span></div>
                    <div class="tha-record-topbar-code">RECORD ${String(record.number).padStart(2, "0")} / 11</div>
                    <div class="tha-page-identity-slot" data-tha-identity-slot></div>
                </header>
                <main class="tha-record-main">
                    <div class="tha-record-kicker">${escapeHTML(subtitle)} <span>·</span> ${escapeHTML(record.templateName || `TEMPLATE ${record.template}`)}</div>
                    <h1 class="tha-record-title">${escapeHTML(record.screenTitle || record.title)}</h1>
                    ${bodyMarkup}
                </main>
            </section>`;
    }

    function bindRecordBack(root) {
        root.querySelectorAll('[data-action="back-map"]').forEach((button) => {
            button.addEventListener("click", () => window.THANavigation?.goTo(button.dataset.backRoute || "menu"));
        });
    }

    window.THATemplateUI = {
        escapeHTML,
        getCompletedRecords,
        markRecordComplete,
        renderRecordImages,
        renderNASAData,
        renderStory,
        renderObjectDNA,
        renderRecordFrame,
        getBackRoute,
        getBackLabel,
        bindRecordBack
    };
})();
