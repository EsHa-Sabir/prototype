/* ============================================================================
   THE HUMAN ARCHIVE — TEMPLATE C
   Mission Identity Analyzer: four clue reveals followed by an interpretation
   choice. Fallen Astronaut has no right or wrong answer by design.
   ============================================================================ */
(() => {
  "use strict";

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };

  const makeButton = (label, cls, onClick) => {
    const node = el("button", cls, label);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  };

  function createClueSequence({ record, onComplete } = {}) {
    const root = el("section", "tha-template-c-clue-flow");
    const heading = el("div", "tha-section-heading");
    heading.append(
      el("span", "", "READ THE MEMORIAL CLUES"),
      el("small", "", "4 CLUES // OPEN IN SEQUENCE")
    );
    const clues = el("div", "tha-clues");
    const data = Array.isArray(record?.clues) ? record.clues : [];
    const revealed = new Set();
    const progress = el("div", "tha-clue-progress");
    const fill = el("span", "tha-clue-progress-fill");
    progress.append(fill);
    const label = el("p", "tha-clue-progress-label", `0 / ${data.length} CLUES DECODED`);

    function reveal(index, card) {
      if (revealed.has(index) || index !== revealed.size) return;
      revealed.add(index);
      card.classList.remove("is-locked");
      card.classList.add("is-revealed");
      const trigger = card.querySelector(".tha-clue-trigger");
      trigger.setAttribute("aria-expanded", "true");
      trigger.querySelector(".tha-clue-state").textContent = "DECODED";
      const body = card.querySelector(".tha-clue-body");
      body.hidden = false;
      body.classList.add("is-open");
      fill.style.width = `${(revealed.size / data.length) * 100}%`;
      label.textContent = `${revealed.size} / ${data.length} CLUES DECODED`;
      const next = clues.querySelectorAll(".tha-clue-trigger")[index + 1];
      if (next) {
        next.disabled = false;
        next.closest(".tha-clue")?.classList.remove("is-locked");
        next.querySelector(".tha-clue-state").textContent = "OPEN CLUE";
      }
      if (revealed.size === data.length) {
        label.textContent = `${data.length} / ${data.length} — INTERPRETATION UNLOCKED`;
        window.setTimeout(() => onComplete?.(), 420);
      }
    }

    data.forEach((clue, index) => {
      const card = el("article", `tha-clue tha-template-c-clue ${index ? "is-locked" : ""}`.trim());
      const trigger = makeButton("", "tha-clue-trigger", () => reveal(index, card));
      trigger.disabled = index !== 0;
      trigger.setAttribute("aria-expanded", "false");
      trigger.append(
        el("span", "tha-clue-number", `0${index + 1}`),
        el("span", "tha-clue-title", clue.title || `CLUE ${index + 1}`),
        el("span", "tha-clue-state", index === 0 ? "OPEN CLUE" : "LOCKED")
      );
      const body = el("div", "tha-clue-body");
      body.hidden = true;
      const visual = el("div", `tha-clue-visual tha-clue-visual-${index + 1}`);
      visual.append(
        el("span", "tha-clue-visual-symbol", ["⌖", "1971", "8.5 cm", "14"][index] || "•"),
        el("span", "tha-clue-visual-label", ["HADLEY RILLE", "MISSION YEAR", "ALUMINUM FIGURE", "REMEMBRANCE"][index] || "ARCHIVE CLUE")
      );
      body.append(visual, el("p", "", clue.text || ""));
      card.append(trigger, body);
      clues.append(card);
    });

    root.append(heading, clues, progress, label);
    return { element: root, get revealedCount() { return revealed.size; } };
  }

  function createChoicePanel({ question, choices = [], onChoose, noRightAnswer = false } = {}) {
    const root = el("section", "tha-template-c tha-identity-analyzer");
    root.append(
      el("p", "tha-template-kicker", "YOUR INTERPRETATION // NO WRONG ANSWER"),
      el("h3", "tha-template-question", question || "Why do humans leave memorials on another world?")
    );
    const options = el("div", "tha-template-choices");
    choices.forEach((choice) => {
      const option = typeof choice === "string" ? { label: choice } : choice;
      const button = makeButton(option.label || "CHOOSE", "tha-template-choice", () => {
        options.querySelectorAll("button").forEach((item) => { item.disabled = true; });
        button.classList.add("is-selected");
        const feedback = el("p", "tha-template-feedback", option.feedback || (noRightAnswer
          ? "Your choice is one way to reflect on this memorial."
          : "Analysis recorded."));
        root.append(feedback);
        onChoose?.(option, button);
      });
      options.append(button);
    });
    root.append(options);
    return root;
  }

  window.THATemplates = window.THATemplates || {};
  window.THATemplates.TemplateC = Object.freeze({
    id: "C",
    name: "Mission Identity Analyzer",
    createClueSequence,
    createChoicePanel
  });
})();
