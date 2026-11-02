// =============================================================================
// THE HUMAN ARCHIVE — TEMPLATE C: MISSION IDENTITY ANALYZER
// Fallen Astronaut has reflection choices only: there is no right or wrong answer.
// The same data-driven renderer can later handle Sky Crane and RTG identification.
// =============================================================================

function renderTemplateC(recordId) {
    const app = document.getElementById("app");
    const record = window.THA?.records?.getRecord(recordId);
    const ui = window.THATemplateUI;
    if (!app || !ui || !record || record.template !== "C") {
        if (app) app.innerHTML = `<section class="tha-template-error"><h1>RECORD UNAVAILABLE</h1><p>Template C could not load this record from records.js.</p><button type="button" data-action="back-map">RETURN TO MOON MAP</button></section>`;
        app?.querySelector("[data-action='back-map']")?.addEventListener("click", () => window.THANavigation?.goTo("menu"));
        return;
    }

    window.THAMoonAudio?.stopAll();
    let revealedCount = 0;
    let selected = false;
    const clues = Array.isArray(record.clues) ? record.clues : [];
    const choices = Array.isArray(record.interaction?.choices) ? record.interaction.choices : [];
    const noCorrectAnswer = record.interaction?.choicesHaveCorrectAnswer === false;

    const body = `
        <div class="tha-record-grid tha-identity-grid">
            <section class="tha-record-visual-column">
                ${ui.renderRecordImages(record)}
                <div class="tha-detected-state"><span class="tha-detected-led" aria-hidden="true"></span><div><strong>OBJECT DETECTED</strong><small>${ui.escapeHTML(record.objectIdentification?.detected?.type || "UNKNOWN")}</small></div></div>
            </section>
            <section class="tha-record-interaction-column">
                <div class="tha-interaction-heading"><span>FALLEN ASTRONAUT // EVIDENCE</span><strong id="thaIdentityClueCount">0 / ${clues.length} CLUES</strong></div>
                <div class="tha-record-howto">
                    <strong>WHAT TO DO</strong>
                    <p>Reveal the four clues, one by one. Then choose why you think people leave memorials. There is no right or wrong answer; the same facts appear whichever option you choose.</p>
                </div>
                <p class="tha-record-instruction" id="thaIdentityStepHint">STEP 1 OF 2 · REVEAL THE CLUES</p>
                <div class="tha-clue-list" id="thaIdentityClues" aria-live="polite"><div class="tha-clue-empty"><span aria-hidden="true">⌖</span><p>IDENTITY UNKNOWN</p><small>Evidence has not yet been revealed.</small></div></div>
                <button type="button" class="tha-template-primary-button" id="thaIdentityRevealButton">REVEAL CLUE 01 <span aria-hidden="true">＋</span></button>
                <section class="tha-identity-choice-panel" id="thaIdentityChoices" hidden>
                    <p class="tha-choice-question">${ui.escapeHTML(record.interaction?.question || "WHAT IS IT?")}</p>
                    <div class="tha-choice-buttons" id="thaChoiceButtons"></div>
                    ${noCorrectAnswer ? `<p class="tha-no-correct-answer">THERE IS NO RIGHT OR WRONG ANSWER.</p>` : ""}
                </section>
            </section>
        </div>
        <div class="tha-record-facts" id="thaIdentityFacts" hidden></div>`;

    app.innerHTML = ui.renderRecordFrame(record, "TEMPLATE C // MISSION IDENTITY ANALYZER", body);
    ui.bindRecordBack(app);

    const clueList = app.querySelector("#thaIdentityClues");
    const counter = app.querySelector("#thaIdentityClueCount");
    const stepHint = app.querySelector("#thaIdentityStepHint");
    const revealButton = app.querySelector("#thaIdentityRevealButton");
    const choicePanel = app.querySelector("#thaIdentityChoices");
    const choiceButtons = app.querySelector("#thaChoiceButtons");
    const facts = app.querySelector("#thaIdentityFacts");

    revealButton.addEventListener("click", () => {
        if (selected || revealedCount >= clues.length) return;
        const clue = clues[revealedCount];
        if (!clue) return;
        const item = document.createElement("article");
        item.className = "tha-clue-card is-revealed";
        item.innerHTML = `
            <button type="button" class="tha-clue-toggle" aria-expanded="true">
                <span><small>CLUE ${String(clue.order || revealedCount + 1).padStart(2, "0")}</small><strong>${ui.escapeHTML(clue.title || `CLUE ${revealedCount + 1}`)}</strong></span>
                <i aria-hidden="true">−</i>
            </button>
            <div class="tha-clue-body"><p>${ui.escapeHTML(clue.text)}</p></div>`;
        const toggle = item.querySelector(".tha-clue-toggle");
        toggle.addEventListener("click", () => {
            const collapsed = item.classList.toggle("is-collapsed");
            toggle.setAttribute("aria-expanded", String(!collapsed));
            toggle.querySelector("i").textContent = collapsed ? "+" : "−";
        });
        clueList.querySelector(".tha-clue-empty")?.remove();
        clueList.appendChild(item);
        revealedCount += 1;
        counter.textContent = `${revealedCount} / ${clues.length} CLUES`;
        if (revealedCount < clues.length) {
            revealButton.innerHTML = `REVEAL CLUE ${String(revealedCount + 1).padStart(2, "0")} <span aria-hidden="true">＋</span>`;
        } else {
            revealButton.hidden = true;
            choicePanel.hidden = false;
            if (stepHint) stepHint.textContent = "STEP 2 OF 2 · CHOOSE YOUR REFLECTION";
            renderChoices();
            choicePanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    });

    function renderChoices() {
        choiceButtons.innerHTML = choices.map((choice) => `
            <button type="button" class="tha-identity-choice" data-choice-id="${ui.escapeHTML(choice.id)}">
                <span>${ui.escapeHTML(choice.label)}</span><i aria-hidden="true">↗</i>
            </button>`).join("");
        choiceButtons.querySelectorAll("[data-choice-id]").forEach((button) => {
            button.addEventListener("click", () => chooseAnswer(button.dataset.choiceId));
        });
    }

    function chooseAnswer(choiceId) {
        if (selected) return;
        const choice = choices.find((item) => item.id === choiceId);
        if (!choice) return;
        const feedback = choice.feedback || "Your selection has been recorded.";
        // This is a user gesture: silently prime the supplied piano asset so the
        // memorial note can play after the short story reveal delay on mobile.
        window.THAMoonAudio?.enableAudioFromGesture();

        if (!noCorrectAnswer && choice.correct !== true) {
            const feedbackNode = document.createElement("p");
            feedbackNode.className = "tha-choice-feedback is-incorrect";
            feedbackNode.textContent = "NOT IDENTIFIED YET — REVIEW THE CLUES AND TRY AGAIN.";
            choicePanel.querySelector(".tha-choice-feedback")?.remove();
            choicePanel.appendChild(feedbackNode);
            return;
        }

        selected = true;
        choiceButtons.querySelectorAll("button").forEach((button) => {
            button.disabled = true;
            if (button.dataset.choiceId === choiceId) button.classList.add("is-selected");
        });
        const feedbackNode = document.createElement("p");
        feedbackNode.className = "tha-choice-feedback";
        feedbackNode.textContent = feedback;
        choicePanel.appendChild(feedbackNode);

        const detectedType = app.querySelector(".tha-detected-state small");
        if (detectedType) detectedType.textContent = record.objectIdentification?.identified || record.title.toUpperCase();
        app.querySelector(".tha-detected-state")?.classList.add("is-identified");
        const title = app.querySelector(".tha-record-title");
        if (title) title.textContent = record.objectIdentification?.identified || record.screenTitle || record.title;
        const kicker = app.querySelector(".tha-record-kicker");
        if (kicker) kicker.textContent = noCorrectAnswer ? "REFLECTION RECORDED · FACTS REVEALED" : "OBJECT IDENTIFIED · FACTS REVEALED";

        facts.hidden = false;
        facts.innerHTML = `${ui.renderNASAData(record)}${ui.renderStory(record)}${ui.renderObjectDNA(record)}
            <section class="tha-record-mantra" aria-label="Archive message">
                <p>ABANDONED ≠ FORGOTTEN.</p>
                <small>HUMANS CAN LEAVE A WORLD BEHIND. THEY DO NOT LEAVE THEIR MEMORIES BEHIND.</small>
            </section>
            <div class="tha-record-complete-row"><span>REFLECTION RECORDED ✓</span><button type="button" class="tha-template-primary-button" data-action="return-map">RETURN TO MOON MAP <span aria-hidden="true">↗</span></button></div>`;
        ui.markRecordComplete(record);
        // The Moon script places a silence before the sustained memorial note.
        window.setTimeout(() => {
            if (facts.isConnected) window.THAMoonAudio?.playSustainedPianoNote();
        }, 1100);
        facts.scrollIntoView({ behavior: "smooth", block: "start" });
        facts.querySelector('[data-action="return-map"]')?.addEventListener("click", () => window.THANavigation?.goTo(ui.getBackRoute(record.chapter)));
    }
}
